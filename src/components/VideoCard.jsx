import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import youtubeApi from '../services/youtubeApi';

const { FiMoreVertical, FiClock, FiEye } = FiIcons;

function VideoCard({ video, index }) {
  const { id, snippet } = video;
  const videoId = typeof id === 'string' ? id : id.videoId;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link to={`/watch/${videoId}`}>
        <div className="relative">
          <motion.img
            src={snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url}
            alt={snippet.title}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            <SafeIcon icon={FiClock} className="w-3 h-3 inline mr-1" />
            {snippet.duration || '0:00'}
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/watch/${videoId}`}>
            <h3 className="font-semibold text-gray-800 hover:text-red-600 transition-colors line-clamp-2">
              {snippet.title}
            </h3>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
          </motion.button>
        </div>
        
        <Link to={`/channel/${snippet.channelId}`}>
          <p className="text-sm text-gray-600 hover:text-red-600 transition-colors mb-1">
            {snippet.channelTitle}
          </p>
        </Link>
        
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <span className="flex items-center">
            <SafeIcon icon={FiEye} className="w-3 h-3 mr-1" />
            {video.statistics ? youtubeApi.formatViewCount(video.statistics.viewCount) : 'N/A'} views
          </span>
          <span>•</span>
          <span>{youtubeApi.getTimeAgo(snippet.publishedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default VideoCard;