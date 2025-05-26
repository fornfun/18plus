'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Share2, Download, ThumbsUp, ThumbsDown, Clock, Eye, Star, Flag, Bookmark } from 'lucide-react';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import Footer from '@/components/Footer';
import { fetchVideoClient, fetchVideosClient } from '@/lib/api';

export const runtime = 'edge';

// Utility function to extract the correct TeraID from different formats
const extractTeraId = (id) => {
  // Case 1: Plain TeraID (alphanumeric string)
  if (/^[a-zA-Z0-9]+$/.test(id) && id.length >= 5) {
    console.log(`✅ Valid TeraID format: ${id}`);
    return id;
  }
  
  // Case 2: URL format (extract TeraID from it)
  if (id.includes('teraboxapp.com/s/') || id.includes('terabox.com/s/')) {
    const matches = id.match(/\/s\/([a-zA-Z0-9]+)/);
    if (matches && matches[1]) {
      console.log(`✅ Extracted TeraID from URL: ${matches[1]}`);
      return matches[1];
    }
  }
  
  // Case 3: Numeric ID (database ID) - can't extract TeraID directly
  if (/^\d+$/.test(id)) {
    console.log(`⚠️ Numeric ID detected: ${id}, will need to fetch TeraID from database`);
    return null;
  }
  
  console.log(`⚠️ Unknown ID format: ${id}`);
  return id; // Return as-is if we can't determine the format
};

