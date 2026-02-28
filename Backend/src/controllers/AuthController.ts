import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import * as authService from '../services/authService';
import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
} from '../validators/auth.schema';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
} from '../utils/cookies';

/**
 * Helper to run Joi validation and surface errors cleanly.
 * Aborts on first error for better UX.
 */
function validate<T>(schema: Joi.ObjectSchema<T>, data: unknown): T {
  const { error, value } = schema.validate(data, { abortEarly: true, stripUnknown: true });
  if (error) {
    const err = new Error(error.details[0].message) as Error & { statusCode: number };
    err.statusCode = 422;
    throw err;
  }
  return value as T;
}

/**
 * @route POST /api/auth/signup
 * @desc Register a new merchant account
 * @access Public
 */
export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = validate(signupSchema, req.body);
    const result = await authService.signup(
      {
        email: body.email,
        password: body.password,
        fullName: body.fullName,
        companyName: body.companyName,
        telegramId: body.telegramId,
        role: body.role,
      },
      req
    );

    res.status(201).json({
      success: true,
      message: result.message,
      // In production: DO NOT return verificationToken in response — send via email
      // Exposing here for development/demo purposes only
      ...(process.env.NODE_ENV !== 'production' && { _devVerificationToken: result.verificationToken }),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email address using the token sent to the user
 * @access Public
 */
export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = validate(verifyEmailSchema, req.body);
    const result = await authService.verifyEmail(body.token, req);

    // Set HTTP-only secure cookies for Instant Onboarding
    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({ 
      success: true, 
      message: result.message,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route POST /api/auth/login
 * @desc Authenticate admin and issue JWT tokens via secure cookies
 * @access Public
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = validate(loginSchema, req.body);
    const result = await authService.login(
      { email: body.email, password: body.password },
      req
    );

    // Set HTTP-only secure cookies — tokens never accessible to JavaScript
    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route POST /api/auth/refresh
 * @desc Issue new access + refresh token pair (strict rotation)
 * @access Semi-public (reads refresh cookie)
 */
export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const incomingRefreshToken: string | undefined = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      res.status(401).json({ success: false, message: 'No refresh token provided.' });
      return;
    }

    const result = await authService.refresh(incomingRefreshToken, req);

    // Set new cookies — old tokens are now invalid
    res.cookie('accessToken', result.accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({ success: true, message: 'Token refreshed.' });
  } catch (error) {
    next(error);
  }
}

/**
 * @route POST /api/auth/logout
 * @desc Blacklist access token + clear all auth cookies
 * @access Protected
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accessToken: string | undefined = req.cookies?.accessToken;
    const userId = req.userId!;

    if (accessToken) {
      await authService.logout(userId, accessToken, req);
    }

    // Clear auth cookies regardless
    res.clearCookie('accessToken', clearCookieOptions);
    res.clearCookie('refreshToken', clearCookieOptions);

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
}

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user profile
 * @access Protected
 */
export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getCurrentUser(req.userId!);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}
