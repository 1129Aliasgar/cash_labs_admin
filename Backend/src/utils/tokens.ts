import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

/**
 * Creates a sha256 hex hash of a token string.
 * Used for both storing refresh tokens in DB and tracking blacklisted access tokens.
 * NEVER store raw tokens in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a cryptographically random URL-safe token (for email verification).
 * Returns both the raw token (to send in email) and its hash (to store in DB).
 */
export function generateVerificationToken(): { rawToken: string; hashedToken: string } {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
}

/**
 * Signs a short-lived access token (15m by default).
 * Payload intentionally minimal — only userId.
 */
export function signAccessToken(userId: string): string {
  const payload: AccessTokenPayload = { userId };
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Signs a long-lived refresh token (7d by default).
 * Uses a DIFFERENT secret from access token — isolated blast radius.
 */
export function signRefreshToken(userId: string): string {
  const payload: RefreshTokenPayload = { userId };
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verifies and decodes an access token.
 * Throws if invalid or expired.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
}

/**
 * Verifies and decodes a refresh token.
 * Throws if invalid or expired.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
}

/**
 * Returns the expiration Date object from a JWT without throwing.
 * Used to set the TTL for the BlacklistedToken record.
 */
export function getTokenExpiry(token: string): Date {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) {
    // Fallback: 15 minutes from now
    return new Date(Date.now() + 15 * 60 * 1000);
  }
  return new Date(decoded.exp * 1000);
}
