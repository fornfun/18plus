'use client';
import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayCategories = showAll ? categories : categories.slice(0, 8);

  return (
    <div className="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-orange-500" />
            <span className="text-white font-medium">Categories:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              {displayCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-orange-400 hover:text-white hover:scale-105'
                  }`}
                >
                  {category === 'All' ? '🔥 All' : category}
                </button>
              ))}
            </div>
            
            {categories.length > 8 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
              >
                {showAll ? (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span>Less</span>
                  </>
                ) : (
                  <>
                    <span>More</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
