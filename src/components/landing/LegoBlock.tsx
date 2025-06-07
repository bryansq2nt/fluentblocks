import { motion } from 'framer-motion';
import { useState } from 'react';

interface LegoBlockProps {
  word: string;
  color: string;
  delay?: number;
  isInteractive?: boolean;
  onClick?: () => void;
  translation?: string;
}

const blockColors = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
};

export default function LegoBlock({ 
  word, 
  color, 
  delay = 0, 
  isInteractive = false,
  onClick,
  translation
}: LegoBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0, rotate: -10 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay 
      }}
      whileHover={isInteractive ? { 
        scale: 1.05,
        rotate: [0, -2, 2, -2, 0],
        transition: { duration: 0.3 }
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative px-6 py-4 rounded-lg font-bold text-white
        ${blockColors[color as keyof typeof blockColors]}
        ${isInteractive ? 'cursor-pointer' : ''}
        transform-gpu
        shadow-lg
        hover:shadow-xl
        transition-shadow duration-200
        perspective-1000
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* LEGO studs */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div 
            key={`stud-${i}`}
            className="w-2 h-2 rounded-full bg-white/20"
            style={{
              transform: 'translateZ(2px)',
            }}
          />
        ))}
      </div>
      
      {/* Word text */}
      <div className="relative z-10 text-center">
        <span className="text-xl sm:text-2xl block">
          {word}
        </span>
        {translation && (
          <span className="text-sm opacity-75 block mt-1">
            {translation}
          </span>
        )}
      </div>

      {/* 3D effect layers */}
      <div className="absolute inset-0 rounded-lg bg-black/10" style={{ transform: 'translateZ(-1px)' }} />
      <div className="absolute inset-0 rounded-lg bg-white/10" style={{ transform: 'translateZ(1px)' }} />

      {/* Hover effect */}
      {isHovered && isInteractive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap"
        >
          Haz clic para cambiar
        </motion.div>
      )}

      {/* Click animation indicator */}
      {isInteractive && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          whileTap={{ 
            opacity: [0, 0.2, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
} 