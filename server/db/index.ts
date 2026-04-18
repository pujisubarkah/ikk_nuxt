import { drizzle } from 'drizzle-orm/node-postgres';
// @ts-ignore - Workspace TS plugin may not resolve pg ambient typings in Nuxt referenced configs.
import { Pool } from 'pg';
import { schema } from './schema/index';

const connectionString =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;