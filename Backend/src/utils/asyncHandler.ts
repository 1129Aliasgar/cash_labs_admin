import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler to forward errors to Express error middleware.
 * Eliminates repetitive try/catch in every controller.
 *
 * Usage:
 *   router.post('/login', asyncHandler(authController.login));
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
