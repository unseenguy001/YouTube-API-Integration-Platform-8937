import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoGrid from '../components/VideoGrid';
import useVideoStore from '../store/videoStore';
import useAuthStore from '../store/authStore';
import AuthModal from '../components/auth/AuthModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiThumbsUp } = FiIcons;

function LikedVideosPage() {
  const { userLikedVideos, fetchUserLikedVideos, loading } = useVideoStore();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  useEffect(() => {
    if (user) {
      fetchUserLikedVideos();
    }
  }, [user, fetchUserLikedVideos]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to View Liked Videos</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to see your liked videos.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign In
          </motion.button>
        </motion.div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Liked Videos</h1>
        <p className="text-gray-600">
          Videos you've liked will appear here
        </p>
      </motion.div>

      {userLikedVideos.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SafeIcon icon={FiThumbsUp} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No liked videos yet
          </h2>
          <p className="text-gray-500">
            Videos that you like will show up here
          </p>
        </motion.div>
      ) : (
        <VideoGrid videos={userLikedVideos} loading={loading} />
      )}
    </div>
  );
}

export default LikedVideosPage;