const TeraBoxPlayer = ({ teraId, title }) => {
  // Enhanced player with better error handling and dynamic loading
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [playerSource, setPlayerSource] = useState('terabox');
  
  // Generate multiple player URLs to try if one fails
  const teraboxEmbedUrl = `https://player.terabox.tech/?url=https%3A%2F%2Fteraboxapp.com%2Fs%2F${teraId}`;
  const directTeraboxUrl = `https://teraboxapp.com/s/${teraId}`;
  const alternativeEmbedUrl = `https://www.4funbox.com/s/${teraId}`;
  
  useEffect(() => {
    // Reset states when teraId changes
    setPlayerLoaded(false);
    setPlayerError(false);
    
    // Verify if we have a valid teraId
    if (!teraId || teraId.length < 5) {
      console.error("❌ Invalid TeraID provided:", teraId);
      setPlayerError(true);
      return;
    }
    
    console.log(`🎬 Setting up TeraBox player for ID: ${teraId}`);
    
    // Add a timeout to detect if iframe fails to load
    const timeoutId = setTimeout(() => {
      if (!playerLoaded) {
        console.warn("⚠️ TeraBox player failed to load within timeout period");
        
        // Switch to alternative player source
        if (playerSource === 'terabox') {
          console.log("🔄 Trying alternative player source");
          setPlayerSource('alternative');
          
          // Reset timeout to give alternative a chance
          const altTimeoutId = setTimeout(() => {
            if (!playerLoaded) {
              setPlayerError(true);
            }
          }, 8000);
          
          return () => clearTimeout(altTimeoutId);
        } else {
          setPlayerError(true);
        }
      }
    }, 8000); // 8 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [teraId, playerSource]);
  
  const handleLoad = () => {
    console.log("✅ TeraBox player loaded successfully");
    setPlayerLoaded(true);
    setPlayerError(false);
  };
  
  const handleError = () => {
    console.error("❌ Error loading TeraBox player");
    if (playerSource === 'terabox') {
      // Try alternative source
      console.log("🔄 Switching to alternative player source after error");
      setPlayerSource('alternative');
    } else {
      setPlayerError(true);
    }
  };
  
  // Get current embed URL based on source
  const currentEmbedUrl = playerSource === 'terabox' ? teraboxEmbedUrl : alternativeEmbedUrl;
  
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
      {playerError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-xl mb-4">Player failed to load</p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <a 
              href={directTeraboxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-center"
            >
              Open on TeraBox
            </a>
            <a 
              href={alternativeEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-center"
            >
              Try Alternative Link
            </a>
          </div>
        </div>
      ) : (
        <>
          <iframe 
            src={currentEmbedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            scrolling="no"
            title={title}
            className="w-full h-full rounded-lg"
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
          {!playerLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-2"></div>
                <p className="text-white">Loading video player...</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const VideoPlayer = ({ videoUrl, poster }) => {
  const [quality, setQuality] = React.useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
  const [showSettings, setShowSettings] = React.useState(false);
  
  const qualities = ['4K', '1080p', '720p', '480p', '360p'];
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl group">
      <video
        controls
        poster={poster}
        className="w-full h-full"
        preload="metadata"
        controlsList="nodownload"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Custom overlay controls */}
      <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Quality and Settings */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-black/70 transition-colors pointer-events-auto"
            >
              ⚙️ Settings
            </button>
            
            {showSettings && (
              <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-48 pointer-events-auto">
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">Quality</label>
                    <div className="space-y-1">
                      {qualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => setQuality(q)}
                          className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                            quality === q ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {q} {q === '4K' && <span className="text-yellow-400">👑</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">Playback Speed</label>
                    <div className="space-y-1">
                      {speeds.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                            playbackSpeed === speed ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {speed}x {speed === 1 && '(Normal)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Quality indicator */}
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">
            {quality}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      setError(null);
      
      const loadVideo = async () => {
        try {
          // First, try to extract a valid TeraID from the URL parameter
          const extractedTeraId = extractTeraId(params.id);
          console.log(`🔍 Loading video details for ID: ${params.id} (Extracted TeraID: ${extractedTeraId || 'None'})`);
          
          // Always create a temporary TeraBox video object with the ID
          // This ensures we always have something to display even if the DB query fails
          let directTeraBoxVideo = null;
          
          // First check if the params.id itself is likely a TeraID
          if (/^[a-zA-Z0-9]+$/.test(params.id) && params.id.length >= 5 && !/^\d+$/.test(params.id)) {
            console.log(`🎬 Creating temporary TeraBox video player with direct TeraID: ${params.id}`);
            directTeraBoxVideo = {
              id: params.id,
              title: `TeraBox Video (${params.id})`,
              tera_id: params.id,
              poster: `https://teraboxapp.com/thumbnail/s/${params.id}.jpg`,
              description: 'Loading video details...',
              views: 0,
              likes: 0,
              dislikes: 0,
              created_at: new Date().toISOString()
            };
          } 
          // Then check if we extracted a different TeraID from the params
          else if (extractedTeraId && extractedTeraId !== params.id) {
            console.log(`🎬 Creating temporary TeraBox video player with extracted TeraID: ${extractedTeraId}`);
            directTeraBoxVideo = {
              id: extractedTeraId,
              title: `TeraBox Video (${extractedTeraId})`,
              tera_id: extractedTeraId,
              poster: `https://teraboxapp.com/thumbnail/s/${extractedTeraId}.jpg`,
              description: 'Loading video details...',
              views: 0,
              likes: 0,
              dislikes: 0,
              created_at: new Date().toISOString()
            };
          }
          
          // Try to fetch from API
          const { video: fetchedVideo, relatedVideos: related } = await fetchVideoClient(params.id);
          
          // Use either the fetched video or our temporary one
          const videoToUse = fetchedVideo || directTeraBoxVideo;
          
          if (videoToUse) {
            console.log(`✅ Video ready: ${videoToUse.title}`);
            setVideo(videoToUse);
            
            // If no related videos or less than minimum, fetch random videos
            if (!related || related.length < 20) {
              console.log(`⚠️ Insufficient related videos (${related?.length || 0}), fetching random videos`);
              
              try {
                const { videos: randomVideos } = await fetchVideosClient({
                  limit: '40',
                  random: 'true',
                  sortBy: 'random'
                });
                
                // Filter out the current video from random videos
                const filteredVideos = randomVideos.filter(v => v.id !== videoToUse.id);
                console.log(`✅ Fetched ${filteredVideos.length} random videos as alternatives`);
                setRelatedVideos(filteredVideos);
              } catch (randomError) {
                console.error('❌ Error fetching random videos:', randomError);
                // Still show the main video even if related videos fail
                setRelatedVideos([]);
              }
            } else {
              console.log(`✅ Using ${related.length} related videos`);
              setRelatedVideos(related);
            }

            // Increment view count - don't block the UI if this fails
            if (fetchedVideo && fetchedVideo.id) {
              fetch(`/api/videos/${fetchedVideo.id}/views`, { method: 'POST' })
                .catch(viewError => console.error('❌ Error updating view count:', viewError));
            }
            
          } else {
            console.warn(`⚠️ No video found with ID: ${params.id}`);
            setError('Video not found');
          }
        } catch (err) {
          console.error('❌ Error loading video:', err);
          setError(`Failed to load video: ${err.message || 'Unknown error'}`);
        } finally {
          setLoading(false);
        }
      };
      
      loadVideo();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-400 text-lg">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-gray-400 text-lg">{error || 'Video not found'}</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      
      // Optimistic update
      const oldLikes = video.likes || 0;
      const newLikes = action === 'like' ? oldLikes + 1 : Math.max(0, oldLikes - 1);
      setIsLiked(!isLiked);
      if (isDisliked) {
        setIsDisliked(false);
        setVideo(prev => ({ 
          ...prev, 
          likes: newLikes,
          dislikes: Math.max(0, (prev.dislikes || 0) - 1)
        }));
      } else {
        setVideo(prev => ({ ...prev, likes: newLikes }));
      }

      const response = await fetch(`/api/videos/${params.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setIsLiked(!isLiked);
        if (isDisliked) setIsDisliked(true);
        setVideo(prev => ({ ...prev, likes: oldLikes }));
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const action = isDisliked ? 'undislike' : 'dislike';
      
      // Optimistic update
      const oldDislikes = video.dislikes || 0;
      const newDislikes = action === 'dislike' ? oldDislikes + 1 : Math.max(0, oldDislikes - 1);
      setIsDisliked(!isDisliked);
      if (isLiked) {
        setIsLiked(false);
        setVideo(prev => ({ 
          ...prev, 
          dislikes: newDislikes,
          likes: Math.max(0, (prev.likes || 0) - 1)
        }));
      } else {
        setVideo(prev => ({ ...prev, dislikes: newDislikes }));
      }

      const response = await fetch(`/api/videos/${params.id}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setIsDisliked(!isDisliked);
        if (isLiked) setIsLiked(true);
        setVideo(prev => ({ ...prev, dislikes: oldDislikes }));
        throw new Error('Failed to update dislike');
      }
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const action = isBookmarked ? 'unbookmark' : 'bookmark';
      
      // Optimistic update
      const oldBookmarks = video.bookmarks || 0;
      const newBookmarks = action === 'bookmark' ? oldBookmarks + 1 : Math.max(0, oldBookmarks - 1);
      setIsBookmarked(!isBookmarked);
      setVideo(prev => ({ ...prev, bookmarks: newBookmarks }));

      const response = await fetch(`/api/videos/${params.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setIsBookmarked(!isBookmarked);
        setVideo(prev => ({ ...prev, bookmarks: oldBookmarks }));
        throw new Error('Failed to update bookmark');
      }
    } catch (error) {
      console.error('Error bookmarking video:', error);
    }
  };

  const handleFavorite = async () => {
    try {
      const action = isFavorited ? 'unfavorite' : 'favorite';
      
      // Optimistic update
      const oldFavorites = video.favorites || 0;
      const newFavorites = action === 'favorite' ? oldFavorites + 1 : Math.max(0, oldFavorites - 1);
      setIsFavorited(!isFavorited);
      setVideo(prev => ({ ...prev, favorites: newFavorites }));

      const response = await fetch(`/api/videos/${params.id}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setIsFavorited(!isFavorited);
        setVideo(prev => ({ ...prev, favorites: oldFavorites }));
        throw new Error('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error favoriting video:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description || `Check out this video: ${video.title}`,
        url: window.location.href
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Error copying to clipboard:', error));
    }
  };

  // Update the button onClick handlers
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-3">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-400 hover:text-orange-500 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to videos
            </button>

            {/* Video Player - More resilient with fallbacks */}
            {(() => {
              // Case 1: Video has a tera_id - use it directly
              if (video.tera_id) {
                return (
                  <TeraBoxPlayer 
                    teraId={video.tera_id}
                    title={video.title || 'Untitled Video'}
                  />
                );
              }
              
              // Case 2: The params.id itself might be a valid TeraID
              if (/^[a-zA-Z0-9]+$/.test(params.id) && params.id.length >= 5 && !/^\d+$/.test(params.id)) {
                return (
                  <TeraBoxPlayer 
                    teraId={params.id}
                    title={video.title || `TeraBox Video (${params.id})`}
                  />
                );
              }
              
              // Case 3: We can extract a TeraID from params
              const extractedId = extractTeraId(params.id);
              if (extractedId) {
                return (
                  <TeraBoxPlayer 
                    teraId={extractedId}
                    title={video.title || `TeraBox Video (${extractedId})`}
                  />
                );
              }
              
              // Case 4: Fallback to regular video player
              return (
                <VideoPlayer 
                  videoUrl={video.video_url || ''}
                  poster={video.poster || '/placeholder-video.jpg'} 
                />
              );
            })()}

            {/* Video Info */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {video.title || 'Untitled Video'}
                </h1>
                
                {video.tera_id && (
                  <div className="flex items-center space-x-3">
                    <a 
                      href={`https://teraboxapp.com/s/${video.tera_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>TeraBox</span>
                    </a>
                    <a 
                      href={`https://teraboxapp.com/s/${video.tera_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  </div>
                )}
              </div>
              
              {/* Stats Row */}
              <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center space-x-6 text-gray-300">
                  <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{video.views || 0}</span> views
                  </span>
                  <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 mr-2" />
                    {video.duration || 'N/A'}
                  </span>
                  <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
                    <ThumbsUp className="w-4 h-4 mr-2 fill-current text-green-500" />
                    <span className="font-semibold">{video.likes || 0}</span>
                  </span>
                  <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
                    <ThumbsDown className="w-4 h-4 mr-2 fill-current text-red-500" />
                    <span className="font-semibold">{video.dislikes || 0}</span>
                  </span>
                  <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
                    <Heart className="w-4 h-4 mr-2 fill-current text-pink-500" />
                    <span className="font-semibold">{video.favorites || 0}</span>
                  </span>
                  <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
                    <Bookmark className="w-4 h-4 mr-2 fill-current text-blue-500" />
                    <span className="font-semibold">{video.bookmarks || 0}</span>
                  </span>
                  <span className="text-gray-400">
                    {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'Recently added'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    HD
                  </span>
                  {video.published && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      VERIFIED
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isLiked ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-medium">Like</span>
                </button>
                
                <button
                  onClick={handleDislike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isDisliked ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="font-medium">Dislike</span>
                </button>
                
                <button
                  onClick={handleFavorite}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isFavorited ? 'bg-pink-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-pink-600 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span className="font-medium">Favorite</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isBookmarked ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Save</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-orange-600 hover:text-white rounded-lg transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-medium">Share</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-orange-600 hover:text-white rounded-lg transition-all duration-300">
                  <Download className="w-4 h-4" />
                  <span className="font-medium">Download</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300">
                  <Flag className="w-4 h-4" />
                  <span className="font-medium">Report</span>
                </button>
              </div>

              {/* Category and Tags */}
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400 text-sm">Category: </span>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {video.category || 'General'}
                  </span>
                </div>
                
                {video.description && (
                  <div>
                    <span className="text-gray-400 text-sm mb-2 block">Description:</span>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                )}
                
                {video.tags && (
                  <div>
                    <span className="text-gray-400 text-sm mb-2 block">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {(typeof video.tags === 'string' ? JSON.parse(video.tags) : video.tags)?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-orange-500 hover:text-white cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      )) || (
                        <span className="text-gray-500 text-sm">No tags available</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-orange-500">Related Videos</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {relatedVideos.slice(0, 6).map((relatedVideo) => (
                  <div key={relatedVideo.id} className="block">
                    <VideoCard video={relatedVideo} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* More Videos Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            <span className="text-orange-500">More Videos</span> You Might Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {relatedVideos.slice(6).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
