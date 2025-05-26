// Script to test the API connection directly
import http from 'http';

// Function to perform an HTTP GET request
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            data: data
          });
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function testApiConnection() {
  console.log('Testing API connection directly...');
  
  try {
    // Test videos endpoint
    console.log('Fetching videos from http://localhost:3000/api/videos?limit=3...');
    const videosResult = await httpGet('http://localhost:3000/api/videos?limit=3');
    console.log('Response status:', videosResult.statusCode);
    console.log('Videos result:', JSON.stringify(videosResult.data, null, 2));
    
    // Test categories endpoint
    console.log('\nFetching categories from http://localhost:3000/api/categories...');
    const categoriesResult = await httpGet('http://localhost:3000/api/categories');
    console.log('Response status:', categoriesResult.statusCode);
    console.log('Categories result:', JSON.stringify(categoriesResult.data, null, 2));
    
    console.log('\nAPI connection test completed successfully!');
  } catch (error) {
    console.error('API connection test failed:', error);
  }
}

testApiConnection();
