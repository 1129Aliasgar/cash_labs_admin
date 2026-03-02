import { controller, httpPost, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { UserService } from '../services/UserService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';

@controller('/api/users')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpPost('/create', authenticate, requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN))
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, fullName, role, companyName } = req.body;
      const currentUserId = (req as any).userId;
      const currentUserRole = (req as any).role;
      const result = await this.userService.createUser(
        { email, password, fullName, role, companyName },
        currentUserId,
        currentUserRole,
        req
      );
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/', authenticate, requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN))
  public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }
}
