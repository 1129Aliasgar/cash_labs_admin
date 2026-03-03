import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IClient } from '../types/Client.types';

const MODEL_NAME = 'client';

@injectable()
export class ClientRepository extends BaseRepository<IClient> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async findByClientId(clientId: string, includeSecret = false): Promise<IClient | null> {
    const q = this.getModel(MODEL_NAME).findOne({ clientId } as Record<string, unknown>);
    if (includeSecret) {
      q.select('+clientSecret');
    }
    return q.lean().exec() as Promise<IClient | null>;
  }
}
