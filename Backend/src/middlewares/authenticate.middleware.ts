import { Request, Response, NextFunction } from 'express';
import { Container } from 'inversify';
import { verifyAccessToken, hashToken, AccessTokenPayload } from '../utils/tokens';
import { TYPES } from '../config/inversifyTypes';
import { BlacklistedTokenRepository } from '../repositories/BlacklistedTokenRepository';

type AuthMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;
let _authenticate: AuthMiddleware | null = null;

export function setAuthenticateMiddleware(fn: AuthMiddleware) {
  _authenticate = fn;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  if (!_authenticate) return next(new Error('Authenticate middleware not initialized'));
  _authenticate(req, res, next);
}

export function createAuthenticate(container: Container): AuthMiddleware {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accessToken: string | undefined = req.cookies?.accessToken;

      if (!accessToken) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      let payload: AccessTokenPayload;
      try {
        payload = verifyAccessToken(accessToken);
      } catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
        return;
      }

      const blacklistRepo = container.get<BlacklistedTokenRepository>(
        TYPES.BlacklistedTokenRepository
      );
      const tokenHash = hashToken(accessToken);
      const isBlacklisted = await blacklistRepo.existsByTokenHash(tokenHash);
      if (isBlacklisted) {
        res.status(401).json({ success: false, message: 'Token has been revoked.' });
        return;
      }

      (req as any).userId = payload.userId;
      (req as any).role = payload.role;
      next();
    } catch (error) {
      next(error);
    }
  };
}
