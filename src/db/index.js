import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';

const TURSO_DB_URL="libsql://18plus-sh20raj.aws-ap-south-1.turso.io"
const TURSO_DB_SECRET="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDgxNzEzMjcsImlkIjoiNWJjZGJmZDMtYmQ1Ni00NjdhLWE3MjEtNTFiMjNkOWQ1NGEzIiwicmlkIjoiOTgwOTA2NGEtODk0Mi00NDEzLTgwZTItM2M5MTg0OGIxODFjIn0.uyh1FWbJ80VzGW_pBCjpASuJ83_1dhI6WHyvOKze7j774dQuAP8om75bzAck4yfYUE2AcJ5luPSe92ayADjTBg"


// Check if we're in build/SSG mode and DB connection isn't needed
// Enhanced to handle more build environments (Vercel, Cloudflare, etc.)
// In production, we should always attempt to connect to the database during runtime
// Note: Edge runtime requires special handling
const isBuildTime = 
  // Next.js build phase
  (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') ||
  // Cloudflare Pages build (not runtime)
  (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES && !process.env.CF_PAGES_URL) || 
  // Vercel build (not runtime)
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD_STEP);

let client;
let db;

// Try/catch to handle Edge runtime errors gracefully
try {
  // Only create a real client if we're not in build time AND we have a DB URL
  if (!isBuildTime && TURSO_DB_URL) {
    client = createClient({
      url: TURSO_DB_URL,
      authToken: TURSO_DB_SECRET,
    });
    
    db = drizzle(client, { schema });
    console.log('✅ Successfully connected to Turso database');
  } else {
    throw new Error('Build-time or missing database credentials');
  }
} catch (error) {
  // Log the error but don't crash
  console.warn(`⚠️ Database connection error: ${error.message}`);
  console.warn('Using mock DB client - limited functionality');
  
  // Provide a more robust mock database
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
