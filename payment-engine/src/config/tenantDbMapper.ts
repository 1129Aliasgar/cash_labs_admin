/**
 * Maps tenant key (e.g. subdomain) to MongoDB database name.
 * Extend this map for each tenant.
 */
export const tenantDbMapper: Record<string, string> = {
  default: 'default',
  api: 'default',
  // Add tenants: 'subdomain': 'db_name'
};
