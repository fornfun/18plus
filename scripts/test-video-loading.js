// test-video-loading.js - A script to test video loading from TeraBox
// Run with: node scripts/test-video-loading.js TERAID
const fetch = require('node-fetch');

// Get TeraID from command line args
const teraId = process.argv[2];

if (!teraId) {
  console.error('❌ Error: No TeraID provided');
  console.log('Usage: node scripts/test-video-loading.js TERAID');
  process.exit(1);
}

console.log(`🔍 Testing TeraID: ${teraId}`);

// Test direct TeraBox URL
const teraboxUrl = `https://teraboxapp.com/s/${teraId}`;
console.log(`🌐 Testing URL: ${teraboxUrl}`);

// Test functions
async function testMetadataService() {
  try {
    console.log('\n🔄 Testing metadata service...');
    const url = `https://get-metadata.shraj.workers.dev/?url=https://teraboxapp.com/s/${teraId}`;
    console.log(`📡 Fetching from: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`❌ Metadata service failed with status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ Metadata service response:');
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error(`❌ Error with metadata service: ${error.message}`);
    return null;
  }
}

async function testThumbnailUrl() {
  try {
    console.log('\n🔄 Testing thumbnail URL...');
    const thumbnailUrl = `https://teraboxapp.com/thumbnail/s/${teraId}.jpg`;
    console.log(`🖼️ Attempting to access: ${thumbnailUrl}`);
    
    const response = await fetch(thumbnailUrl);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.headers.get('content-type')?.includes('image/')) {
      console.log('✅ Valid thumbnail URL');
      return thumbnailUrl;
    } else {
      console.log('❌ Not a valid image or thumbnail URL');
      return null;
    }
  } catch (error) {
    console.error(`❌ Error with thumbnail URL: ${error.message}`);
    return null;
  }
}

async function testPlayerUrl() {
  try {
    console.log('\n🔄 Testing TeraBox player URL...');
    const playerUrl = `https://player.terabox.tech/?url=https%3A%2F%2Fteraboxapp.com%2Fs%2F${teraId}`;
    console.log(`📺 Player URL: ${playerUrl}`);
    
    const response = await fetch(playerUrl);
    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Player URL seems valid');
      return true;
    } else {
      console.log('❌ Player URL returned an error');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error with player URL: ${error.message}`);
    return false;
  }
}

// Run all the tests
async function runTests() {
  console.log('🧪 Starting tests...');
  
  // Run metadata test
  const metadata = await testMetadataService();
  
  // Run thumbnail test
  const thumbnailUrl = await testThumbnailUrl();
  
  // Run player test
  const playerWorks = await testPlayerUrl();
  
  // Summary
  console.log('\n📋 TEST SUMMARY:');
  console.log('------------------------------------');
  console.log(`TeraID: ${teraId}`);
  console.log(`Direct URL: ${teraboxUrl}`);
  console.log(`Metadata service: ${metadata ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Title: ${metadata?.title || 'Unknown'}`);
  console.log(`Thumbnail: ${thumbnailUrl ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Player URL: ${playerWorks ? '✅ WORKING' : '❌ FAILED'}`);
  console.log('------------------------------------');
  
  if (metadata && thumbnailUrl && playerWorks) {
    console.log('✅ ALL TESTS PASSED!');
  } else {
    console.log('⚠️ SOME TESTS FAILED');
  }
}

// Run everything
runTests().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
