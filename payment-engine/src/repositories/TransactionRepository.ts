import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { ITransactionDoc, TransactionStatus } from '../types/Transaction.types';

const MODEL_NAME = 'transaction';

function normalizeStatus(input: unknown): TransactionStatus {
  if (typeof input !== 'string') return 'pending';
  const v = input.trim().toLowerCase();
  if (v === 'success' || v === 'failed' || v === 'pending') return v;
  return 'pending';
}

@injectable()
export class TransactionRepository extends BaseRepository<ITransactionDoc> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async upsertByTransactionId(data: Partial<ITransactionDoc>): Promise<ITransactionDoc> {
    const transactionId = data.transactionId?.trim();
    const status = normalizeStatus(data.status);

    // If transactionId is absent, fall back to a plain create.
    if (!transactionId) {
      return this.getModel(MODEL_NAME).create({
        ...data,
        status,
      }) as Promise<ITransactionDoc>;
    }

    return this.getModel(MODEL_NAME)
      .findOneAndUpdate(
        { transactionId } as Record<string, unknown>,
        {
          $set: {
            ...data,
            transactionId,
            status,
          },
        } as Record<string, unknown>,
        { new: true, upsert: true }
      )
      .exec() as Promise<ITransactionDoc>;
  }
}

