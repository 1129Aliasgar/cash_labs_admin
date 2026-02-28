/**
 * System Constants
 * 
 * Single source of truth for ROLES, STATUSES and other system-wide definitions.
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MERCHANT = 'MERCHANT',
  AGENT = 'AGENT',
}

export enum MerchantStatus {
  NONE = 'NONE',
  ACTIVE = 'ACTIVE',     // Just signed up, needs to complete onboarding
  PENDING = 'PENDING',   // Submitted onboarding, awaiting manual approval
  APPROVED = 'APPROVED', // Fully active and verified
  REJECTED = 'REJECTED', // Compliance check failed
}

export enum AuditAction {
  SIGNUP = 'SIGNUP',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  TOKEN_REUSE_DETECTED = 'TOKEN_REUSE_DETECTED',
  MERCHANT_APPROVED = 'MERCHANT_APPROVED',
  MERCHANT_REJECTED = 'MERCHANT_REJECTED',
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  LOGOUT = 'LOGOUT',
}

export const ROLE_HIERARCHY = {
  [UserRole.SUPER_ADMIN]: 4,
  [UserRole.ADMIN]: 3,
  [UserRole.AGENT]: 2,
  [UserRole.MERCHANT]: 1,
};

export const DEFAULT_MERCHANT_STATUS = MerchantStatus.ACTIVE;
export const DEFAULT_ADMIN_STATUS = MerchantStatus.NONE;
