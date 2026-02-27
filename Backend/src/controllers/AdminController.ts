import { Request, Response, NextFunction } from 'express';
import { User, MerchantStatus, UserRole } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { createError } from '../middleware/errorHandler';

/**
 * approveMerchant — Admin only (Super Admin per spec)
 * @route PATCH /api/admin/merchant/:id/approve
 */
export async function approveMerchant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const merchant = await User.findById(id);

    if (!merchant) {
      throw createError('Merchant not found.', 404);
    }

    if (merchant.role !== UserRole.MERCHANT) {
      throw createError('Only merchant accounts can be approved.', 400);
    }

    merchant.merchantStatus = MerchantStatus.APPROVED;
    merchant.approvedBy = req.userId as any; // Cast as any if mongoose Types.ObjectId is strict
    merchant.approvedAt = new Date();

    await merchant.save();

    // Audit log
    await AuditLog.create({
      userId: req.userId,
      action: 'MERCHANT_APPROVED',
      ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'unknown',
      metadata: { merchantId: id, merchantEmail: merchant.email },
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: `Merchant ${merchant.email} approved successfully.`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * rejectMerchant — Admin only
 * @route PATCH /api/admin/merchant/:id/reject
 */
export async function rejectMerchant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const merchant = await User.findById(id);

    if (!merchant) {
      throw createError('Merchant not found.', 404);
    }

    merchant.merchantStatus = MerchantStatus.REJECTED;
    await merchant.save();

    // Audit log
    await AuditLog.create({
      userId: req.userId,
      action: 'MERCHANT_REJECTED',
      ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'unknown',
      metadata: { merchantId: id, merchantEmail: merchant.email },
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: `Merchant ${merchant.email} rejected.`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * getPendingMerchants — List merchants awaiting approval
 * @route GET /api/admin/merchants/pending
 */
export async function getPendingMerchants(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const merchants = await User.find({
      role: UserRole.MERCHANT,
      merchantStatus: MerchantStatus.PENDING,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: merchants,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * getAllMerchants — List all merchants
 * @route GET /api/admin/merchants
 */
export async function getAllMerchants(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const merchants = await User.find({
      role: UserRole.MERCHANT,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: merchants,
    });
  } catch (error) {
    next(error);
  }
}
