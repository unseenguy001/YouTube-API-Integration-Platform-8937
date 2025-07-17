import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import useAuthStore from '../store/authStore';
import useSubscriptionStore from '../store/subscriptionStore';
import AuthModal from '../components/auth/AuthModal';

const { FiUser, FiMail, FiEdit2, FiCamera, FiCreditCard, FiPackage } = FiIcons;

function AccountPage() {
  const { user, updateProfile } = useAuthStore();
  const { userSubscription } = useSubscriptionStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.user_metadata?.username || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to View Account</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to access your account settings.
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

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateProfile({ username });
    if (result.success) {
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <motion.div
          className="md:col-span-2 bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(!editing)}
              className="text-gray-600 hover:text-gray-800"
            >
              <SafeIcon icon={editing ? FiUser : FiEdit2} className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.username || 'User'}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {(user.user_metadata?.username || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg"
                >
                  <SafeIcon icon={FiCamera} className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>
              
              <div className="flex-1">
                {editing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your username"
                  />
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.user_metadata?.username || 'Set your username'}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Subscription Info */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-6">Subscription</h2>
          
          {userSubscription?.status === 'active' ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPackage} className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Active Subscription</p>
                    <p className="text-sm text-green-600">
                      {userSubscription.plan_id.charAt(0).toUpperCase() + userSubscription.plan_id.slice(1)} Plan
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Next billing date: {new Date(userSubscription.current_period_end).toLocaleDateString()}
                </p>
                <Link to="/subscription">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </motion.button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">No active subscription</p>
              <Link to="/subscription">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Upgrade Now
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AccountPage;