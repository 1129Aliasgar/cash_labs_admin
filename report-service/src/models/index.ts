import fs from 'fs';
import path from 'path';
import { Connection, Schema } from 'mongoose';

const schemas: Record<string, Schema> = {};
const schemasDir = path.join(__dirname, 'schemas');

try {
  fs.readdirSync(schemasDir).forEach((file: string) => {
    if (!file.endsWith('.schema.ts') && !file.endsWith('.schema.js')) return;

    const name = file.replace(/\.schema\.(ts|js)$/, '');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const schema = (require(path.join(schemasDir, file)) as { default: Schema }).default;

    if (schema instanceof Schema) {
      schemas[name] = schema;
    } else {
      console.warn(`⚠ Warning: ${file} does not export a valid Schema. Skipped.`);
    }
  });
} catch {
  // schemas dir may not exist or be empty
}

const modelCache = new WeakMap<Connection, Record<string, ReturnType<Connection['model']>>>();

export const registerModelsOnConnection = async (conn: Connection) => {
  if (conn.readyState !== 1) {
    await conn.asPromise();
  }

  if (modelCache.has(conn)) {
    return modelCache.get(conn)!;
  }

  console.log(`[ModelLoader] Registering models on connection: ${conn.name}`);

  const models: Record<string, ReturnType<Connection['model']>> = {};

  for (const [name, schema] of Object.entries(schemas)) {
    const modelName = name.charAt(0).toUpperCase() + name.slice(1);
    models[name] = conn.models[modelName] ?? conn.model(modelName, schema);
  }

  modelCache.set(conn, models);

  return models;
};
