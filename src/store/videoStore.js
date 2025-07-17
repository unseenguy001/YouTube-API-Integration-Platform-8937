import { create } from 'zustand';
import supabase from '../lib/supabase';
import youtubeApi from '../services/youtubeApi';

const useVideoStore = create((set, get) => ({
  videos: [],
  shorts: [],
  trending: [],
  userVideos: [],
  userLikedVideos: [],
  userHistory: [],
  currentVideo: null,
  loading: false,
  error: null,
  
  // Fetch videos from YouTube API
  fetchVideos: async (query = '', maxResults = 50, pageToken = '') => {
    try {
      set({ loading: true, error: null });
      const data = await youtubeApi.fetchVideos(query, maxResults, pageToken);
      set({ videos: data.items || [], loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      set({ error: error.message, loading: false });
      return { items: [] };
    }
  },

  fetchTrending: async () => {
    try {
      set({ loading: true, error: null });
      const data = await youtubeApi.fetchTrendingVideos();
      set({ trending: data.items || [], loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      set({ error: error.message, loading: false });
      return { items: [] };
    }
  },

  fetchShorts: async () => {
    try {
      set({ loading: true, error: null });
      const data = await youtubeApi.fetchShorts(50);
      set({ shorts: data.items || [], loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching shorts:', error);
      set({ error: error.message, loading: false });
      return { items: [] };
    }
  },

  fetchVideoDetails: async (videoId) => {
    try {
      set({ loading: true, error: null });
      const videoData = await youtubeApi.fetchVideoDetails(videoId);
      set({ currentVideo: videoData, loading: false });
      
      // Add to history if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (user && videoData) {
        await supabase
          .from('video_history')
          .upsert([{
            user_id: user.id,
            video_id: videoId,
            title: videoData.snippet.title,
            thumbnail: videoData.snippet.thumbnails.medium.url,
            channel_id: videoData.snippet.channelId,
            channel_title: videoData.snippet.channelTitle,
            viewed_at: new Date()
          }], { onConflict: 'user_id,video_id' });
      }
      
      return videoData;
    } catch (error) {
      console.error('Error fetching video details:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // User video interactions
  likeVideo: async (videoId, videoData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) return { success: false, error: 'User not logged in' };
      
      const { error } = await supabase
        .from('video_likes')
        .upsert([{
          user_id: user.id,
          video_id: videoId,
          title: videoData.snippet.title,
          thumbnail: videoData.snippet.thumbnails.medium.url,
          channel_id: videoData.snippet.channelId,
          channel_title: videoData.snippet.channelTitle,
          liked_at: new Date()
        }], { onConflict: 'user_id,video_id' });
      
      if (error) throw error;
      
      // Refresh liked videos
      get().fetchUserLikedVideos();
      return { success: true };
    } catch (error) {
      console.error('Error liking video:', error);
      return { success: false, error: error.message };
    }
  },

  unlikeVideo: async (videoId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) return { success: false, error: 'User not logged in' };
      
      const { error } = await supabase
        .from('video_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', videoId);
      
      if (error) throw error;
      
      // Refresh liked videos
      get().fetchUserLikedVideos();
      return { success: true };
    } catch (error) {
      console.error('Error unliking video:', error);
      return { success: false, error: error.message };
    }
  },

  isVideoLiked: async (videoId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('video_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single();
      
      if (error) return false;
      return !!data;
    } catch (error) {
      console.error('Error checking if video is liked:', error);
      return false;
    }
  },

  // User video history and liked videos
  fetchUserHistory: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        set({ userHistory: [] });
        return [];
      }
      
      set({ loading: true });
      const { data, error } = await supabase
        .from('video_history')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false });
      
      if (error) throw error;
      set({ userHistory: data || [], loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching user history:', error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  fetchUserLikedVideos: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        set({ userLikedVideos: [] });
        return [];
      }
      
      set({ loading: true });
      const { data, error } = await supabase
        .from('video_likes')
        .select('*')
        .eq('user_id', user.id)
        .order('liked_at', { ascending: false });
      
      if (error) throw error;
      set({ userLikedVideos: data || [], loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching liked videos:', error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  clearHistory: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) return { success: false, error: 'User not logged in' };
      
      const { error } = await supabase
        .from('video_history')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      set({ userHistory: [] });
      return { success: true };
    } catch (error) {
      console.error('Error clearing history:', error);
      return { success: false, error: error.message };
    }
  }
}));

export default useVideoStore;