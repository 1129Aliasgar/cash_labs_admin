import { controller, httpGet, httpPost, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { GatewayService } from '../services/GatewayService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';

@controller('/api/admin')
export class GatewayController {
  constructor(
    @inject(TYPES.GatewayService) private gatewayService: GatewayService
  ) {}

  /**
   * List gateways with filters and pagination
   * @route GET /api/admin/gateways?page=1&limit=20&type=Fiat&name=Stripe
   */
  @httpGet(
    '/gateways',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async listGateways(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1') || 1;
      const limit = parseInt((req.query.limit as string) || '20') || 20;
      const type = (req.query.type as string) || undefined;
      const name = (req.query.name as string) || undefined;
      const result = await this.gatewayService.listGateways({ page, limit, type, name });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new gateway (Admin only)
   * @route POST /api/admin/gateways
   */
  @httpPost(
    '/gateways',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async createGateway(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gateway = await this.gatewayService.createGateway(req.body);
      res.status(201).json({ success: true, data: gateway });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a gateway by id (Admin only)
   * @route PATCH /api/admin/gateways/:id
   */
  @httpPatch(
    '/gateways/:id',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async updateGateway(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const gateway = await this.gatewayService.updateGateway(id, req.body);
      res.status(200).json({ success: true, data: gateway });
    } catch (error) {
      next(error);
    }
  }
}
