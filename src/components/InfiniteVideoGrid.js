'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import VideoCard from './VideoCard';
import { fetchVideosClient } from '@/lib/api';

const VIDEOS_PER_PAGE = 50; // Base number of videos per page
const LOAD_AHEAD_THRESHOLD = 2; // Start loading when 2 videos before the end

const InfiniteVideoGrid = ({ 
  initialVideos = [], 
  category = null, 
  search = null, 
  sortBy = 'created_at', 
  order = 'desc'
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef();
  const loadingRef = useRef();

  const loadMoreVideos = useCallback(async (nextPage = page + 1, limit = VIDEOS_PER_PAGE) => {
    console.log('🔄 loadMoreVideos called:', { nextPage, limit, loadingMore, hasMore });
    
    if (loadingMore || !hasMore) {
      console.log('⏹️ Skipping loadMoreVideos:', { loadingMore, hasMore });
      return;
    }

    console.log('📥 Loading more videos...');
    setLoadingMore(true);
    setError(null);

    try {
      const params = {
        page: nextPage,
        limit: limit.toString(),
        sortBy,
        order
      };

      if (category && category !== 'All') {
        params.category = category;
      }

      if (search) {
        params.search = search;
      }

      console.log('📤 Fetching more videos with params:', params);
      const { videos: newVideos, pagination } = await fetchVideosClient(params);
      console.log('📦 Received more videos:', { count: newVideos?.length, pagination });
      
      if (newVideos && newVideos.length > 0) {
        setVideos(prev => {
          // Remove duplicates by ID
          const existingIds = new Set(prev.map(v => v.id));
          const uniqueNewVideos = newVideos.filter(v => !existingIds.has(v.id));
          const updatedVideos = [...prev, ...uniqueNewVideos];
          
          console.log('📊 Videos updated:', { 
            previous: prev.length, 
            new: uniqueNewVideos.length, 
            total: updatedVideos.length 
          });
          
          // If we still don't have enough videos and there are more, keep loading
          if (updatedVideos.length < 40 && pagination.hasMore) {
            console.log('🔄 Still need more videos, loading next page...');
            setTimeout(() => {
              loadMoreVideos(nextPage + 1, VIDEOS_PER_PAGE);
            }, 100);
          }
          
          return updatedVideos;
        });
        setPage(nextPage);
        setHasMore(pagination.hasMore);
      } else {
        console.log('❌ No more videos received');
        setHasMore(false);
      }
    } catch (err) {
      console.error('💥 Error loading more videos:', err);
      setError('Failed to load more videos');
    } finally {
      setLoadingMore(false);
      console.log('🏁 loadMoreVideos completed');
    }
  }, [category, search, sortBy, order, hasMore, loadingMore]);

  // Load initial videos when component mounts or filters change
  useEffect(() => {
    console.log('🔄 InfiniteVideoGrid useEffect triggered:', { category, search, sortBy, order });
    
    const loadInitialVideos = async () => {
      console.log('📥 Starting to load initial videos...');
      setLoading(true);
      setError(null);
      setVideos([]);
      setPage(1);
      setHasMore(true);

      try {
        const params = {
          page: 1,
          limit: VIDEOS_PER_PAGE.toString(),
          sortBy,
          order
        };

        if (category && category !== 'All') {
          params.category = category;
        }

        if (search) {
          params.search = search;
        }

        console.log('📤 Fetching videos with params:', params);
        const { videos: newVideos, pagination } = await fetchVideosClient(params);
        console.log('📦 Received videos:', { count: newVideos?.length, pagination });
        
        if (newVideos && newVideos.length > 0) {
          setVideos(newVideos);
          setTotalVideos(pagination.total);
          setHasMore(pagination.hasMore);
          console.log('✅ Videos set successfully:', { count: newVideos.length, total: pagination.total });
          
          // If we have less than 40 videos, immediately load more
          if (newVideos.length < 40 && pagination.hasMore) {
            console.log('🔄 Need more videos, loading page 2...');
            // Use setTimeout to avoid dependency issues
            setTimeout(() => {
              loadMoreVideos(2, VIDEOS_PER_PAGE);
            }, 100);
          }
        } else {
          console.log('❌ No videos received');
          setVideos([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error('💥 Error loading initial videos:', err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
        console.log('🏁 Initial video loading completed');
      }
    };

    loadInitialVideos();
  }, [category, search, sortBy, order]); // Removed loadMoreVideos dependency

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreVideos();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px' // Load when 200px before the end
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore]); // Removed loadMoreVideos and videos.length dependencies

  if (loading && videos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-400">Loading videos...</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😔</div>
        <p className="text-gray-400 text-xl mb-2">No videos found</p>
        <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Video Count Info */}
      {videos.length > 0 && (
        <div className="text-gray-400 mb-6">
          Showing {videos.length} of {totalVideos} videos
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
        {videos.map((video, index) => (
          <div 
            key={`${video.id}-${index}`} 
            className="opacity-0 animate-fadeIn"
            style={{ animationDelay: `${(index % VIDEOS_PER_PAGE) * 50}ms`, animationFillMode: 'forwards' }}
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      {/* Loading indicator and intersection target */}
      <div ref={loadingRef} className="py-8 text-center">
        {loading && (
          <div>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-400">Loading more videos...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => loadMoreVideos()}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!hasMore && !loading && videos.length > 0 && (
          <div className="text-center py-8">
            {videos.length >= totalVideos ? (
              <>
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-gray-400 text-lg mb-2">
                  You've reached the end! You've seen all {totalVideos} videos.
                </p>
                {(sortBy === 'random' || order === 'random') && (
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
                  >
                    🔄 Shuffle and Watch More
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">📺</div>
                <p className="text-gray-400 text-lg mb-2">
                  Showing {videos.length} of {totalVideos} videos
                </p>
                <button 
                  onClick={() => {
                    setHasMore(true);
                    loadMoreVideos();
                  }}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
                >
                  Load More Videos
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteVideoGrid;
