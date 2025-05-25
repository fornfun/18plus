'use client';

import { useState } from 'react';

// Sample video data
const sampleVideos = [
  {
    id: 1,
    title: "The Future of AI",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
    duration: "12:34",
    views: "2.1M",
    uploadDate: "2 days ago",
    channel: "TechExplorer",
    category: "Technology"
  },
  {
    id: 2,
    title: "Beautiful Nature Documentary",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    duration: "45:22",
    views: "5.7M",
    uploadDate: "1 week ago",
    channel: "NatureWorld",
    category: "Documentary"
  },
  {
    id: 3,
    title: "Cooking Masterclass: Italian Pasta",
    thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop",
    duration: "18:45",
    views: "892K",
    uploadDate: "3 days ago",
    channel: "ChefMario",
    category: "Food"
  },
  {
    id: 4,
    title: "Space Exploration: Mars Mission",
    thumbnail: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&h=300&fit=crop",
    duration: "25:16",
    views: "3.4M",
    uploadDate: "5 days ago",
    channel: "SpaceTV",
    category: "Science"
  },
  {
    id: 5,
    title: "Music Production Tutorial",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
    duration: "22:08",
    views: "654K",
    uploadDate: "1 day ago",
    channel: "BeatMaker",
    category: "Music"
  },
  {
    id: 6,
    title: "Travel Vlog: Tokyo Adventures",
    thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
    duration: "15:30",
    views: "1.2M",
    uploadDate: "4 days ago",
    channel: "TravelBuddy",
    category: "Travel"
  }
];

const featuredVideo = {
  id: 7,
  title: "Epic Mountain Adventure: Climbing the Himalayas",
  thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
  duration: "1:32:45",
  views: "8.5M",
  uploadDate: "2 days ago",
  channel: "AdventureSeeker",
  description: "Join us on an incredible journey as we climb through the majestic Himalayan mountains, discovering breathtaking views and challenging terrains."
};

const categories = ['All', 'Technology', 'Documentary', 'Food', 'Science', 'Music', 'Travel'];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVideos = sampleVideos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-red-500">StreamFlix</h1>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-red-400 transition-colors">Home</a>
            <a href="#" className="hover:text-red-400 transition-colors">Trending</a>
            <a href="#" className="hover:text-red-400 transition-colors">Categories</a>
            <a href="#" className="hover:text-red-400 transition-colors">My List</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">U</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredVideo.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 h-full flex items-center px-4 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{featuredVideo.title}</h2>
            <p className="text-lg md:text-xl mb-6 text-gray-200">{featuredVideo.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">{featuredVideo.duration}</span>
              <span className="text-gray-300">{featuredVideo.views} views</span>
              <span className="text-gray-300">{featuredVideo.uploadDate}</span>
            </div>
            <div className="flex space-x-4">
              <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Play Now</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add to List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 md:px-8 py-6">
        <div className="flex space-x-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-4 md:px-8 pb-8">
        <h3 className="text-2xl font-bold mb-6">
          {selectedCategory === 'All' ? 'Recommended for You' : selectedCategory}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gray-800 aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm font-medium">
                  {video.duration}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <h4 className="font-semibold text-lg group-hover:text-red-400 transition-colors line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-gray-400 text-sm mt-1">{video.channel}</p>
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
                  <span>{video.views} views</span>
                  <span>•</span>
                  <span>{video.uploadDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-red-500 mb-4">StreamFlix</h3>
              <p className="text-gray-400">Your ultimate destination for streaming the best videos online.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Entertainment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Education</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StreamFlix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
