import { injectable, inject } from 'inversify';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import { config } from '../config';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { UserRepository } from '../repositories/UserRepository';
import { BlacklistedTokenRepository } from '../repositories/BlacklistedTokenRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateVerificationToken,
  getTokenExpiry,
} from '../utils/tokens';
import { UserRole, MerchantStatus, AuditAction } from '../constants/user.constants';
import { IUser } from '../types/User.types';
import { publishEmailEvent } from '../kafka/producer';

function getClientInfo(req: Request): { ip: string; userAgent: string } {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return { ip, userAgent };
}

@injectable()
export class AuthService extends BaseService {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: UserRepository,
    @inject(TYPES.BlacklistedTokenRepository) private blacklistRepo: BlacklistedTokenRepository,
    @inject(TYPES.AuditLogRepository) private auditRepo: AuditLogRepository
  ) {
    super();
  }

  private async writeAuditLog(
    action: string,
    req: Request,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const { ip, userAgent } = getClientInfo(req);
    this.auditRepo.createLog({ userId, action, ip, userAgent, metadata }).catch((err) =>
      console.error('[AuditLog] Failed to write audit log:', err)
    );
  }

  async signup(
    data: {
      email: string;
      password: string;
      fullName: string;
      companyName: string;
      telegramId?: string;
      role: string;
    },
    req: Request
  ): Promise<{ message: string; verificationToken: string }> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      await bcrypt.hash(data.password, config.bcrypt.rounds);
      throw this.createError('An account with this email already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, config.bcrypt.rounds);
    const { rawToken, hashedToken } = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.userRepo.createUser({
      email: data.email,
      password: passwordHash,
      fullName: data.fullName,
      companyName: data.companyName,
      telegramId: data.telegramId,
      role: data.role,
      isVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    } as Partial<IUser>);

    await this.writeAuditLog(AuditAction.SIGNUP, req, (user as IUser)._id?.toString(), {
      email: data.email,
    });

    // ─── Publish email verification event to Kafka (fire-and-forget) ─────────
    // This MUST NOT throw — signup must succeed regardless of email delivery.
    try {
      await publishEmailEvent({
        type: 'VERIFY_EMAIL',
        userId: (user as IUser)._id?.toString() ?? '',
        email: data.email,
        token: rawToken,
        retryCount: 0,
      });
    } catch (kafkaErr) {
      console.error('[AuthService] Failed to publish email event to Kafka:', kafkaErr);
      // Non-fatal: the user is already created. Worker can be re-triggered manually.
    }

    return {
      message: 'Account created. Please check your email to verify your account.',
      verificationToken: rawToken,
    };
  }

  async verifyEmail(
    rawToken: string,
    req: Request
  ): Promise<{
    message: string;
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; fullName: string; role: string; merchantStatus: string };
  }> {
    const hashedToken = hashToken(rawToken);
    const user = await this.userRepo.getUserModel().findOne({
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw this.createError('Invalid or expired verification token.', 400);
    }

    const refreshToken = signRefreshToken(user._id.toString());
    const refreshTokenHash = hashToken(refreshToken);

    await this.userRepo.updateById(user._id.toString(), {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpiry: undefined,
      refreshTokenHash,
    } as Partial<IUser>);

    await this.writeAuditLog(AuditAction.EMAIL_VERIFIED, req, user._id.toString());

    const accessToken = signAccessToken(user._id.toString(), user.role, true);

    return {
      message: 'Email verified successfully. You are now signed in.',
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        merchantStatus: user.merchantStatus,
      },
    };
  }

  async login(
    credentials: { email: string; password: string },
    req: Request
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; fullName: string; role: string; merchantStatus: string };
  }> {
    const UserModel = this.userRepo.getUserModel();
    const user = await UserModel.findOne({ email: credentials.email }).select(
      '+password +refreshTokenHash'
    );

    const { ip, userAgent } = getClientInfo(req);
    const INVALID_CREDENTIALS = 'Invalid email or password.';

    if (!user) {
      await bcrypt.hash(credentials.password, config.bcrypt.rounds);
      await this.writeAuditLog(AuditAction.LOGIN_FAILED, req, undefined, {
        email: credentials.email,
        reason: 'user_not_found',
      });
      throw this.createError(INVALID_CREDENTIALS, 401);
    }

    if (!user.isVerified) {
      throw this.createError('Please verify your email address before signing in.', 403);
    }

    const userDoc = user as IUser & { isLocked?: () => boolean };
    if (userDoc.isLocked?.()) {
      const remainingMs = (userDoc.lockUntil as Date).getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      await this.writeAuditLog(AuditAction.ACCOUNT_LOCKED, req, user._id.toString(), {
        remainingMinutes: remainingMin,
      });
      throw this.createError(
        `Account is temporarily locked. Try again in ${remainingMin} minute(s).`,
        423
      );
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    if (!passwordMatch) {
      const newFailedAttempts = user.failedLoginAttempts + 1;
      const shouldLock = newFailedAttempts >= config.auth.maxFailedAttempts;

      await this.userRepo.updateById(user._id.toString(), {
        failedLoginAttempts: newFailedAttempts,
        ...(shouldLock && { lockUntil: new Date(Date.now() + config.auth.lockoutDurationMs) }),
      } as Partial<IUser>);

      await this.writeAuditLog(AuditAction.LOGIN_FAILED, req, user._id.toString(), {
        attempt: newFailedAttempts,
        locked: shouldLock,
      });

      if (shouldLock) {
        throw this.createError(
          `Account locked after ${config.auth.maxFailedAttempts} failed attempts. Try again in 15 minutes.`,
          423
        );
      }

      const attemptsRemaining = config.auth.maxFailedAttempts - newFailedAttempts;
      throw this.createError(
        `${INVALID_CREDENTIALS} ${attemptsRemaining} attempt(s) remaining before lockout.`,
        401
      );
    }

    const accessToken = signAccessToken(user._id.toString(), user.role, user.isVerified);
    const refreshToken = signRefreshToken(user._id.toString());
    const refreshTokenHash = hashToken(refreshToken);

    await this.userRepo.updateById(user._id.toString(), {
      refreshTokenHash,
      failedLoginAttempts: 0,
      lockUntil: undefined,
    } as Partial<IUser>);

    await this.writeAuditLog(AuditAction.LOGIN_SUCCESS, req, user._id.toString());

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        merchantStatus: user.merchantStatus,
      },
    };
  }

  async refresh(
    incomingRefreshToken: string,
    req: Request
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(incomingRefreshToken);
    } catch {
      throw this.createError('Invalid or expired refresh token.', 401);
    }

    const UserModel = this.userRepo.getUserModel();
    const user = await UserModel.findById(payload.userId).select('+refreshTokenHash');
    if (!user) {
      throw this.createError('User not found.', 401);
    }

    const incomingHash = hashToken(incomingRefreshToken);
    if (!user.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
      await this.userRepo.getUserModel().findByIdAndUpdate(user._id, {
        $unset: { refreshTokenHash: '' },
      });

      await this.writeAuditLog(AuditAction.TOKEN_REUSE_DETECTED, req, user._id.toString(), {
        action: 'all_sessions_invalidated',
      });

      throw this.createError(
        'Security violation: token reuse detected. All sessions have been invalidated.',
        401
      );
    }

    const accessToken = signAccessToken(user._id.toString(), user.role, user.isVerified);
    const newRefreshToken = signRefreshToken(user._id.toString());
    const newRefreshTokenHash = hashToken(newRefreshToken);

    await this.userRepo.getUserModel().findByIdAndUpdate(user._id, {
      refreshTokenHash: newRefreshTokenHash,
    });

    await this.writeAuditLog(AuditAction.TOKEN_REFRESHED, req, user._id.toString());

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, accessToken: string, req: Request): Promise<void> {
    const tokenHash = hashToken(accessToken);
    const expiresAt = getTokenExpiry(accessToken);

    await this.blacklistRepo.createToken({ tokenHash, expiresAt });
    await this.userRepo.getUserModel().findByIdAndUpdate(userId, {
      $unset: { refreshTokenHash: '' },
    });

    await this.writeAuditLog(AuditAction.LOGOUT, req, userId);
  }

  async getCurrentUser(userId: string): Promise<{
    id: string;
    email: string;
    fullName: string;
    companyName: string;
    isVerified: boolean;
    role: string;
    merchantStatus: string;
    createdAt: Date;
  }> {
    const user = await this.userRepo.getUserModel().findById(userId).lean();
    if (!user) {
      throw this.createError('User not found.', 404);
    }

    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      companyName: user.companyName,
      isVerified: user.isVerified,
      role: user.role,
      merchantStatus: user.merchantStatus,
      createdAt: user.createdAt,
    };
  }
}
