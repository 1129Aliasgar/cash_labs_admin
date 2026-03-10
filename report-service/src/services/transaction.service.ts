import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { TYPES } from '../types';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { ITransactionDoc, TransactionStatus } from '../types/Transaction.types';

export interface TransactionEventPayload {
  transactionId?: string;
  descriptor?: string;
  requestBody?: Record<string, unknown>;
  gatewayResponse?: Record<string, unknown> | null;
  gatewayLogs?: Array<{ requestBody?: Record<string, unknown>; gatewayResponse?: Record<string, unknown> | null }>;
  currency?: string;
  amount?: number;
  redirectUrl?: string;
  returnUrl?: string;
  callbackUrl?: string;
  transactionDetails?: Record<string, unknown>;
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
    const referenceId = typeof event.referenceId === 'string' ? event.referenceId : undefined;
    const status: TransactionStatus =
      event.status === 'pending' || event.status === 'success' || event.status === 'failed'
        ? event.status
        : 'pending';

    const transactionDetails =
      event.transactionDetails && typeof event.transactionDetails === 'object' ? event.transactionDetails : {};

    let gatewayLogs: Array<{ requestBody: Record<string, unknown>; gatewayResponse: Record<string, unknown> | null }> =
      [];
    if (Array.isArray(event.gatewayLogs) && event.gatewayLogs.length > 0) {
      gatewayLogs = event.gatewayLogs
        .filter((e) => e && (e.requestBody != null || e.gatewayResponse != null))
        .map((e) => ({
          requestBody: (e.requestBody && typeof e.requestBody === 'object' ? e.requestBody : {}) as Record<string, unknown>,
          gatewayResponse: (e.gatewayResponse && typeof e.gatewayResponse === 'object' ? e.gatewayResponse : null) as Record<string, unknown> | null,
        }));
    } else if (event.requestBody != null || event.gatewayResponse != null) {
      const rb = event.requestBody && typeof event.requestBody === 'object' ? event.requestBody : {};
      const gr = event.gatewayResponse && typeof event.gatewayResponse === 'object' ? event.gatewayResponse : null;
      gatewayLogs = [{ requestBody: rb as Record<string, unknown>, gatewayResponse: gr as Record<string, unknown> | null }];
    }

    const currency = typeof event.currency === 'string' ? event.currency : undefined;
    const amount = typeof event.amount === 'number' ? event.amount : undefined;
    const redirectUrl = typeof event.redirectUrl === 'string' ? event.redirectUrl : undefined;
    const returnUrl = typeof event.returnUrl === 'string' ? event.returnUrl : undefined;
    const callbackUrl = typeof event.callbackUrl === 'string' ? event.callbackUrl : undefined;

    if (transactionId) {
      const doc = await Transaction.findOneAndUpdate(
        { transactionId },
        {
          $set: {
            transactionId,
            descriptor,
            gatewayLogs,
            currency,
            amount,
            redirectUrl,
            returnUrl,
            callbackUrl,
            transactionDetails,
            status,
          },
        },
        { upsert: true, new: true }
      );
      return doc;
    }

    return await Transaction.create({
      descriptor,
      gatewayLogs,
      currency,
      amount,
      redirectUrl,
      returnUrl,
      callbackUrl,
      transactionDetails,
      status,
    });
  }
}

