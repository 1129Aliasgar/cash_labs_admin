/**
 * Backend - Inversify Container Type Symbols
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

export const TYPES = {
  TenantContextProvider: Symbol.for('TenantContextProvider'),
  UserRepository: Symbol.for('UserRepository'),
  BlacklistedTokenRepository: Symbol.for('BlacklistedTokenRepository'),
  AuditLogRepository: Symbol.for('AuditLogRepository'),
  AuthService: Symbol.for('AuthService'),
  AdminService: Symbol.for('AdminService'),
  AuditLogService: Symbol.for('AuditLogService'),
  MerchantService: Symbol.for('MerchantService'),
  UserService: Symbol.for('UserService'),
  AuthController: Symbol.for('AuthController'),
  AdminController: Symbol.for('AdminController'),
  AuditLogController: Symbol.for('AuditLogController'),
  MerchantController: Symbol.for('MerchantController'),
  UserController: Symbol.for('UserController'),
  AuthenticateMiddleware: Symbol.for('AuthenticateMiddleware'),
  RequireApprovedMerchantMiddleware: Symbol.for('RequireApprovedMerchantMiddleware'),
};
