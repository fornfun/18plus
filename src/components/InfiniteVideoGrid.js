'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import VideoCard from './VideoCard';
import { fetchVideosClient } from '@/lib/api';

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
  const observerRef = useRef();
  const loadingRef = useRef();

  // Load initial videos when component mounts or filters change
  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoading(true);
      setError(null);
      setVideos([]);
      setPage(1);
      setHasMore(true);

      try {
        const params = {
          page: 1,
          limit: '24',
          sortBy,
          order
        };

        if (category && category !== 'All') {
          params.category = category;
        }

        if (search) {
          params.search = search;
        }

        const { videos: newVideos, pagination } = await fetchVideosClient(params);
        
        if (newVideos && newVideos.length > 0) {
          setVideos(newVideos);
          setHasMore(pagination.pages > 1);
        } else {
          setVideos([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error loading initial videos:', err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    loadInitialVideos();
  }, [category, search, sortBy, order]);

  const loadMoreVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const params = {
        page: nextPage,
        limit: '24',
        sortBy,
        order
      };

      if (category && category !== 'All') {
        params.category = category;
      }

      if (search) {
        params.search = search;
      }

      const { videos: newVideos, pagination } = await fetchVideosClient(params);
      
      if (newVideos && newVideos.length > 0) {
        setVideos(prev => [...prev, ...newVideos]);
        setPage(nextPage);
        setHasMore(nextPage < pagination.pages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more videos:', err);
      setError('Failed to load more videos');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, category, search, sortBy, order]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreVideos();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px' // Load before user reaches the bottom
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
  }, [loadMoreVideos, hasMore, loading]);

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
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
        {videos.map((video, index) => (
          <div 
            key={`${video.id}-${index}`} 
            className="opacity-0 animate-fadeIn"
            style={{ animationDelay: `${(index % 24) * 50}ms`, animationFillMode: 'forwards' }}
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
              onClick={loadMoreVideos}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!hasMore && !loading && videos.length > 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg mb-2">You&apos;ve reached the end!</p>
            <p className="text-gray-500 text-sm">
              {sortBy === 'random' ? 'Want more? Refresh for new random videos!' : 'That&apos;s all the videos we have for now.'}
            </p>
            {sortBy === 'random' && (
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
              >
                🔄 Shuffle More Videos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteVideoGrid;
