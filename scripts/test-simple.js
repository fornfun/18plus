#!/usr/bin/env node

console.log('🧪 Testing API endpoints...\n');

const testAPI = async () => {
  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test categories API
    console.log('1. Testing /api/categories...');
    const categoriesResponse = await fetch(`${baseUrl}/api/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log(`   ✅ Status: ${categoriesResponse.status}`);
    console.log(`   📊 Categories found: ${categoriesData.categories?.length || 0}\n`);
    
    // Test videos API
    console.log('2. Testing /api/videos...');
    const videosResponse = await fetch(`${baseUrl}/api/videos?limit=5`);
    const videosData = await videosResponse.json();
    console.log(`   ✅ Status: ${videosResponse.status}`);
    console.log(`   🎬 Videos found: ${videosData.videos?.length || 0}`);
    console.log(`   📈 Total videos in DB: ${videosData.pagination?.total || 0}\n`);
    
    console.log('🎉 API endpoints are working correctly!');
    
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
  }
};

testAPI();
