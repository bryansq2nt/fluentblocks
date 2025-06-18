// components/game/components/AnswerArea.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { WordOption } from '../types';

interface AnswerAreaProps {
  answer: WordOption[];
  onRemove: (option: WordOption) => void;
  status: 'idle' | 'correct' | 'incorrect';
}

const containerVariants = {
  idle: {},
  correct: {
    transition: {
      staggerChildren: 0.08,
    },
  },
  incorrect: {
    x: [-1, 1, -3, 3, -1, 1, 0],
    transition: { duration: 0.4, ease: "easeInOut" as const },
  },
};

// CAMBIO: Modificamos la transición en las variantes de la palabra.
const wordVariants = {
  idle: {
    y: 0,
  },
  correct: {
    y: [0, -14, 0], // La ruta de 3 puntos se mantiene.
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
  incorrect: {},
};

export function AnswerArea({ answer, onRemove, status }: AnswerAreaProps) {
  const isAnswered = status !== 'idle';

  const containerClasses = {
    idle: 'bg-blue-50 border-blue-200',
    correct: 'bg-green-50 border-green-500',
    incorrect: 'bg-red-50 border-red-500',
  }[status];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
      <motion.div
      variants={containerVariants}
      initial="idle"
      animate={status}
      className={`min-h-[60px] p-4 border-2 border-dashed rounded-xl flex flex-wrap gap-2 transition-colors duration-300 ${containerClasses}`}
    >
      <AnimatePresence>
        {answer.map((opt) => {
          const buttonClasses = {
            idle: 'bg-white border-gray-200 text-gray-800 cursor-pointer',
            correct: 'bg-green-100 border-green-500 text-green-800 font-bold',
            incorrect: 'bg-red-100 border-red-500 text-red-800 font-bold line-through',
          }[status];

          return (
            <motion.button
              key={opt.id}
              variants={wordVariants}
              layoutId={`word-${opt.id}`}
              onClick={() => !isAnswered && onRemove(opt)}
              whileHover={isAnswered ? {} : { scale: 1.05 }}
              whileTap={isAnswered ? {} : { scale: 0.95 }}
              className={`px-4 py-2 rounded-full shadow-sm border font-medium transition-colors duration-300 ${buttonClasses}`}
              disabled={isAnswered}
            >
              {opt.word}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  </div>
  
  );
}