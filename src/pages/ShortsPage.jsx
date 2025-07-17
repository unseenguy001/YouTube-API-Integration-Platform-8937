import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import ShortsPlayer from '../components/shorts/ShortsPlayer';
import youtubeApi from '../services/youtubeApi';
import useVideoStore from '../store/videoStore';

function ShortsPage() {
  const { shorts, fetchShorts, loading } = useVideoStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  
  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);
  
  const nextShort = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevShort = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handlers = useSwipeable({
    onSwipedUp: () => nextShort(),
    onSwipedDown: () => prevShort(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        prevShort();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextShort();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, shorts.length]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  
  if (shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No shorts available</h2>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      {...handlers}
      className="fixed inset-0 bg-black flex items-center justify-center"
    >
      <div className="relative w-full max-w-md h-screen overflow-hidden">
        {shorts.map((short, index) => (
          <ShortsPlayer
            key={typeof short.id === 'string' ? short.id : short.id.videoId}
            short={short}
            index={index}
            currentIndex={currentIndex}
            totalShorts={shorts.length}
            onNext={nextShort}
            onPrev={prevShort}
          />
        ))}
      </div>
    </div>
  );
}

export default ShortsPage;