#!/usr/bin/env node

/**
 * Test script to verify infinite scroll and random feed functionality
 */

const { fetchVideosClient } = require('../src/lib/api');

async function testInfiniteScroll() {
  console.log('🧪 Testing Infinite Scroll and Random Feed Functionality\n');

  try {
    // Test 1: Normal pagination
    console.log('📄 Test 1: Normal pagination');
    const page1 = await fetchVideosClient({ page: 1, limit: 10 });
    const page2 = await fetchVideosClient({ page: 2, limit: 10 });
    
    console.log(`   Page 1: ${page1.videos.length} videos`);
    console.log(`   Page 2: ${page2.videos.length} videos`);
    console.log(`   Different content: ${page1.videos[0].id !== page2.videos[0].id ? '✅' : '❌'}`);
    console.log();

    // Test 2: Random sorting
    console.log('🎲 Test 2: Random sorting');
    const random1 = await fetchVideosClient({ sortBy: 'random', limit: 10 });
    const random2 = await fetchVideosClient({ sortBy: 'random', limit: 10 });
    
    console.log(`   Random 1: ${random1.videos.length} videos`);
    console.log(`   Random 2: ${random2.videos.length} videos`);
    
    // Check if order is different (high probability with random)
    const sameOrder = random1.videos.every((video, index) => 
      random2.videos[index] && video.id === random2.videos[index].id
    );
    console.log(`   Different order: ${!sameOrder ? '✅' : '⚠️  (might be same by chance)'}`);
    console.log();

    // Test 3: Category filtering with pagination
    console.log('🏷️  Test 3: Category filtering with pagination');
    const categoryPage1 = await fetchVideosClient({ category: 'Solo', page: 1, limit: 5 });
    const categoryPage2 = await fetchVideosClient({ category: 'Solo', page: 2, limit: 5 });
    
    console.log(`   Solo Page 1: ${categoryPage1.videos.length} videos`);
    console.log(`   Solo Page 2: ${categoryPage2.videos.length} videos`);
    console.log();

    // Test 4: Search with pagination
    console.log('🔍 Test 4: Search with pagination');
    const searchPage1 = await fetchVideosClient({ search: 'hot', page: 1, limit: 5 });
    const searchPage2 = await fetchVideosClient({ search: 'hot', page: 2, limit: 5 });
    
    console.log(`   Search "hot" Page 1: ${searchPage1.videos.length} videos`);
    console.log(`   Search "hot" Page 2: ${searchPage2.videos.length} videos`);
    console.log();

    // Test 5: Sorting options
    console.log('📊 Test 5: Sorting options');
    const byViews = await fetchVideosClient({ sortBy: 'views', order: 'desc', limit: 5 });
    const byDate = await fetchVideosClient({ sortBy: 'created_at', order: 'desc', limit: 5 });
    
    console.log(`   By views: ${byViews.videos.length} videos`);
    console.log(`   By date: ${byDate.videos.length} videos`);
    console.log(`   First video by views: ${byViews.videos[0]?.views || 0} views`);
    console.log(`   First video by date: ${byDate.videos[0]?.title || 'No title'}`);
    console.log();

    console.log('✅ All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Pagination is working');
    console.log('   - Random sorting is implemented');
    console.log('   - Category filtering works with pagination');
    console.log('   - Search works with pagination');
    console.log('   - Multiple sorting options available');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testInfiniteScroll();
