/**
 * Kafka Producer — singleton used by the Auth API to publish email events.
 *
 * Configuration:
 *  - acks: -1        → all in-sync replicas must acknowledge (strongest guarantee)
 *  - idempotent: true → exactly-once delivery per partition
 *  - retries: 10     → producer-level retry on transient errors
 */

import { Kafka, Producer, logLevel } from 'kafkajs';
import { config } from '../config';
import { KAFKA_TOPICS, type EmailEvent } from './topics';

const kafka = new Kafka({
  clientId: 'cashlabs-auth-api',
  brokers: config.kafka.brokers,
  logLevel: config.env === 'production' ? logLevel.WARN : logLevel.INFO,
});

let producer: Producer | null = null;

/** Initialize and connect the Kafka producer. Call once at server startup. */
export async function connectProducer(): Promise<void> {
  producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30_000,
    // Idempotent producer config
    idempotent: true,
    maxInFlightRequests: 1,
  });

  await producer.connect();
  console.log('[Kafka Producer] Connected successfully.');
}

/** Gracefully disconnect the producer. Call during shutdown. */
export async function disconnectProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = null;
    console.log('[Kafka Producer] Disconnected.');
  }
}

/**
 * Publish an email event to the email.send topic.
 * This is fire-and-forget from the API's perspective — errors are logged
 * but never re-thrown so they cannot break the signup flow.
 */
export async function publishEmailEvent(event: EmailEvent): Promise<void> {
  if (!producer) {
    console.error('[Kafka Producer] Producer not connected. Cannot publish event.');
    return;
  }

  const message = JSON.stringify(event);

  await producer.send({
    topic: KAFKA_TOPICS.EMAIL_SEND,
    messages: [
      {
        // Use userId as partition key for ordered delivery per user
        key: event.userId,
        value: message,
      },
    ],
    acks: -1,
  });

  console.log(`[Kafka Producer] Published ${event.type} event for user ${event.userId}`);
}
