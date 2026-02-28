import { Request, Response, NextFunction } from 'express';
import { getDbConnection } from '../database/connectionManager';
import { registerModelsOnConnection } from '../models';
import { tenantContextStorage } from '../utils/tenantContext.provider';
import { tenantDbMapper } from '../config/tenantDbMapper';

const getHost = (req: Request): string => {
  if (req.headers['x-host']) {
    return (req.headers['x-host'] as string).split(':')[0];
  }
  return (req.hostname || req.headers.host || '').split(':')[0];
};

/**
 * Default tenant selector using request host (subdomain) as tenant key.
 */
export const tenantSelector = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const host = getHost(req);
    const tenantKey = host.split('.')[0];

    const dbName = tenantDbMapper[tenantKey];
    if (!dbName) {
      res.status(400).json({
        message: `Tenant not found for host: ${host}`,
      });
      return;
    }

    const conn = await getDbConnection(dbName);
    const models = await registerModelsOnConnection(conn);

    await tenantContextStorage.run(
      {
        tenantId: dbName,
        models,
        connectionName: dbName,
        host: tenantKey,
      },
      () => {
        next();
        return Promise.resolve();
      }
    );
  } catch (err) {
    next(err);
  }
};
