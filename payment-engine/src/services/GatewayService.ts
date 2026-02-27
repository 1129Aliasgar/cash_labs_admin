import { injectable, inject } from 'inversify';
import { BaseService } from './BaseService';
import { GatewayRepository, GatewayFilter, GatewayPaginationOptions } from '../repositories/GatewayRepository';
import { TYPES } from '../types';
import { GetGatewaysQuery } from '../validators/gateway.validator';

@injectable()
export class GatewayService extends BaseService {
  constructor(
    @inject(TYPES.GatewayRepository) private readonly gatewayRepository: GatewayRepository
  ) {
    super();
  }

  async getGateways(query: GetGatewaysQuery) {
    const filter: GatewayFilter = {
      type: query.type,
      name: query.name,
      refund: query.refund,
      payment: query.payment,
      apm: query.apm,
      authorization: query.authorization,
      subscription: query.subscription,
      token: query.token,
      payout: query.payout,
      payin: query.payin,
    };
    const options: GatewayPaginationOptions = {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    };
    return this.gatewayRepository.findGatewaysWithPagination(filter, options);
  }
}
