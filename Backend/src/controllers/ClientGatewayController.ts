import { controller, httpGet, httpPost, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { ClientGatewayService } from '../services/ClientGatewayService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';

@controller('/api/admin')
export class ClientGatewayController {
  constructor(
    @inject(TYPES.ClientGatewayService) private clientGatewayService: ClientGatewayService
  ) {}

  /**
   * List client gateways with filters and pagination
   * @route GET /api/admin/client-gateways?page=1&limit=20&clientId=...&gatewayId=...
   */
  @httpGet(
    '/client-gateways',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async listClientGateways(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1') || 1;
      const limit = parseInt((req.query.limit as string) || '20') || 20;
      const clientId = (req.query.clientId as string) || undefined;
      const gatewayId = (req.query.gatewayId as string) || undefined;
      const result = await this.clientGatewayService.listClientGateways({
        page,
        limit,
        clientId,
        gatewayId,
      });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new client-gateway link (Admin only)
   * @route POST /api/admin/client-gateways
   */
  @httpPost(
    '/client-gateways',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async createClientGateway(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientGateway = await this.clientGatewayService.createClientGateway(req.body);
      res.status(201).json({ success: true, data: clientGateway });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a client-gateway by id (Admin only)
   * @route PATCH /api/admin/client-gateways/:id
   */
  @httpPatch(
    '/client-gateways/:id',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async updateClientGateway(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const clientGateway = await this.clientGatewayService.updateClientGateway(id, req.body);
      res.status(200).json({ success: true, data: clientGateway });
    } catch (error) {
      next(error);
    }
  }
}
