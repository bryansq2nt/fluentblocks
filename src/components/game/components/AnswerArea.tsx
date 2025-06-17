// components/game/components/AnswerArea.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { WordOption } from '../types';

// CAMBIO: La interfaz ahora acepta el estado del feedback.
interface AnswerAreaProps {
  answer: WordOption[];
  onRemove: (option: WordOption) => void;
  status: 'idle' | 'correct' | 'incorrect';
}

// AÑADIDO: Variantes de animación para el efecto de "vibración" en error.
const containerVariants = {
  initial: { x: 0 },
  shake: {
    x: [-1, 1, -3, 3, -1, 1, 0],
    transition: { duration: 0.4, ease: "easeInOut" as const },
  },
};

export function AnswerArea({ answer, onRemove, status }: AnswerAreaProps) {
  const isAnswered = status !== 'idle';

  const containerClasses = {
    idle: 'bg-blue-50 border-blue-200',
    correct: 'bg-green-50 border-green-500',
    incorrect: 'bg-red-50 border-red-500',
  }[status];

  return (
    <motion.div
      variants={containerVariants}
      animate={status === 'incorrect' ? 'shake' : 'initial'}
      className={`min-h-[60px] p-4 border-2 border-dashed rounded-xl flex flex-wrap gap-2 transition-colors duration-300 ${containerClasses}`}
    >
      <AnimatePresence>
        {answer.map((opt) => {
          // AÑADIDO: Clases dinámicas para los botones de palabras.
          const buttonClasses = {
            idle: 'bg-white border-gray-200 text-gray-800 cursor-pointer',
            correct: 'bg-green-100 border-green-500 text-green-800 font-bold',
            incorrect: 'bg-red-100 border-red-500 text-red-800 font-bold line-through',
          }[status];

          return (
            <motion.button
              key={opt.id}
              layoutId={`word-${opt.id}`}
              // CAMBIO: La función onRemove solo se ejecuta si la respuesta no ha sido calificada.
              onClick={() => !isAnswered && onRemove(opt)}
              // Deshabilitamos el hover y tap cuando ya está respondido para evitar distracciones.
              whileHover={isAnswered ? {} : { scale: 1.05 }}
              whileTap={isAnswered ? {} : { scale: 0.95 }}
              className={`px-4 py-2 rounded-full shadow-sm border font-medium transition-colors duration-300 ${buttonClasses}`}
              // AÑADIDO: Deshabilitamos el botón para que no sea enfocable.
              disabled={isAnswered}
            >
              {opt.word}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}