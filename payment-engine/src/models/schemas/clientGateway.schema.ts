import { Schema } from 'mongoose';
import { IClientGatewayDoc } from '../../types/ClientGateway.types';

const clientGatewaySchema = new Schema<IClientGatewayDoc>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    gatewayId: {
      type: Schema.Types.ObjectId,
      ref: 'Gateway',
      required: true,
      index: true,
    },
    credentials: { type: Schema.Types.Mixed, default: () => ({}) },
  },
  { timestamps: true, versionKey: false }
);

clientGatewaySchema.index({ clientId: 1, gatewayId: 1 }, { unique: true });

export default clientGatewaySchema;
