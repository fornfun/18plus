import { NextResponse } from 'next/server';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { sql } from 'drizzle-orm';

// GET /api/categories - Get all unique categories
export async function GET() {
  try {
    const categoryResults = await db
      .select({ category: videos.category })
      .from(videos)
      .where(sql`${videos.category} IS NOT NULL AND ${videos.category} != ''`)
      .groupBy(videos.category);
    
    const categories = ['All', ...categoryResults.map(row => row.category).filter(Boolean)];
    
    return NextResponse.json({ categories });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
