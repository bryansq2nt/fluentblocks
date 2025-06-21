import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackToastProps {
  status: 'correct' | 'incorrect' | 'idle';
  message: string;
  onNext: () => void;
  onRetry: () => void;
  canRetry: boolean;
}

export function FeedbackToast({ status, message, onNext, onRetry, canRetry }: FeedbackToastProps) {
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className={`fixed inset-x-4 bottom-6 p-4 rounded-xl shadow-lg border ${
            status === 'correct'
              ? 'bg-green-100 border-green-200'
              : 'bg-red-100 border-red-200'
          }`}
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {status === 'correct' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <p className={`font-semibold ${status === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              {status === 'incorrect' && canRetry && (
                <button
                  onClick={onRetry}
                  className="px-5 py-2 rounded-lg font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Reintentar
                </button>
              )}
              <button
                onClick={onNext}
                className={`px-5 py-2 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg ${
                  status === 'correct'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 