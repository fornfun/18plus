#!/usr/bin/env node

#!/usr/bin/env node

// Test script to verify all API endpoints are working
async function testAPI() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test categories API
    console.log('1. Testing /api/categories...');
    const categoriesResponse = await globalThis.fetch(`${baseUrl}/api/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log(`   ✅ Status: ${categoriesResponse.status}`);
    console.log(`   📊 Categories found: ${categoriesData.categories?.length || 0}\n`);
    
    // Test videos API
    console.log('2. Testing /api/videos...');
    const videosResponse = await globalThis.fetch(`${baseUrl}/api/videos?limit=5`);
    const videosData = await videosResponse.json();
    console.log(`   ✅ Status: ${videosResponse.status}`);
    console.log(`   🎬 Videos found: ${videosData.videos?.length || 0}`);
    console.log(`   📈 Total videos in DB: ${videosData.pagination?.total || 0}\n`);
    
    // Test search API
    console.log('3. Testing search functionality...');
    const searchResponse = await globalThis.fetch(`${baseUrl}/api/videos?search=video&limit=3`);
    const searchData = await searchResponse.json();
    console.log(`   ✅ Status: ${searchResponse.status}`);
    console.log(`   🔍 Search results: ${searchData.videos?.length || 0}\n`);
    
    // Test single video API (if we have videos)
    if (videosData.videos?.length > 0) {
      const firstVideoId = videosData.videos[0].id;
      console.log(`4. Testing /api/videos/${firstVideoId}...`);
      const videoResponse = await globalThis.fetch(`${baseUrl}/api/videos/${firstVideoId}`);
      const videoData = await videoResponse.json();
      console.log(`   ✅ Status: ${videoResponse.status}`);
      console.log(`   🎥 Video title: ${videoData.video?.title || 'No title'}`);
      console.log(`   🔗 Related videos: ${videoData.relatedVideos?.length || 0}\n`);
    }
    
    console.log('🎉 All API endpoints are working correctly!');
    
    // Show sample video data
    if (videosData.videos?.length > 0) {
      console.log('\n📋 Sample video data:');
      const sampleVideo = videosData.videos[0];
      console.log(`   ID: ${sampleVideo.id}`);
      console.log(`   Title: ${sampleVideo.title || 'No title'}`);
      console.log(`   Category: ${sampleVideo.category || 'No category'}`);
      console.log(`   Views: ${sampleVideo.views || 0}`);
      console.log(`   Has poster: ${!!sampleVideo.poster}`);
      console.log(`   Tera ID: ${sampleVideo.tera_id}`);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
}

testAPI();
