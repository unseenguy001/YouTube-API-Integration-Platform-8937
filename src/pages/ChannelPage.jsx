import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoGrid from '../components/VideoGrid';
import youtubeApi from '../services/youtubeApi';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiVideo, FiEye, FiBell } = FiIcons;

function ChannelPage() {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    if (channelId) {
      fetchChannelData();
    }
  }, [channelId]);

  const fetchChannelData = async () => {
    setLoading(true);
    try {
      const channelData = await youtubeApi.fetchChannelDetails(channelId);
      setChannel(channelData);
      
      // Fetch channel videos
      const videosData = await youtubeApi.fetchVideos(`channel:${channelData.snippet.title}`, 50);
      setVideos(videosData.items || []);
    } catch (error) {
      console.error('Error fetching channel data:', error);
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

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Channel not found</p>
      </div>
    );
  }

  const tabs = [
    { id: 'videos', label: 'Videos', icon: FiVideo },
    { id: 'shorts', label: 'Shorts', icon: FiVideo },
    { id: 'playlists', label: 'Playlists', icon: FiVideo },
    { id: 'about', label: 'About', icon: FiVideo },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Channel Header */}
      <motion.div
        className="bg-white rounded-lg overflow-hidden mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Channel Banner */}
        <div className="h-48 bg-gradient-to-r from-red-500 to-red-600 relative">
          {channel.snippet.thumbnails.high && (
            <img
              src={channel.snippet.thumbnails.high.url}
              alt="Channel banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Channel Info */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <img
                src={channel.snippet.thumbnails.default.url}
                alt={channel.snippet.title}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {channel.snippet.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-2">
                  <span className="flex items-center">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
                    {youtubeApi.formatViewCount(channel.statistics.subscriberCount)} subscribers
                  </span>
                  <span className="flex items-center">
                    <SafeIcon icon={FiVideo} className="w-4 h-4 mr-1" />
                    {channel.statistics.videoCount} videos
                  </span>
                  <span className="flex items-center">
                    <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                    {youtubeApi.formatViewCount(channel.statistics.viewCount)} views
                  </span>
                </div>
                <p className="text-gray-700 max-w-2xl line-clamp-2">
                  {channel.snippet.description}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <SafeIcon icon={FiBell} className="w-4 h-4" />
              <span>Subscribe</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Channel Tabs */}
      <motion.div
        className="bg-white rounded-lg mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'videos' && (
          <VideoGrid videos={videos} loading={false} />
        )}
        
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {channel.snippet.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Subscribers</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {youtubeApi.formatViewCount(channel.statistics.subscriberCount)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Videos</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {channel.statistics.videoCount}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Total Views</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {youtubeApi.formatViewCount(channel.statistics.viewCount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {(activeTab === 'shorts' || activeTab === 'playlists') && (
          <div className="bg-white rounded-lg p-12 text-center">
            <SafeIcon icon={FiVideo} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {activeTab === 'shorts' ? 'No Shorts Available' : 'No Playlists Available'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'shorts' 
                ? 'This channel has no shorts to display.' 
                : 'This channel has no playlists to display.'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ChannelPage;