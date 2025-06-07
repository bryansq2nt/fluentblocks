import { motion } from 'framer-motion';
import type { Word } from '@/types/game';

interface DropZoneProps {
  index: number;
  word?: Word;
  isActive: boolean;
  isCorrect?: boolean;
  onDrop?: (word: Word) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  index,
  word,
  isActive,
  isCorrect
}) => {
  return (
    <motion.div
      className={`
        relative
        w-32 h-16
        rounded-lg
        border-2
        border-dashed
        flex items-center justify-center
        transition-all duration-200
        ${isActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        ${isCorrect === true ? 'border-green-400 bg-green-50' : ''}
        ${isCorrect === false ? 'border-red-400 bg-red-50' : ''}
      `}
      whileHover={isActive ? { scale: 1.05 } : {}}
      animate={{
        boxShadow: isActive 
          ? '0 0 0 4px rgba(59, 130, 246, 0.2)'
          : '0 0 0 0px rgba(59, 130, 246, 0)'
      }}
    >
      {/* Slot number */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 rounded-full text-sm font-medium text-gray-500">
        {index + 1}
      </div>

      {/* Word or placeholder */}
      {word ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-bold"
          style={word.style}
        >
          {word.text}
        </motion.div>
      ) : (
        <div className="text-gray-400 text-sm">
          {isActive ? 'Drop here' : 'Empty'}
        </div>
      )}

      {/* Highlight effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-blue-400/10"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default DropZone; 