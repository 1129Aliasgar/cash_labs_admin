import mongoose, { Connection } from 'mongoose';

const baseUri = process.env.MONGO_URI || '';

const connectionCache = new Map<string, Connection>();

export async function getDbConnection(dbName: string): Promise<Connection> {
  const cached = connectionCache.get(dbName);
  if (cached && cached.readyState === 1) {
    return cached;
  }

  const uri = baseUri.replace('<DB_NAME>', dbName);
  console.log('Connecting to database:', uri.replace(/:[^:@]+@/, ':***@'));
  const conn = mongoose.createConnection(uri);
  conn.asPromise().catch((err) => {
    console.error(`[ConnectionManager] Failed to connect to ${dbName}:`, err);
  });

  await conn.asPromise();
  connectionCache.set(dbName, conn);
  return conn;
}
