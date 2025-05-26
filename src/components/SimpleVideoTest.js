'use client';
import React, { useState, useEffect } from 'react';
import { fetchVideosClient } from '@/lib/api';

const SimpleVideoTest = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        console.log('🔄 SimpleVideoTest: Loading videos...');
        const result = await fetchVideosClient({
          page: '1',
          limit: '10',
          sortBy: 'created_at',
          order: 'desc'
        });
        
        console.log('📦 SimpleVideoTest: Result:', result);
        
        if (result.videos) {
          setVideos(result.videos);
          console.log('✅ SimpleVideoTest: Videos loaded:', result.videos.length);
        } else {
          console.log('❌ SimpleVideoTest: No videos in result');
        }
      } catch (err) {
        console.error('💥 SimpleVideoTest: Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (loading) {
    return <div className="text-white text-center p-8">Loading simple test...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  return (
    <div className="text-white p-8">
      <h2 className="text-2xl mb-4">Simple Video Test</h2>
      <p className="mb-4">Found {videos.length} videos:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div key={video.id} className="bg-gray-800 p-4 rounded">
            <h3 className="text-lg font-bold mb-2">{video.title}</h3>
            <p className="text-sm text-gray-400">ID: {video.id}</p>
            <p className="text-sm text-gray-400">Views: {video.views}</p>
            {video.poster && (
              <img 
                src={video.poster} 
                alt={video.title}
                className="w-full h-32 object-cover mt-2 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleVideoTest;
