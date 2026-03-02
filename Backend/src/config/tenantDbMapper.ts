/**
 * Maps tenant key (e.g. subdomain) to MongoDB database name.
 * Uses BETSEA_TENANT_MAP env: "domain1:db1,domain2:db2" or defaults.
 */
function parseTenantMap(): Record<string, string> {
  const raw = process.env.TENANT_MAP;
  if (!raw) {
    return { default: 'auth', api: 'auth' };
  }
  const map: Record<string, string> = {};
  raw.split(',').forEach((pair) => {
    const [key, val] = pair.trim().split(':');
    if (key && val) map[key.trim()] = val.trim();
  });
  return Object.keys(map).length ? map : { default: 'auth', api: 'auth' };
}

export const tenantDbMapper: Record<string, string> = parseTenantMap();
