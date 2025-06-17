import { motion } from 'framer-motion';
import { WordOption } from '../types';

interface WordBankProps {
  options: WordOption[];
  onSelect: (option: WordOption) => void;
}

export function WordBank({ options, onSelect }: WordBankProps) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <p className="text-sm text-gray-600 mb-2">Palabras disponibles:</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onSelect(opt)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-800 font-medium text-center"
          >
            {opt.word}
          </motion.button>
        ))}
      </div>
    </div>
  );
} 