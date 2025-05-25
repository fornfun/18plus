'use client';

import { motion } from 'framer-motion';
import { 
  Play, Heart, Star, Download, Facebook, Twitter, Instagram, Youtube, 
  Smartphone, Monitor, Mail, Phone, MapPin, Send
} from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: "Content",
      links: ["Movies", "TV Shows", "Documentaries", "Kids", "Originals", "Sports"]
    },
    {
      title: "Features",
      links: ["4K Streaming", "Offline Downloads", "Multiple Profiles", "Parental Controls", "Subtitles", "Audio Description"]
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Account", "Media Center", "Investor Relations", "Jobs"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Preferences", "Corporate Information", "DMCA", "Accessibility"]
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "from-blue-600 to-blue-700" },
    { icon: Twitter, label: "Twitter", color: "from-sky-500 to-sky-600" },
    { icon: Instagram, label: "Instagram", color: "from-pink-500 to-purple-600" },
    { icon: Youtube, label: "YouTube", color: "from-red-500 to-red-600" }
  ];

  const appDownloads = [
    { icon: Smartphone, label: "Download for Mobile", subtitle: "iOS & Android" },
    { icon: Monitor, label: "Desktop App", subtitle: "Windows & Mac" }
  ];

  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-800 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Section */}
        <div className="py-16 text-center border-b border-gray-700/50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              StreamFlix
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg"
          >
            Your ultimate destination for streaming entertainment. Discover unlimited movies, TV shows, and exclusive content.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Play, count: "50,000+", label: "Total Videos", color: "from-red-500 to-pink-600" },
              { icon: Heart, count: "2.5M+", label: "Happy Users", color: "from-pink-500 to-purple-600" },
              { icon: Star, count: "4.8/5", label: "Average Rating", color: "from-yellow-400 to-orange-500" },
              { icon: Download, count: "10M+", label: "Downloads", color: "from-green-500 to-teal-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {stat.count}
                </h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>support@streamflix.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span>123 Streaming St, Los Angeles, CA</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3 rounded-r-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 group">
                    <Send className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* App Downloads & Social Links */}
          <div className="mt-16 pt-8 border-t border-gray-700/50">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
              {/* App Downloads */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                {appDownloads.map((app, index) => (
                  <motion.button
                    key={app.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl px-6 py-4 transition-all duration-300 group"
                  >
                    <app.icon className="w-8 h-8 text-gray-400 group-hover:text-white" />
                    <div className="text-left">
                      <p className="text-white font-medium">{app.label}</p>
                      <p className="text-gray-400 text-sm">{app.subtitle}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex space-x-4"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <social.icon className="w-6 h-6 text-white" />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-700/50 text-center"
          >
            <p className="text-gray-400 text-sm">
              © 2025 StreamFlix. All rights reserved. | Designed with ❤️ for the streaming revolution
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
