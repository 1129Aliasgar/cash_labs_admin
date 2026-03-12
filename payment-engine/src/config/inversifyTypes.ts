/**
 * Payment Engine - Inversify Container Type Symbols
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

export const TYPES = {
  // Services
  GatewayService: Symbol.for('GatewayService'),
  TransactionService: Symbol.for('TransactionService'),
  TransactionEventProducerService: Symbol.for('TransactionEventProducerService'),
  // Repositories
  GatewayRepository: Symbol.for('GatewayRepository'),
  ClientRepository: Symbol.for('ClientRepository'),
  ClientGatewayRepository: Symbol.for('ClientGatewayRepository'),
  GatewayRequestConfigRepository: Symbol.for('GatewayRequestConfigRepository'),
  TransactionRepository: Symbol.for('TransactionRepository'),
  // Utilities
  TenantContextProvider: Symbol.for('TenantContextProvider'),
  // Controllers
  HealthController: Symbol.for('HealthController'),
  RedirectController: Symbol.for('RedirectController'),
  TransactionController: Symbol.for('TransactionController'),
};
