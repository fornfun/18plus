'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp, Clock, Eye, MoreVertical } from 'lucide-react';

const VideoCard = ({ video, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);

  return (
    <motion.div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay && onPlay(video)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-800 aspect-video mb-4 shadow-xl">
        <motion.img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Duration Badge */}
        <motion.div 
          className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Clock className="w-3 h-3" />
          <span>{video.duration}</span>
        </motion.div>

        {/* Category Badge */}
        <motion.div 
          className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-600 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {video.category}
        </motion.div>

        {/* Views Badge */}
        <motion.div 
          className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white flex items-center space-x-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Eye className="w-3 h-3" />
          <span>{video.views}</span>
        </motion.div>

        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className="w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="absolute top-3 right-3 flex flex-col space-y-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -10
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.button 
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ThumbsUp className="w-4 h-4" />
          </motion.button>
          
          <motion.button 
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
              isInList ? 'bg-green-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsInList(!isInList);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className={`w-4 h-4 transition-transform duration-300 ${isInList ? 'rotate-45' : ''}`} />
          </motion.button>
          
          <motion.button 
            className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Video Info Section */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h3 
          className="font-semibold text-lg text-white group-hover:text-red-400 transition-colors duration-300 line-clamp-2 leading-tight"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {video.title}
        </motion.h3>
        
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ring-2 ring-transparent group-hover:ring-blue-400/50 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-xs font-bold">
              {video.channel?.charAt(0) || 'V'}
            </span>
          </motion.div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
              {video.channel}
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-between text-gray-500 text-sm"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{video.views}</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{video.uploadDate}</span>
            </span>
          </div>
          <motion.div 
            className="flex items-center space-x-1"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.div>
            <span className="text-white text-sm font-medium">4.8</span>
          </motion.div>
        </motion.div>

        {/* Progress Bar (if video has been watched) */}
        {video.watchProgress && (
          <motion.div 
            className="w-full bg-gray-700 rounded-full h-1 overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${video.watchProgress}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VideoCard;
