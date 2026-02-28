import { Document } from 'mongoose';
import { GatewayType, CardType } from '../constants/gateway.constants';

/**
 * Gateway interface
 * @description Type for the Gateway (PaymentGateway) model
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 * @since 1.0.0
 */
export interface IGateway extends Document {
    logo?: string;
    name: string;
    type: GatewayType;
    refund: boolean;
    payment: boolean;
    apm: boolean;
    authorization: boolean;
    subscription: boolean;
    token: boolean;
    payout: boolean;
    payin: boolean;
    cardTypes?: CardType[];
    endpoint?: string;
    apiKey?: string;
    apiSecret?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
