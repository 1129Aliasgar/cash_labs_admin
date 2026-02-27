type TenantMapping = Record<string, string>;

const rawMapping = process.env.BETSEA_TENANT_MAP || '';

export const tenantDbMapper: TenantMapping = rawMapping
  .split(',')
  .filter(Boolean)
  .reduce((acc, item) => {
    const [domain, db] = item.split(':').map(v => v.trim());
    if (domain && db) acc[domain] = db;
    return acc;
  }, {} as TenantMapping);



