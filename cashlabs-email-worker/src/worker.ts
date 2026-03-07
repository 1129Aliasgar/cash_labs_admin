/**
 * worker.ts — Main entry point for the CashLabs email worker.
 *
 * Lifecycle:
 *   1. Start Kafka consumer (subscribes to email.send)
 *   2. For each message: attempt to send email via SendGrid
 *   3. On failure: retry with exponential backoff (max 10 attempts)
 *   4. After 10 failures: publish to email.dead (DLQ)
 *   5. Graceful shutdown on SIGTERM/SIGINT
 */

import { config } from './config';
import { startConsumer, stopConsumer } from './kafka/consumer';
import { scheduleRetry, publishToDLQ, disconnectRetryProducer } from './kafka/retry';
import { sendVerificationEmail } from './services/emailService';
import type { EmailEvent, ProcessMessageFn } from './types';

// Re-export so other modules can import types from here for backwards compat
export type { EmailEvent, ProcessMessageFn };

// ─── Message Processor ─────────────────────────────────────────────────────

/**
 * Process a single email event from Kafka.
 * Handles retry and DLQ routing.
 */
export async function processMessage(event: EmailEvent): Promise<void> {
  const maxRetries = config.app.maxRetries;

  // Guard: unknown event type
  if (event.type !== 'VERIFY_EMAIL') {
    console.warn(`[Worker] Unknown event type: ${String(event.type)} — discarding.`);
    return;
  }

  // Guard: exceeded max retries → DLQ
  if (event.retryCount >= maxRetries) {
    await publishToDLQ(
      event,
      `Max retries (${maxRetries}) exceeded for user ${event.userId}`
    );
    return;
  }

  const attempt = event.retryCount + 1;
  console.log(
    `[Worker] Processing ${event.type} for ${event.email} ` +
      `(attempt ${attempt}/${maxRetries})`
  );

  try {
    await sendVerificationEmail(event.email, event.token);
    console.log(
      `[Worker] ✓ Email delivered to ${event.email} on attempt ${attempt}`
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(
      `[Worker] ✗ Failed to send email to ${event.email} on attempt ${attempt}: ${errorMsg}`
    );

    await scheduleRetry(event);
  }
}

// ─── Bootstrap ─────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  console.log(`[Worker] Starting CashLabs Email Worker [${config.env}]`);
  console.log(`[Worker] Kafka brokers: ${config.kafka.brokers.join(', ')}`);
  console.log(`[Worker] Consumer group: ${config.kafka.groupId}`);
  console.log(`[Worker] Max retries: ${config.app.maxRetries}`);

  await startConsumer(processMessage);

  console.log('[Worker] 🟢 Ready — listening for email events...');
}

// ─── Graceful Shutdown ──────────────────────────────────────────────────────

async function shutdown(signal: string): Promise<void> {
  console.log(`\n[Worker] ${signal} received. Shutting down gracefully...`);
  try {
    await stopConsumer();
    await disconnectRetryProducer();
    console.log('[Worker] Clean shutdown complete.');
    process.exit(0);
  } catch (err) {
    console.error('[Worker] Error during shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[Worker] Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('[Worker] Uncaught Exception:', error);
  process.exit(1);
});

bootstrap().catch((err) => {
  console.error('[Worker] Failed to start:', err);
  process.exit(1);
});
