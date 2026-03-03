import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { TYPES } from '../config/inversifyTypes';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IGatewayRequestConfigDoc } from '../types/GatewayRequestConfig.types';

const MODEL_NAME = 'gatewayRequestConfig';

@injectable()
export class GatewayRequestConfigRepository extends BaseRepository<IGatewayRequestConfigDoc> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async createConfig(data: {
    gatewayId: mongoose.Types.ObjectId;
    type: string;
    headers?: { static?: Record<string, string>; mapped?: Record<string, string> };
    bodyMapping?: Record<string, string>;
    endpoint?: string;
  }): Promise<IGatewayRequestConfigDoc> {
    return super.create(data as Partial<IGatewayRequestConfigDoc>, MODEL_NAME) as Promise<IGatewayRequestConfigDoc>;
  }

  async findByGatewayId(gatewayId: string): Promise<IGatewayRequestConfigDoc[]> {
    const id = new mongoose.Types.ObjectId(gatewayId);
    const docs = await this.getModel(MODEL_NAME)
      .find({ gatewayId: id })
      .sort({ type: 1 })
      .lean()
      .exec();
    return docs as unknown as IGatewayRequestConfigDoc[];
  }

  async findByGatewayIdAndType(
    gatewayId: string,
    type: string
  ): Promise<IGatewayRequestConfigDoc | null> {
    const id = new mongoose.Types.ObjectId(gatewayId);
    const doc = await this.getModel(MODEL_NAME)
      .findOne({ gatewayId: id, type })
      .lean()
      .exec();
    return doc as IGatewayRequestConfigDoc | null;
  }

  async updateByGatewayIdAndType(
    gatewayId: string,
    type: string,
    data: Partial<Pick<IGatewayRequestConfigDoc, 'headers' | 'bodyMapping' | 'endpoint'>>
  ): Promise<IGatewayRequestConfigDoc | null> {
    const id = new mongoose.Types.ObjectId(gatewayId);
    const updated = await this.getModel(MODEL_NAME)
      .findOneAndUpdate({ gatewayId: id, type }, { $set: data }, { new: true })
      .lean()
      .exec();
    return updated as IGatewayRequestConfigDoc | null;
  }
}
