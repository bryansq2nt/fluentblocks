import { motion, AnimatePresence } from 'framer-motion';
import { WordOption } from '../types';

interface AnswerAreaProps {
  answer: WordOption[];
  onRemove: (option: WordOption) => void;
}

export function AnswerArea({ answer, onRemove }: AnswerAreaProps) {
  return (
    <motion.div
      className="min-h-[60px] p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl flex flex-wrap gap-2"
      whileHover={{ backgroundColor: '#E0F2FE' }}
    >
      <AnimatePresence>
        {answer.map((opt) => (
          <motion.button
            key={opt.id}
            layoutId={`word-${opt.id}`}
            onClick={() => onRemove(opt)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 font-medium text-gray-800 cursor-pointer"
          >
            {opt.word}
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
} 