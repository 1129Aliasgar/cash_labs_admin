import { Kafka, Producer } from 'kafkajs';
import { injectable } from 'inversify';
import { createKafkaClient } from '../utils/kafkaConfig';

/** Event payload for report-service transaction-events consumer (tenantHost + TransactionEventPayload). */
export interface TransactionEventPayload {
  tenantHost: string;
  transactionId?: string;
  referenceId?: string;
  requestBody?: Record<string, unknown>;
  gatewayResponse?: Record<string, unknown> | null;
  status?: string;
  [key: string]: unknown;
}

@injectable()
export class TransactionEventProducerService {
  private kafka: Kafka;
  private producer: Producer;
  private connected = false;
  private readonly topic: string;

  constructor() {
    const clientId = process.env.KAFKA_TRANSACTION_CLIENT_ID || 'payment-engine';
    this.kafka = createKafkaClient(clientId);
    this.producer = this.kafka.producer();
    this.topic = process.env.TRANSACTION_EVENTS_TOPIC || 'transaction-events';
  }

  private async ensureConnected(): Promise<void> {
    if (this.connected) return;
    await this.producer.connect();
    this.connected = true;
  }

  /**
   * Send a transaction event to the topic for report-service to consume.
   * No-ops if ENABLE_TRANSACTION_EVENTS is not 'true'. Swallows errors so the API request is not failed.
   */
  async sendTransactionEvent(payload: TransactionEventPayload): Promise<void> {
    try {
      await this.ensureConnected();
      const value = JSON.stringify(payload);
      await this.producer.send({
        topic: this.topic,
        messages: [{ value }],
      });
    } catch (err) {
      console.error('[TransactionEventProducer] Send failed:', err);
    }
  }
}
