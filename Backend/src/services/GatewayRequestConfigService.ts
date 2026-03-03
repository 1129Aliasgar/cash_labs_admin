import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { GatewayRepository } from '../repositories/GatewayRepository';
import { GatewayRequestConfigRepository } from '../repositories/GatewayRequestConfigRepository';
import { IGatewayRequestConfigDoc } from '../types/GatewayRequestConfig.types';
import {
  GatewayRequestConfigHeaders,
  GatewayRequestConfigBodyMapping,
} from '../types/GatewayRequestConfig.types';
import { REQUEST_CONFIG_TYPE } from '../constants/gateway.constants';
import { IGateway } from '../types/Gateway.types';

export interface CreateConfigInput {
  type: string;
  headers?: GatewayRequestConfigHeaders;
  bodyMapping?: GatewayRequestConfigBodyMapping;
}

export type UpdateConfigInput = Partial<Pick<CreateConfigInput, 'headers' | 'bodyMapping'>>;

@injectable()
export class GatewayRequestConfigService extends BaseService {
  constructor(
    @inject(TYPES.GatewayRepository) private gatewayRepo: GatewayRepository,
    @inject(TYPES.GatewayRequestConfigRepository) private configRepo: GatewayRequestConfigRepository
  ) {
    super();
  }

  private validateConfigType(type: string): void {
    const valid = Object.values(REQUEST_CONFIG_TYPE);
    this.validateBusinessRule(
      valid.includes(type as (typeof valid)[number]),
      `type must be one of: ${valid.join(', ')}`,
      400
    );
  }

  /** Set gateway capability for this type to configured: true */
  private async setGatewayCapabilityConfigured(gatewayId: string, type: string): Promise<void> {
    const gateway = await this.gatewayRepo.findById(gatewayId);
    if (!gateway) return;
    const cap = (gateway as IGateway)[type as keyof IGateway];
    if (!cap || typeof cap !== 'object' || !('enabled' in cap)) return;
    const enabled = Boolean((cap as { enabled?: boolean }).enabled);
    await this.gatewayRepo.updateById(gatewayId, {
      [type]: { enabled, configured: true },
    } as Partial<IGateway>);
  }

  async createConfig(
    gatewayId: string,
    data: CreateConfigInput
  ): Promise<IGatewayRequestConfigDoc> {
    this.validateValue(gatewayId, 'gatewayId', 400);
    this.validateConfigType(data.type);
    const gateway = await this.gatewayRepo.findById(gatewayId);
    this.validateValue(gateway, 'Gateway', 404);
    const existing = await this.configRepo.findByGatewayIdAndType(gatewayId, data.type);
    if (existing) {
      throw this.createError(`Config for type "${data.type}" already exists for this gateway. Use PATCH to update.`, 409);
    }
    const objId = new mongoose.Types.ObjectId(gatewayId);
    const config = await this.configRepo.createConfig({
      gatewayId: objId,
      type: data.type,
      headers: data.headers,
      bodyMapping: data.bodyMapping,
    });
    await this.setGatewayCapabilityConfigured(gatewayId, data.type);
    return config;
  }

  async updateConfig(
    gatewayId: string,
    type: string,
    data: UpdateConfigInput
  ): Promise<IGatewayRequestConfigDoc> {
    this.validateValue(gatewayId, 'gatewayId', 400);
    this.validateConfigType(type);
    const gateway = await this.gatewayRepo.findById(gatewayId);
    this.validateValue(gateway, 'Gateway', 404);
    const updated = await this.configRepo.updateByGatewayIdAndType(gatewayId, type, {
      headers: data.headers,
      bodyMapping: data.bodyMapping,
    });
    if (!updated) throw this.createError('Config not found for this gateway and type.', 404);
    await this.setGatewayCapabilityConfigured(gatewayId, type);
    return updated;
  }

  async getByGatewayIdAndType(
    gatewayId: string,
    type: string
  ): Promise<IGatewayRequestConfigDoc | null> {
    this.validateConfigType(type);
    const gateway = await this.gatewayRepo.findById(gatewayId);
    this.validateValue(gateway, 'Gateway', 404);
    return this.configRepo.findByGatewayIdAndType(gatewayId, type);
  }

  async getConfigsByGatewayId(gatewayId: string): Promise<IGatewayRequestConfigDoc[]> {
    const gateway = await this.gatewayRepo.findById(gatewayId);
    this.validateValue(gateway, 'Gateway', 404);
    return this.configRepo.findByGatewayId(gatewayId);
  }
}
