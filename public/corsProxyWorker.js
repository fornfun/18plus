// This is a service worker that can help bypass CORS issues in development
// It will proxy requests to terabox domains through a CORS proxy

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Only handle requests to terabox domains
  if (url.hostname.includes('terabox') || url.hostname.includes('4funbox')) {
    console.log('📦 TeraBox proxy intercepting request:', url.toString());
    
    // Create a new request with CORS headers
    const modifiedRequest = new Request(event.request, {
      headers: {
        'Origin': self.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      mode: 'cors'
    });
    
    // Try direct request first
    event.respondWith(
      fetch(modifiedRequest)
        .catch(error => {
          console.warn('📦 Direct request failed, trying CORS proxy:', error);
          
          // If direct request fails, try CORS proxy
          const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url.toString());
          return fetch(proxyUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
        })
    );
  }
});

// Log when the service worker is installed
self.addEventListener('install', event => {
  console.log('📦 TeraBox CORS proxy service worker installed');
  self.skipWaiting(); // Activate worker immediately
});

// Log when the service worker is activated
self.addEventListener('activate', event => {
  console.log('📦 TeraBox CORS proxy service worker activated');
  event.waitUntil(self.clients.claim()); // Take control of all clients
});
