'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const recentSearches = ['Breaking Bad', 'Marvel Movies', 'Documentaries'];
  const trendingSearches = ['The Last of Us', 'Avatar', 'Wednesday', 'Stranger Things'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.input
          type="text"
          placeholder="Search movies, shows, documentaries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          className={`
            bg-gray-800/60 backdrop-blur-md text-white px-4 py-3 pl-12 pr-10
            rounded-2xl w-64 md:w-96 transition-all duration-300
            border border-gray-700/50 hover:border-gray-600/50
            focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
            placeholder-gray-400 text-sm
            ${isFocused ? 'bg-gray-800/80 shadow-2xl' : ''}
          `}
          animate={{
            boxShadow: isFocused 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        
        <Search 
          className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            isFocused ? 'text-red-400' : 'text-gray-400'
          }`}
        />
        
        {searchTerm && (
          <motion.button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
      
      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-3 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center text-xs text-gray-400 px-2 py-2 font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    RECENT SEARCHES
                  </div>
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={`recent-${index}`}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors flex items-center"
                      onClick={() => handleSearch(search)}
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Clock className="w-4 h-4 mr-3 text-gray-500" />
                      {search}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center text-xs text-gray-400 px-2 py-2 font-medium">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  TRENDING NOW
                </div>
                {trendingSearches.map((search, index) => (
                  <motion.button
                    key={`trending-${index}`}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors flex items-center"
                    onClick={() => handleSearch(search)}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + recentSearches.length) * 0.05 }}
                  >
                    <TrendingUp className="w-4 h-4 mr-3 text-red-400" />
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
