import { injectable, inject } from 'inversify';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { ClientRepository } from '../repositories/ClientRepository';
import { IClient } from '../types/Client.types';

export interface CreateClientInput {
  name: string;
  clientId: string;
  clientSecret: string;
}

export type UpdateClientInput = Partial<Pick<IClient, 'name' | 'clientSecret'>>;

export interface ListClientsFilters {
  page?: number;
  limit?: number;
  name?: string;
  clientId?: string;
}

export interface ListClientsResult {
  data: IClient[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

@injectable()
export class ClientService extends BaseService {
  constructor(
    @inject(TYPES.ClientRepository) private clientRepo: ClientRepository
  ) {
    super();
  }

  async createClient(data: CreateClientInput): Promise<IClient> {
    this.validateBusinessRule(!!data.name?.trim(), 'name is required', 400);
    this.validateBusinessRule(!!data.clientId?.trim(), 'clientId is required', 400);
    this.validateBusinessRule(!!data.clientSecret?.trim(), 'clientSecret is required', 400);
    const existing = await this.clientRepo.findByClientId(data.clientId.trim());
    this.validateBusinessRule(!existing, 'clientId already in use', 409);
    return this.clientRepo.createClient({
      name: data.name.trim(),
      clientId: data.clientId.trim(),
      clientSecret: data.clientSecret,
    });
  }

  async updateClient(id: string, data: UpdateClientInput): Promise<IClient> {
    const existing = await this.clientRepo.findById(id);
    this.validateValue(existing, 'Client', 404);
    const payload: Partial<IClient> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.clientSecret !== undefined) payload.clientSecret = data.clientSecret;
    const updated = await this.clientRepo.updateById(id, payload);
    if (!updated) throw this.createError('Client not found.', 404);
    return updated;
  }

  async listClients(filters: ListClientsFilters = {}): Promise<ListClientsResult> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const skip = (page - 1) * limit;
    const { items, total } = await this.clientRepo.findWithFilters(skip, limit, {
      name: filters.name,
      clientId: filters.clientId,
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

  async getClientById(id: string): Promise<IClient | null> {
    return this.clientRepo.findById(id);
  }
}
