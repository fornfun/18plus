// API utility functions for fetching video data

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : 'http://localhost:3001';

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
    
    const response = await fetch(`${API_BASE_URL}/api/videos?${params}`);
    
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
    const response = await fetch(`${API_BASE_URL}/api/videos/${id}`);
    
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
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    
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
    const response = await fetch(`/api/videos?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
}

export async function fetchCategoriesClient() {
  try {
    const response = await fetch('/api/categories');
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: ['All'] };
  }
}

export async function fetchVideoClient(id) {
  try {
    const response = await fetch(`/api/videos/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    return { video: null, relatedVideos: [] };
  }
}
