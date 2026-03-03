import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { TYPES } from '../types';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IClientGatewayDoc } from '../types/ClientGateway.types';
import { IGateway } from '../types/Gateway.types';

const MODEL_NAME = 'clientGateway';

@injectable()
export class ClientGatewayRepository extends BaseRepository<IClientGatewayDoc> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async findByClientId(clientId: string): Promise<Array<IClientGatewayDoc & { gatewayId: IGateway }>> {
    const id = new mongoose.Types.ObjectId(clientId);
    const docs = await this.getModel(MODEL_NAME)
      .find({ clientId: id } as Record<string, unknown>)
      .populate('gatewayId')
      .lean()
      .exec();
    return docs as unknown as Array<IClientGatewayDoc & { gatewayId: IGateway }>;
  }
}
