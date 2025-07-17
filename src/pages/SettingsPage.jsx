import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import useAuthStore from '../store/authStore';
import AuthModal from '../components/auth/AuthModal';

const { FiGlobe, FiSun, FiMoon, FiBell, FiVolume2, FiShield, FiTrash2 } = FiIcons;

function SettingsPage() {
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to Access Settings</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to manage your settings.
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
    <div className="max-w-4xl mx-auto pt-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your app preferences and settings
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-6">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {['light', 'dark', 'system'].map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(option)}
                    className={`p-3 rounded-lg border ${
                      theme === option
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <SafeIcon
                      icon={option === 'light' ? FiSun : option === 'dark' ? FiMoon : FiGlobe}
                      className="w-5 h-5 mx-auto mb-1"
                    />
                    <span className="text-sm capitalize">{option}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Get notified about new content</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Playback */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-6">Playback</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiVolume2} className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Autoplay Videos</p>
                  <p className="text-sm text-gray-500">Play videos automatically</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiShield} className="w-5 h-5 text-gray-600" />
                <span>Privacy Settings</span>
              </div>
              <span className="text-gray-400">→</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3 text-red-600">
                <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                <span>Delete Account</span>
              </div>
              <span className="text-gray-400">→</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPage;