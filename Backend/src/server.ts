import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';
import { config } from './config';

const PORT = config.port;

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.db.uri, {
      // Connection pool settings for production
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('[DB] Connection failed:', error);
    process.exit(1); // Fail fast — no DB, no service
  }
}

async function startServer(): Promise<void> {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] PSPManager Auth API running on port ${PORT} [${config.env}]`);
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await mongoose.connection.close();
        console.log('[DB] MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('[Server] Error during shutdown:', err);
        process.exit(1);
      }
    });

    // Force shutdown after 10s if graceful fails
    setTimeout(() => {
      console.error('[Server] Force shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Catch unhandled rejections — log and exit (let Docker/K8s restart)
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
