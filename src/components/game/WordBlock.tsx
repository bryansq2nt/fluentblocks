import { motion } from 'framer-motion';
import type { WordBlockProps } from '@/types/game';

const WordBlock: React.FC<WordBlockProps> = ({
  word,
  onDragStart,
  onDragEnd,
  isDragging,
  isCorrect
}) => {
  const handleDragStart = () => {
    onDragStart(word);
  };

  const handleDragEnd = () => {
    onDragEnd(word);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        level-3d
        relative
        px-4 py-2
        rounded-lg
        cursor-grab
        select-none
        ${isDragging ? 'cursor-grabbing scale-110' : ''}
        ${isCorrect ? 'ring-2 ring-green-500' : ''}
        transition-all duration-200
      `}
      style={word.style}
      whileHover={{ 
        scale: 1.05,
        rotate: [-1, 1, -1],
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: isDragging ? -5 : 0,
        boxShadow: isDragging 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Top highlight */}
      <div className="absolute inset-0 bg-white/20 rounded-lg pointer-events-none" />
      
      {/* Bottom shadow */}
      <div className="absolute inset-0 bg-black/10 rounded-lg pointer-events-none" />
      
      {/* Word text */}
      <span className="relative z-10 text-white font-bold text-lg">
        {word.text}
      </span>
    </motion.div>
  );
};

export default WordBlock; 