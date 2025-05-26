// verify-video-entries.js - A script to check or repair video entries in the database
// Run with: node scripts/verify-video-entries.js
// Add --repair flag to fix issues

// Import required modules
const { createClient } = require('@libsql/client');
const { drizzle } = require('drizzle-orm/libsql');
const fetch = require('node-fetch');

// Database credentials (same as in db/index.js)
const TURSO_DB_URL = "libsql://18plus-sh20raj.aws-ap-south-1.turso.io";
const TURSO_DB_SECRET = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDgxNzEzMjcsImlkIjoiNWJjZGJmZDMtYmQ1Ni00NjdhLWE3MjEtNTFiMjNkOWQ1NGEzIiwicmlkIjoiOTgwOTA2NGEtODk0Mi00NDEzLTgwZTItM2M5MTg0OGIxODFjIn0.uyh1FWbJ80VzGW_pBCjpASuJ83_1dhI6WHyvOKze7j774dQuAP8om75bzAck4yfYUE2AcJ5luPSe92ayADjTBg";

// Check if --repair flag is present
const shouldRepair = process.argv.includes('--repair');

// Initialize database connection
console.log('🔌 Connecting to database...');
const client = createClient({
  url: TURSO_DB_URL,
  authToken: TURSO_DB_SECRET,
});

// Helper function to fetch metadata
async function fetchMetadata(teraId) {
  try {
    console.log(`🔍 Fetching metadata for teraId: ${teraId}`);
    
    // First try the metadata service
    const response = await fetch(`https://get-metadata.shraj.workers.dev/?url=https://teraboxapp.com/s/${teraId}`);
    
    if (!response.ok) {
      console.warn(`⚠️ Metadata service returned status ${response.status} for teraId ${teraId}`);
      return null;
    }
    
    const data = await response.json();
    let cleanTitle = data.title || '';
    
    // Clean the title
    cleanTitle = cleanTitle.replace(/\s*-\s*TeraBox.*$/i, '');
    cleanTitle = cleanTitle.replace(/&amp;/g, '&');
    cleanTitle = cleanTitle.replace(/&lt;/g, '<');
    cleanTitle = cleanTitle.replace(/&gt;/g, '>');
    cleanTitle = cleanTitle.replace(/&quot;/g, '"');
    cleanTitle = cleanTitle.replace(/&#39;/g, "'");
    cleanTitle = cleanTitle.trim();
    
    console.log(`✅ Successfully fetched metadata for teraId ${teraId}: "${cleanTitle}"`);
    
    return {
      title: cleanTitle,
      poster: data.image || null
    };
  } catch (error) {
    console.error(`❌ Error fetching metadata for teraId ${teraId}:`, error);
    return null;
  }
}

// Function to verify and repair video entries
async function verifyVideoEntries() {
  try {
    // Query all videos
    console.log('📋 Fetching all video entries from the database...');
    const videos = await client.execute('SELECT * FROM videos WHERE tera_id IS NOT NULL');
    console.log(`✅ Found ${videos.rows.length} video entries with TeraIDs`);
    
    // Process each video
    let issuesFound = 0;
    let fixed = 0;
    
    for (const video of videos.rows) {
      console.log(`\n🔄 Checking video ${video.id}: ${video.title || 'Untitled'} (TeraID: ${video.tera_id})`);
      
      // Check for issues
      const issues = [];
      if (!video.title || video.title.length < 3) {
        issues.push('Missing or too short title');
      }
      if (!video.poster) {
        issues.push('Missing poster image');
      }
      
      if (issues.length > 0) {
        console.log(`⚠️ Issues found: ${issues.join(', ')}`);
        issuesFound++;
        
        if (shouldRepair) {
          console.log('🔧 Attempting to fix issues...');
          
          // Fetch metadata for repair
          const metadata = await fetchMetadata(video.tera_id);
          
          if (metadata) {
            // Prepare update data
            const updates = {};
            let updatesMade = false;
            
            if ((!video.title || video.title.length < 3) && metadata.title) {
              updates.title = metadata.title;
              updatesMade = true;
            }
            
            if (!video.poster && metadata.poster) {
              updates.poster = metadata.poster;
              updatesMade = true;
            }
            
            // Apply updates if needed
            if (updatesMade) {
              const setClause = Object.entries(updates)
                .map(([key, value]) => `${key} = ?`)
                .join(', ');
              
              const updateQuery = `UPDATE videos SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
              const params = [...Object.values(updates), video.id];
              
              await client.execute({
                sql: updateQuery,
                args: params
              });
              
              console.log(`✅ Fixed video ${video.id}:`, updates);
              fixed++;
            }
          } else {
            console.log(`❌ Could not fetch metadata for TeraID: ${video.tera_id}`);
          }
        }
      } else {
        console.log('✅ No issues found');
      }
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`Total videos checked: ${videos.rows.length}`);
    console.log(`Issues found: ${issuesFound}`);
    
    if (shouldRepair) {
      console.log(`Videos fixed: ${fixed}`);
    } else if (issuesFound > 0) {
      console.log('\n💡 Run with --repair flag to fix these issues:');
      console.log('node scripts/verify-video-entries.js --repair');
    }
    
  } catch (error) {
    console.error('❌ Error verifying video entries:', error);
  } finally {
    await client.close();
  }
}

// Run the verification
console.log(`🔍 Starting video verification${shouldRepair ? ' with repair' : ''}...`);
verifyVideoEntries().then(() => {
  console.log('✅ Verification complete');
}).catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
