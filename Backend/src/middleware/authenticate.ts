import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, hashToken, AccessTokenPayload } from '../utils/tokens';
import { UserRole } from '../models/User';
import { BlacklistedToken } from '../models/BlacklistedToken';

/**
 * Authenticate middleware — protects routes requiring a valid access token.
 *
 * Flow:
 * 1. Extract accessToken from HTTP-only cookie
 * 2. Verify JWT signature and expiry
 * 3. Hash the raw token and check it against the blacklist (logout/rotation)
 * 4. Attach userId to req for downstream handlers
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken: string | undefined = req.cookies?.accessToken;

    if (!accessToken) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    // 1. Verify JWT
    let payload: AccessTokenPayload;
    try {
      payload = verifyAccessToken(accessToken);
    } catch {
      res.status(401).json({ success: false, message: 'Invalid or expired token.' });
      return;
    }

    // 2. Check blacklist — O(1) indexed lookup
    const tokenHash = hashToken(accessToken);
    const isBlacklisted = await BlacklistedToken.exists({ tokenHash });
    if (isBlacklisted) {
      res.status(401).json({ success: false, message: 'Token has been revoked.' });
      return;
    }

    // 3. Attach userId and role for downstream use
    req.userId = payload.userId;
    req.role = payload.role;
    next();
  } catch (error) {
    next(error);
  }
}
