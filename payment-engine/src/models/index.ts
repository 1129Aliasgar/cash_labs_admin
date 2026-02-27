/// <reference types="node" />
import fs from 'fs';
import path from 'path';
import { Connection, Schema } from 'mongoose';

// --------------------------------------------------------------------
// 1. Load all schemas once at startup
// --------------------------------------------------------------------
const schemas: Record<string, Schema> = {};
const schemasDir = path.join(__dirname, 'schemas');

fs.readdirSync(schemasDir).forEach((file: string) => {
  if (!file.endsWith('.schema.ts') && !file.endsWith('.schema.js')) return;

  const name = file.replace(/\.schema\.(ts|js)$/, '');
  const schema = require(path.join(schemasDir, file)).default;

  if (schema instanceof Schema) {
    schemas[name] = schema;
  } else {
    console.warn(`⚠ Warning: ${file} does not export a valid Schema. Skipped.`);
  }
});

// --------------------------------------------------------------------
// 2. Cache models per connection using WeakMap (no memory leaks)
// --------------------------------------------------------------------
const modelCache = new WeakMap<Connection, Record<string, ReturnType<Connection['model']>>>();

// --------------------------------------------------------------------
// 3. Register models on a connection only once
// --------------------------------------------------------------------
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
