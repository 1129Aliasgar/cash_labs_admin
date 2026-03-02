import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { UserRepository } from '../repositories/UserRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { UserRole, MerchantStatus } from '../constants/user.constants';

function getClientInfo(req: Request): { ip: string; userAgent: string } {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return { ip, userAgent };
}

@injectable()
export class AdminService extends BaseService {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: UserRepository,
    @inject(TYPES.AuditLogRepository) private auditRepo: AuditLogRepository
  ) {
    super();
  }

  async approveMerchant(merchantId: string, approvedBy: string, req: Request) {
    const merchant = await this.userRepo.findById(merchantId);
    if (!merchant) throw this.createError('Merchant not found.', 404);
    if ((merchant as { role: string }).role !== UserRole.MERCHANT) {
      throw this.createError('Only merchant accounts can be approved.', 400);
    }

    await this.userRepo.updateById(merchantId, {
      merchantStatus: MerchantStatus.APPROVED,
      approvedBy,
      approvedAt: new Date(),
    } as any);

    const { ip, userAgent } = getClientInfo(req);
    await this.auditRepo.createLog({
      userId: approvedBy,
      action: 'MERCHANT_APPROVED',
      ip,
      userAgent,
      metadata: { merchantId, merchantEmail: (merchant as any).email },
    });

    return { message: `Merchant ${(merchant as any).email} approved successfully.` };
  }

  async rejectMerchant(merchantId: string, req: Request) {
    const merchant = await this.userRepo.findById(merchantId);
    if (!merchant) throw this.createError('Merchant not found.', 404);

    await this.userRepo.updateById(merchantId, {
      merchantStatus: MerchantStatus.REJECTED,
    } as any);

    const { ip, userAgent } = getClientInfo(req);
    await this.auditRepo.createLog({
      userId: (req as any).userId,
      action: 'MERCHANT_REJECTED',
      ip,
      userAgent,
      metadata: { merchantId, merchantEmail: (merchant as any).email },
    });

    return { message: `Merchant ${(merchant as any).email} rejected.` };
  }

  async getPendingMerchants() {
    return this.userRepo.findMerchants(MerchantStatus.PENDING);
  }

  async getAllMerchants() {
    return this.userRepo.findMerchants();
  }
}
