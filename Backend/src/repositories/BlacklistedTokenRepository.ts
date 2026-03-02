import { injectable, inject } from 'inversify';
import { TYPES } from '../config/inversifyTypes';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IBlacklistedToken } from '../models/schemas/blacklistedToken.schema';

const MODEL_NAME = 'blacklistedToken';

@injectable()
export class BlacklistedTokenRepository extends BaseRepository<IBlacklistedToken> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  async existsByTokenHash(tokenHash: string): Promise<boolean> {
    const doc = await this.findOne({ tokenHash }, MODEL_NAME);
    return !!doc;
  }

  async createToken(data: { tokenHash: string; expiresAt: Date }) {
    return super.create(data as Partial<IBlacklistedToken>, MODEL_NAME);
  }
}
