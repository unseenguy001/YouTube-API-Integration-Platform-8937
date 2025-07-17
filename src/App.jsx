import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import ShortsPage from './pages/ShortsPage';
import SearchPage from './pages/SearchPage';
import ChannelPage from './pages/ChannelPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import UploadPage from './pages/UploadPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';
import LikedVideosPage from './pages/LikedVideosPage';
import NotFoundPage from './pages/NotFoundPage';

import useAuthStore from './store/authStore';
import useSubscriptionStore from './store/subscriptionStore';
import useAnalyticsStore from './store/analyticsStore';

import './App.css';

function App() {
  const { initialize: initAuth } = useAuthStore();
  const { initialize: initSubscription } = useSubscriptionStore();
  const { initialize: initAnalytics } = useAnalyticsStore();
  
  useEffect(() => {
    // Initialize all stores
    initAuth();
    initSubscription();
    initAnalytics();
  }, [initAuth, initSubscription, initAnalytics]);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <motion.main 
            className="flex-1 ml-64 mt-16 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/watch/:videoId" element={<VideoPage />} />
              <Route path="/shorts" element={<ShortsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/channel/:channelId" element={<ChannelPage />} />
              <Route path="/trending" element={<HomePage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/liked" element={<LikedVideosPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.main>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;