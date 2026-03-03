import { Document } from 'mongoose';
import { GatewayType, CardType } from '../constants/gateway.constants';

export interface GatewayCapability {
  enabled: boolean;
  configured: boolean;
}

export interface IGateway extends Document {
  logo?: string;
  name: string;
  type: GatewayType;
  refund: GatewayCapability;
  payment: GatewayCapability;
  apm: GatewayCapability;
  authorization: GatewayCapability;
  subscription: GatewayCapability;
  token: GatewayCapability;
  payout: GatewayCapability;
  payin: GatewayCapability;
  cardTypes?: CardType[];
  endpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
