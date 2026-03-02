import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/user.constants';
import { AppError } from '../utils/AppError';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = (req as any).role;
    if (!role || !roles.includes(role)) {
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }
    next();
  };
}
