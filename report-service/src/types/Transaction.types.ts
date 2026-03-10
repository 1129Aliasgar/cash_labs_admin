export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface IGatewayLog {
  requestBody: Record<string, unknown>;
  gatewayResponse: Record<string, unknown> | null;
}

export interface ITransaction {
  transactionId?: string;
  descriptor?: string;
  gatewayLogs: IGatewayLog[];
  currency?: string;
  amount?: number;
  redirectUrl?: string;
  returnUrl?: string;
  callbackUrl?: string;
  transactionDetails?: Record<string, unknown>;
  status: TransactionStatus;
}

/** Document shape when used with Mongoose (adds _id, timestamps). */
export interface ITransactionDoc extends ITransaction {
  _id: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}
