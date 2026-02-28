import { AsyncLocalStorage } from 'async_hooks';
import { injectable } from 'inversify';

export interface TenantContext {
  tenantId: string;
  models?: Record<string, unknown>;
  connectionName?: string;
  host?: string;
}

export const tenantContextStorage =
  new AsyncLocalStorage<TenantContext>();

@injectable()
export class TenantContextProvider {
  run<T>(
    context: TenantContext,
    fn: () => Promise<T>
  ): Promise<T> {
    return tenantContextStorage.run(context, fn);
  }

  get context(): TenantContext {
    const ctx = tenantContextStorage.getStore();
    if (!ctx) {
      throw new Error('Tenant context not available');
    }
    return ctx;
  }

  get tenantId(): string {
    return this.context.tenantId;
  }

  get models(): Record<string, unknown> | undefined {
    return this.context.models;
  }
}
