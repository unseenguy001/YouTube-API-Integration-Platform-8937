import { create } from 'zustand'
import supabase from '../lib/supabase'
import useAuthStore from './authStore'

const useSubscriptionStore = create((set, get) => ({
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      features: [
        'Limited access to content',
        'Standard video quality',
        'Ad-supported experience',
        'Basic analytics'
      ],
      color: 'bg-gray-600',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      features: [
        'Full access to all videos',
        'Ad-free experience',
        'HD video quality',
        'Download videos for offline viewing',
        'Enhanced analytics'
      ],
      color: 'bg-blue-600',
      popular: true
    },
    {
      id: 'creator',
      name: 'Creator Pro',
      price: 19.99,
      features: [
        'All Premium features',
        'Advanced analytics dashboard',
        'Priority support',
        'Monetization options',
        'Custom channel branding'
      ],
      color: 'bg-purple-600',
      popular: false
    }
  ],
  userSubscription: null,
  loading: false,
  error: null,
  
  // Initialize on app load
  initialize: async () => {
    const { user } = useAuthStore.getState()
    if (user) {
      get().fetchUserSubscription()
    }
  },
  
  fetchUserSubscription: async () => {
    const { user } = useAuthStore.getState()
    if (!user) {
      set({ userSubscription: null })
      return null
    }
    
    try {
      set({ loading: true })
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found" error
        throw error
      }
      
      set({ 
        userSubscription: data || null,
        loading: false
      })
      
      return data
    } catch (error) {
      console.error('Error fetching subscription:', error)
      set({ 
        error: error.message,
        loading: false
      })
      return null
    }
  },
  
  subscribeToPlan: async (planId) => {
    const { user } = useAuthStore.getState()
    if (!user) return { success: false, error: 'User not logged in' }
    
    try {
      set({ loading: true })
      
      // Get plan details
      const plan = get().plans.find(p => p.id === planId)
      if (!plan) throw new Error('Invalid plan selected')
      
      // Check if user already has a subscription
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      let result
      
      if (existingSubscription) {
        // Update existing subscription
        result = await supabase
          .from('subscriptions')
          .update({
            plan_id: planId,
            amount: plan.price,
            status: 'active',
            updated_at: new Date()
          })
          .eq('user_id', user.id)
      } else {
        // Create new subscription
        result = await supabase
          .from('subscriptions')
          .insert([{
            user_id: user.id,
            plan_id: planId,
            amount: plan.price,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          }])
      }
      
      if (result.error) throw result.error
      
      // Refresh subscription data
      get().fetchUserSubscription()
      
      set({ loading: false })
      return { success: true }
    } catch (error) {
      console.error('Error subscribing to plan:', error)
      set({ 
        error: error.message,
        loading: false
      })
      return { success: false, error: error.message }
    }
  },
  
  cancelSubscription: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return { success: false, error: 'User not logged in' }
    
    try {
      set({ loading: true })
      
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date()
        })
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Refresh subscription data
      get().fetchUserSubscription()
      
      set({ loading: false })
      return { success: true }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      set({ 
        error: error.message,
        loading: false
      })
      return { success: false, error: error.message }
    }
  },
  
  getUserPlanName: () => {
    const { userSubscription, plans } = get()
    if (!userSubscription || userSubscription.status !== 'active') return 'Basic (Free)'
    
    const plan = plans.find(p => p.id === userSubscription.plan_id)
    return plan ? plan.name : 'Unknown Plan'
  },
  
  canAccessFeature: (feature) => {
    const { userSubscription, plans } = get()
    
    // If no active subscription, user has basic free tier
    if (!userSubscription || userSubscription.status !== 'active') {
      const basicPlan = plans.find(p => p.id === 'basic')
      return basicPlan.features.includes(feature)
    }
    
    // Otherwise check if their plan includes the feature
    const userPlan = plans.find(p => p.id === userSubscription.plan_id)
    if (!userPlan) return false
    
    return userPlan.features.includes(feature)
  }
}))

export default useSubscriptionStore