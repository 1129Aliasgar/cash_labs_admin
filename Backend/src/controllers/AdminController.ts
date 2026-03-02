import { controller, httpPatch, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { AdminService } from '../services/AdminService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';
@controller('/api/admin')
export class AdminController {
  constructor(@inject(TYPES.AdminService) private adminService: AdminService) {}

  @httpPatch('/merchant/:id/approve', authenticate, requireRole(UserRole.SUPER_ADMIN))
  public async approveMerchant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.adminService.approveMerchant(id, (req as any).userId, req);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  @httpPatch('/merchant/:id/reject', authenticate, requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN))
  public async rejectMerchant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.adminService.rejectMerchant(id, req);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/merchants/pending', authenticate, requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN))
  public async getPendingMerchants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const merchants = await this.adminService.getPendingMerchants();
      res.status(200).json({ success: true, data: merchants });
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/merchants', authenticate, requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN))
  public async getAllMerchants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const merchants = await this.adminService.getAllMerchants();
      res.status(200).json({ success: true, data: merchants });
    } catch (error) {
      next(error);
    }
  }
}
