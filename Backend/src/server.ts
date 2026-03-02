/**
 * Backend - Main Application Entry Point
 * Inversify + Multitenant architecture
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

import 'dotenv/config';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config';
import { container } from './config/container';
import { tenantSelector } from './middlewares/tenantSelector.middleware';
import {
  createAuthenticate,
  setAuthenticateMiddleware,
} from './middlewares/authenticate.middleware';
import {
  createRequireApprovedMerchant,
  setRequireApprovedMerchantMiddleware,
} from './middlewares/requireApprovedMerchant.middleware';
import { AppError } from './utils/AppError';

import './controllers/AuthController';
import './controllers/AdminController';
import './controllers/MerchantController';
import './controllers/UserController';

function configureApp(app: Application): void {
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  app.use(
    cors({
      origin: config.cors.frontendUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  if (config.env !== 'test') {
    app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
  }

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(cookieParser());

  app.use(tenantSelector);

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'PSPManager Auth API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });
}

function configureErrorHandling(app: Application): void {
  app.use((err: Error & { statusCode?: number }, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || (err instanceof AppError ? err.statusCode : 500);
    console.error(
      `[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`,
      { statusCode, stack: config.env !== 'production' ? err.stack : '[hidden]' }
    );
    const clientMessage =
      statusCode < 500 ? err.message : 'An unexpected error occurred. Please try again.';
    res.status(statusCode).json({
      success: false,
      message: clientMessage,
      ...(config.env !== 'production' && statusCode >= 500 && { debug: err.message }),
    });
  });

  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
  });
}

async function startServer(): Promise<void> {
  setAuthenticateMiddleware(createAuthenticate(container));
  setRequireApprovedMerchantMiddleware(createRequireApprovedMerchant(container));

  const server = new InversifyExpressServer(container);
  server.setConfig(configureApp);
  server.setErrorConfig(configureErrorHandling);

  const app = server.build();

  const PORT = config.port;
  const httpServer = app.listen(PORT, () => {
    console.log(`[Server] PSPManager Auth API running on port ${PORT} [${config.env}]`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      process.exit(0);
    });
    setTimeout(() => {
      console.error('[Server] Force shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled Promise Rejection:', reason);
    process.exit(1);
  });
  process.on('uncaughtException', (error) => {
    console.error('[Server] Uncaught Exception:', error);
    process.exit(1);
  });
}

startServer();
