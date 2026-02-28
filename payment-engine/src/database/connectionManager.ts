import mongoose, { Connection } from 'mongoose';
import { registerModelsOnConnection } from '../models';

const baseUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

const connectionCache = new Map<string, Connection>();

/**
 * Get or create a Mongoose connection for the given database name.
 * Connections are cached per dbName.
 */
export async function getDbConnection(dbName: string): Promise<Connection> {
  const cached = connectionCache.get(dbName);
  if (cached && cached.readyState === 1) {
    return cached;
  }

  const [base, qs] = baseUri.split('?');
  const path = base.replace(/\/$/, '');
  const uri = qs ? `${path}/${dbName}?${qs}` : `${path}/${dbName}`;
  const conn = mongoose.createConnection(uri);
  conn.asPromise().catch((err) => {
    console.error(`[ConnectionManager] Failed to connect to ${dbName}:`, err);
  });

  await conn.asPromise();
  connectionCache.set(dbName, conn);
  return conn;
}
