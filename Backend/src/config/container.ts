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
import { AuthService } from '../services/AuthService';
import { AdminService } from '../services/AdminService';
import { AuditLogService } from '../services/AuditLogService';
import { MerchantService } from '../services/MerchantService';
import { UserService } from '../services/UserService';
import { AuthController } from '../controllers/AuthController';
import { AdminController } from '../controllers/AdminController';
import { AuditLogController } from '../controllers/AuditLogController';
import { MerchantController } from '../controllers/MerchantController';
import { UserController } from '../controllers/UserController';

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
  container.bind(MerchantController).toSelf().inSingletonScope();
  container.bind(UserController).toSelf().inSingletonScope();

  return container;
}

export const container = configureContainer();
