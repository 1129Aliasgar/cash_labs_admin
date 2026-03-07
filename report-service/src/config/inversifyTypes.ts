/**
 * Inversify Container Type Symbols
 * Same pattern as payment-engine.
 */

export const TYPES = {
  // Tenant
  TenantContextProvider: Symbol.for('TenantContextProvider'),
  // Kafka / Consumers
  TransactionEventConsumerService: Symbol.for('TransactionEventConsumerService'),
  // Services
  ExampleService: Symbol.for('ExampleService'),
  TransactionService: Symbol.for('TransactionService'),
  // Controllers
  HealthController: Symbol.for('HealthController'),
  ExampleController: Symbol.for('ExampleController'),
};
