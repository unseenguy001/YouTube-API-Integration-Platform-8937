import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoGrid from '../components/VideoGrid';
import youtubeApi from '../services/youtubeApi';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiMusic, FiGamepad2, FiFilm, FiMonitor } = FiIcons;

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('trending');
  const [nextPageToken, setNextPageToken] = useState('');

  const categories = [
    { id: 'trending', label: 'Trending', icon: FiTrendingUp },
    { id: 'music', label: 'Music', icon: FiMusic },
    { id: 'gaming', label: 'Gaming', icon: FiGamepad2 },
    { id: 'movies', label: 'Movies', icon: FiFilm },
    { id: 'live', label: 'Live', icon: FiMonitor },
  ];

  useEffect(() => {
    fetchVideos();
  }, [activeCategory]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let data;
      if (activeCategory === 'trending') {
        data = await youtubeApi.fetchTrendingVideos();
      } else {
        data = await youtubeApi.fetchVideos(activeCategory, 50);
      }
      setVideos(data.items || []);
      setNextPageToken(data.nextPageToken || '');
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = async () => {
    if (!nextPageToken) return;
    
    try {
      let data;
      if (activeCategory === 'trending') {
        data = await youtubeApi.fetchTrendingVideos('US', 50);
      } else {
        data = await youtubeApi.fetchVideos(activeCategory, 50, nextPageToken);
      }
      setVideos(prev => [...prev, ...(data.items || [])]);
      setNextPageToken(data.nextPageToken || '');
    } catch (error) {
      console.error('Error loading more videos:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Category Tabs */}
      <motion.div
        className="flex space-x-2 mb-8 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={category.icon} className="w-4 h-4" />
            <span className="font-medium">{category.label}</span>
          </motion.button>
        ))}
      </motion.div>

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
            Load More Videos
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default HomePage;