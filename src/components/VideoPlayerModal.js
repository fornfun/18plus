'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, Settings, 
  Heart, Share, Download, MoreHorizontal, ThumbsUp, ThumbsDown,
  SkipBack, SkipForward, Rewind, FastForward, Minimize, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

const VideoPlayerModal = ({ isOpen, onClose, video, embedded = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [isBuffering, setIsBuffering] = useState(false);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities = ['4K', '1080p', '720p', '480p', '360p', 'Auto'];
  
  const handleKeyPress = useCallback((e) => {
    switch(e.key.toLowerCase()) {
      case ' ':
      case 'k':
        togglePlay();
        e.preventDefault();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'm':
        toggleMute();
        break;
      case 'arrowleft':
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
        break;
      case 'arrowright':
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
        }
        break;
      default:
        break;
    }
  }, [duration]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!embedded && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, embedded]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && playerRef.current) {
      try {
        if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen();
        } else if (playerRef.current.webkitRequestFullscreen) {
          await playerRef.current.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error('Failed to enter fullscreen:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleProgressChange = (e) => {
    setCurrentTime(e.target.value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const handleQualityChange = (quality) => {
    setQuality(quality);
    setShowSettings(false);
  };

  const PlayerContent = () => (
    <div 
      ref={playerRef}
      className={`relative ${
        embedded ? 'w-full h-full' : 'w-full max-w-6xl h-full max-h-[90vh]'
      } bg-black rounded-2xl overflow-hidden shadow-2xl`}
      onClick={(e) => e.stopPropagation()}
      onMouseMove={handleMouseMove}
    >
      {/* Player Area */}
      <div className="relative w-full h-full">
        <div className="relative w-full h-full">
          <Image
            src={video.thumbnail}
            alt={video.title}
            layout="fill"
            objectFit="cover"
            priority
            loading="eager"
          />
        </div>
      </div>

      {/* Video Controls Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 50 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
            
            <button className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
              <Rewind className="w-5 h-5 text-white" />
            </button>
            
            <button className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
              <FastForward className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center">
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
            >
              <Settings className={`w-5 h-5 text-white ${showSettings ? 'text-red-500' : ''}`} />
            </button>
            <button 
              onClick={toggleFullscreen}
              className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Settings Menu */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 right-4 bg-black/90 rounded-xl p-4 backdrop-blur-sm min-w-[200px]"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm mb-2">Playback Speed</p>
                  <div className="space-y-1">
                    {speeds.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors ${
                          playbackSpeed === speed ? 'text-red-500' : 'text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-2">Quality</p>
                  <div className="space-y-1">
                    {qualities.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQualityChange(q)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors ${
                          quality === q ? 'text-red-500' : 'text-white'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  if (embedded) {
    return <PlayerContent />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            onMouseMove={handleMouseMove}
            ref={playerRef}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: showControls ? 1 : 0 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Video Player Area */}
            <div className="relative w-full h-2/3 bg-black">
              {/* Mock Video Display */}
              <div className="relative w-full h-full">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Play/Pause Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: showControls && !isPlaying ? 1 : 0, scale: showControls && !isPlaying ? 1 : 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-20 h-20 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Video Controls */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 50 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </button>
                    
                    <button className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                      <Rewind className="w-5 h-5 text-white" />
                    </button>
                    
                    <button className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                      <FastForward className="w-5 h-5 text-white" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center">
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Settings className={`w-5 h-5 text-white ${showSettings ? 'text-red-500' : ''}`} />
                    </button>
                    <button 
                      onClick={toggleFullscreen} 
                      className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5 text-white" />
                      ) : (
                        <Maximize className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Settings Menu */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-20 right-4 bg-black/90 rounded-xl p-4 backdrop-blur-sm min-w-[200px]"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/70 text-sm mb-2">Playback Speed</p>
                          <div className="space-y-1">
                            {speeds.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors ${
                                  playbackSpeed === speed ? 'text-red-500' : 'text-white'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-white/70 text-sm mb-2">Quality</p>
                          <div className="space-y-1">
                            {qualities.map((q) => (
                              <button
                                key={q}
                                onClick={() => handleQualityChange(q)}
                                className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors ${
                                  quality === q ? 'text-red-500' : 'text-white'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Video Info Section */}
            <div className="h-1/3 p-6 bg-gray-900 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Details */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-3">{video.title}</h2>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{video.uploadDate}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          isLiked ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span>1.2K</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDislike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          isDisliked ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <ThumbsDown className="w-5 h-5" />
                      </motion.button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-all duration-300">
                        <Share className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-all duration-300">
                        <Download className="w-5 h-5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {video.channel?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{video.channel}</h3>
                        <p className="text-gray-400 text-sm">2.5M subscribers</p>
                      </div>
                      <button className="ml-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors">
                        Subscribe
                      </button>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {video.description || "Experience amazing content that will captivate your imagination and take you on an incredible journey. This video features stunning visuals and compelling storytelling that you won't want to miss."}
                    </p>
                  </div>
                </div>

                {/* Suggested Videos */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-white mb-4">Up Next</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                        <div className="w-24 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                          <img
                            src={`https://images.unsplash.com/photo-${1614728894747 + i}?w=200&h=120&fit=crop`}
                            alt={`Suggested video ${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">
                            Amazing Video Title {i}
                          </h4>
                          <p className="text-gray-400 text-xs">Channel Name</p>
                          <p className="text-gray-400 text-xs">1.5M views • 2 days ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayerModal;
