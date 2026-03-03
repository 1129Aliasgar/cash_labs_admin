import { Document, Types } from 'mongoose';
import { RequestConfigType } from '../constants/gateway.constants';

export interface GatewayRequestConfigHeaders {
  static?: Record<string, string>;
  mapped?: Record<string, string>;
}

export interface GatewayRequestConfigBodyMapping {
  [outputKey: string]: string;
}

export interface IGatewayRequestConfigDoc extends Document {
  gatewayId: Types.ObjectId;
  type: RequestConfigType;
  headers: GatewayRequestConfigHeaders;
  bodyMapping: GatewayRequestConfigBodyMapping;
  createdAt?: Date;
  updatedAt?: Date;
}
