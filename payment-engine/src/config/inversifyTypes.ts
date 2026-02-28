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
  // Repositories
  GatewayRepository: Symbol.for('GatewayRepository'),
  // Utilities
  TenantContextProvider: Symbol.for('TenantContextProvider'),
  // Controllers
  HealthController: Symbol.for('HealthController'),
  PaymentController: Symbol.for('PaymentController'),
  GatewayController: Symbol.for('GatewayController'),
};
