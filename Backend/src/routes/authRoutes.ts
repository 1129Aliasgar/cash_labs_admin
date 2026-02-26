import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import * as AuthController from '../controllers/AuthController';

const router = Router();

/**
 * @route POST /api/auth/signup
 * @desc Register new merchant account
 * @access Public
 */
router.post('/signup', asyncHandler(AuthController.signup));

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email with token
 * @access Public
 */
router.post('/verify-email', asyncHandler(AuthController.verifyEmail));

/**
 * @route POST /api/auth/login
 * @desc Authenticate and issue JWT cookies
 * @access Public
 */
router.post('/login', asyncHandler(AuthController.login));

/**
 * @route POST /api/auth/refresh
 * @desc Rotate refresh token (strict rotation)
 * @access Semi-public (reads refresh cookie)
 */
router.post('/refresh', asyncHandler(AuthController.refresh));

/**
 * @route POST /api/auth/logout
 * @desc Blacklist access token and clear cookies
 * @access Protected
 */
router.post('/logout', authenticate, asyncHandler(AuthController.logout));

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Protected
 */
router.get('/me', authenticate, asyncHandler(AuthController.me));

export default router;
