'use client';
import React from 'react';
import { Github, Twitter, Instagram, Shield, Lock, Globe } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="text-3xl font-bold">
                <span className="text-orange-500">18</span>
                <span className="text-white">Plus</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Premium adult entertainment platform featuring high-quality content from verified creators. 
              Experience the best in adult streaming with crystal-clear HD videos and fast loading times.
            </p>
            
            {/* Trust badges */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-300">Secure</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <Lock className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-300">Private</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <Globe className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-gray-300">Global</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/category/solo" className="text-gray-400 hover:text-orange-400 transition-colors flex items-center">🔥 Solo</Link></li>
              <li><Link href="/category/couples" className="text-gray-400 hover:text-orange-400 transition-colors flex items-center">💕 Couples</Link></li>
              <li><Link href="/category/lesbian" className="text-gray-400 hover:text-orange-400 transition-colors flex items-center">👩‍❤️‍👩 Lesbian</Link></li>
              <li><Link href="/category/amateur" className="text-gray-400 hover:text-orange-400 transition-colors flex items-center">📹 Amateur</Link></li>
              <li><Link href="/category/fetish" className="text-gray-400 hover:text-orange-400 transition-colors flex items-center">🔗 Fetish</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/help" className="text-gray-400 hover:text-orange-400 transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/dmca" className="text-gray-400 hover:text-orange-400 transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>

        {/* Age verification notice */}
        <div className="bg-gray-800 rounded-lg p-4 my-8">
          <div className="flex items-center justify-center space-x-2 text-center">
            <span className="text-red-500 text-2xl">18+</span>
            <div>
              <p className="text-white font-semibold">Adults Only Content</p>
              <p className="text-gray-400 text-sm">You must be 18 years or older to access this website</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 18Plus Premium. All rights reserved. This website contains age-restricted materials.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">18+</span>
              <span className="text-gray-400 text-sm">RTA Labeled</span>
              <span className="text-gray-400 text-sm">ASACP Member</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
