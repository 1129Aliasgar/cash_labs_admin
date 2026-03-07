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
    requestBody: {
      type: Schema.Types.Mixed,
      required: true,
      default: () => ({}),
    },
    gatewayResponse: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
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

export default transactionSchema;
