import { AnimatePresence, motion } from 'framer-motion';

type WordOption = { id: number; word: string };

interface WordBankProps {
  options: WordOption[];
  onSelect: (option: WordOption) => void;
}

export function WordBank({ options, onSelect }: WordBankProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <AnimatePresence>
        {options.map(opt => (
          <motion.button
            key={opt.id}
            layoutId={`word-${opt.id}`}
            onClick={() => onSelect(opt)}
            whileHover={{ y: -2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-gray-800 text-center min-w-[80px] transition-colors duration-150"
          >
            {opt.word}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
} 