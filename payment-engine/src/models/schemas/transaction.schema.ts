import { Schema } from 'mongoose';
import { ITransactionDoc } from '../../types/Transaction.types';

const TRANSACTION_STATUSES = ['pending', 'success', 'failed'] as const;

const transactionSchema = new Schema<ITransactionDoc>(
  {
    transactionId: {
      type: String,
      required: false,
      index: true,
    },
    descriptor: {
      type: String,
      required: false,
      index: true,
    },
    gatewayLogs: {
      type: [
        {
          requestBody: Schema.Types.Mixed,
          gatewayResponse: Schema.Types.Mixed,
        },
      ],
      default: () => [],
    },
    currency: { type: String, required: false },
    amount: { type: Number, required: false },
    redirectUrl: { type: String, required: false },
    returnUrl: { type: String, required: false },
    callbackUrl: { type: String, required: false },
    transactionDetails: {
      type: Schema.Types.Mixed,
      required: false,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUSES,
      required: true,
      index: true,
      default: 'pending',
    },
  },
  { timestamps: true, versionKey: false }
);

transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1, createdAt: -1 });
transactionSchema.index({ descriptor: 1, createdAt: -1 });

export default transactionSchema;
