'use client';
import React, { useState } from 'react';
import { Play, Clock, Eye, Star, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const VideoCard = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality
  };

  // Determine the URL to use - prefer tera_id if available, fallback to numeric id
  const videoUrl = video.tera_id ? `/watch/${video.tera_id}` : `/watch/${video.id}`;

  return (
    <Link href={videoUrl} className="group block">
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105 hover:shadow-xl">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-700">
          <Image
            src={video.poster || video.thumbnail || '/placeholder-video.jpg'}
            alt={video.title || 'Video'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Duration overlay */}
          <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded font-medium">
            {video.duration || 'N/A'}
          </div>
          
          {/* Quality badge */}
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">
            HD
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-orange-500 rounded-full p-4 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/70'} hover:bg-red-500 transition-colors`}
            >
              <Heart className={`w-4 h-4 text-white ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/70 hover:bg-orange-500 transition-colors"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        {/* Video info */}
        <div className="p-3">
          <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors leading-tight">
            {video.title || 'Untitled Video'}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {video.views || 0}
              </span>
              <span className="flex items-center">
                <Heart className="w-3 h-3 mr-1 fill-current text-red-500" />
                {video.likes || 0}
              </span>
            </div>
            <span className="text-gray-500">
              {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'New'}
            </span>
          </div>

          {/* Category badge */}
          <div className="mb-2">
            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full border border-orange-500/30">
              {video.category || 'General'}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {(() => {
              let tags = [];
              try {
                tags = video.tags ? (typeof video.tags === 'string' ? JSON.parse(video.tags) : video.tags) : [];
              } catch (e) {
                tags = [];
              }
              
              return (
                <>
                  {tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                  {tags.length > 2 && (
                    <span className="text-gray-500 text-xs px-1">
                      +{tags.length - 2} more
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
