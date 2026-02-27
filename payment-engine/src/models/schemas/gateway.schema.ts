import { Schema, model } from 'mongoose';
import { IGateway } from '../../types/Gateway.types';
import { GATEWAY_TYPE, CARD_TYPE } from '../../constants/gateway.constants';

/**
 * Gateway Schema
 * @description Schema for the Gateway (PaymentGateway) model
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 * @since 1.0.0
 */
const gatewaySchema = new Schema<IGateway>({
    logo: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(GATEWAY_TYPE),
        required: true
    },
    refund: {
        type: Boolean,
        required: true,
        default: false
    },
    payment: {
        type: Boolean,
        required: true,
        default: false
    },
    apm: {
        type: Boolean,
        required: true,
        default: false
    },
    authorization: {
        type: Boolean,
        required: true,
        default: false
    },
    subscription: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: Boolean,
        required: true,
        default: false
    },
    payout: {
        type: Boolean,
        required: true,
        default: false
    },
    payin: {
        type: Boolean,
        required: true,
        default: false
    },
    cardTypes: {
        type: [String],
        enum: Object.values(CARD_TYPE),
        required: false
    },
    endpoint: {
        type: String,
        required: false
    },
    apiKey: {
        type: String,
        required: false
    },
    apiSecret: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

gatewaySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Indexes for efficient queries
gatewaySchema.index({ name: 1 });
gatewaySchema.index({ type: 1 });
gatewaySchema.index({ createdAt: -1 });

export const Gateway = model<IGateway>('Gateway', gatewaySchema);
export default gatewaySchema;
