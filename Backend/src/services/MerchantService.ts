import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { UserRepository } from '../repositories/UserRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { MerchantStatus } from '../constants/user.constants';

@injectable()
export class MerchantService extends BaseService {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: UserRepository,
    @inject(TYPES.AuditLogRepository) private auditRepo: AuditLogRepository
  ) {
    super();
  }

  async finalizeOnboarding(userId: string, req: Request) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw this.createError('User not found.', 404);
    if ((user as any).role !== 'MERCHANT') {
      throw this.createError('Only merchants can perform onboarding', 403);
    }

    await this.userRepo.updateById(userId, {
      merchantStatus: MerchantStatus.PENDING,
    } as any);

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await this.auditRepo.createLog({
      userId,
      action: 'SIGNUP',
      ip,
      userAgent,
      metadata: {
        details: 'Merchant onboarding application submitted',
        newStatus: MerchantStatus.PENDING,
      },
    });

    return { message: 'Onboarding application submitted successfully', status: 'PENDING' };
  }
}
