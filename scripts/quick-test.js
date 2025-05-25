// Simple test to verify API endpoints
import { fetchVideosClient } from '../src/lib/api.js';

async function quickTest() {
  console.log('Testing API endpoints...\n');
  
  try {
    // Test basic fetch
    const result = await fetchVideosClient({ limit: 5 });
    console.log(`✅ Basic fetch: ${result.videos.length} videos`);
    
    // Test random
    const randomResult = await fetchVideosClient({ sortBy: 'random', limit: 5 });
    console.log(`✅ Random fetch: ${randomResult.videos.length} videos`);
    
    console.log('\n✅ API is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
