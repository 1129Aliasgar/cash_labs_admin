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
}
