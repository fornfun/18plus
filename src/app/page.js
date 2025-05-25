'use client';

import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoryFilter from '../components/CategoryFilter';
import VideoGrid from '../components/VideoGrid';
import TrendingVideos from '../components/TrendingVideos';
import Footer from '../components/Footer';
import { sampleVideos, featuredVideo, categories } from '../data/sampleData';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVideos = sampleVideos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVideoPlay = (video) => {
    console.log('Playing video:', video.title);
    // Implement video playback logic here
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
      />
      
      <Footer />
    </div>
  );
}
         