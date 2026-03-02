import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { AuditLogService } from '../services/AuditLogService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';

@controller('/api/admin')
export class AuditLogController {
  constructor(
    @inject(TYPES.AuditLogService) private auditLogService: AuditLogService
  ) {}

  /**
   * Get system audit logs (Admin only)
   * @route GET /api/admin/audit-logs
   */
  @httpGet(
    '/audit-logs',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async getAuditLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1') || 1;
      const limit = parseInt((req.query.limit as string) || '50') || 50;
      const result = await this.auditLogService.getAuditLogs(page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}
