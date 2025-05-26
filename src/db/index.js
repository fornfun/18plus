import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import * as schema from './schema.js';

// Load environment variables
config();

// Check if we're in build/SSG mode and DB connection isn't needed
// Enhanced to handle more build environments (Vercel, Cloudflare, etc.)
const isBuildTime = 
  (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') ||
  process.env.CF_PAGES_BRANCH || // Cloudflare Pages build
  process.env.VERCEL_ENV === 'production'; // Vercel build

let client;
let db;

// Only create a real client if we're not in build time AND we have a DB URL
if (!isBuildTime && process.env.TURSO_DB_URL) {
  client = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_SECRET,
  });
  
  db = drizzle(client, { schema });
} else {
  // Provide a more robust mock database during build
  console.warn('Using mock DB client for build - no actual DB operations will work');
  db = {
    select: () => ({ 
      from: () => ({ 
        where: () => ({ 
          groupBy: () => [],
          orderBy: () => [],
          limit: () => ({ offset: () => [] })
        }) 
      }) 
    }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => [] }) }),
    delete: () => ({ where: () => [] }),
    query: () => []
  };
}

export { db };
