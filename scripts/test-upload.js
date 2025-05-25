#!/usr/bin/env node

/**
 * Test script for TeraBox upload functionality
 */

const testData = {
  tera_id: '1EWkWY66FhZKS2WfxwBgd0Q',
  title: 'Test Video Upload',
  category: 'Amateur',
  tags: ['hot', 'sexy', 'test'],
  url: 'https://teraboxapp.com/s/1EWkWY66FhZKS2WfxwBgd0Q'
};

async function testUpload() {
  console.log('🧪 Testing TeraBox Upload Functionality\n');

  try {
    console.log('📤 Testing video upload API...');
    
    const response = await fetch('http://localhost:3001/api/videos/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Upload successful!');
      console.log(`   Title: ${result.video.title}`);
      console.log(`   Tera ID: ${result.video.tera_id}`);
      console.log(`   URL: /watch/${result.video.tera_id}`);
      console.log(`   Status: ${result.video.published ? 'Published' : 'Pending Review'}`);
      
      // Test fetching the video
      console.log('\n🔍 Testing video fetch...');
      const fetchResponse = await fetch(`http://localhost:3001/api/videos/${testData.tera_id}`);
      const fetchResult = await fetchResponse.json();
      
      if (fetchResponse.ok) {
        console.log('✅ Video fetch successful!');
        console.log(`   Retrieved title: ${fetchResult.video.title}`);
        console.log(`   Tera ID: ${fetchResult.video.tera_id}`);
      } else {
        console.log('❌ Video fetch failed:', fetchResult.error);
      }
      
    } else {
      console.log('❌ Upload failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running on port 3001:');
    console.log('   npm run dev');
  }
}

console.log('TeraBox Upload Test');
console.log('==================');
testUpload();
