import { injectable, inject } from 'inversify';
import { TYPES } from '../config/inversifyTypes';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IGateway } from '../types/Gateway.types';

const MODEL_NAME = 'gateway';

export interface GatewayListFilters {
  type?: string;
  name?: string;
}

@injectable()
export class GatewayRepository extends BaseRepository<IGateway> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async createGateway(data: Partial<IGateway>): Promise<IGateway> {
    return super.create(data, MODEL_NAME) as Promise<IGateway>;
  }

  async findById(id: string): Promise<IGateway | null> {
    return super.findById(id, MODEL_NAME);
  }

  async updateById(id: string, data: Partial<IGateway>): Promise<IGateway | null> {
    return super.findByIdAndUpdate(id, data, MODEL_NAME);
  }

  async findWithFilters(
    skip: number,
    limit: number,
    filters: GatewayListFilters
  ): Promise<{ items: IGateway[]; total: number }> {
    const model = this.getModel(MODEL_NAME);
    const query: Record<string, unknown> = {};
    if (filters.type) query.type = filters.type;
    if (filters.name && filters.name.trim()) {
      query.name = new RegExp(filters.name.trim(), 'i');
    }
    const [items, total] = await Promise.all([
      model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      model.countDocuments(query).exec(),
    ]);
    return { items: items as unknown as IGateway[], total };
  }
}
