import { create } from 'zustand'
import supabase from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  
  initialize: async () => {
    try {
      set({ loading: true })
      
      // Get session data if there's an active session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser()
        set({ user, session, loading: false })
      } else {
        set({ user: null, session: null, loading: false })
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user || null })
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
    }
  },
  
  signIn: async (email, password) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      set({ user: data.user, session: data.session, loading: false })
      return { success: true }
    } catch (error) {
      console.error('Error signing in:', error)
      set({ loading: false })
      return { success: false, error: error.message }
    }
  },
  
  signUp: async (email, password, username) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      })
      
      if (error) throw error
      
      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              username,
              avatar_url: `https://ui-avatars.com/api/?name=${username}&background=random`,
              created_at: new Date()
            }
          ])
        
        if (profileError) throw profileError
      }
      
      set({ user: data.user, session: data.session, loading: false })
      return { success: true }
    } catch (error) {
      console.error('Error signing up:', error)
      set({ loading: false })
      return { success: false, error: error.message }
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true })
      await supabase.auth.signOut()
      set({ user: null, session: null, loading: false })
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      set({ loading: false })
      return { success: false, error: error.message }
    }
  },
  
  updateProfile: async (updates) => {
    try {
      set({ loading: true })
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', useAuthStore.getState().user.id)
      
      if (error) throw error
      
      // Refresh user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', useAuthStore.getState().user.id)
        .single()
      
      set({ 
        user: { 
          ...useAuthStore.getState().user, 
          user_metadata: { 
            ...useAuthStore.getState().user.user_metadata,
            ...updates 
          } 
        }, 
        loading: false,
        profile: profile || null
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error updating profile:', error)
      set({ loading: false })
      return { success: false, error: error.message }
    }
  }
}))

export default useAuthStore