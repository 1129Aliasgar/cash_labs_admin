import { injectable, inject } from 'inversify';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { GatewayRepository } from '../repositories/GatewayRepository';
import { IGateway, GatewayCapability } from '../types/Gateway.types';
import { GATEWAY_TYPE, CARD_TYPE } from '../constants/gateway.constants';

export interface CreateGatewayInput {
  logo?: string;
  name: string;
  type: string;
  refund?: GatewayCapability;
  payment?: GatewayCapability;
  apm?: GatewayCapability;
  authorization?: GatewayCapability;
  subscription?: GatewayCapability;
  token?: GatewayCapability;
  payout?: GatewayCapability;
  payin?: GatewayCapability;
  cardTypes?: string[];
  endpoint?: string;
  apiKey?: string;
  apiSecret?: string;
}

export type UpdateGatewayInput = Partial<CreateGatewayInput>;

export interface ListGatewaysFilters {
  page?: number;
  limit?: number;
  type?: string;
  name?: string;
}

export interface ListGatewaysResult {
  data: IGateway[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

@injectable()
export class GatewayService extends BaseService {
  constructor(
    @inject(TYPES.GatewayRepository) private gatewayRepo: GatewayRepository
  ) {
    super();
  }

  async createGateway(data: CreateGatewayInput): Promise<IGateway> {
    this.validateBusinessRule(!!data.name?.trim(), 'name is required', 400);
    this.validateBusinessRule(
      Boolean(data.type && Object.values(GATEWAY_TYPE).includes(data.type as never)),
      `type must be one of: ${Object.values(GATEWAY_TYPE).join(', ')}`,
      400
    );
    const payload = this.toGatewayPayload(data);
    return this.gatewayRepo.createGateway(payload);
  }

  async updateGateway(id: string, data: UpdateGatewayInput): Promise<IGateway> {
    const existing = await this.gatewayRepo.findById(id);
    this.validateValue(existing, 'Gateway', 404);
    if (data.type != null) {
      this.validateBusinessRule(
        Object.values(GATEWAY_TYPE).includes(data.type as never),
        `type must be one of: ${Object.values(GATEWAY_TYPE).join(', ')}`,
        400
      );
    }
    const payload = this.toGatewayPayload(data as CreateGatewayInput, true);
    const updated = await this.gatewayRepo.updateById(id, payload);
    if (!updated) throw this.createError('Gateway not found.', 404);
    return updated;
  }

  async listGateways(filters: ListGatewaysFilters = {}): Promise<ListGatewaysResult> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const skip = (page - 1) * limit;
    const { items, total } = await this.gatewayRepo.findWithFilters(skip, limit, {
      type: filters.type,
      name: filters.name,
    });
    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  private defaultCapability(): GatewayCapability {
    return { enabled: false, configured: false };
  }

  private toGatewayPayload(data: Partial<CreateGatewayInput>, isUpdate = false): Partial<IGateway> {
    const cap = (c?: GatewayCapability) => c ?? this.defaultCapability();
    const payload: Partial<IGateway> = {};
    if (data.logo !== undefined) payload.logo = data.logo;
    if (data.name !== undefined) payload.name = data.name;
    if (data.type !== undefined) payload.type = data.type as IGateway['type'];
    if (data.refund !== undefined) payload.refund = cap(data.refund);
    if (data.payment !== undefined) payload.payment = cap(data.payment);
    if (data.apm !== undefined) payload.apm = cap(data.apm);
    if (data.authorization !== undefined) payload.authorization = cap(data.authorization);
    if (data.subscription !== undefined) payload.subscription = cap(data.subscription);
    if (data.token !== undefined) payload.token = cap(data.token);
    if (data.payout !== undefined) payload.payout = cap(data.payout);
    if (data.payin !== undefined) payload.payin = cap(data.payin);
    if (data.cardTypes !== undefined) {
      const valid = data.cardTypes.filter((c) => Object.values(CARD_TYPE).includes(c as never));
      payload.cardTypes = valid as IGateway['cardTypes'];
    }
    if (data.endpoint !== undefined) payload.endpoint = data.endpoint;
    if (data.apiKey !== undefined) payload.apiKey = data.apiKey;
    if (data.apiSecret !== undefined) payload.apiSecret = data.apiSecret;
    if (!isUpdate) {
      payload.refund = payload.refund ?? this.defaultCapability();
      payload.payment = payload.payment ?? this.defaultCapability();
      payload.apm = payload.apm ?? this.defaultCapability();
      payload.authorization = payload.authorization ?? this.defaultCapability();
      payload.subscription = payload.subscription ?? this.defaultCapability();
      payload.token = payload.token ?? this.defaultCapability();
      payload.payout = payload.payout ?? this.defaultCapability();
      payload.payin = payload.payin ?? this.defaultCapability();
    }
    return payload;
  }
}
