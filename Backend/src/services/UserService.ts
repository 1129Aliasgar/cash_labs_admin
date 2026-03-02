import { injectable, inject } from 'inversify';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import { config } from '../config';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { UserRepository } from '../repositories/UserRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { UserRole, MerchantStatus } from '../constants/user.constants';

@injectable()
export class UserService extends BaseService {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: UserRepository,
    @inject(TYPES.AuditLogRepository) private auditRepo: AuditLogRepository
  ) {
    super();
  }

  async createUser(
    data: { email: string; password: string; fullName: string; role: string; companyName?: string },
    currentUserId: string,
    currentUserRole: string,
    req: Request
  ) {
    const roleHierarchy: Record<string, number> = {
      [UserRole.SUPER_ADMIN]: 4,
      [UserRole.ADMIN]: 3,
      [UserRole.MERCHANT]: 2,
      [UserRole.AGENT]: 1,
    };

    const targetRole = data.role;
    if (!roleHierarchy[targetRole]) {
      throw this.createError('Invalid role specified.', 400);
    }

    if (currentUserRole !== UserRole.SUPER_ADMIN) {
      if (data.role === UserRole.SUPER_ADMIN || data.role === UserRole.ADMIN) {
        throw this.createError('Insufficient permissions to create this role.', 403);
      }
    }

    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw this.createError('User already exists.', 409);

    const passwordHash = await bcrypt.hash(data.password, config.bcrypt.rounds);
    const user = await this.userRepo.createUser({
      email: data.email,
      password: passwordHash,
      fullName: data.fullName,
      companyName: data.companyName || '',
      role: data.role,
      isVerified: true,
      merchantStatus: data.role === UserRole.MERCHANT ? MerchantStatus.PENDING : MerchantStatus.NONE,
    } as any);

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await this.auditRepo.createLog({
      userId: currentUserId,
      action: 'USER_CREATED',
      ip,
      userAgent,
      metadata: {
        createdUserId: (user as any)._id,
        createdUserEmail: (user as any).email,
        role: (user as any).role,
      },
    });

    return {
      message: `User ${(user as any).email} created successfully as ${(user as any).role}.`,
      user: {
        id: (user as any)._id,
        email: (user as any).email,
        fullName: (user as any).fullName,
        role: (user as any).role,
      },
    };
  }

  async getAllUsers() {
    return this.userRepo.findAllUsers('-password -refreshTokenHash');
  }
}
