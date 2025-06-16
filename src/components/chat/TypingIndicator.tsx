// components/chat/TypingIndicator.tsx
import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="px-4 py-3 rounded-2xl bg-gray-100 flex items-center space-x-1.5">
      <motion.span
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
      <motion.span
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
      <motion.span
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
    </div>
  );
}