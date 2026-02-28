import Joi from 'joi';
import { GATEWAY_TYPE } from '../constants/gateway.constants';

const gatewayTypeValues = Object.values(GATEWAY_TYPE);

export const getGatewaysQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  type: Joi.string().valid(...gatewayTypeValues).optional(),
  name: Joi.string().trim().optional(),
  refund: Joi.boolean().optional(),
  payment: Joi.boolean().optional(),
  apm: Joi.boolean().optional(),
  authorization: Joi.boolean().optional(),
  subscription: Joi.boolean().optional(),
  token: Joi.boolean().optional(),
  payout: Joi.boolean().optional(),
  payin: Joi.boolean().optional(),
  sortBy: Joi.string().valid('name', 'type', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export interface GetGatewaysQuery {
  page: number;
  limit: number;
  type?: string;
  name?: string;
  refund?: boolean;
  payment?: boolean;
  apm?: boolean;
  authorization?: boolean;
  subscription?: boolean;
  token?: boolean;
  payout?: boolean;
  payin?: boolean;
  sortBy: string;
  sortOrder: string;
}
