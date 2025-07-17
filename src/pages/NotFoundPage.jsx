import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome } = FiIcons;

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto"
          >
            <SafeIcon icon={FiHome} className="w-5 h-5 mr-2" />
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;