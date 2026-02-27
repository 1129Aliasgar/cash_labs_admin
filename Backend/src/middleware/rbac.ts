import { Request, Response, NextFunction } from 'express';
import { UserRole, MerchantStatus, User } from '../models/User';
import { createError } from './errorHandler';

/**
 * requireRole — Restricts access to specific user roles.
 * Must be used AFTER the authenticate middleware.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return next(createError('Access denied. Insufficient permissions.', 403));
    }
    next();
  };
}

/**
 * requireApprovedMerchant — Ensures the merchant is approved.
 * Fetches status from DB to ensure immediate revocation if needed.
 */
export async function requireApprovedMerchant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Super Admin/Admin skip status check
    if (req.role === UserRole.SUPER_ADMIN || req.role === UserRole.ADMIN) {
      return next();
    }

    const user = await User.findById(req.userId).select('merchantStatus');

    if (!user) {
      return next(createError('User not found.', 404));
    }

    if (user.merchantStatus !== MerchantStatus.APPROVED) {
      return next(
        createError('Access denied. Your merchant account is not yet approved.', 403)
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
