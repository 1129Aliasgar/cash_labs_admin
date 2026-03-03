import { Schema } from 'mongoose';
import { IGatewayRequestConfigDoc } from '../../types/GatewayRequestConfig.types';
import { REQUEST_CONFIG_TYPE } from '../../constants/gateway.constants';

const gatewayRequestConfigSchema = new Schema<IGatewayRequestConfigDoc>(
  {
    gatewayId: {
      type: Schema.Types.ObjectId,
      ref: 'Gateway',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(REQUEST_CONFIG_TYPE),
      required: true,
      index: true,
    },
    headers: {
      static: { type: Schema.Types.Mixed, default: () => ({}) },
      mapped: { type: Schema.Types.Mixed, default: () => ({}) },
    },
    bodyMapping: { type: Schema.Types.Mixed, default: () => ({}) },
    endpoint: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

gatewayRequestConfigSchema.index({ gatewayId: 1, type: 1 }, { unique: true });

export default gatewayRequestConfigSchema;
