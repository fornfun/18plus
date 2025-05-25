import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_SECRET,
  },
});
