'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import VideoGrid from '@/components/VideoGrid';
import Footer from '@/components/Footer';
import { sampleVideos, categories, featuredCreators } from '@/data/sampleVideos';
import VideoCard from '@/components/VideoCard';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState(sampleVideos);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredVideos(sampleVideos);
    } else {
      setFilteredVideos(sampleVideos.filter(video => video.category === category));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-orange-500">18</span>
              <span className="text-white">Plus</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">Premium Adult Entertainment</p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
              <span>🔥 Hot & Fresh</span>
              <span>📱 Mobile Friendly</span>
              <span>🎬 HD Quality</span>
              <span>⚡ Fast Streaming</span>
            </div>
          </div>
        </div>
      </section>

      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Main content */}
      <main className="bg-gray-900">
        {/* Featured Videos Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedCategory === 'All' ? '🔥 Hot Videos' : `${selectedCategory} Videos`}
              </h2>
              <div className="text-sm text-gray-400">
                {filteredVideos.length} videos found
              </div>
            </div>
          </div>
          <VideoGrid videos={filteredVideos} />
        </section>

        {/* Popular Categories */}
        <section className="py-12 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.filter(cat => cat !== 'All').map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className="bg-gray-700 hover:bg-orange-500 transition-colors duration-300 rounded-lg p-4 text-center group"
                >
                  <div className="text-2xl mb-2">🎬</div>
                  <div className="text-sm font-medium group-hover:text-white">{category}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Premium VIP Section */}
        <section className="py-12 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
                👑 Premium VIP Content
              </h2>
              <p className="text-xl text-yellow-100 mb-8">Exclusive HD content for premium members</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <div className="text-3xl mb-3">🎬</div>
                  <h3 className="text-lg font-semibold mb-2">Ultra HD Quality</h3>
                  <p className="text-yellow-100/80">4K videos with crystal clear picture</p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">No Ads</h3>
                  <p className="text-yellow-100/80">Uninterrupted viewing experience</p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="text-lg font-semibold mb-2">Exclusive Content</h3>
                  <p className="text-yellow-100/80">Access to premium creators</p>
                </div>
              </div>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg">
                Upgrade to Premium - $9.99/month
              </button>
            </div>
          </div>
        </section>

        {/* Trending Videos */}
        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-orange-500">🔥 Trending</span> Right Now
              </h2>
              <p className="text-gray-400">The hottest videos everyone&apos;s watching</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
              {sampleVideos.slice(0, 6).map((video, index) => (
                <div 
                  key={video.id} 
                  className="relative opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                    #{index + 1}
                  </div>
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
