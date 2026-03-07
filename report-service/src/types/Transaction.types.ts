export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface ITransaction {
  transactionId?: string;
  requestBody: Record<string, unknown>;
  gatewayResponse: Record<string, unknown> | null;
  status: TransactionStatus;
}

/** Document shape when used with Mongoose (adds _id, timestamps). */
export interface ITransactionDoc extends ITransaction {
  _id: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}
