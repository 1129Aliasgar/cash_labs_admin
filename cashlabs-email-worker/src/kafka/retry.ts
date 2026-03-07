/**
 * retry.ts — Exponential backoff retry logic for the email worker.
 *
 * Retry schedule (delay = 2^(retryCount-1) seconds, 0 for first attempt):
 *   Attempt 1 → 0s
 *   Attempt 2 → 2s
 *   Attempt 3 → 4s
 *   Attempt 4 → 8s
 *   Attempt 5 → 16s
 *   Attempt 6 → 32s
 *   Attempt 7 → 64s   (~1 min)
 *   Attempt 8 → 128s  (~2 min)
 *   Attempt 9 → 256s  (~4 min)
 *   Attempt 10 → 512s (~8.5 min)
 */

import { Kafka, Producer, logLevel } from 'kafkajs';
import { config } from '../config';
import type { EmailEvent } from '../types';

const KAFKA_TOPICS = {
  EMAIL_SEND: 'email.send',
  EMAIL_DEAD: 'email.dead',
} as const;

// ─── Kafka producer for retry/DLQ re-publishing ───────────────────────────
let retryProducer: Producer | null = null;

async function getRetryProducer(): Promise<Producer> {
  if (!retryProducer) {
    const kafka = new Kafka({
      clientId: 'cashlabs-email-worker-retry',
      brokers: config.kafka.brokers,
      logLevel: config.env === 'production' ? logLevel.WARN : logLevel.INFO,
    });
    retryProducer = kafka.producer({ allowAutoTopicCreation: true });
    await retryProducer.connect();
  }
  return retryProducer;
}

export async function disconnectRetryProducer(): Promise<void> {
  if (retryProducer) {
    await retryProducer.disconnect();
    retryProducer = null;
  }
}

// ─── Delay helpers ─────────────────────────────────────────────────────────

/**
 * Returns the delay in milliseconds before the next retry attempt.
 * retryCount = 0 → 0ms (first attempt, no wait)
 * retryCount = 1 → 2000ms (second attempt)
 * retryCount = n → 2^(n) * 1000ms
 */
export function getRetryDelay(retryCount: number): number {
  if (retryCount <= 0) return 0;
  return Math.pow(2, retryCount) * 1000;
}

// ─── Retry & DLQ ──────────────────────────────────────────────────────────

/**
 * Schedule a retry by re-publishing the event to email.send after the
 * appropriate exponential-backoff delay.
 */
export async function scheduleRetry(event: EmailEvent): Promise<void> {
  const nextRetryCount = event.retryCount + 1;
  const delayMs = getRetryDelay(nextRetryCount);

  console.log(
    `[Retry] Scheduling retry #${nextRetryCount} for ${event.email} in ${delayMs / 1000}s`
  );

  await new Promise<void>((resolve) => setTimeout(resolve, delayMs));

  const producer = await getRetryProducer();
  const retryEvent: EmailEvent = { ...event, retryCount: nextRetryCount };

  await producer.send({
    topic: KAFKA_TOPICS.EMAIL_SEND,
    messages: [
      {
        key: event.userId,
        value: JSON.stringify(retryEvent),
      },
    ],
  });

  console.log(`[Retry] Re-published retry #${nextRetryCount} for user ${event.userId}`);
}

/**
 * Publish a permanently failed event to the dead-letter topic for
 * manual inspection and replay.
 */
export async function publishToDLQ(event: EmailEvent, reason: string): Promise<void> {
  console.error(
    `[DLQ] Publishing to dead-letter topic after ${event.retryCount} attempts. Reason: ${reason}`
  );

  const producer = await getRetryProducer();

  await producer.send({
    topic: KAFKA_TOPICS.EMAIL_DEAD,
    messages: [
      {
        key: event.userId,
        value: JSON.stringify({
          ...event,
          deadReason: reason,
          deadAt: new Date().toISOString(),
        }),
      },
    ],
  });

  console.error(`[DLQ] Event for user ${event.userId} written to email.dead topic.`);
}
