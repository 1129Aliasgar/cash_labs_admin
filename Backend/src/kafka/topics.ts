/**
 * Kafka topic registry and shared message types.
 * Keep topic names as constants to avoid typos across services.
 */

export const KAFKA_TOPICS = {
  EMAIL_SEND: 'email.send',
  EMAIL_DEAD: 'email.dead',
} as const;

export type KafkaTopicName = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];

// ─── Message Types ────────────────────────────────────────────────────────────

export type EmailEventType = 'VERIFY_EMAIL';

export interface EmailEvent {
  type: EmailEventType;
  userId: string;
  email: string;
  token: string;
  retryCount: number;
}
