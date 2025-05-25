import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { videos } from '../src/db/schema.js';
import { eq, isNull, or } from 'drizzle-orm';

// Load environment variables
config();

// Initialize database
const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_SECRET,
});

const db = drizzle(client);

// Function to fetch metadata from TeraBox API
async function fetchMetadata(teraId) {
  try {
    const url = `https://get-metadata.shraj.workers.dev/?url=https://teraboxapp.com/s/${teraId}`;
    console.log(`🔍 Fetching metadata for: ${teraId}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Clean up the title by removing TeraBox suffix as specified
    let cleanTitle = data.title || '';
    cleanTitle = cleanTitle.replace(/ - Share Files Online & Send Larges Files with TeraBox$/g, '');
    cleanTitle = cleanTitle.replace(/\.mp4$/i, ''); // Also remove .mp4 extension
    cleanTitle = cleanTitle.trim();
    
    return {
      title: cleanTitle,
      poster: data.og_image || null
    };
  } catch (error) {
    console.error(`❌ Error fetching metadata for ${teraId}:`, error.message);
    return null;
  }
}

// Function to update video metadata in database
async function updateVideoMetadata(videoId, metadata) {
  try {
    const result = await db
      .update(videos)
      .set({
        title: metadata.title,
        poster: metadata.poster,
        updatedAt: new Date()
      })
      .where(eq(videos.id, videoId))
      .returning();
    
    console.log(`✅ Updated video ${videoId}: ${metadata.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Error updating video ${videoId}:`, error.message);
    return null;
  }
}

// Function to add delay between API calls
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to process all videos
async function updateAllVideosMetadata() {
  try {
    console.log('🚀 Starting metadata update process...');
    
    // Get all videos that need metadata updates (no title or empty title)
    const videosToUpdate = await db
      .select({
        id: videos.id,
        teraId: videos.teraId,
        title: videos.title,
        poster: videos.poster
      })
      .from(videos)
      .where(
        or(
          isNull(videos.title),
          eq(videos.title, ''),
          isNull(videos.poster),
          eq(videos.poster, '')
        )
      )
      .limit(100); // Process in batches to avoid overwhelming the API
    
    console.log(`📊 Found ${videosToUpdate.length} videos to update`);
    
    if (videosToUpdate.length === 0) {
      console.log('✅ No videos need metadata updates');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < videosToUpdate.length; i++) {
      const video = videosToUpdate[i];
      
      console.log(`\n🔍 Processing ${i + 1}/${videosToUpdate.length}: ${video.teraId}`);
      
      // Fetch metadata from API
      const metadata = await fetchMetadata(video.teraId);
      
      if (metadata && metadata.title) {
        // Update database
        const updateResult = await updateVideoMetadata(video.id, metadata);
        
        if (updateResult) {
          successCount++;
        } else {
          errorCount++;
        }
      } else {
        console.log(`⚠️  No valid metadata found for ${video.teraId}`);
        errorCount++;
      }
      
      // Add delay to be respectful to the API (1 second between calls)
      if (i < videosToUpdate.length - 1) {
        await delay(1000);
      }
    }
    
    console.log('\n📈 === Update Summary ===');
    console.log(`✅ Successfully updated: ${successCount} videos`);
    console.log(`❌ Failed to update: ${errorCount} videos`);
    console.log('🎉 Metadata update process completed!');
    
  } catch (error) {
    console.error('💥 Error in main process:', error);
  } finally {
    // Close database connection
    client.close();
    console.log('🔌 Database connection closed');
  }
}

// Function to update specific video by teraId (for testing)
async function updateSingleVideo(teraId) {
  try {
    console.log(`🔍 Updating single video: ${teraId}`);
    
    // Find the video
    const video = await db
      .select()
      .from(videos)
      .where(eq(videos.teraId, teraId))
      .limit(1);
    
    if (video.length === 0) {
      console.log('❌ Video not found');
      return;
    }
    
    // Fetch metadata
    const metadata = await fetchMetadata(teraId);
    
    if (metadata && metadata.title) {
      // Update database
      await updateVideoMetadata(video[0].id, metadata);
      console.log('✅ Single video updated successfully!');
    } else {
      console.log('❌ Failed to fetch metadata');
    }
  } catch (error) {
    console.error('💥 Error updating single video:', error);
  } finally {
    client.close();
  }
}

// Function to update all videos (force update even if they have titles)
async function forceUpdateAllVideos() {
  try {
    console.log('🚀 Starting FORCE metadata update process...');
    
    // Get ALL videos
    const videosToUpdate = await db
      .select({
        id: videos.id,
        teraId: videos.teraId,
        title: videos.title,
        poster: videos.poster
      })
      .from(videos)
      .limit(200); // Process larger batches for force update
    
    console.log(`📊 Found ${videosToUpdate.length} videos to force update`);
    
    if (videosToUpdate.length === 0) {
      console.log('❌ No videos found in database');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < videosToUpdate.length; i++) {
      const video = videosToUpdate[i];
      
      console.log(`\n🔍 Processing ${i + 1}/${videosToUpdate.length}: ${video.teraId}`);
      
      // Fetch metadata from API
      const metadata = await fetchMetadata(video.teraId);
      
      if (metadata && metadata.title) {
        // Update database
        const updateResult = await updateVideoMetadata(video.id, metadata);
        
        if (updateResult) {
          successCount++;
        } else {
          errorCount++;
        }
      } else {
        console.log(`⚠️  No valid metadata found for ${video.teraId}`);
        errorCount++;
      }
      
      // Add delay to be respectful to the API (1 second between calls)
      if (i < videosToUpdate.length - 1) {
        await delay(1000);
      }
    }
    
    console.log('\n📈 === Force Update Summary ===');
    console.log(`✅ Successfully updated: ${successCount} videos`);
    console.log(`❌ Failed to update: ${errorCount} videos`);
    console.log('🎉 Force metadata update process completed!');
    
  } catch (error) {
    console.error('💥 Error in force update process:', error);
  } finally {
    // Close database connection
    client.close();
    console.log('🔌 Database connection closed');
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === '--single' && args[1]) {
  // Update single video
  updateSingleVideo(args[1]);
} else if (args.length > 0 && args[0] === '--force') {
  // Force update all videos
  forceUpdateAllVideos();
} else if (args.length > 0 && args[0] === '--help') {
  console.log('📖 Usage:');
  console.log('  node scripts/update-metadata.js                     # Update videos without titles/posters');
  console.log('  node scripts/update-metadata.js --force             # Force update ALL videos');
  console.log('  node scripts/update-metadata.js --single <tera_id>  # Update specific video');
  console.log('  node scripts/update-metadata.js --help              # Show this help');
} else {
  // Update only videos that need updates
  updateAllVideosMetadata();
}
