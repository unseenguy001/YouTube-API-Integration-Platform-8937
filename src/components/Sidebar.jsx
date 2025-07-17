import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiTrendingUp, FiUsers, FiMusic, FiGamepad2, FiFilm, FiMonitor, FiClock, FiThumbsUp, FiBookmark, FiDownload } = FiIcons;

function Sidebar() {
  const location = useLocation();

  const mainMenuItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiTrendingUp, label: 'Trending', path: '/trending' },
    { icon: FiUsers, label: 'Subscriptions', path: '/subscriptions' },
  ];

  const libraryItems = [
    { icon: FiClock, label: 'History', path: '/history' },
    { icon: FiThumbsUp, label: 'Liked videos', path: '/liked' },
    { icon: FiBookmark, label: 'Watch later', path: '/watch-later' },
    { icon: FiDownload, label: 'Downloads', path: '/downloads' },
  ];

  const exploreItems = [
    { icon: FiMusic, label: 'Music', path: '/music' },
    { icon: FiGamepad2, label: 'Gaming', path: '/gaming' },
    { icon: FiFilm, label: 'Movies', path: '/movies' },
    { icon: FiMonitor, label: 'Live', path: '/live' },
  ];

  const MenuItem = ({ icon, label, path }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link to={path}>
        <motion.div
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
            isActive ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
          }`}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <SafeIcon icon={icon} className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.aside
      className="fixed left-0 top-16 w-64 h-screen bg-white shadow-lg overflow-y-auto"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="p-4">
        {/* Main Menu */}
        <div className="space-y-2">
          {mainMenuItems.map((item) => (
            <MenuItem key={item.path} {...item} />
          ))}
        </div>

        {/* Shorts */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link to="/shorts">
            <motion.div
              className="flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 bg-red-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="font-medium">Shorts</span>
            </motion.div>
          </Link>
        </div>

        {/* Library */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 px-4">Library</h3>
          <div className="space-y-2">
            {libraryItems.map((item) => (
              <MenuItem key={item.path} {...item} />
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 px-4">Explore</h3>
          <div className="space-y-2">
            {exploreItems.map((item) => (
              <MenuItem key={item.path} {...item} />
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;