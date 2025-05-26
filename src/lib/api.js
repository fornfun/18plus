// API utility functions for fetching video data

// Use the actual production URL for API calls
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://18plus.pages.dev' 
  : 'http://localhost:3000';

// Fallback values to use if we're in Cloudflare Pages
const CLOUDFLARE_ENABLED = typeof globalThis.caches !== 'undefined';

// Helper function to fetch metadata if missing
async function fetchMetadata(teraId) {
  try {
    // First try the metadata service
    const response = await fetch(`https://get-metadata.shraj.workers.dev/?url=https://teraboxapp.com/s/${teraId}`);
    if (!response.ok) {
      // If that fails, try direct OG image fetch
      return await fetchTeraboxOgImage(teraId);
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
    
    return {
      title: cleanTitle,
      poster: data.image || null
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    // Try fallback method
    return await fetchTeraboxOgImage(teraId);
  }
}

// New function to directly fetch OG image from teraboxapp.com
async function fetchTeraboxOgImage(teraId) {
  try {
    console.log(`🖼️ Fetching OG image for teraId: ${teraId}`);
    const teraboxUrl = `https://teraboxapp.com/s/${teraId}`;
    
    // Use a CORS proxy or server-side API for production
    const proxyUrl = 'https://corsproxy.io/?';
    const response = await fetch(proxyUrl + encodeURIComponent(teraboxUrl), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch terabox page: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    
    // Extract title using regex
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1] : '';
    title = title.replace(/\s*-\s*TeraBox.*$/i, '').trim();
    
    // Extract OG image using regex
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const poster = ogImageMatch ? ogImageMatch[1] : null;
    
    console.log(`📸 Extracted OG image: ${poster ? poster.substring(0, 30) + '...' : 'none found'}`);
    
    return {
      title: title || null,
      poster: poster || null
    };
  } catch (error) {
    console.error('Error fetching terabox OG image:', error);
    return null;
  }
}

// Helper function to process video data
async function processVideoData(video) {
  let processedVideo = { ...video };

  // Always try to fetch poster if we have tera_id, even if just ensuring it's valid
  if (video.tera_id) {
    console.log(`🔍 Processing video ${video.id} with tera_id ${video.tera_id}`);
    
    // We should fetch metadata in these cases:
    // 1. Missing title
    // 2. Missing poster
    // 3. Poster URL exists but might be invalid (doesn't have teraboxapp.com in it)
    const needsMetadata = !video.title || 
                         !video.poster || 
                         (video.poster && !video.poster.includes('teraboxapp.com'));
    
    if (needsMetadata) {
      console.log(`📡 Fetching metadata for video ${video.id} (${video.tera_id})`);
      const metadata = await fetchMetadata(video.tera_id);
      
      if (metadata) {
        // Update the processed video
        if (!video.title && metadata.title) {
          processedVideo.title = metadata.title;
          console.log(`📝 Updated title for video ${video.id}: ${metadata.title}`);
        }
        
        if ((!video.poster || !video.poster.includes('teraboxapp.com')) && metadata.poster) {
          processedVideo.poster = metadata.poster;
          console.log(`🖼️ Updated poster for video ${video.id}: ${metadata.poster.substring(0, 30)}...`);
        }
        
        // Update in database asynchronously
      try {
        await fetch(`/api/videos/${video.id}/metadata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: processedVideo.title,
            poster: processedVideo.poster
          }),
        });
      } catch (error) {
        console.error('Error updating video metadata:', error);
      }
    }
  }
  
  // Ensure we have fallback values
  processedVideo.title = processedVideo.title || `Video ${video.id}`;
  processedVideo.poster = processedVideo.poster || '/placeholder-video.jpg';
  processedVideo.duration = processedVideo.duration || '00:00';
  processedVideo.views = processedVideo.views || 0;
  processedVideo.likes = processedVideo.likes || 0;
  processedVideo.dislikes = processedVideo.dislikes || 0;
  processedVideo.favorites = processedVideo.favorites || 0;
  processedVideo.bookmarks = processedVideo.bookmarks || 0;
  processedVideo.thumbnail = processedVideo.poster;
  processedVideo.uploadDate = new Date(processedVideo.created_at).toLocaleDateString();
  
  // Parse tags if they exist
  if (processedVideo.tags) {
    try {
      processedVideo.tags = JSON.parse(processedVideo.tags);
    } catch {
      processedVideo.tags = [];
    }
  } else {
    processedVideo.tags = [];
  }
  
  return processedVideo;
}
}

export async function fetchVideos({ 
  page = 1, 
  limit = 20, 
  category = null, 
  search = null, 
  sortBy = 'created_at', 
  order = 'desc' 
} = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      order
    });
    
    if (category && category !== 'All') {
      params.append('category', category);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    // Use relative URL in browser environment, API_BASE_URL otherwise
    const url = typeof window !== 'undefined' 
      ? `/api/videos?${params}` 
      : `${API_BASE_URL}/api/videos?${params}`;
      
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], pagination: { page: 1, limit, total: 0, pages: 0 } };
  }
}

export async function fetchVideo(id) {
  try {
    // Use relative URL in browser environment, API_BASE_URL otherwise
    const url = typeof window !== 'undefined' 
      ? `/api/videos/${id}` 
      : `${API_BASE_URL}/api/videos/${id}`;
      
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    return { video: null };
  }
}

export async function fetchCategories() {
  try {
    // Use relative URL in browser environment, API_BASE_URL otherwise
    const url = typeof window !== 'undefined' 
      ? `/api/categories` 
      : `${API_BASE_URL}/api/categories`;
      
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: ['All'] };
  }
}

// Client-side only functions
export async function fetchVideosClient(params = {}) {
  try {
    const queryParams = new URLSearchParams(params);
    
    // Determine if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';
    
    // Use relative URL in browser, absolute URL in Node.js scripts
    const url = isBrowser 
      ? `/api/videos?${queryParams}` 
      : `${API_BASE_URL}/api/videos?${queryParams}`;
      
    console.log('🔄 Fetching videos from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      // Get more details about the error
      let errorDetails = '';
      try {
        const errorResponse = await response.text();
        errorDetails = ` - ${errorResponse}`;
      } catch {}
      
      throw new Error(`Failed to fetch videos (${response.status})${errorDetails}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched videos: ${data.videos?.length || 0} items`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching videos:', error.message);
    return { videos: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
}

export async function fetchCategoriesClient() {
  try {
    // Determine if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';
    
    // Use relative URL in browser, absolute URL in Node.js scripts
    const url = isBrowser 
      ? '/api/categories' 
      : `${API_BASE_URL}/api/categories`;
      
    console.log('🔄 Fetching categories from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      // Get more details about the error
      let errorDetails = '';
      try {
        const errorResponse = await response.text();
        errorDetails = ` - ${errorResponse}`;
      } catch {}
      
      throw new Error(`Failed to fetch categories (${response.status})${errorDetails}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched categories: ${data.categories?.length || 0} items`);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: ['All'] };
  }
}

export async function fetchVideoClient(id) {
  try {
    console.log(`🎬 Fetching video ${id}`);
    
    // Extract TeraID if possible
    const extractTeraId = (id) => {
      // Case 1: Plain TeraID (alphanumeric string)
      if (/^[a-zA-Z0-9]+$/.test(id) && id.length >= 5 && !/^\d+$/.test(id)) {
        console.log(`✅ Valid TeraID format: ${id}`);
        return id;
      }
      
      // Case 2: URL format (extract TeraID from it)
      if (id.includes('teraboxapp.com/s/') || id.includes('terabox.com/s/')) {
        const matches = id.match(/\/s\/([a-zA-Z0-9]+)/);
        if (matches && matches[1]) {
          console.log(`✅ Extracted TeraID from URL: ${matches[1]}`);
          return matches[1];
        }
      }
      
      return null;
    };
    
    // Try to extract TeraID from the ID
    const teraId = extractTeraId(id);
    
    let directTeraBoxData = null;
    if (teraId) {
      console.log(`🔍 ID appears to be/contain a direct TeraBox ID: ${teraId}`);
      try {
        // Try to fetch metadata for this TeraBox ID directly
        const metadataResponse = await fetch(`https://get-metadata.shraj.workers.dev/?url=https://teraboxapp.com/s/${teraId}`);
        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json();
          console.log(`✅ Successfully fetched TeraBox metadata directly for ${teraId}`);
          
          directTeraBoxData = {
            id: teraId,
            tera_id: teraId,
            title: metadata.title || `TeraBox Video (${teraId})`,
            poster: metadata.og_image || metadata.image || `https://teraboxapp.com/thumbnail/s/${teraId}.jpg`,
            description: 'TeraBox Video',
            views: 0,
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString()
          };
        } else {
          // Even if metadata fails, still create a basic video object
          directTeraBoxData = {
            id: teraId,
            tera_id: teraId,
            title: `TeraBox Video (${teraId})`,
            poster: `https://teraboxapp.com/thumbnail/s/${teraId}.jpg`,
            description: 'TeraBox Video',
            views: 0,
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString()
          };
        }
      } catch (metadataError) {
        console.warn(`⚠️ Failed to fetch TeraBox metadata directly: ${metadataError.message}`);
        // Still create a fallback video object
        directTeraBoxData = {
          id: teraId,
          tera_id: teraId,
          title: `TeraBox Video (${teraId})`,
          poster: `https://teraboxapp.com/thumbnail/s/${teraId}.jpg`,
          description: 'TeraBox Video',
          views: 0,
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString()
        };
      }
    }
    
    // Always try to fetch from our API first
    console.log(`🔄 Trying API fetch for ID: ${id}`);
    const response = await fetch(`/api/videos/${id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorResponse = await response.text();
        errorDetails = ` - ${errorResponse}`;
      } catch {}
      
      console.warn(`⚠️ API request failed: ${response.status}${errorDetails}`);
      
      // Return our directly fetched data if available, otherwise throw
      if (directTeraBoxData) {
        console.log(`🔄 Using directly fetched TeraBox data as fallback after API failure`);
        return { 
          video: directTeraBoxData, 
          relatedVideos: [] 
        };
      }
      
      // If we have a teraId but no directTeraBoxData (which shouldn't happen due to our logic above)
      // Create a video object anyway as ultimate fallback
      if (teraId) {
        console.log(`🔄 Creating ultimate fallback TeraBox video for ${teraId}`);
        const ultimateFallbackVideo = {
          id: teraId,
          tera_id: teraId,
          title: `TeraBox Video (${teraId})`,
          poster: `https://teraboxapp.com/thumbnail/s/${teraId}.jpg`,
          description: 'TeraBox Video',
          views: 0,
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString()
        };
        
        return { 
          video: ultimateFallbackVideo, 
          relatedVideos: [] 
        };
      }
      
      throw new Error(`Failed to fetch video (${response.status})${errorDetails}`);
    }
    
    const data = await response.json();
    console.log(`📺 Video data received:`, data.video ? `ID: ${data.video.id}, Title: ${data.video.title?.substring(0, 30) || 'No title'}...` : 'No video data');
    
    if (data.video) {
      // Process the video data to ensure metadata
      const processedVideo = await processVideoData(data.video);
      data.video = processedVideo;
      console.log(`🔄 Processed video data - Poster: ${processedVideo.poster ? 'Found' : 'Missing'}, TeraID: ${processedVideo.tera_id || 'Missing'}`);
    } else if (directTeraBoxData) {
      // Use our directly fetched data as fallback
      console.log(`🔄 Using directly fetched TeraBox data as fallback (API returned no video)`);
      data.video = directTeraBoxData;
    } else if (teraId) {
      // Ultimate fallback - create a basic video object with the teraId
      console.log(`🔄 Creating ultimate fallback TeraBox video for ${teraId}`);
      data.video = {
        id: teraId,
        tera_id: teraId,
        title: `TeraBox Video (${teraId})`,
        poster: `https://teraboxapp.com/thumbnail/s/${teraId}.jpg`,
        description: 'TeraBox Video',
        views: 0,
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString()
      };
    } else {
      console.warn(`⚠️ No video data found for ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching video:', error);
    return { video: null, relatedVideos: [] };
  }
}
