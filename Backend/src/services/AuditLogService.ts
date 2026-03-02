import { injectable, inject } from 'inversify';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { IAuditLog } from '../models/schemas/auditLog.schema';

export interface GetAuditLogsResult {
  data: IAuditLog[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

@injectable()
export class AuditLogService extends BaseService {
  constructor(
    @inject(TYPES.AuditLogRepository) private auditRepo: AuditLogRepository
  ) {
    super();
  }

  async getAuditLogs(page: number = 1, limit: number = 50): Promise<GetAuditLogsResult> {
    const skip = (page - 1) * limit;
    const { logs, total } = await this.auditRepo.findPaginated(skip, limit);
    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
