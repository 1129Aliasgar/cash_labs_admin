import { injectable, inject } from 'inversify';
import { TYPES } from '../config/inversifyTypes';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IClient } from '../types/Client.types';

const MODEL_NAME = 'client';

export interface ClientListFilters {
  name?: string;
  clientId?: string;
}

@injectable()
export class ClientRepository extends BaseRepository<IClient> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async createClient(data: Partial<IClient>): Promise<IClient> {
    return super.create(data, MODEL_NAME) as Promise<IClient>;
  }

  async findById(id: string): Promise<IClient | null> {
    return super.findById(id, MODEL_NAME);
  }

  async findByClientId(clientId: string): Promise<IClient | null> {
    return super.findOne({ clientId } as Record<string, unknown>, MODEL_NAME);
  }

  async updateById(id: string, data: Partial<IClient>): Promise<IClient | null> {
    return super.findByIdAndUpdate(id, data, MODEL_NAME);
  }

  async findWithFilters(
    skip: number,
    limit: number,
    filters: ClientListFilters
  ): Promise<{ items: IClient[]; total: number }> {
    const model = this.getModel(MODEL_NAME);
    const query: Record<string, unknown> = {};
    if (filters.name?.trim()) {
      query.name = new RegExp(filters.name.trim(), 'i');
    }
    if (filters.clientId?.trim()) {
      query.clientId = new RegExp(filters.clientId.trim(), 'i');
    }
    const [items, total] = await Promise.all([
      model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      model.countDocuments(query).exec(),
    ]);
    return { items: items as unknown as IClient[], total };
  }
}
