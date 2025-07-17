import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiHeart, FiMessageCircle, FiShare2, FiMoreVertical, 
  FiThumbsUp, FiThumbsDown, FiPlay, FiPause, FiVolume2, FiVolumeX
} = FiIcons;

function ShortsPlayer({ short, index, currentIndex, totalShorts, onNext, onPrev }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 10000) + 1000);
  
  const playerRef = useRef(null);
  const { id, snippet } = short;
  const videoId = typeof id === 'string' ? id : id.videoId;
  
  useEffect(() => {
    // Reset playing state when short changes
    setPlaying(index === currentIndex);
    setLoaded(false);
  }, [currentIndex, index]);
  
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };
  
  const handleVideoReady = () => {
    setLoaded(true);
    if (index === currentIndex) {
      setPlaying(true);
    }
  };
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const isActive = index === currentIndex;
  
  return (
    <motion.div
      className={`relative w-full h-full ${isActive ? 'z-10' : 'z-0'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full bg-black">
        {/* Video Player */}
        <div className="absolute inset-0">
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="100%"
            playing={playing && isActive}
            muted={muted}
            loop={true}
            onReady={handleVideoReady}
            onBuffer={() => setPlaying(false)}
            onBufferEnd={() => setPlaying(true)}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  showinfo: 0,
                  controls: 0,
                  fs: 0,
                  disablekb: 1,
                  rel: 0,
                  iv_load_policy: 3
                }
              }
            }}
          />
        </div>
        
        {/* Loading Overlay */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Thumbnail as Fallback */}
        {!loaded && (
          <img
            src={snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url}
            alt={snippet.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        
        {/* Overlay for controls */}
        <div 
          className="absolute inset-0"
          onClick={() => setPlaying(!playing)}
        >
          {/* Play/Pause Button (shows briefly when clicked) */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
              >
                <SafeIcon icon={FiPlay} className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          )}
          
          {/* Video Info */}
          <div className="absolute bottom-20 left-4 right-16 text-white">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
              {snippet.title}
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              @{snippet.channelTitle}
            </p>
            <p className="text-sm text-gray-300 line-clamp-3">
              {snippet.description}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col space-y-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <div className={`w-12 h-12 ${liked ? 'bg-red-600' : 'bg-white bg-opacity-20'} rounded-full flex items-center justify-center backdrop-blur-sm`}>
              <SafeIcon icon={FiThumbsUp} className="w-6 h-6" />
            </div>
            <span className="text-xs">{formatNumber(likes)}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <SafeIcon icon={FiMessageCircle} className="w-6 h-6" />
            </div>
            <span className="text-xs">{formatNumber(Math.floor(Math.random() * 1000) + 50)}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <SafeIcon icon={FiShare2} className="w-6 h-6" />
            </div>
            <span className="text-xs">Share</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <SafeIcon icon={FiMoreVertical} className="w-6 h-6" />
            </div>
            <span className="text-xs">More</span>
          </motion.button>
        </div>
        
        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center">
          {/* Mute Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMuted(!muted)}
            className="p-2 bg-white bg-opacity-20 rounded-full text-white backdrop-blur-sm"
          >
            <SafeIcon icon={muted ? FiVolumeX : FiVolume2} className="w-5 h-5" />
          </motion.button>
          
          {/* Progress Indicator */}
          <div className="flex-1 mx-4 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: playing ? "100%" : "0%" }}
              transition={{ duration: 15, repeat: playing ? Infinity : 0, ease: "linear" }}
            />
          </div>
          
          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPlaying(!playing)}
            className="p-2 bg-white bg-opacity-20 rounded-full text-white backdrop-blur-sm"
          >
            <SafeIcon icon={playing ? FiPause : FiPlay} className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-0 right-0 px-4 flex justify-between items-center -translate-y-1/2 pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPrev}
            className="p-3 bg-black bg-opacity-20 rounded-full text-white backdrop-blur-sm pointer-events-auto"
          >
            <SafeIcon icon="FiChevronLeft" className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            className="p-3 bg-black bg-opacity-20 rounded-full text-white backdrop-blur-sm pointer-events-auto"
          >
            <SafeIcon icon="FiChevronRight" className="w-6 h-6" />
          </motion.button>
        </div>
        
        {/* Progress Indicator at Top */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex space-x-1">
            {Array.from({ length: totalShorts }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i === currentIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ShortsPlayer;