'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Filter, SortAsc } from 'lucide-react';
import { useState } from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, selectedCategory, onVideoPlay }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'popular', 'duration'

  const handleVideoPlay = (video) => {
    console.log('Playing video:', video.title);
    if (onVideoPlay) {
      onVideoPlay(video);
    }
  };

  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return parseInt(b.views.replace(/[^\d]/g, '')) - parseInt(a.views.replace(/[^\d]/g, ''));
      case 'duration':
        const getDurationMinutes = (duration) => {
          const parts = duration.split(':');
          return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        };
        return getDurationMinutes(b.duration) - getDurationMinutes(a.duration);
      default: // newest
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="px-6 md:px-12 pb-16 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-2">
            {selectedCategory === 'All' ? 'Recommended for You' : selectedCategory}
          </h2>
          <p className="text-gray-400">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} available
          </p>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 appearance-none pr-8"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="duration">Duration</option>
            </select>
            <SortAsc className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-800/80 backdrop-blur-sm rounded-xl p-1">
            <motion.button
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid className="w-5 h-5" />
            </motion.button>
            <motion.button
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {videos.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-2xl">
              <Filter className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No videos found</h3>
            <p className="text-gray-400 text-lg">Try adjusting your search or category filter</p>
          </motion.div>
        ) : (
          <motion.div 
            className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8" 
                : "space-y-6"
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${selectedCategory}-${sortBy}-${viewMode}`}
          >
            {sortedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <VideoCard
                  video={video}
                  onPlay={handleVideoPlay}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoGrid;