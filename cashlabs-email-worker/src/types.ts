/**
 * Shared types for the email worker.
 * Kept in a separate file to avoid circular imports between worker.ts,
 * kafka/consumer.ts, and kafka/retry.ts.
 */

export type EmailEventType = 'VERIFY_EMAIL';

export interface EmailEvent {
  type: EmailEventType;
  userId: string;
  email: string;
  token: string;
  retryCount: number;
}

export type ProcessMessageFn = (event: EmailEvent) => Promise<void>;
