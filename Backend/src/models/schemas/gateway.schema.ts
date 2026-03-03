import { Schema, model } from 'mongoose';
import { IGateway } from '../../types/Gateway.types';
import { GATEWAY_TYPE, CARD_TYPE } from '../../constants/gateway.constants';

const gatewaySchema = new Schema<IGateway>(
  {
    logo: { type: String, required: false },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(GATEWAY_TYPE),
      required: true,
    },
    refund: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    payment: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    apm: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    authorization: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    subscription: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    token: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    payout: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    payin: {
      type: { enabled: Boolean, configured: Boolean },
      required: true,
      default: () => ({ enabled: false, configured: false }),
    },
    cardTypes: {
      type: [String],
      enum: Object.values(CARD_TYPE),
      required: false,
    },
    endpoint: { type: String, required: false },
    apiKey: { type: String, required: false },
    apiSecret: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

gatewaySchema.index({ name: 1 });
gatewaySchema.index({ type: 1 });
gatewaySchema.index({ createdAt: -1 });

export const Gateway = model<IGateway>('Gateway', gatewaySchema);
export default gatewaySchema;
