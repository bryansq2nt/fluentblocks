import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface CompletionScreenProps {
  onSessionComplete: () => void;
}

export function CompletionScreen({ onSessionComplete }: CompletionScreenProps) {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[60vh]">
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Lección Completada!</h2>
        <p className="text-gray-600 text-lg mb-6">Has practicado este patrón con éxito.</p>
        <motion.button
          onClick={onSessionComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          Volver
        </motion.button>
      </motion.div>
    </div>
  );
} 