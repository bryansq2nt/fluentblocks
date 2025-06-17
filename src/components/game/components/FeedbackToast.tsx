import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { FeedbackStatus } from '../types';

interface FeedbackToastProps {
  status: FeedbackStatus;
  onNext: () => void;
  onRetry: () => void;
}

export function FeedbackToast({ status, onNext, onRetry }: FeedbackToastProps) {
  if (status === 'idle') return null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className={`fixed inset-x-4 bottom-6 p-4 rounded-xl shadow-lg ${
        status === 'correct' ? 'bg-green-100' : 'bg-red-100'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === 'correct' ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <XCircle className="w-8 h-8 text-red-600" />
          )}
          <p
            className={`font-semibold ${
              status === 'correct' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {status === 'correct'
              ? '¡Perfecto! El orden es correcto.'
              : '¡Casi! Inténtalo de nuevo.'}
          </p>
        </div>
        <button
          onClick={status === 'correct' ? onNext : onRetry}
          className={`px-5 py-2 rounded-lg font-bold text-white transition ${
            status === 'correct'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {status === 'correct' ? 'Continuar' : 'Reintentar'}
        </button>
      </div>
    </motion.div>
  );
} 