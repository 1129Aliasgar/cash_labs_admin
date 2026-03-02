import { injectable, inject } from 'inversify';
import { TYPES } from '../config/inversifyTypes';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { BaseRepository } from './BaseRepository';
import { IUser } from '../types/User.types';
import { UserRole, MerchantStatus } from '../constants/user.constants';

const MODEL_NAME = 'user';

@injectable()
export class UserRepository extends BaseRepository<IUser> {
  constructor(
    @inject(TYPES.TenantContextProvider) tenantContextProvider: TenantContextProvider
  ) {
    super(tenantContextProvider);
  }

  findByEmail(email: string) {
    return this.findOne({ email: email.toLowerCase() }, MODEL_NAME);
  }

  findById(id: string) {
    return super.findById(id, MODEL_NAME);
  }

  getUserModel() {
    return this.getModel(MODEL_NAME);
  }

  createUser(data: Partial<IUser>) {
    return super.create(data, MODEL_NAME);
  }


  async updateById(id: string, update: Partial<IUser>) {
    return this.getModel(MODEL_NAME)
      .findByIdAndUpdate(id, update as Record<string, unknown>, { new: true })
      .exec();
  }

  findMerchants(merchantStatus?: string): Promise<IUser[]> {
    const query: Record<string, unknown> = { role: UserRole.MERCHANT };
    if (merchantStatus) query.merchantStatus = merchantStatus;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.getModel(MODEL_NAME) as any)
      .find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  findAllUsers(select?: string): Promise<IUser[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q = (this.getModel(MODEL_NAME) as any).find({});
    if (select) q = q.select(select);
    return q.sort({ createdAt: -1 }).exec();
  }
}
