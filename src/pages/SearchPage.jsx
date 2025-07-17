import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoGrid from '../components/VideoGrid';
import youtubeApi from '../services/youtubeApi';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFilter, FiSearch } = FiIcons;

function SearchPage() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      searchVideos(query);
    }
  }, [location.search]);

  const searchVideos = async (query) => {
    setLoading(true);
    try {
      const data = await youtubeApi.searchVideos(query, 50);
      setVideos(data.items || []);
      setNextPageToken(data.nextPageToken || '');
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = async () => {
    if (!nextPageToken || !searchQuery) return;
    
    try {
      const data = await youtubeApi.searchVideos(searchQuery, 50, nextPageToken);
      setVideos(prev => [...prev, ...(data.items || [])]);
      setNextPageToken(data.nextPageToken || '');
    } catch (error) {
      console.error('Error loading more videos:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiSearch} className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Search results for "{searchQuery}"
          </h1>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SafeIcon icon={FiFilter} className="w-4 h-4" />
          <span>Filters</span>
        </motion.button>
      </motion.div>

      {/* Results Count */}
      {!loading && videos.length > 0 && (
        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Found {videos.length} results
        </motion.p>
      )}

      {/* No Results */}
      {!loading && videos.length === 0 && searchQuery && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SafeIcon icon={FiSearch} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No results found for "{searchQuery}"
          </h2>
          <p className="text-gray-500">
            Try different keywords or check your spelling
          </p>
        </motion.div>
      )}

      {/* Video Grid */}
      <VideoGrid videos={videos} loading={loading} />

      {/* Load More Button */}
      {nextPageToken && !loading && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={loadMoreVideos}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Results
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default SearchPage;