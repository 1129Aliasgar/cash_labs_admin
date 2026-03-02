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

export const tenantSelector = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const host = getHost(req);
    const tenantKey = host.split('.')[0] || 'default';

    const dbName = tenantDbMapper[tenantKey];
    if (!dbName) {
      res.status(400).json({
        success: false,
        message: `Tenant not found for host: ${host}`,
      });
      return;
    }

    console.log('Connecting to database:', dbName);

    const conn = await getDbConnection(dbName);
    console.log('Connected to database:', conn.name);
    const models = await registerModelsOnConnection(conn);
    console.log('Models registered:', models);

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
