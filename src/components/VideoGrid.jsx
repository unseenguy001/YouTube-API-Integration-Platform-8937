import React from 'react';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';

function VideoGrid({ videos, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {videos.map((video, index) => (
        <VideoCard key={video.id.videoId || video.id} video={video} index={index} />
      ))}
    </motion.div>
  );
}

export default VideoGrid;