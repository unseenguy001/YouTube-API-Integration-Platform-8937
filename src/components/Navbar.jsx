import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AuthModal from './auth/AuthModal';
import UserDropdown from './user/UserDropdown';
import useAuthStore from '../store/authStore';

const { FiSearch, FiMenu, FiUser, FiBell, FiVideo, FiMic, FiUpload } = FiIcons;

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  
  const { user, initialize } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const toggleSidebar = () => {
    // This would be implemented if we add sidebar collapse functionality
    console.log('Toggle sidebar');
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 px-4 py-3"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <SafeIcon icon={FiMenu} className="w-6 h-6" />
            </motion.button>
            <Link to="/">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiVideo} className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">VideoHub</span>
              </motion.div>
            </Link>
          </div>

          {/* Search Section */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <motion.input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiSearch} className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <SafeIcon icon={FiMic} className="w-6 h-6" />
            </motion.button>
            
            {user && (
              <Link to="/upload">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <SafeIcon icon={FiUpload} className="w-6 h-6" />
                </motion.button>
              </Link>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <SafeIcon icon={FiBell} className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>
            
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="p-1 rounded-full hover:bg-gray-100 overflow-hidden"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata.username || 'User'} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white">
                      {(user.user_metadata?.username || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {showUserDropdown && (
                    <UserDropdown 
                      onClose={() => setShowUserDropdown(false)} 
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAuthModal(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <SafeIcon icon={FiUser} className="w-6 h-6" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default Navbar;