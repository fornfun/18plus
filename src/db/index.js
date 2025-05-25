import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_SECRET,
});

export const db = drizzle(client, { schema });
