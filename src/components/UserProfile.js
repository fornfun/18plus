'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Clock, 
  Heart, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Crown, 
  Star,
  Bell,
  Download,
  Shield,
  ChevronDown
} from 'lucide-react';

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const dropdownRef = useRef(null);

  const userStats = {
    watchTime: '24h 32m',
    videosWatched: 127,
    favorites: 45,
    subscriptions: 12
  };

  const userMenuItems = [
    { name: 'My Profile', icon: User, color: 'text-blue-400', premium: false },
    { name: 'Watch History', icon: Clock, color: 'text-green-400', premium: false },
    { name: 'Favorites', icon: Heart, color: 'text-red-400', premium: false },
    { name: 'Downloads', icon: Download, color: 'text-purple-400', premium: true },
    { name: 'Premium', icon: Crown, color: 'text-yellow-400', premium: true },
    { name: 'Settings', icon: Settings, color: 'text-gray-400', premium: false },
    { name: 'Help & Support', icon: HelpCircle, color: 'text-cyan-400', premium: false },
    { name: 'Sign Out', icon: LogOut, color: 'text-red-400', premium: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 group relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300 ring-2 ring-transparent group-hover:ring-red-400/30"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white font-bold text-sm">SR</span>
          </motion.div>
          
          {/* Online Status */}
          <motion.div 
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Notification Badge */}
          {notifications > 0 && (
            <motion.div 
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {notifications}
            </motion.div>
          )}
        </div>
        
        <div className="hidden md:block text-left">
          <p className="text-white font-medium text-sm">Shaswat Raj</p>
          <p className="text-gray-400 text-xs">Premium Member</p>
        </div>
        
        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-red-500/10 to-purple-500/10 border-b border-gray-700/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">SR</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-yellow-900" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Shaswat Raj</h3>
                  <p className="text-purple-400 text-sm font-medium flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Premium Member</span>
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-gray-300 text-xs">4.9</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span className="text-gray-300 text-xs">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User Stats */}
              <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700/50">
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{userStats.watchTime}</p>
                  <p className="text-gray-400 text-xs">Watch Time</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{userStats.videosWatched}</p>
                  <p className="text-gray-400 text-xs">Videos</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{userStats.favorites}</p>
                  <p className="text-gray-400 text-xs">Favorites</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{userStats.subscriptions}</p>
                  <p className="text-gray-400 text-xs">Following</p>
                </div>
              </div>
            </motion.div>

            {/* Menu Items */}
            <div className="py-2">
              {userMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-white/5 transition-all duration-200 group"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (item.name === 'Sign Out') {
                        // Handle sign out
                        console.log('Signing out...');
                      }
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <div className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors flex-1 text-left">
                      {item.name}
                    </span>
                    {item.premium && (
                      <motion.div
                        className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-black text-xs font-bold">PRO</span>
                      </motion.div>
                    )}
                    {item.name === 'Help & Support' && notifications > 0 && (
                      <motion.div
                        className="w-2 h-2 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Footer */}
            <motion.div 
              className="p-4 bg-gray-800/50 border-t border-gray-700/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <p>Premium expires in 23 days</p>
                </div>
                <motion.button
                  className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-xs font-medium text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Renew
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
