'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Play, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const TrendingVideos = ({ videos, onVideoPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trendingVideos = videos.slice(0, 6); // Get top 6 trending videos

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, trendingVideos.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, trendingVideos.length - 2)) % Math.max(1, trendingVideos.length - 2));
  };

  const handleVideoClick = (video) => {
    if (onVideoPlay) {
      onVideoPlay(video);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Trending Now</h2>
              <p className="text-gray-400">What&apos;s hot this week</p>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 group"
            >
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </motion.div>

        {/* Trending Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Trending Video */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {trendingVideos[0] && (
              <div 
                className="relative group cursor-pointer"
                onClick={() => handleVideoClick(trendingVideos[0])}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={trendingVideos[0].thumbnail}
                    alt={trendingVideos[0].title}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Play Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={() => handleVideoClick(trendingVideos[0])}
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.div>

                  {/* Trending Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-semibold">#1 Trending</span>
                  </div>

                  {/* Video Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {trendingVideos[0].title}
                    </h3>
                    <div className="flex items-center space-x-4 text-gray-300 text-sm">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{trendingVideos[0].views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{trendingVideos[0].duration}</span>
                      </div>
                      <span>{trendingVideos[0].channel}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Trending List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {trendingVideos.slice(1, 6).map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-300 group"
                onClick={() => handleVideoClick(video)}
              >
                {/* Rank Number */}
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">#{index + 2}</span>
                </div>

                {/* Thumbnail */}
                <div className="relative w-20 h-14 overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-gray-400 text-xs mt-1">
                    <span>{video.channel}</span>
                    <span>•</span>
                    <span>{video.views}</span>
                  </div>
                </div>

                {/* Play Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-5 h-5 text-red-500" />
                </div>
              </motion.div>
            ))}

            {/* View All Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 rounded-xl transition-all duration-300"
            >
              View All Trending
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-8 md:hidden">
          {Array.from({ length: Math.max(1, trendingVideos.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                currentIndex === index ? 'bg-red-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingVideos;
