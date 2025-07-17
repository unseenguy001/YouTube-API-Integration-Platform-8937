const API_KEY = 'AIzaSyBWCSISZUVet2bV3vwaRUNhTbWmlGFakjo';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

class YouTubeAPI {
  async fetchVideos(query = '', maxResults = 50, pageToken = '') {
    try {
      const url = `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&pageToken=${pageToken}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async fetchShorts(maxResults = 50, pageToken = '') {
    try {
      const url = `${BASE_URL}/search?part=snippet&type=video&videoDuration=short&q=shorts&maxResults=${maxResults}&pageToken=${pageToken}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching shorts:', error);
      throw error;
    }
  }

  async fetchVideoDetails(videoId) {
    try {
      const url = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.items[0];
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  async fetchChannelDetails(channelId) {
    try {
      const url = `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.items[0];
    } catch (error) {
      console.error('Error fetching channel details:', error);
      throw error;
    }
  }

  async fetchTrendingVideos(regionCode = 'US', maxResults = 50) {
    try {
      const url = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      throw error;
    }
  }

  async searchVideos(query, maxResults = 50, pageToken = '') {
    try {
      const url = `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&pageToken=${pageToken}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  formatViewCount(viewCount) {
    const num = parseInt(viewCount);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  }

  getTimeAgo(publishedAt) {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInSeconds = Math.floor((now - published) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }
}

export default new YouTubeAPI();