/**
 * Inversify + Express - Main Entry (same pattern as payment-engine)
 */

import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './config/container';
import { TYPES } from './types';
import { TransactionEventConsumerService } from './services/transactionEventConsumer.service';

import { tenantSelector } from './middlewares/tenantSelector.middleware';

import './controllers/health.controller';
import './controllers/example.controller';

function configureApp(app: Application): void {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-host');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.use(tenantSelector);

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Inversify service is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });
}

function configureErrorHandling(app: Application): void {
  app.use((err: Error & { statusCode?: number; code?: string }, req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error', err, { url: req.url, method: req.method });
    res.status(err.statusCode ?? 500).json({
      success: false,
      error: err.message ?? 'Internal Server Error',
      code: err.code ?? 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('*', (req: Request, res: Response) => {
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

  const PORT = process.env.PORT ?? 3001;
  app.listen(PORT, () => {
    console.log(`Inversify service started`);
    console.log(`Server running on port: ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`API:    http://localhost:${PORT}/api/hello`);
  });


    const consumer = container.get<TransactionEventConsumerService>(TYPES.TransactionEventConsumerService);
    consumer.start().catch((err) => {
      console.error('[TransactionConsumer] Failed to start', err);
    });
}

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export { startServer };
