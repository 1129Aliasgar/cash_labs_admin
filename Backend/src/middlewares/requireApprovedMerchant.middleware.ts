import { Request, Response, NextFunction } from 'express';
import { Container } from 'inversify';
import { TYPES } from '../config/inversifyTypes';
import { UserRepository } from '../repositories/UserRepository';
import { UserRole, MerchantStatus } from '../constants/user.constants';
import { AppError } from '../utils/AppError';

let _requireApprovedMerchant: ((req: Request, res: Response, next: NextFunction) => Promise<void>) | null = null;

export function setRequireApprovedMerchantMiddleware(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  _requireApprovedMerchant = fn;
}

export function requireApprovedMerchant(req: Request, res: Response, next: NextFunction): void {
  if (!_requireApprovedMerchant) return next(new Error('RequireApprovedMerchant not initialized'));
  _requireApprovedMerchant(req, res, next);
}

export function createRequireApprovedMerchant(container: Container): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = (req as any).role;
      if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
        return next();
      }

      const userId = (req as any).userId;
      const userRepo = container.get<UserRepository>(TYPES.UserRepository);
      const user = await userRepo.findById(userId);

      if (!user) {
        return next(new AppError('User not found.', 404));
      }

      if ((user as any).merchantStatus !== MerchantStatus.APPROVED) {
        return next(
          new AppError('Access denied. Your merchant account is not yet approved.', 403)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
