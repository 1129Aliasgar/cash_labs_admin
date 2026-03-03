import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { TYPES } from '../config/inversifyTypes';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IClientGatewayDoc } from '../types/ClientGateway.types';

const MODEL_NAME = 'clientGateway';

export interface ClientGatewayListFilters {
  clientId?: string;
  gatewayId?: string;
}

@injectable()
export class ClientGatewayRepository extends BaseRepository<IClientGatewayDoc> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async createClientGateway(data: {
    clientId: mongoose.Types.ObjectId;
    gatewayId: mongoose.Types.ObjectId;
    credentials?: Record<string, unknown>;
  }): Promise<IClientGatewayDoc> {
    return super.create(data as Partial<IClientGatewayDoc>, MODEL_NAME) as Promise<IClientGatewayDoc>;
  }

  async findById(id: string): Promise<IClientGatewayDoc | null> {
    return super.findById(id, MODEL_NAME);
  }

  async findByClientAndGateway(
    clientId: string,
    gatewayId: string
  ): Promise<IClientGatewayDoc | null> {
    const cid = new mongoose.Types.ObjectId(clientId);
    const gid = new mongoose.Types.ObjectId(gatewayId);
    return super.findOne(
      { clientId: cid, gatewayId: gid } as Record<string, unknown>,
      MODEL_NAME
    );
  }

  async updateById(
    id: string,
    data: Partial<Pick<IClientGatewayDoc, 'credentials'>>
  ): Promise<IClientGatewayDoc | null> {
    return super.findByIdAndUpdate(id, data, MODEL_NAME);
  }

  async findWithFilters(
    skip: number,
    limit: number,
    filters: ClientGatewayListFilters
  ): Promise<{ items: IClientGatewayDoc[]; total: number }> {
    const model = this.getModel(MODEL_NAME);
    const query: Record<string, unknown> = {};
    if (filters.clientId?.trim()) {
      query.clientId = new mongoose.Types.ObjectId(filters.clientId.trim());
    }
    if (filters.gatewayId?.trim()) {
      query.gatewayId = new mongoose.Types.ObjectId(filters.gatewayId.trim());
    }
    const [items, total] = await Promise.all([
      model
        .find(query)
        .populate('clientId', 'name clientId')
        .populate('gatewayId', 'name type')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      model.countDocuments(query).exec(),
    ]);
    return { items: items as unknown as IClientGatewayDoc[], total };
  }
}
