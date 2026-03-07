/**
 * consumer.ts — Kafka consumer for the email worker.
 * Subscribes to email.send, passes each message to processMessage.
 */

import { Kafka, Consumer, logLevel, EachMessagePayload } from 'kafkajs';
import { config } from '../config';
import type { ProcessMessageFn } from '../types';

const KAFKA_TOPICS = {
  EMAIL_SEND: 'email.send',
} as const;

let consumer: Consumer | null = null;

export async function startConsumer(processMessage: ProcessMessageFn): Promise<void> {
  const kafka = new Kafka({
    clientId: 'cashlabs-email-worker',
    brokers: config.kafka.brokers,
    logLevel: config.env === 'production' ? logLevel.WARN : logLevel.INFO,
    // Retry connecting to Kafka on startup (it may start after us)
    retry: {
      initialRetryTime: 3000,
      retries: 20,
    },
  });

  consumer = kafka.consumer({
    groupId: config.kafka.groupId,
    // Allow reprocessing from beginning if group has no committed offset
    sessionTimeout: 30_000,
    heartbeatInterval: 3_000,
  });

  await consumer.connect();
  console.log('[Kafka Consumer] Connected.');

  await consumer.subscribe({
    topic: KAFKA_TOPICS.EMAIL_SEND,
    fromBeginning: false,
  });

  console.log(`[Kafka Consumer] Subscribed to topic: ${KAFKA_TOPICS.EMAIL_SEND}`);

  await consumer.run({
    autoCommit: true,
    autoCommitInterval: 5000,
    eachMessage: async ({ message }: EachMessagePayload) => {
      if (!message.value) {
        console.warn('[Kafka Consumer] Received empty message — skipping.');
        return;
      }

      let event: unknown;
      try {
        event = JSON.parse(message.value.toString());
      } catch {
        console.error('[Kafka Consumer] Failed to parse message as JSON — skipping.', {
          value: message.value.toString(),
        });
        return;
      }

      await processMessage(event as Parameters<ProcessMessageFn>[0]);
    },
  });
}

export async function stopConsumer(): Promise<void> {
  if (consumer) {
    await consumer.disconnect();
    consumer = null;
    console.log('[Kafka Consumer] Disconnected.');
  }
}
