/**
 * Payment Engine - Inversify Container Type Symbols
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

export const TYPES = {
  // Services
  PaymentService: Symbol.for('PaymentService'),
  GatewayService: Symbol.for('GatewayService'),
  TransactionService: Symbol.for('TransactionService'),
  TransactionEventProducerService: Symbol.for('TransactionEventProducerService'),
  // Repositories
  GatewayRepository: Symbol.for('GatewayRepository'),
  ClientRepository: Symbol.for('ClientRepository'),
  ClientGatewayRepository: Symbol.for('ClientGatewayRepository'),
  GatewayRequestConfigRepository: Symbol.for('GatewayRequestConfigRepository'),
  // Utilities
  TenantContextProvider: Symbol.for('TenantContextProvider'),
  // Controllers
  HealthController: Symbol.for('HealthController'),
  PaymentController: Symbol.for('PaymentController'),
  TransactionController: Symbol.for('TransactionController'),
};
