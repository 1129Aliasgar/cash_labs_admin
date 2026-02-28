import { Model } from 'mongoose';
import { AppError } from '../utils/AppError';
import { TenantContextProvider } from '../utils/tenantContext.provider';

export abstract class BaseRepository<T> {
  protected tenantContextProvider: TenantContextProvider;

  constructor(tenantContextProvider: TenantContextProvider) {
    this.tenantContextProvider = tenantContextProvider;
  }

  protected get tenantContext() {
    return this.tenantContextProvider.context;
  }

  protected getModel(modelName: string): Model<T> {
    const ctx = this.tenantContext;
    if (!ctx) {
      throw new AppError('Tenant context not available', 500);
    }
    const model = ctx.models?.[modelName];
    if (!model) {
      throw new AppError(`Model ${modelName} not registered for tenant ${ctx.tenantId}`, 500);
    }
    return model as Model<T>;
  }

  async findById(id: string, modelName: string): Promise<T | null> {
    return this.getModel(modelName).findById(id).exec();
  }

  async create(data: Partial<T>, modelName: string): Promise<T> {
    return this.getModel(modelName).create(data) as Promise<T>;
  }

  async find(query: Record<string, unknown>, modelName: string): Promise<T[]> {
    return this.getModel(modelName).find(query).exec();
  }

  async findOne(query: Record<string, unknown>, modelName: string): Promise<T | null> {
    return this.getModel(modelName).findOne(query).exec();
  }

  async findByIdAndUpdate(
    id: string,
    updateData: Partial<T>,
    modelName: string
  ): Promise<T | null> {
    return this.getModel(modelName)
      .findByIdAndUpdate(id, updateData as Record<string, unknown>, { new: true })
      .exec();
  }

  async deleteById(id: string, modelName: string): Promise<T | null> {
    return this.getModel(modelName).findByIdAndDelete(id).exec();
  }

  async findWithPagination(
    query: Record<string, unknown>,
    modelName: string,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
    const model = this.getModel(modelName);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      model.find(query).sort(sort).skip(skip).limit(limit).exec(),
      model.countDocuments(query).exec(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
