/**
 * Backend - Inversify Container Configuration
 * Multitenant auth API with Inversify IoC
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './inversifyTypes';

import { TenantContextProvider } from '../utils/tenantContext.provider';
import { UserRepository } from '../repositories/UserRepository';
import { BlacklistedTokenRepository } from '../repositories/BlacklistedTokenRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { GatewayRepository } from '../repositories/GatewayRepository';
import { GatewayRequestConfigRepository } from '../repositories/GatewayRequestConfigRepository';
import { ClientRepository } from '../repositories/ClientRepository';
import { ClientGatewayRepository } from '../repositories/ClientGatewayRepository';
import { AuthService } from '../services/AuthService';
import { AdminService } from '../services/AdminService';
import { AuditLogService } from '../services/AuditLogService';
import { GatewayService } from '../services/GatewayService';
import { GatewayRequestConfigService } from '../services/GatewayRequestConfigService';
import { ClientService } from '../services/ClientService';
import { ClientGatewayService } from '../services/ClientGatewayService';
import { MerchantService } from '../services/MerchantService';
import { UserService } from '../services/UserService';
import {
  AuthController,
  AdminController,
  AuditLogController,
  GatewayController,
  GatewayRequestConfigController,
  ClientController,
  ClientGatewayController,
  MerchantController,
  UserController,
} from '../controllers';

export function configureContainer(): Container {
  const container = new Container();

  container
    .bind<TenantContextProvider>(TYPES.TenantContextProvider)
    .to(TenantContextProvider)
    .inSingletonScope();

  container
    .bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

  container
    .bind<BlacklistedTokenRepository>(TYPES.BlacklistedTokenRepository)
    .to(BlacklistedTokenRepository)
    .inSingletonScope();

  container
    .bind<AuditLogRepository>(TYPES.AuditLogRepository)
    .to(AuditLogRepository)
    .inSingletonScope();

  container
    .bind<GatewayRepository>(TYPES.GatewayRepository)
    .to(GatewayRepository)
    .inSingletonScope();

  container
    .bind<GatewayRequestConfigRepository>(TYPES.GatewayRequestConfigRepository)
    .to(GatewayRequestConfigRepository)
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
    .bind<AuthService>(TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope();

  container
    .bind<AdminService>(TYPES.AdminService)
    .to(AdminService)
    .inSingletonScope();

  container
    .bind<AuditLogService>(TYPES.AuditLogService)
    .to(AuditLogService)
    .inSingletonScope();

  container
    .bind<GatewayService>(TYPES.GatewayService)
    .to(GatewayService)
    .inSingletonScope();

  container
    .bind<GatewayRequestConfigService>(TYPES.GatewayRequestConfigService)
    .to(GatewayRequestConfigService)
    .inSingletonScope();

  container
    .bind<ClientService>(TYPES.ClientService)
    .to(ClientService)
    .inSingletonScope();

  container
    .bind<ClientGatewayService>(TYPES.ClientGatewayService)
    .to(ClientGatewayService)
    .inSingletonScope();

  container
    .bind<MerchantService>(TYPES.MerchantService)
    .to(MerchantService)
    .inSingletonScope();

  container
    .bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();

  container.bind(AuthController).toSelf().inSingletonScope();
  container.bind(AdminController).toSelf().inSingletonScope();
  container.bind(AuditLogController).toSelf().inSingletonScope();
  container.bind(GatewayController).toSelf().inSingletonScope();
  container.bind(GatewayRequestConfigController).toSelf().inSingletonScope();
  container.bind(ClientController).toSelf().inSingletonScope();
  container.bind(ClientGatewayController).toSelf().inSingletonScope();
  container.bind(MerchantController).toSelf().inSingletonScope();
  container.bind(UserController).toSelf().inSingletonScope();

  return container;
}

export const container = configureContainer();
