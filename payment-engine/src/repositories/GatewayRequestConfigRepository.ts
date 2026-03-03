import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { TYPES } from '../types';
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

  async findByGatewayIdAndType(
    gatewayId: string,
    type: string
  ): Promise<IGatewayRequestConfigDoc | null> {
    const id = new mongoose.Types.ObjectId(gatewayId);
    const doc = await this.getModel(MODEL_NAME)
      .findOne({ gatewayId: id, type } as Record<string, unknown>)
      .lean()
      .exec();
    return doc as IGatewayRequestConfigDoc | null;
  }
}
