import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import useSubscriptionStore from '../store/subscriptionStore';
import useAuthStore from '../store/authStore';
import AuthModal from '../components/auth/AuthModal';

const { FiCheck, FiStar } = FiIcons;

function SubscriptionPage() {
  const { 
    plans, 
    userSubscription, 
    subscribeToPlan, 
    cancelSubscription, 
    fetchUserSubscription, 
    loading 
  } = useSubscriptionStore();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    }
  }, [user, fetchUserSubscription]);
  
  const handleSubscribe = async (planId) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setProcessingPlanId(planId);
    setSuccessMessage('');
    setErrorMessage('');
    
    const result = await subscribeToPlan(planId);
    
    if (result.success) {
      setSuccessMessage(`Successfully subscribed to ${plans.find(p => p.id === planId).name}!`);
    } else {
      setErrorMessage(result.error || 'Failed to subscribe. Please try again.');
    }
    
    setProcessingPlanId(null);
  };
  
  const handleCancelSubscription = async () => {
    setProcessingPlanId('cancel');
    setSuccessMessage('');
    setErrorMessage('');
    
    const result = await cancelSubscription();
    
    if (result.success) {
      setSuccessMessage('Your subscription has been canceled. You will have access until the end of your billing period.');
    } else {
      setErrorMessage(result.error || 'Failed to cancel subscription. Please try again.');
    }
    
    setProcessingPlanId(null);
  };
  
  const isCurrentPlan = (planId) => {
    return userSubscription && userSubscription.plan_id === planId && userSubscription.status === 'active';
  };
  
  return (
    <div className="max-w-7xl mx-auto pt-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock premium features and enhanced content with our subscription plans.
        </p>
      </motion.div>
      
      {successMessage && (
        <motion.div
          className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {successMessage}
        </motion.div>
      )}
      
      {errorMessage && (
        <motion.div
          className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {errorMessage}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
              plan.popular ? 'border-red-500 transform scale-105 md:scale-110' : 'border-transparent'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {plan.popular && (
              <div className="bg-red-600 text-white text-center py-2">
                <span className="text-sm font-medium flex items-center justify-center">
                  <SafeIcon icon={FiStar} className="w-4 h-4 mr-1" />
                  MOST POPULAR
                </span>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price.toFixed(2)}</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full ${plan.color} flex items-center justify-center mt-0.5 mr-2`}>
                      <SafeIcon icon={FiCheck} className="w-3 h-3 text-white" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isCurrentPlan(plan.id) || loading || !!processingPlanId}
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 rounded-lg font-medium ${
                  isCurrentPlan(plan.id)
                    ? 'bg-green-600 text-white cursor-default'
                    : `${plan.color} text-white hover:opacity-90`
                }`}
              >
                {processingPlanId === plan.id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : isCurrentPlan(plan.id) ? (
                  'Current Plan'
                ) : (
                  `Get ${plan.name}`
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {userSubscription && userSubscription.status === 'active' && (
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 mb-4">
            You are currently subscribed to the {plans.find(p => p.id === userSubscription.plan_id)?.name || 'Unknown'} plan.
            Your next billing date is {new Date(userSubscription.current_period_end).toLocaleDateString()}.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancelSubscription}
            disabled={loading || processingPlanId === 'cancel'}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
          >
            {processingPlanId === 'cancel' ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              'Cancel Subscription'
            )}
          </motion.button>
        </motion.div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default SubscriptionPage;