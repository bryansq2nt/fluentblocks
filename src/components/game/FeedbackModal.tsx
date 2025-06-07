// components/FeedbackModal.tsx - Versión con debug mejorado

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    setDebugInfo('Enviando...');
    
    // Preparar los datos
    const feedbackData = {
      rating: rating,
      comment: comment || 'Sin comentario',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      appName: 'FluentBlocks',
      source: 'feedback-modal'
    };

    console.log('📤 Enviando datos al webhook:', feedbackData);
    setDebugInfo(`Datos preparados: ${JSON.stringify(feedbackData, null, 2)}`);
    
    try {
      const response = await fetch('https://hook.us2.make.com/w2ajw433gnby32751sb5np7zo59aery1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      console.log('📥 Respuesta del webhook:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      setDebugInfo(`Respuesta: ${response.status} ${response.statusText}`);

      if (response.ok) {
        console.log('✅ Feedback enviado exitosamente');
        setDebugInfo('¡Enviado exitosamente!');
        onSubmit();
        // Reset form
        setRating(0);
        setComment('');
        setTimeout(() => setDebugInfo(''), 2000);
      } else {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        setDebugInfo(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error enviando feedback:', error);
      setDebugInfo(`Error de red: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setRating(0);
    setComment('');
    setDebugInfo('');
  };

  // Función de prueba para enviar datos simples
  const handleTestWebhook = async () => {
    setDebugInfo('Enviando prueba...');
    
    try {
      const testData = {
        test: true,
        message: 'Test desde FeedbackModal',
        timestamp: new Date().toISOString()
      };

      console.log('🧪 Enviando datos de prueba:', testData);

      const response = await fetch('https://hook.us2.make.com/cjp5l06n8zxrcm0q85chkgfhsfckphjr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('🧪 Respuesta de prueba:', response.status, response.statusText);
      setDebugInfo(`Prueba: ${response.status} ${response.statusText}`);

    } catch (error) {
      console.error('🧪 Error en prueba:', error);
      setDebugInfo(`Error de prueba: ${error instanceof Error ? error.message : 'Error'}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💭</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">¡Tu opinión importa!</h3>
                  <p className="text-sm text-gray-600">Ayúdanos a mejorar</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Debug Info - Solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 font-mono">{debugInfo}</p>
                <button
                  onClick={handleTestWebhook}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
                >
                  Test Webhook
                </button>
              </div>
            )}

            {/* Rating Stars */}
            <div className="mb-6">
              <p className="text-center text-gray-700 font-medium mb-4">
                ¿Cómo calificarías tu experiencia?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-2 text-sm text-gray-600"
                >
                  {rating === 1 && '😞 Necesitamos mejorar mucho'}
                  {rating === 2 && '😐 Puede mejorar'}
                  {rating === 3 && '🙂 Está bien'}
                  {rating === 4 && '😊 ¡Muy bueno!'}
                  {rating === 5 && '🤩 ¡Excelente!'}
                </motion.p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuéntanos más (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Qué te gustó más? ¿Qué podríamos mejorar?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/500 caracteres
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Más tarde
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  rating === 0 || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar Feedback'
                )}
              </motion.button>
            </div>

            {/* Privacy note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Tu feedback es anónimo y nos ayuda a crear una mejor experiencia
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};