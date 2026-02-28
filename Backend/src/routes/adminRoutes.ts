import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/User';
import * as AdminController from '../controllers/AdminController';

const router = Router();

// All routes here require authentication and at least ADMIN/SUPER_ADMIN role
router.use(authenticate);

/**
 * @route PATCH /api/admin/merchant/:id/approve
 * @desc Approve a merchant account (SUPER_ADMIN only per spec)
 */
router.patch(
  '/merchant/:id/approve',
  requireRole(UserRole.SUPER_ADMIN),
  asyncHandler(AdminController.approveMerchant)
);

/**
 * @route PATCH /api/admin/merchant/:id/reject
 * @desc Reject a merchant account
 */
router.patch(
  '/merchant/:id/reject',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  asyncHandler(AdminController.rejectMerchant)
);

/**
 * @route GET /api/admin/merchants/pending
 * @desc List merchants awaiting approval
 */
router.get(
  '/merchants/pending',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  asyncHandler(AdminController.getPendingMerchants)
);

/**
 * @route GET /api/admin/merchants
 * @desc List all merchants
 */
router.get(
  '/merchants',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  asyncHandler(AdminController.getAllMerchants)
);

/**
 * @route GET /api/admin/audit-logs
 * @desc Get system audit logs
 */
router.get(
  '/audit-logs',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  asyncHandler(AdminController.getAuditLogs)
);

export default router;
