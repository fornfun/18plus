'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import VideoGrid from '@/components/VideoGrid';
import Footer from '@/components/Footer';
import { sampleVideos } from '@/data/sampleVideos';
import { Search, Filter } from 'lucide-react';

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      // Simulate search delay
      setTimeout(() => {
        const results = sampleVideos.filter(video =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredVideos(results);
        setLoading(false);
      }, 500);
    } else {
      setFilteredVideos([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newQuery = form.get('search');
    setSearchQuery(newQuery);
  };

  const sortVideos = (videos, sortType) => {
    switch (sortType) {
      case 'views':
        return [...videos].sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
      case 'rating':
        return [...videos].sort((a, b) => b.rating - a.rating);
      case 'date':
        return [...videos].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      default:
        return videos;
    }
  };

  const sortedVideos = sortVideos(filteredVideos, sortBy);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Videos'}
          </h1>
          
          {/* Enhanced Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search for videos, categories, tags..."
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters and Sort */}
          {searchQuery && (
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-orange-500 focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="views">Most Viewed</option>
                  <option value="rating">Highest Rated</option>
                  <option value="date">Newest</option>
                </select>
              </div>
              
              <div className="text-gray-400 text-sm">
                {loading ? 'Searching...' : `${sortedVideos.length} results found`}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {searchQuery ? (
          <VideoGrid videos={sortedVideos} loading={loading} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-300">Start Your Search</h2>
            <p className="text-gray-400 mb-8">Discover amazing content by searching for videos, categories, or tags</p>
            
            {/* Popular searches */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Popular Searches:</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {['Solo', 'Couples', 'Lesbian', 'Amateur', 'HD', 'Hot'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default SearchPage;
