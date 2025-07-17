import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useAuthStore from '../../store/authStore';
import useSubscriptionStore from '../../store/subscriptionStore';

const { FiUser, FiSettings, FiLogOut, FiCreditCard, FiBarChart2, FiHelpCircle } = FiIcons;

function UserDropdown({ onClose }) {
  const { user, signOut } = useAuthStore();
  const { getUserPlanName } = useSubscriptionStore();
  
  const handleSignOut = async () => {
    await signOut();
    onClose();
  };
  
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };
  
  return (
    <motion.div
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={dropdownVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata.username || 'User'} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
              {(user.user_metadata?.username || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">
              {user.user_metadata?.username || user.email.split('@')[0]}
            </p>
            <p className="text-sm text-gray-500">{getUserPlanName()}</p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        <Link to="/account" onClick={onClose}>
          <motion.div 
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            whileHover={{ x: 5 }}
          >
            <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600 mr-3" />
            <span>Your Channel</span>
          </motion.div>
        </Link>
        
        <Link to="/analytics" onClick={onClose}>
          <motion.div 
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            whileHover={{ x: 5 }}
          >
            <SafeIcon icon={FiBarChart2} className="w-5 h-5 text-gray-600 mr-3" />
            <span>Analytics</span>
          </motion.div>
        </Link>
        
        <Link to="/subscription" onClick={onClose}>
          <motion.div 
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            whileHover={{ x: 5 }}
          >
            <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-gray-600 mr-3" />
            <span>Subscription</span>
          </motion.div>
        </Link>
        
        <Link to="/settings" onClick={onClose}>
          <motion.div 
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            whileHover={{ x: 5 }}
          >
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-600 mr-3" />
            <span>Settings</span>
          </motion.div>
        </Link>
        
        <Link to="/help" onClick={onClose}>
          <motion.div 
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            whileHover={{ x: 5 }}
          >
            <SafeIcon icon={FiHelpCircle} className="w-5 h-5 text-gray-600 mr-3" />
            <span>Help</span>
          </motion.div>
        </Link>
      </div>
      
      <div className="border-t border-gray-200 py-2">
        <motion.div 
          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
          whileHover={{ x: 5 }}
          onClick={handleSignOut}
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 text-gray-600 mr-3" />
          <span>Sign Out</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default UserDropdown;