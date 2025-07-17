import { create } from 'zustand'
import supabase from '../lib/supabase'
import useAuthStore from './authStore'

// Mock data for analytics (would be real data in production)
const generateMockViewsData = (days = 30) => {
  const data = []
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 1000) + 100
    })
  }
  return data
}

const generateMockDeviceData = () => {
  return [
    { name: 'Desktop', value: Math.floor(Math.random() * 50) + 30 },
    { name: 'Mobile', value: Math.floor(Math.random() * 40) + 20 },
    { name: 'Tablet', value: Math.floor(Math.random() * 20) + 5 },
    { name: 'TV', value: Math.floor(Math.random() * 10) + 1 },
  ]
}

const generateMockAudienceData = () => {
  return [
    { name: '13-17', value: Math.floor(Math.random() * 10) + 5 },
    { name: '18-24', value: Math.floor(Math.random() * 20) + 15 },
    { name: '25-34', value: Math.floor(Math.random() * 25) + 20 },
    { name: '35-44', value: Math.floor(Math.random() * 20) + 15 },
    { name: '45-54', value: Math.floor(Math.random() * 15) + 10 },
    { name: '55+', value: Math.floor(Math.random() * 10) + 5 },
  ]
}

const useAnalyticsStore = create((set, get) => ({
  viewsData: [],
  deviceData: [],
  audienceData: [],
  engagementData: [],
  revenueData: [],
  topVideos: [],
  loading: false,
  error: null,
  
  // Initialize analytics
  initialize: async () => {
    const { user } = useAuthStore.getState()
    if (user) {
      get().fetchAnalytics()
    }
  },
  
  fetchAnalytics: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return
    
    try {
      set({ loading: true })
      
      // In a real app, we would fetch this data from the backend
      // For this demo, we'll use mock data
      
      // Get user's subscription level to determine analytics access
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      // Basic analytics for all users
      const viewsData = generateMockViewsData(30)
      const deviceData = generateMockDeviceData()
      
      let audienceData = []
      let engagementData = []
      let revenueData = []
      let topVideos = []
      
      // Enhanced analytics for premium and creator users
      if (subscription && ['premium', 'creator'].includes(subscription.plan_id)) {
        audienceData = generateMockAudienceData()
        
        engagementData = viewsData.map(item => ({
          ...item,
          likes: Math.floor(item.views * (Math.random() * 0.1 + 0.05)),
          comments: Math.floor(item.views * (Math.random() * 0.05 + 0.01)),
          shares: Math.floor(item.views * (Math.random() * 0.03 + 0.005)),
        }))
        
        // Advanced analytics for creator users
        if (subscription.plan_id === 'creator') {
          revenueData = viewsData.map(item => ({
            ...item,
            revenue: +(item.views * (Math.random() * 0.001 + 0.0005)).toFixed(2),
          }))
          
          topVideos = Array(5).fill().map((_, i) => ({
            id: `video-${i + 1}`,
            title: `Top Performing Video ${i + 1}`,
            views: Math.floor(Math.random() * 10000) + 1000,
            engagement: Math.floor(Math.random() * 20) + 5,
            revenue: +(Math.random() * 100 + 10).toFixed(2),
          }))
        }
      }
      
      set({
        viewsData,
        deviceData,
        audienceData,
        engagementData,
        revenueData,
        topVideos,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      set({ 
        error: error.message,
        loading: false
      })
    }
  },
  
  getAnalyticsSummary: () => {
    const { viewsData } = get()
    
    if (!viewsData.length) return { total: 0, change: 0 }
    
    const total = viewsData.reduce((sum, item) => sum + item.views, 0)
    
    // Calculate change percentage from previous period
    const halfIndex = Math.floor(viewsData.length / 2)
    const currentPeriod = viewsData.slice(halfIndex).reduce((sum, item) => sum + item.views, 0)
    const previousPeriod = viewsData.slice(0, halfIndex).reduce((sum, item) => sum + item.views, 0)
    
    let change = 0
    if (previousPeriod > 0) {
      change = ((currentPeriod - previousPeriod) / previousPeriod) * 100
    }
    
    return {
      total,
      change: +change.toFixed(1)
    }
  }
}))

export default useAnalyticsStore