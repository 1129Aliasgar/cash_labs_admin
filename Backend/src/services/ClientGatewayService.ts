import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { BaseService } from './BaseService';
import { TYPES } from '../config/inversifyTypes';
import { ClientRepository } from '../repositories/ClientRepository';
import { GatewayRepository } from '../repositories/GatewayRepository';
import { ClientGatewayRepository } from '../repositories/ClientGatewayRepository';
import { IClientGatewayDoc } from '../types/ClientGateway.types';

export interface CreateClientGatewayInput {
  clientId: string;
  gatewayId: string;
  credentials?: Record<string, unknown>;
}

export type UpdateClientGatewayInput = Partial<Pick<IClientGatewayDoc, 'credentials'>>;

export interface ListClientGatewaysFilters {
  page?: number;
  limit?: number;
  clientId?: string;
  gatewayId?: string;
}

export interface ListClientGatewaysResult {
  data: IClientGatewayDoc[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

@injectable()
export class ClientGatewayService extends BaseService {
  constructor(
    @inject(TYPES.ClientRepository) private clientRepo: ClientRepository,
    @inject(TYPES.GatewayRepository) private gatewayRepo: GatewayRepository,
    @inject(TYPES.ClientGatewayRepository) private clientGatewayRepo: ClientGatewayRepository
  ) {
    super();
  }

  async createClientGateway(data: CreateClientGatewayInput): Promise<IClientGatewayDoc> {
    this.validateValue(data.clientId, 'clientId', 400);
    this.validateValue(data.gatewayId, 'gatewayId', 400);
    const client = await this.clientRepo.findById(data.clientId);
    this.validateValue(client, 'Client', 404);
    const gateway = await this.gatewayRepo.findById(data.gatewayId);
    this.validateValue(gateway, 'Gateway', 404);
    const existing = await this.clientGatewayRepo.findByClientAndGateway(
      data.clientId,
      data.gatewayId
    );
    this.validateBusinessRule(
      !existing,
      'A client-gateway link for this client and gateway already exists.',
      409
    );
    return this.clientGatewayRepo.createClientGateway({
      clientId: new mongoose.Types.ObjectId(data.clientId),
      gatewayId: new mongoose.Types.ObjectId(data.gatewayId),
      credentials: data.credentials ?? {},
    });
  }

  async updateClientGateway(
    id: string,
    data: UpdateClientGatewayInput
  ): Promise<IClientGatewayDoc> {
    const existing = await this.clientGatewayRepo.findById(id);
    this.validateValue(existing, 'Client gateway', 404);
    const payload: Partial<Pick<IClientGatewayDoc, 'credentials'>> = {};
    if (data.credentials !== undefined) payload.credentials = data.credentials;
    const updated = await this.clientGatewayRepo.updateById(id, payload);
    if (!updated) throw this.createError('Client gateway not found.', 404);
    return updated;
  }

  async listClientGateways(
    filters: ListClientGatewaysFilters = {}
  ): Promise<ListClientGatewaysResult> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const skip = (page - 1) * limit;
    const { items, total } = await this.clientGatewayRepo.findWithFilters(skip, limit, {
      clientId: filters.clientId,
      gatewayId: filters.gatewayId,
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

  async getClientGatewayById(id: string): Promise<IClientGatewayDoc | null> {
    return this.clientGatewayRepo.findById(id);
  }
}
