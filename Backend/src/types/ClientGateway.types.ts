import { Document, Types } from 'mongoose';

export interface IClientGatewayDoc extends Document {
  clientId: Types.ObjectId;
  gatewayId: Types.ObjectId;
  credentials?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
