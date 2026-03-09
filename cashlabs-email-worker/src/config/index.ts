/**
 * Central config loader for the email worker.
 * All env vars are required — fail fast if any are missing.
 */

import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  env: process.env.NODE_ENV || 'development',

  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    groupId: process.env.KAFKA_GROUP_ID || 'email-worker-group',
  },

  sendgrid: {
    apiKey: requireEnv('SENDGRID_API_KEY'),
    from: requireEnv('EMAIL_FROM'),
  },

  app: {
    frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, ''),
    maxRetries: parseInt(process.env.MAX_EMAIL_RETRIES || '10', 10),
  },
} as const;
