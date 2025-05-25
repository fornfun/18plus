import { createReadStream } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createInterface } from 'readline';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Now import db after env vars are loaded
const { db } = await import('../src/db/index.js');
const { videos } = await import('../src/db/schema.js');

async function seedVideos() {
  try {
    console.log('🔄 Starting to seed videos from JSON file...');
    
    // Read the JSON file line by line to handle large files
    const jsonPath = join(process.cwd(), 'videos', 'videos.json');
    console.log('📁 Reading JSON file:', jsonPath);
    
    const fileStream = createReadStream(jsonPath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let isInDataArray = false;
    let videoData = [];
    let processedCount = 0;
    let skippedCount = 0;
    const batchSize = 50; // Reduced batch size for better memory management
    
    console.log('📊 Processing videos...');
    
    for await (const line of rl) {
      const trimmedLine = line.trim();
      
      // Look for the start of video data
      if (trimmedLine.includes('"name":"Video"') && trimmedLine.includes('"data":')) {
        isInDataArray = true;
        continue;
      }
      
      // If we're in the data array, process video objects
      if (isInDataArray && trimmedLine.startsWith('{"id":')) {
        try {
          // Remove trailing comma if present
          const cleanLine = trimmedLine.replace(/,\s*$/, '');
          const video = JSON.parse(cleanLine);
          
          // Skip if tera_id is null or empty
          if (!video.tera_id) {
            skippedCount++;
            continue;
          }
          
          // Prepare video data for insertion
          const videoRecord = {
            slug: video.slug || video.tera_id,
            title: video.title || null,
            description: video.description || null,
            poster: video.poster || null,
            video_url: video.video_url || null,
            tera_id: video.tera_id,
            category: video.category || null,
            tags: video.tags || null,
            duration: video.duration || null,
            views: video.views ? parseInt(video.views) : null,
            likes: video.likes ? parseInt(video.likes) : null,
            dislikes: video.dislikes ? parseInt(video.dislikes) : null,
            comments: video.comments ? parseInt(video.comments) : null,
            published: video.published ? Boolean(video.published) : null,
            published_at: video.published_at || null,
            authorId: video.authorId || null,
            user: video.user || null,
            created_at: video.created_at || null,
            updated_at: video.updated_at || null,
          };
          
          videoData.push(videoRecord);
          
          // Process in batches
          if (videoData.length >= batchSize) {
            await processBatch(videoData);
            processedCount += videoData.length;
            videoData = [];
            
            // Progress update
            if (processedCount % 200 === 0) {
              console.log(`🔄 Progress: ${processedCount} videos processed`);
            }
          }
          
        } catch (error) {
          console.error(`❌ Error parsing line: ${trimmedLine.substring(0, 100)}...`);
          skippedCount++;
        }
      }
      
      // Check if we've reached the end of the data array
      if (isInDataArray && trimmedLine === ']') {
        break;
      }
    }
    
    // Process remaining videos in the last batch
    if (videoData.length > 0) {
      await processBatch(videoData);
      processedCount += videoData.length;
    }
    
    console.log(`\n🎉 Seeding completed!`);
    console.log(`✅ Successfully processed: ${processedCount} videos`);
    console.log(`⚠️  Skipped: ${skippedCount} videos`);
    
    // Verify insertion
    const totalVideos = await db.select().from(videos);
    console.log(`📊 Total videos in database: ${totalVideos.length}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

async function processBatch(videosToInsert) {
  if (videosToInsert.length === 0) return;
  
  try {
    await db.insert(videos).values(videosToInsert).onConflictDoNothing();
    console.log(`✅ Inserted batch: ${videosToInsert.length} videos`);
  } catch (error) {
    console.error(`❌ Error inserting batch:`, error.message);
    
    // Try inserting one by one if batch fails
    for (const video of videosToInsert) {
      try {
        await db.insert(videos).values(video).onConflictDoNothing();
      } catch (singleError) {
        console.error(`❌ Failed to insert video ${video.tera_id}:`, singleError.message);
      }
    }
  }
}

// Run the seeding function
seedVideos()
  .then(() => {
    console.log('✅ Seeding script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
  });
