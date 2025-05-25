'use client';
import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, loading = false }) => {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-700"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="opacity-0 animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
