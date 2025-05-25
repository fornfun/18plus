'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: Home },
    ...items
  ];

  return (
    <nav className="py-4 px-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.ol
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 text-sm"
        >
          {breadcrumbItems.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center"
            >
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-500 mx-2" />
              )}
              
              <motion.a
                href={item.href || '#'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all duration-300 ${
                  index === breadcrumbItems.length - 1
                    ? 'text-red-400 bg-red-400/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </motion.a>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
