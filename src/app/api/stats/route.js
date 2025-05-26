import { NextResponse } from 'next/server';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { sql } from 'drizzle-orm';

// GET /api/stats - Get site statistics
export async function GET() {
  try {
    // Get total videos
    const totalResults = await db
      .select({ 
        totalVideos: sql`COUNT(*)`,
        publishedVideos: sql`SUM(CASE WHEN ${videos.published} = 1 THEN 1 ELSE 0 END)`,
        totalViews: sql`SUM(${videos.views})`,
        totalLikes: sql`SUM(${videos.likes})`
      })
      .from(videos);
    
    const stats = {
      totalVideos: totalResults[0]?.totalVideos || 0,
      publishedVideos: totalResults[0]?.publishedVideos || 0,
      totalViews: totalResults[0]?.totalViews || 0,
      totalLikes: totalResults[0]?.totalLikes || 0
    };

    // Get top categories
    const categoryStats = await db
      .select({
        category: videos.category,
        count: sql`COUNT(*)`
      })
      .from(videos)
      .where(sql`${videos.published} = 1`)
      .groupBy(videos.category)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(5);

    return NextResponse.json({
      ...stats,
      topCategories: categoryStats
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
