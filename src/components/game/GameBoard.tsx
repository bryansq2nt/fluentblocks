import { motion } from 'framer-motion';
import WordBlock from './WordBlock';
import DropZone from './DropZone';
import type { Word } from '@/types/game';

interface GameBoardProps {
  pattern: string;
  words: Word[];
  dropZones: (Word | undefined)[];
  isDragging: boolean;
  onWordDragStart: (word: Word) => void;
  onWordDragEnd: (word: Word) => void;
  onWordDrop: (word: Word, index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  pattern,
  words,
  dropZones,
  isDragging,
  onWordDragStart,
  onWordDragEnd,
  onWordDrop
}) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      {/* Pattern Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Form the sentence:</h2>
        <p className="text-lg text-gray-600">{pattern}</p>
      </motion.div>

      {/* Blocky Character */}
      <div className="absolute top-4 right-4">
       
      </div>

      {/* Drop Zones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 justify-center mb-12"
      >
        {dropZones.map((word, index) => (
          <DropZone
            key={`dropzone-${index}-${word?.id || 'empty'}`}
            index={index}
            word={word}
            isActive={isDragging}
            onDrop={(word) => onWordDrop(word, index)}
          />
        ))}
      </motion.div>

      {/* Word Pool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        {words.map((word) => (
          <WordBlock
            key={word.id}
            word={word}
            isDragging={isDragging}
            onDragStart={onWordDragStart}
            onDragEnd={onWordDragEnd}
            onDrop={() => {}}
          />
        ))}
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-600">
            Exercise 1 of 4
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default GameBoard; 