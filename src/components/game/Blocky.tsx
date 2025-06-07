import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockyProps } from '@/types/game';

// Animation variants
const blockyVariants = {
  idle: {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut"
    }
  },
  blink: {
    scaleY: [1, 0.1, 1],
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  thinking: {
    rotate: [-5, 5, -5],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut"
    }
  },
  excited: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut"
    }
  },
  celebrating: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut"
    }
  }
};

// Expression components
const Eyes: React.FC<{ expression: BlockyProps['emotion'] }> = ({ expression }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const getEyeStyle = () => {
    switch (expression) {
      case 'thinking':
        return 'w-2 h-2 bg-gray-600';
      case 'excited':
        return 'w-3 h-3 bg-yellow-400';
      default:
        return 'w-2 h-2 bg-gray-700';
    }
  };

  return (
    <div className="flex gap-4 justify-center mt-4">
      <motion.div
        className={`${getEyeStyle()} rounded-full`}
        animate={isBlinking ? "blink" : "idle"}
        variants={blockyVariants}
      />
      <motion.div
        className={`${getEyeStyle()} rounded-full`}
        animate={isBlinking ? "blink" : "idle"}
        variants={blockyVariants}
      />
    </div>
  );
};

const Mouth: React.FC<{ expression: BlockyProps['emotion'] }> = ({ expression }) => {
  const getMouthStyle = () => {
    switch (expression) {
      case 'happy':
        return 'w-8 h-4 border-b-4 border-gray-700 rounded-b-full';
      case 'excited':
        return 'w-10 h-6 border-b-4 border-gray-700 rounded-b-full';
      case 'thinking':
        return 'w-6 h-6 border-2 border-gray-700 rounded-full flex items-center justify-center text-gray-700 text-sm';
      default:
        return 'w-8 h-4 border-b-4 border-gray-700 rounded-b-full';
    }
  };

  return (
    <div className={`${getMouthStyle()} mt-2`}>
      {expression === 'thinking' && '?'}
    </div>
  );
};

// Typewriter effect component
const TypewriterText: React.FC<{ text: string; onComplete: () => void }> = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
    onComplete();
  }, [currentIndex, text, onComplete]);

  return <span>{displayText}</span>;
};

// Main Blocky component
const Blocky: React.FC<BlockyProps> = ({ 
  emotion = 'happy',
  message,
  position
}) => {
  const [isMessageComplete, setIsMessageComplete] = useState(false);
  const getAnimationVariant = () => {
    switch (emotion) {
      case 'thinking':
        return 'thinking';
      case 'excited':
        return 'excited';
      case 'happy':
        return 'idle';
      default:
        return 'idle';
    }
  };

  const positionStyle = position ? {
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: position.z
  } : undefined;

  return (
    <div className="relative" style={positionStyle}>
      {/* Blocky Character */}
      <motion.div
        className="level-3d w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer"
        animate={getAnimationVariant()}
        variants={blockyVariants}
        initial="idle"
      >
        <Eyes expression={emotion} />
        <Mouth expression={emotion} />
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute left-1/2 -translate-x-1/2 -top-24 w-48 bg-white rounded-lg p-3 shadow-lg"
          >
            <div className="relative">
              <div className="text-sm text-gray-700">
                <TypewriterText 
                  text={message} 
                  onComplete={() => { if (!isMessageComplete) setIsMessageComplete(true); }} 
                />
              </div>
              {/* Speech bubble pointer */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blocky; 