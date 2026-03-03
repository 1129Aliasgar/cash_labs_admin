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
  GatewayRepository: Symbol.for('GatewayRepository'),
  GatewayRequestConfigRepository: Symbol.for('GatewayRequestConfigRepository'),
  ClientRepository: Symbol.for('ClientRepository'),
  ClientGatewayRepository: Symbol.for('ClientGatewayRepository'),
  AuthService: Symbol.for('AuthService'),
  AdminService: Symbol.for('AdminService'),
  AuditLogService: Symbol.for('AuditLogService'),
  GatewayService: Symbol.for('GatewayService'),
  GatewayRequestConfigService: Symbol.for('GatewayRequestConfigService'),
  ClientService: Symbol.for('ClientService'),
  ClientGatewayService: Symbol.for('ClientGatewayService'),
  MerchantService: Symbol.for('MerchantService'),
  UserService: Symbol.for('UserService'),
  AuthController: Symbol.for('AuthController'),
  AdminController: Symbol.for('AdminController'),
  AuditLogController: Symbol.for('AuditLogController'),
  GatewayController: Symbol.for('GatewayController'),
  GatewayRequestConfigController: Symbol.for('GatewayRequestConfigController'),
  ClientController: Symbol.for('ClientController'),
  ClientGatewayController: Symbol.for('ClientGatewayController'),
  MerchantController: Symbol.for('MerchantController'),
  UserController: Symbol.for('UserController'),
  AuthenticateMiddleware: Symbol.for('AuthenticateMiddleware'),
  RequireApprovedMerchantMiddleware: Symbol.for('RequireApprovedMerchantMiddleware'),
};
