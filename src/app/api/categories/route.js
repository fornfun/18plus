import { NextResponse } from 'next/server';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { sql } from 'drizzle-orm';

// GET /api/categories - Get all unique categories
export async function GET() {
  try {
    // Check if we're in build time with mock DB
    const isBuildTime = 
      (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') ||
      process.env.CF_PAGES_BRANCH || // Cloudflare Pages build
      process.env.VERCEL_ENV === 'production'; // Vercel build
    
    let categories = ['All'];
    
    if (!isBuildTime) {
      try {
        // Only query the DB if we're not in build time
        const categoryResults = await db
          .select({ category: videos.category })
          .from(videos)
          .where(sql`${videos.category} IS NOT NULL AND ${videos.category} != ''`)
          .groupBy(videos.category);
        
        categories = ['All', ...categoryResults.map(row => row.category).filter(Boolean)];
      } catch (dbError) {
        console.warn('DB query failed in categories, using fallback:', dbError);
      }
    } 
    
    return NextResponse.json({ categories });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
