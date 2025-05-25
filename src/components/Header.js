'use client';
import React, { useState } from 'react';
import { Search, User, Heart, History, Menu, X } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-orange-500">18</span>
              <span className="text-white">Plus</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-orange-500 transition-colors">
              Categories
            </Link>
            <Link href="/trending" className="text-gray-300 hover:text-orange-500 transition-colors">
              Trending
            </Link>
            <Link href="/live" className="text-gray-300 hover:text-orange-500 transition-colors">
              Live Cams
            </Link>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <form onSubmit={(e) => {
              e.preventDefault();
              const query = new FormData(e.target).get('search');
              if (query) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
              }
            }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search videos, categories..."
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </form>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-3">
            <button className="text-gray-400 hover:text-orange-500 transition-colors p-2">
              <Heart className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-orange-500 transition-colors p-2">
              <History className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 text-gray-300 hover:text-orange-500 transition-colors bg-gray-800 px-3 py-2 rounded-lg">
              <User className="w-5 h-5" />
              <span className="hidden lg:block">Login</span>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gray-800">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const query = new FormData(e.target).get('search');
                if (query) {
                  window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }
                setIsMobileMenuOpen(false);
              }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search videos..."
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </form>
              
              {/* Mobile Navigation */}
              <nav className="space-y-3">
                <Link href="/" className="block text-gray-300 hover:text-orange-500">Home</Link>
                <Link href="/categories" className="block text-gray-300 hover:text-orange-500">Categories</Link>
                <Link href="/trending" className="block text-gray-300 hover:text-orange-500">Trending</Link>
                <Link href="/live" className="block text-gray-300 hover:text-orange-500">Live Cams</Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
