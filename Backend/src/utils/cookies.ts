import { CookieOptions } from 'express';
import { config } from '../config';

/**
 * Base secure cookie options shared by all auth cookies.
 * - httpOnly: true         → JS cannot access (XSS protection)
 * - sameSite: 'strict'     → Not sent on cross-origin requests (CSRF protection)
 * - secure: true (prod)    → Only sent over HTTPS
 * - domain: config value   → Scope to your domain
 */
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: config.cookie.secure,
  domain: config.env === 'production' ? config.cookie.domain : undefined,
  path: '/',
};

export const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes in ms
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

/** Cookie options for clearing — maxAge 0 expires immediately */
export const clearCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 0,
};
