import bcrypt from 'bcrypt';
import { Request } from 'express';
import { config } from '../config';
import { User } from '../models/User';
import { BlacklistedToken } from '../models/BlacklistedToken';
import { AuditLog, AuditAction } from '../models/AuditLog';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateVerificationToken,
  getTokenExpiry,
} from '../utils/tokens';
import { createError } from '../middleware/errorHandler';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getClientInfo(req: Request): { ip: string; userAgent: string } {
  // When behind reverse proxy / DigitalOcean load balancer, trust X-Forwarded-For
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return { ip, userAgent };
}

async function writeAuditLog(
  action: AuditAction,
  req: Request,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const { ip, userAgent } = getClientInfo(req);
  // Fire-and-forget: don't block the response for audit log writes
  AuditLog.create({ userId, action, ip, userAgent, metadata }).catch((err) =>
    console.error('[AuditLog] Failed to write audit log:', err)
  );
}

// ─── Service Methods ─────────────────────────────────────────────────────────

/**
 * @route POST /api/auth/signup
 * @desc Register a new merchant account
 * @access Public
 *
 * Flow:
 * 1. Check if email already registered
 * 2. Hash password with bcrypt (cost 12)
 * 3. Generate verification token (raw to send, hashed to store)
 * 4. Create user with isVerified=false
 * 5. Log SIGNUP audit event
 * 6. Return success (email sending is async/placeholder)
 */
export async function signup(
  data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    telegramId?: string;
  },
  req: Request
): Promise<{ message: string; verificationToken: string }> {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    // Timing-safe: even if exists, we hash anyway to prevent timing attacks
    await bcrypt.hash(data.password, config.bcrypt.rounds);
    throw createError('An account with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, config.bcrypt.rounds);
  const { rawToken, hashedToken } = generateVerificationToken();
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const user = await User.create({
    email: data.email,
    password: passwordHash,
    fullName: data.fullName,
    companyName: data.companyName,
    telegramId: data.telegramId,
    isVerified: false,
    verificationToken: hashedToken,
    verificationTokenExpiry: tokenExpiry,
  });

  await writeAuditLog('SIGNUP', req, user.id, { email: data.email });

  return {
    message: 'Account created. Please check your email to verify your account.',
    verificationToken: rawToken, // In production: send via email, not response
  };
}

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email using token (or OTP)
 * @access Public
 *
 * Flow:
 * 1. Hash incoming token
 * 2. Find user with matching hash + non-expired token
 * 3. Mark isVerified=true, clear token fields
 */
export async function verifyEmail(
  rawToken: string,
  req: Request
): Promise<{ message: string }> {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw createError('Invalid or expired verification token.', 400);
  }

  await User.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: '', verificationTokenExpiry: '' },
  });

  await writeAuditLog('EMAIL_VERIFIED', req, user.id);

  return { message: 'Email verified successfully. You can now sign in.' };
}

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and issue JWT tokens
 * @access Public
 *
 * Flow:
 * 1. Find user by email (include password, refreshTokenHash via select)
 * 2. Check isVerified
 * 3. Check account lock
 * 4. Compare password
 * 5. On failure: increment failedLoginAttempts, lock after threshold
 * 6. On success: reset attempts, issue tokens, store hashed refresh token
 */
export async function login(
  credentials: { email: string; password: string },
  req: Request
): Promise<{ accessToken: string; refreshToken: string; user: { id: string; email: string; fullName: string } }> {
  // Select password and refreshTokenHash explicitly (both are select:false)
  const user = await User.findOne({ email: credentials.email }).select(
    '+password +refreshTokenHash'
  );

  const { ip, userAgent } = getClientInfo(req);

  // Generic message to prevent user enumeration
  const INVALID_CREDENTIALS = 'Invalid email or password.';

  if (!user) {
    // Still hash to be timing-safe even if user not found
    await bcrypt.hash(credentials.password, config.bcrypt.rounds);
    await writeAuditLog('LOGIN_FAILED', req, undefined, { email: credentials.email, reason: 'user_not_found' });
    throw createError(INVALID_CREDENTIALS, 401);
  }

  if (!user.isVerified) {
    throw createError('Please verify your email address before signing in.', 403);
  }

  // Check if account is locked
  if (user.isLocked()) {
    const remainingMs = user.lockUntil!.getTime() - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60000);
    await AuditLog.create({
      userId: user.id, action: 'ACCOUNT_LOCKED', ip, userAgent,
      metadata: { remainingMinutes: remainingMin }
    }).catch(() => {});
    throw createError(
      `Account is temporarily locked. Try again in ${remainingMin} minute(s).`,
      423
    );
  }

  const passwordMatch = await bcrypt.compare(credentials.password, user.password);

  if (!passwordMatch) {
    const newFailedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = newFailedAttempts >= config.auth.maxFailedAttempts;

    await User.findByIdAndUpdate(user._id, {
      failedLoginAttempts: newFailedAttempts,
      ...(shouldLock && { lockUntil: new Date(Date.now() + config.auth.lockoutDurationMs) }),
    });

    await writeAuditLog('LOGIN_FAILED', req, user.id, {
      attempt: newFailedAttempts,
      locked: shouldLock,
    });

    if (shouldLock) {
      throw createError(
        `Account locked after ${config.auth.maxFailedAttempts} failed attempts. Try again in 15 minutes.`,
        423
      );
    }

    const attemptsRemaining = config.auth.maxFailedAttempts - newFailedAttempts;
    throw createError(
      `${INVALID_CREDENTIALS} ${attemptsRemaining} attempt(s) remaining before lockout.`,
      401
    );
  }

  // ✅ Credentials valid — issue tokens
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  const refreshTokenHash = hashToken(refreshToken);

  // Store hashed refresh token, reset failure counter
  await User.findByIdAndUpdate(user._id, {
    refreshTokenHash,
    failedLoginAttempts: 0,
    $unset: { lockUntil: '' },
  });

  await writeAuditLog('LOGIN_SUCCESS', req, user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
  };
}

