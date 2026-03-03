import { controller, httpGet, httpPost, httpPatch } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { ClientService } from '../services/ClientService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';

@controller('/api/admin')
export class ClientController {
  constructor(
    @inject(TYPES.ClientService) private clientService: ClientService
  ) {}

  /**
   * List clients with filters and pagination
   * @route GET /api/admin/clients?page=1&limit=20&name=Acme&clientId=acme
   */
  @httpGet(
    '/clients',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async listClients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1') || 1;
      const limit = parseInt((req.query.limit as string) || '20') || 20;
      const name = (req.query.name as string) || undefined;
      const clientId = (req.query.clientId as string) || undefined;
      const result = await this.clientService.listClients({ page, limit, name, clientId });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new client (Admin only)
   * @route POST /api/admin/clients
   */
  @httpPost(
    '/clients',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await this.clientService.createClient(req.body);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a client by id (Admin only)
   * @route PATCH /api/admin/clients/:id
   */
  @httpPatch(
    '/clients/:id',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  )
  public async updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const client = await this.clientService.updateClient(id, req.body);
      res.status(200).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }
}
