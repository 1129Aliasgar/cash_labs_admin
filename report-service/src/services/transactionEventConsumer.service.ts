import { Consumer, Kafka } from 'kafkajs';
import { injectable, inject } from 'inversify';
import pLimit from 'p-limit';
import { TYPES } from '../types';
import { Logger } from '../utils/logger';
import { TenantContextProvider, TenantContext } from '../utils/tenantContext.provider';
import { createKafkaClient } from '../utils/kafkaConfig';
import { getDbConnection } from '../database/connectionManager';
import { registerModelsOnConnection } from '../models';
import { TransactionService, TransactionEventPayload } from './transaction.service';
import { tenantDbMapper } from '../config/tenantDbMapper';

// Per-tenant concurrency limiter
const tenantLimits = new Map<string, ReturnType<typeof pLimit>>();
function getTenantLimiter(tenantHost: string) {
  if (!tenantLimits.has(tenantHost)) {
    tenantLimits.set(tenantHost, pLimit(1));
  }
  return tenantLimits.get(tenantHost)!;
}

function resolveTenantHost(event: Record<string, unknown>): string | undefined {
  const raw =
    (event.tenantHost as string | undefined) ||
    (event.tenant as string | undefined) ||
    (event.host as string | undefined);
  if (!raw) return undefined;
  return raw.split(':')[0].split('.')[0];
}

@injectable()
export class TransactionEventConsumerService {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    @inject(TYPES.TransactionService) private readonly transactionService: TransactionService,
    @inject(TYPES.TenantContextProvider) private readonly tenantContextProvider: TenantContextProvider
  ) {
    const clientId = process.env.KAFKA_TRANSACTION_CLIENT_ID || 'report-service';
    this.kafka = createKafkaClient(clientId);
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_TRANSACTION_GROUP_ID || 'report-service-transaction-group',
      sessionTimeout: 60000,
      heartbeatInterval: 10000,
      maxWaitTimeInMs: 5000,
      rebalanceTimeout: 120000,
    });
  }

  public async start(): Promise<void> {
    await this.consumer.connect();
    Logger.info('[TransactionConsumer] Connected to Kafka');

    await this.consumer.subscribe({
      topic: process.env.TRANSACTION_EVENTS_TOPIC || 'transaction-events',
      fromBeginning: false,
    });
    Logger.info('[TransactionConsumer] Subscribed to topic');

    await this.consumer.run({
      eachMessage: async ({ message }: { topic: string; partition: number; message: { value: Buffer | null } }) => {
        if (!message.value) return;

        const raw = message.value.toString();
        Logger.info(`[TransactionConsumer] Received message: ${raw}`);

        let event: Record<string, unknown>;
        try {
          event = JSON.parse(raw);
        } catch (err) {
          Logger.error(`[TransactionConsumer] Invalid JSON payload: ${String(err)}`, { raw });
          return;
        }

        try {
          const tenantHost = resolveTenantHost(event);
          if (!tenantHost) throw new Error('Tenant host not found in event');

          const limiter = getTenantLimiter(tenantHost);

          await limiter(async () => {
            await this.runWithTenantContext(tenantHost, async () => {
              const saved = await this.transactionService.upsertFromEvent(event as TransactionEventPayload);
              Logger.info(`[TransactionConsumer] Stored transaction: ${saved._id != null ? String(saved._id) : 'n/a'}`, {
                tenantHost,
                status: saved.status,
                transactionId: saved.transactionId,
              });
            });
          });
        } catch (err) {
          Logger.error(`[TransactionConsumer] Error processing event: ${String(err)}`, event);
          // Throw so offset is NOT committed and Kafka can retry.
          throw err;
        }
      },
    });
  }

  private async runWithTenantContext(tenantHost: string, handler: () => Promise<void>) {
    const dbName = tenantDbMapper[tenantHost];
    if (!dbName) throw new Error(`Tenant not found for host: ${tenantHost}`);

    const conn = await getDbConnection(dbName);
    const models = await registerModelsOnConnection(conn);

    const tenantContext: TenantContext = {
      tenantId: dbName,
      models,
      connectionName: dbName,
      host: tenantHost,
    };

    await this.tenantContextProvider.run(tenantContext, handler);
  }
}

