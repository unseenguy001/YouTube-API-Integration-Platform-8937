import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import youtubeApi from '../services/youtubeApi';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiThumbsUp, FiThumbsDown, FiShare2, FiDownload, FiMoreHorizontal, FiEye, FiCalendar } = FiIcons;

function VideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  const fetchVideoDetails = async () => {
    setLoading(true);
    try {
      const videoData = await youtubeApi.fetchVideoDetails(videoId);
      setVideo(videoData);
      
      if (videoData) {
        const channelData = await youtubeApi.fetchChannelDetails(videoData.snippet.channelId);
        setChannel(channelData);
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Video not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <motion.div
            className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={video.snippet.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </motion.div>

          {/* Video Info */}
          <motion.div
            className="bg-white rounded-lg p-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {video.snippet.title}
            </h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                  {youtubeApi.formatViewCount(video.statistics.viewCount)} views
                </span>
                <span className="flex items-center">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                  {youtubeApi.getTimeAgo(video.snippet.publishedAt)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiThumbsUp} className="w-4 h-4" />
                  <span>{youtubeApi.formatViewCount(video.statistics.likeCount)}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiThumbsDown} className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiShare2} className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span>Download</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Channel Info */}
            {channel && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={channel.snippet.thumbnails.default.url}
                    alt={channel.snippet.title}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {channel.snippet.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {youtubeApi.formatViewCount(channel.statistics.subscriberCount)} subscribers
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            )}

            {/* Description */}
            <div className="mt-4">
              <motion.button
                onClick={() => setShowDescription(!showDescription)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {showDescription ? 'Show less' : 'Show more'}
              </motion.button>
              {showDescription && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  {video.snippet.description}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            className="bg-white rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {youtubeApi.formatViewCount(video.statistics.commentCount)} Comments
            </h3>
            <div className="space-y-4">
              {/* Comment placeholder */}
              <div className="text-gray-500 text-center py-8">
                Comments would be loaded here via YouTube API
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-lg p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4">Related Videos</h3>
            <div className="space-y-4">
              {/* Related videos placeholder */}
              <div className="text-gray-500 text-center py-8">
                Related videos would be loaded here
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;