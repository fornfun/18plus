'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Share2, Download, ThumbsUp, ThumbsDown, Clock, Eye, Star, Flag, Bookmark } from 'lucide-react';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import Footer from '@/components/Footer';
import { fetchVideoClient } from '@/lib/api';

const TeraBoxPlayer = ({ teraId, title }) => {
  const embedUrl = `https://player.terabox.tech/?url=https%3A%2F%2Fteraboxapp.com%2Fs%2F${teraId}`;
  
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
      <iframe 
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        title={title}
        className="w-full h-full rounded-lg"
      />
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
          const { video: fetchedVideo, relatedVideos: related } = await fetchVideoClient(params.id);
          
          if (fetchedVideo) {
            setVideo(fetchedVideo);
            setRelatedVideos(related || []);
          } else {
            setError('Video not found');
          }
        } catch (err) {
          console.error('Error loading video:', err);
          setError('Failed to load video');
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

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

            {/* Video Player */}
            {video.tera_id ? (
              <TeraBoxPlayer 
                teraId={video.tera_id}
                title={video.title || 'Untitled Video'}
              />
            ) : (
              <VideoPlayer 
                videoUrl={`https://teraboxapp.com/s/${video.tera_id}`} 
                poster={video.poster || '/placeholder-video.jpg'} 
              />
            )}

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
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isFavorited ? 'bg-pink-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-pink-600 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span className="font-medium">Favorite</span>
                </button>
                
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isBookmarked ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Save</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-orange-600 hover:text-white rounded-lg transition-all duration-300">
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
