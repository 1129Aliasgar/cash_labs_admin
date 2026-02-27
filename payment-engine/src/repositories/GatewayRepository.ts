import { injectable, inject } from 'inversify';
import { IGateway } from '../types/Gateway.types';
import { BaseRepository } from './BaseRepository';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { TYPES } from '../types';

const GATEWAY_MODEL_NAME = 'gateway';

export interface GatewayFilter {
  type?: string;
  name?: string;
  refund?: boolean;
  payment?: boolean;
  apm?: boolean;
  authorization?: boolean;
  subscription?: boolean;
  token?: boolean;
  payout?: boolean;
  payin?: boolean;
}

export interface GatewayPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@injectable()
export class GatewayRepository extends BaseRepository<IGateway> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async findGatewaysWithPagination(
    filter: GatewayFilter,
    options: GatewayPaginationOptions
  ): Promise<{ data: IGateway[]; total: number; page: number; limit: number; totalPages: number }> {
    const query: Record<string, unknown> = {};
    if (filter.type) query.type = filter.type;
    if (filter.name) query.name = new RegExp(filter.name, 'i');
    if (filter.refund !== undefined) query.refund = filter.refund;
    if (filter.payment !== undefined) query.payment = filter.payment;
    if (filter.apm !== undefined) query.apm = filter.apm;
    if (filter.authorization !== undefined) query.authorization = filter.authorization;
    if (filter.subscription !== undefined) query.subscription = filter.subscription;
    if (filter.token !== undefined) query.token = filter.token;
    if (filter.payout !== undefined) query.payout = filter.payout;
    if (filter.payin !== undefined) query.payin = filter.payin;

    const sortKey = options.sortBy ?? 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortKey]: sortOrder };

    return super.findWithPagination(
      query,
      GATEWAY_MODEL_NAME,
      options.page,
      options.limit,
      sort
    );
  }
}