/**
 * @route POST /api/auth/refresh
 * @desc Rotate refresh token — issue new access + refresh token pair
 * @access Semi-public (requires valid refresh cookie)
 *
 * STRICT ROTATION FLOW:
 * 1. Extract refresh token from cookie
 * 2. Verify JWT signature
 * 3. Hash the incoming token
 * 4. Compare with stored hash in DB
 * 5. If NOT found → TOKEN REUSE ATTACK DETECTED → wipe ALL tokens for this user
 * 6. If VALID → issue new pair, replace stored hash
 *
 * This means stolen refresh tokens can only be used ONCE.
 * If an attacker uses the token first, the legitimate user's next refresh
 * invalidates the attacker's tokens (and vice versa) — raising an alert.
 */
export async function refresh(
  incomingRefreshToken: string,
  req: Request
): Promise<{ accessToken: string; refreshToken: string }> {
  // 1. Verify JWT signature + expiry
  let payload: { userId: string };
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw createError('Invalid or expired refresh token.', 401);
  }

  // 2. Look up user (select refreshTokenHash explicitly)
  const user = await User.findById(payload.userId).select('+refreshTokenHash');
  if (!user) {
    throw createError('User not found.', 401);
  }

  const incomingHash = hashToken(incomingRefreshToken);

  // 3. Compare hashes — REUSE DETECTION
  if (!user.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
    // ⚠️ SECURITY EVENT: Refresh token reuse detected
    // Wipe the stored refresh token to invalidate all existing sessions for this user
    await User.findByIdAndUpdate(user._id, { $unset: { refreshTokenHash: '' } });

    await writeAuditLog('TOKEN_REUSE_DETECTED', req, user.id, {
      action: 'all_sessions_invalidated',
    });

    throw createError(
      'Security violation: token reuse detected. All sessions have been invalidated.',
      401
    );
  }

  // 4. Issue new tokens
  const newAccessToken = signAccessToken(user.id);
  const newRefreshToken = signRefreshToken(user.id);
  const newRefreshTokenHash = hashToken(newRefreshToken);

  // 5. Atomically replace old hash with new hash
  await User.findByIdAndUpdate(user._id, { refreshTokenHash: newRefreshTokenHash });

  await writeAuditLog('TOKEN_REFRESHED', req, user.id);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

/**
 * @route POST /api/auth/logout
 * @desc Revoke tokens and clear cookies
 * @access Protected
 *
 * Flow:
 * 1. Hash the access token and add to BlacklistedToken with TTL = token expiry
 * 2. Remove the refresh token hash from the user record
 * 3. Caller (controller) clears the cookies
 */
export async function logout(
  userId: string,
  accessToken: string,
  req: Request
): Promise<void> {
  const tokenHash = hashToken(accessToken);
  const expiresAt = getTokenExpiry(accessToken);

  // Add to blacklist (TTL index will auto-delete after expiry)
  await BlacklistedToken.create({ tokenHash, expiresAt });

  // Remove refresh token from DB
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: '' } });

  await writeAuditLog('LOGOUT', req, userId);
}

/**
 * @route GET /api/auth/me
 * @desc Return current authenticated user data
 * @access Protected
 */
export async function getCurrentUser(
  userId: string
): Promise<{ id: string; email: string; fullName: string; companyName: string; isVerified: boolean; createdAt: Date }> {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw createError('User not found.', 404);
  }

  return {
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    companyName: user.companyName,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}
