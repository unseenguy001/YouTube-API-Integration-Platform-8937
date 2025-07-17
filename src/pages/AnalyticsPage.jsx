import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import useAnalyticsStore from '../store/analyticsStore';
import useAuthStore from '../store/authStore';
import useSubscriptionStore from '../store/subscriptionStore';
import AuthModal from '../components/auth/AuthModal';

const { FiEye, FiUsers, FiActivity, FiDollarSign, FiTrendingUp, FiTrendingDown, FiArrowRight, FiLock } = FiIcons;

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

function AnalyticsPage() {
  const navigate = useNavigate();
  const { viewsData, deviceData, audienceData, engagementData, revenueData, topVideos, getAnalyticsSummary, fetchAnalytics, loading } = useAnalyticsStore();
  const { user } = useAuthStore();
  const { userSubscription } = useSubscriptionStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState('30d');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  // Check if user has access to premium analytics
  const hasPremiumAccess = userSubscription && (userSubscription.status === 'active' && (userSubscription.plan_id === 'premium' || userSubscription.plan_id === 'creator'));

  // Check if user has access to creator analytics
  const hasCreatorAccess = userSubscription && (userSubscription.status === 'active' && userSubscription.plan_id === 'creator');

  const { total: totalViews, change: viewsChange } = getAnalyticsSummary();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to View Analytics</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in or create an account to access your video analytics.
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Track your performance and audience insights
        </p>
      </motion.div>

      {/* Time Range Selector */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {['7d', '30d', '90d', '12m'].map((range) => (
          <motion.button
            key={range}
            onClick={() => setActiveTimeRange(range)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeTimeRange === range ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {range === '7d' && '7 Days'}
            {range === '30d' && '30 Days'}
            {range === '90d' && '90 Days'}
            {range === '12m' && '12 Months'}
          </motion.button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 font-medium">Total Views</p>
              <h3 className="text-3xl font-bold">{totalViews.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <SafeIcon icon={FiEye} className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className={`flex items-center ${viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <SafeIcon icon={viewsChange >= 0 ? FiTrendingUp : FiTrendingDown} className="w-4 h-4 mr-1" />
            <span className="font-medium">{Math.abs(viewsChange)}%</span>
            <span className="text-gray-500 ml-1">vs. previous period</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 font-medium">Watch Time</p>
              <h3 className="text-3xl font-bold">342 hrs</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center text-green-600">
            <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
            <span className="font-medium">12.3%</span>
            <span className="text-gray-500 ml-1">vs. previous period</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 font-medium">Subscribers</p>
              <h3 className="text-3xl font-bold">1,024</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center text-green-600">
            <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
            <span className="font-medium">8.7%</span>
            <span className="text-gray-500 ml-1">vs. previous period</span>
          </div>
        </motion.div>

        <motion.div
          className={`bg-white p-6 rounded-lg shadow-md ${!hasCreatorAccess ? 'opacity-60' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center">
                <p className="text-gray-500 font-medium mr-1">Revenue</p>
                {!hasCreatorAccess && <SafeIcon icon={FiLock} className="w-4 h-4 text-gray-400" />}
              </div>
              <h3 className="text-3xl font-bold">{hasCreatorAccess ? '$1,284' : '—'}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {hasCreatorAccess ? (
            <div className="flex items-center text-green-600">
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
              <span className="font-medium">15.2%</span>
              <span className="text-gray-500 ml-1">vs. previous period</span>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Upgrade to Creator Pro to access revenue analytics
            </div>
          )}
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Views Over Time */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6">Views Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={viewsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#FF6384" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Device Distribution */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6">Device Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Premium Analytics Section */}
      <div className={`mb-8 ${!hasPremiumAccess ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Enhanced Analytics
            {!hasPremiumAccess && <SafeIcon icon={FiLock} className="w-5 h-5 ml-2 inline-block text-gray-400" />}
          </h2>
          {!hasPremiumAccess && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/subscription')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
            >
              Upgrade to Premium
            </motion.button>
          )}
        </div>

        {!hasPremiumAccess ? (
          <motion.div
            className="bg-white p-8 rounded-lg shadow-md text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Unlock Enhanced Analytics
            </h3>
            <p className="text-gray-500 mb-6">
              Upgrade to Premium or Creator Pro to access audience demographics, engagement metrics, and more detailed insights.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/subscription')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg flex items-center justify-center mx-auto"
            >
              Upgrade Now
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Audience Demographics */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-6">Audience Demographics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={audienceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#36A2EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Engagement Metrics */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-6">Engagement Metrics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={engagementData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="likes" stroke="#FF6384" />
                    <Line yAxisId="right" type="monotone" dataKey="comments" stroke="#FFCE56" />
                    <Line yAxisId="right" type="monotone" dataKey="shares" stroke="#4BC0C0" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Creator Pro Analytics Section */}
      <div className={`mb-8 ${!hasCreatorAccess ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Creator Pro Analytics
            {!hasCreatorAccess && <SafeIcon icon={FiLock} className="w-5 h-5 ml-2 inline-block text-gray-400" />}
          </h2>
          {!hasCreatorAccess && hasPremiumAccess && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/subscription')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
            >
              Upgrade to Creator Pro
            </motion.button>
          )}
        </div>

        {!hasCreatorAccess ? (
          <motion.div
            className="bg-white p-8 rounded-lg shadow-md text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Unlock Creator Pro Analytics
            </h3>
            <p className="text-gray-500 mb-6">
              Upgrade to Creator Pro to access revenue analytics, top performing videos, and advanced monetization insights.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/subscription')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto"
            >
              Upgrade to Creator Pro
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Over Time */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#4BC0C0" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Performing Videos */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-6">Top Performing Videos</h3>
              <div className="space-y-4">
                {topVideos.map((video, index) => (
                  <div key={video.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 line-clamp-1">{video.title}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{video.views.toLocaleString()} views</span>
                        <span className="mx-2">•</span>
                        <span>${video.revenue.toFixed(2)} revenue</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {video.engagement}% CTR
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;