import { injectable, inject } from 'inversify';
import { TYPES } from '../config/inversifyTypes';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IAuditLog } from '../models/schemas/auditLog.schema';

const MODEL_NAME = 'auditLog';

@injectable()
export class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async createLog(data: {
    userId?: string;
    action: string;
    ip: string;
    userAgent: string;
    metadata?: Record<string, unknown>;
  }) {
    return super.create(data as Partial<IAuditLog>, MODEL_NAME);
  }

  async findPaginated(skip: number, limit: number): Promise<{ logs: IAuditLog[]; total: number }> {
    const model = this.getModel(MODEL_NAME);
    const [logs, total] = await Promise.all([
      model.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      model.countDocuments().exec(),
    ]);
    return { logs: logs as IAuditLog[], total };
  }
}
