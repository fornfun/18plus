'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScrollability = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability);
      return () => scrollElement.removeEventListener('scroll', checkScrollability);
    }
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      className="px-6 md:px-12 py-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-red-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Browse Categories
          </h2>
        </div>
        <motion.button 
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Categories
        </motion.button>
      </motion.div>
      
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <motion.button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/90 transition-all duration-300 shadow-lg"
            onClick={() => scroll('left')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <motion.button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/90 transition-all duration-300 shadow-lg"
            onClick={() => scroll('right')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {/* Categories */}
        <motion.div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 px-8"
          variants={itemVariants}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap shadow-lg
                ${selectedCategory === category
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-red-500/25'
                  : 'bg-white/5 backdrop-blur-md text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                }
              `}
              whileHover={{ 
                scale: 1.05,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300
              }}
            >
              {category}
              {selectedCategory === category && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-md opacity-50 -z-10"
                  layoutId="categoryGlow"
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
