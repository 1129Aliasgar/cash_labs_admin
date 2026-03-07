/**
 * Inversify Container Configuration
 * Same pattern as payment-engine.
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './inversifyTypes';

import { TenantContextProvider } from '../utils/tenantContext.provider';
import { ExampleService } from '../services/example.service';
import { TransactionService } from '../services/transaction.service';
import { TransactionEventConsumerService } from '../services/transactionEventConsumer.service';
import { HealthController } from '../controllers/health.controller';
import { ExampleController } from '../controllers/example.controller';

export function configureContainer(): Container {
  const container = new Container();

  container.bind(TYPES.TenantContextProvider).to(TenantContextProvider).inSingletonScope();

  container
    .bind<ExampleService>(TYPES.ExampleService)
    .to(ExampleService)
    .inSingletonScope();

  container
    .bind<TransactionService>(TYPES.TransactionService)
    .to(TransactionService)
    .inSingletonScope();

  container
    .bind<TransactionEventConsumerService>(TYPES.TransactionEventConsumerService)
    .to(TransactionEventConsumerService)
    .inSingletonScope();

  container.bind(HealthController).toSelf().inSingletonScope();
  container.bind(ExampleController).toSelf().inSingletonScope();

  return container;
}

export const container = configureContainer();
