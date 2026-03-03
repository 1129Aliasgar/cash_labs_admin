import { controller, httpGet, httpPost, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { GatewayRequestConfigService } from '../services/GatewayRequestConfigService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';

@controller('/api/admin')
export class GatewayRequestConfigController {
  constructor(
    @inject(TYPES.GatewayRequestConfigService) private configService: GatewayRequestConfigService
  ) {}

  /**
   * List all request configs for a gateway
   * @route GET /api/admin/gateways/:gatewayId/configs
   */
  @httpGet(
    '/gateways/:gatewayId/configs',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async listConfigs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gatewayId = Array.isArray(req.params.gatewayId) ? req.params.gatewayId[0] : req.params.gatewayId;
      const configs = await this.configService.getConfigsByGatewayId(gatewayId);
      res.status(200).json({ success: true, data: configs });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get request config by type for a gateway
   * @route GET /api/admin/gateways/:gatewayId/configs/:type
   */
  @httpGet(
    '/gateways/:gatewayId/configs/:type',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async getConfigByType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gatewayId = Array.isArray(req.params.gatewayId) ? req.params.gatewayId[0] : req.params.gatewayId;
      const type = Array.isArray(req.params.type) ? req.params.type[0] : req.params.type;
      const config = await this.configService.getByGatewayIdAndType(gatewayId, type);
      if (!config) {
        res.status(404).json({ success: false, message: 'Config not found for this gateway and type.' });
        return;
      }
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a request config for a gateway
   * @route POST /api/admin/gateways/:gatewayId/configs
   */
  @httpPost(
    '/gateways/:gatewayId/configs',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async createConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gatewayId = Array.isArray(req.params.gatewayId) ? req.params.gatewayId[0] : req.params.gatewayId;
      const config = await this.configService.createConfig(gatewayId, req.body);
      res.status(201).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a request config by type for a gateway
   * @route PATCH /api/admin/gateways/:gatewayId/configs/:type
   */
  @httpPatch(
    '/gateways/:gatewayId/configs/:type',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gatewayId = Array.isArray(req.params.gatewayId) ? req.params.gatewayId[0] : req.params.gatewayId;
      const type = Array.isArray(req.params.type) ? req.params.type[0] : req.params.type;
      const config = await this.configService.updateConfig(gatewayId, type, req.body);
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }
}
