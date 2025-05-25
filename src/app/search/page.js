'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import InfiniteVideoGrid from '@/components/InfiniteVideoGrid';
import Footer from '@/components/Footer';
import { Search, Filter } from 'lucide-react';

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Update search when URL query parameter changes
  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      setSearchSubmitted(true);
    }
  }, [query, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newQuery = form.get('search');
    setSearchQuery(newQuery);
    setSearchSubmitted(true);
  };

  // Convert sort options to API parameters
  const getApiSortParams = () => {
    switch (sortBy) {
      case 'views':
        return { sortBy: 'views', order: 'desc' };
      case 'rating':
        return { sortBy: 'likes', order: 'desc' };
      case 'date':
        return { sortBy: 'created_at', order: 'desc' };
      case 'random':
        return { sortBy: 'random', order: 'asc' };
      default: // relevance
        return { sortBy: 'created_at', order: 'desc' };
    }
  };

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
                  <option value="random">Random</option>
                </select>
              </div>
              
              <div className="text-gray-400 text-sm">
                {searchQuery && searchSubmitted ? 'Showing search results' : 'Enter search terms above'}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {searchQuery && searchSubmitted ? (
          <InfiniteVideoGrid 
            search={searchQuery}
            {...getApiSortParams()}
            key={`search-${searchQuery}-${sortBy}`}
          />
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
