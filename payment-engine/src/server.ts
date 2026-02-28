/**
 * Payment Engine - Main Application Entry Point
 *
 * This file initializes the Express server with Inversify dependency injection
 * and configures all middleware and routes.
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './config/container';
import { tenantSelector } from './middlewares/tenantSelector.middleware';

// Import controllers to register them with inversify-express-utils
import './controllers/health.controller';
import './controllers/payment.controller';
import './controllers/GatewayController';

function configureApp(app: Application): void {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(tenantSelector);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, x-host');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Payment Engine is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });
}

function configureErrorHandling(app: Application): void {
  app.use((err: Error & { statusCode?: number; code?: string }, req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error', err, { url: req.url, method: req.method, ip: req.ip });
    res.status(err.statusCode ?? 500).json({
      success: false,
      error: err.message ?? 'Internal Server Error',
      code: err.code ?? 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('*', (req: Request, res: Response) => {
    console.warn('Route not found', { url: req.url, method: req.method, ip: req.ip });
    res.status(404).json({
      success: false,
      error: 'Route not found',
      code: 'ROUTE_NOT_FOUND',
      timestamp: new Date().toISOString(),
    });
  });
}

async function startServer(): Promise<void> {
  const server = new InversifyExpressServer(container);
  server.setConfig(configureApp);
  server.setErrorConfig(configureErrorHandling);
  const app = server.build();

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Payment Engine started successfully`);
    console.log(`Server running on port: ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export { startServer };
