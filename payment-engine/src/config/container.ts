/**
 * Payment Engine - Inversify Container Configuration
 *
 * This file configures the Inversify IoC container with all dependencies
 * including services, repositories, and controllers.
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './inversifyTypes';

import { TenantContextProvider } from '../utils/tenantContext.provider';
import { GatewayRepository } from '../repositories/GatewayRepository';
import { ClientRepository } from '../repositories/ClientRepository';
import { ClientGatewayRepository } from '../repositories/ClientGatewayRepository';
import { GatewayRequestConfigRepository } from '../repositories/GatewayRequestConfigRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { GatewayService } from '../services/GatewayService';
import { TransactionService } from '../services/transaction.service';
import { TransactionEventProducerService } from '../services/transactionEventProducer.service';
import { HealthController } from '../controllers/health.controller';
import { RedirectController } from '../controllers/redirect.controller';
import { TransactionController } from '../controllers/transaction.controller';

export function configureContainer(): Container {
  const container = new Container();

  // Bind utilities
  container
    .bind<TenantContextProvider>(TYPES.TenantContextProvider)
    .to(TenantContextProvider)
    .inSingletonScope();

  // Bind repositories
  container
    .bind<GatewayRepository>(TYPES.GatewayRepository)
    .to(GatewayRepository)
    .inSingletonScope();

  container
    .bind<ClientRepository>(TYPES.ClientRepository)
    .to(ClientRepository)
    .inSingletonScope();

  container
    .bind<ClientGatewayRepository>(TYPES.ClientGatewayRepository)
    .to(ClientGatewayRepository)
    .inSingletonScope();

  container
    .bind<GatewayRequestConfigRepository>(TYPES.GatewayRequestConfigRepository)
    .to(GatewayRequestConfigRepository)
    .inSingletonScope();

  container
    .bind<TransactionRepository>(TYPES.TransactionRepository)
    .to(TransactionRepository)
    .inSingletonScope();

  // Bind services
  container
    .bind<GatewayService>(TYPES.GatewayService)
    .to(GatewayService)
    .inSingletonScope();

  container
    .bind<TransactionService>(TYPES.TransactionService)
    .to(TransactionService)
    .inSingletonScope();

  container
    .bind<TransactionEventProducerService>(TYPES.TransactionEventProducerService)
    .to(TransactionEventProducerService)
    .inSingletonScope();

  // Bind controllers (by class so inversify-express-utils can resolve them)
  container.bind(HealthController).toSelf().inSingletonScope();
  container.bind(RedirectController).toSelf().inSingletonScope();
  container.bind(TransactionController).toSelf().inSingletonScope();

  return container;
}

export const container = configureContainer();
