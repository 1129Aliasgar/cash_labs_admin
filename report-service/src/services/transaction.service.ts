import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { TYPES } from '../types';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { ITransactionDoc, TransactionStatus } from '../types/Transaction.types';

export interface TransactionEventPayload {
  transactionId?: string;
  requestBody?: Record<string, unknown>;
  gatewayResponse?: Record<string, unknown> | null;
  status?: TransactionStatus;
  [key: string]: unknown;
}

@injectable()
export class TransactionService {
  constructor(
    @inject(TYPES.TenantContextProvider)
    private readonly tenantContextProvider: TenantContextProvider
  ) {}

  private getTransactionModel(): Model<ITransactionDoc> {
    const models = this.tenantContextProvider.models as Record<string, unknown> | undefined;
    const Transaction = models?.transaction as Model<ITransactionDoc> | undefined;
    if (!Transaction) {
      throw new Error('Transaction model not registered on tenant connection');
    }
    return Transaction;
  }

  /**
   * Store a transaction event.
   * - If `transactionId` is present: upsert by transactionId.
   * - Otherwise: create a new transaction document.
   */
  async upsertFromEvent(event: TransactionEventPayload): Promise<ITransactionDoc> {
    const Transaction = this.getTransactionModel();

    const transactionId = typeof event.transactionId === 'string' ? event.transactionId : undefined;
    const status: TransactionStatus =
      event.status === 'pending' || event.status === 'success' || event.status === 'failed'
        ? event.status
        : 'pending';

    const requestBody =
      event.requestBody && typeof event.requestBody === 'object' ? event.requestBody : (event as Record<string, unknown>);

    const gatewayResponse =
      event.gatewayResponse && typeof event.gatewayResponse === 'object' ? event.gatewayResponse : null;

    if (transactionId) {
      const doc = await Transaction.findOneAndUpdate(
        { transactionId },
        {
          $set: {
            transactionId,
            requestBody,
            gatewayResponse,
            status,
          },
        },
        { upsert: true, new: true }
      );
      return doc;
    }

    return await Transaction.create({
      requestBody,
      gatewayResponse,
      status,
    });
  }
}

