'use client';

import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoryFilter from '../components/CategoryFilter';
import VideoGrid from '../components/VideoGrid';
import TrendingVideos from '../components/TrendingVideos';
import VideoPlayerModal from '../components/VideoPlayerModal';
import NotificationSystem from '../components/NotificationSystem';
import SearchResults from '../components/SearchResults';
import Footer from '../components/Footer';
import { sampleVideos, featuredVideo, categories } from '../data/sampleData';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const filteredVideos = sampleVideos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVideoPlay = (video) => {
    console.log('Playing video:', video.title);
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <HeroSection 
        featuredVideo={featuredVideo} 
      />
      
      {/* Conditional Content Based on Search */}
      {searchTerm.trim() !== '' ? (
        <SearchResults 
          searchTerm={searchTerm}
          videos={filteredVideos}
          onVideoPlay={handleVideoPlay}
        />
      ) : (
        <>
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          <VideoGrid 
            videos={filteredVideos}
            selectedCategory={selectedCategory}
            onVideoPlay={handleVideoPlay}
          />
          
          <TrendingVideos 
            videos={sampleVideos}
            onVideoPlay={handleVideoPlay}
          />
        </>
      )}
      
      <Footer />

      {/* Video Player Modal */}
      <VideoPlayerModal 
        isOpen={isPlayerOpen}
        video={selectedVideo} 
        onClose={handleClosePlayer} 
      />

      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
}
