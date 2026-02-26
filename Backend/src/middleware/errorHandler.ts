import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Centralized error handler. MUST be registered last in Express middleware chain.
 *
 * Security rules:
 * - NEVER expose stack traces in production
 * - NEVER expose internal error details to the client
 * - Return consistent JSON error shape
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;

  // Log internally (replace with proper logger like pino/winston in production)
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`, {
    statusCode,
    stack: config.env !== 'production' ? err.stack : '[hidden in production]',
  });

  // FINTECH RULE: Never leak stack traces or internal messages to clients
  const clientMessage =
    statusCode < 500
      ? err.message  // Operational errors (4xx) — safe to show message
      : 'An unexpected error occurred. Please try again.'; // Server errors (5xx) — generic only

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    // Only include error code in dev for debugging
    ...(config.env !== 'production' && statusCode >= 500 && { debug: err.message }),
  });
}

/** Helper to create typed operational errors */
export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}
