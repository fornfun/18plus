import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import * as schema from '../src/db/schema.js';
import { eq, isNull, or } from 'drizzle-orm';

// Load environment variables
config();

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_SECRET,
});

const db = drizzle(client, { schema });
const { videos } = schema;

// Helper function to fetch OG image directly from terabox
async function fetchTeraboxOgImage(teraId) {
  try {
    console.log(`🖼️ Fetching OG image for teraId: ${teraId}`);
    const teraboxUrl = `https://teraboxapp.com/s/${teraId}`;
    
    // Fetch directly from server side (no CORS issues)
    const response = await fetch(teraboxUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch terabox page: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    
    // Extract title using regex
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1] : '';
    title = title.replace(/\s*-\s*TeraBox.*$/i, '').trim();
    
    // Extract OG image using regex
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const poster = ogImageMatch ? ogImageMatch[1] : null;
    
    console.log(`📸 Extracted OG image: ${poster ? poster.substring(0, 30) + '...' : 'none found'}`);
    
    return {
      title: title || null,
      poster: poster || null
    };
  } catch (error) {
    console.error('Error fetching terabox OG image:', error);
    return null;
  }
}

async function updatePosterUrls() {
  try {
    // Get all videos that don't have a poster OR have a placeholder poster
    const videosWithoutPosters = await db
      .select()
      .from(videos)
      .where(
        or(
          isNull(videos.poster),
          eq(videos.poster, ''),
          eq(videos.poster, '/placeholder-video.jpg')
        )
      )
      .limit(100);
    
    console.log(`🔍 Found ${videosWithoutPosters.length} videos without proper posters`);
    
    let updatedCount = 0;
    
    for (const video of videosWithoutPosters) {
      if (!video.tera_id) {
        console.log(`⚠️ Video ${video.id} has no tera_id, skipping...`);
        continue;
      }
      
      console.log(`⏳ Processing video ${video.id} - ${video.title || 'Untitled'} (${video.tera_id})`);
      
      const metadata = await fetchTeraboxOgImage(video.tera_id);
      
      if (metadata && metadata.poster) {
        console.log(`✅ Found poster for video ${video.id}`);
        
        // Update video metadata
        await db
          .update(videos)
          .set({ 
            poster: metadata.poster,
            title: (!video.title && metadata.title) ? metadata.title : video.title,
            updated_at: new Date().toISOString()
          })
          .where(eq(videos.id, video.id));
        
        updatedCount++;
        console.log(`✨ Updated video ${video.id} with new poster URL`);
        
        // Add a small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`❌ Failed to fetch poster for video ${video.id}`);
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} out of ${videosWithoutPosters.length} videos`);
    
  } catch (error) {
    console.error('Error updating poster URLs:', error);
  }
}

// Run the script
updatePosterUrls().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
