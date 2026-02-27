import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/User';
import * as UserController from '../controllers/UserController';

const router = Router();

// Require authentication and at least ADMIN for all user management
router.use(authenticate);
router.use(requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN));

/**
 * @route POST /api/users/create
 * @desc Create a new user (internal or merchant)
 */
router.post('/create', asyncHandler(UserController.createUser));

/**
 * @route GET /api/users
 * @desc List all system users
 */
router.get('/', asyncHandler(UserController.getAllUsers));

export default router;
