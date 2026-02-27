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
import { PaymentService } from '../services/payment.service';
import { GatewayService } from '../services/GatewayService';
import { HealthController } from '../controllers/health.controller';
import { PaymentController } from '../controllers/payment.controller';
import { GatewayController } from '../controllers/GatewayController';

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

  // Bind services
  container
    .bind<PaymentService>(TYPES.PaymentService)
    .to(PaymentService)
    .inSingletonScope();

  container
    .bind<GatewayService>(TYPES.GatewayService)
    .to(GatewayService)
    .inSingletonScope();

  // Bind controllers (by class so inversify-express-utils can resolve them)
  container.bind(HealthController).toSelf().inSingletonScope();
  container.bind(PaymentController).toSelf().inSingletonScope();
  container.bind(GatewayController).toSelf().inSingletonScope();

  return container;
}

export const container = configureContainer();
