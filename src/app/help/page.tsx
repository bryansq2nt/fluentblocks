'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, X, Star } from 'lucide-react';

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Advanced Feedback Modal Component
const FeedbackModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
      source: 'help-page'
    };

    console.log('📤 Enviando datos al webhook desde Help:', feedbackData);
    
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
        statusText: response.statusText
      });

      if (response.ok) {
        console.log('✅ Feedback enviado exitosamente desde Help');
        setDebugInfo('¡Enviado exitosamente!');
        // Reset form y cerrar
        setRating(0);
        setComment('');
        setTimeout(() => {
          setDebugInfo('');
          onClose();
        }, 1500);
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
                  <p className="text-sm text-gray-600">Compártenos tu feedback</p>
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
                className="text-black w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                Cancelar
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

// Main Component
export default function HelpPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const faqItems = [
    {
      id: 'patterns',
      question: "¿Por qué patrones en lugar de vocabulario?",
      answer: "Porque saber palabras no significa saber construir oraciones. Los patrones te enseñan la ESTRUCTURA del inglés, como un molde que puedes reutilizar infinitas veces. Es la diferencia entre memorizar frases y realmente entender cómo funciona el idioma."
    },
    {
      id: 'free',
      question: "¿Es gratis FluentBlocks?",
      answer: "Sí, FluentBlocks es completamente gratuito. Nuestro objetivo es democratizar el aprendizaje del inglés y ayudar a todos los hispanohablantes a superar la barrera de construir oraciones."
    },
    {
      id: 'time',
      question: "¿Cuánto tiempo es recomendado estudiar?",
      answer: "Con solo 10-15 minutos diarios puedes ver resultados sorprendentes. La clave no es estudiar muchas horas, sino ser consistente. Es mejor 10 minutos todos los días que 2 horas una vez por semana."
    },
    {
      id: 'beta',
      question: "¿Cuándo se van a desbloquear las demás funciones?",
      answer: "Esta es la versión beta de FluentBlocks. Por ahora solo está disponible el nivel básico para que pruebes nuestra metodología. Las funciones de ranking, perfil completo y niveles intermedio/avanzado estarán listas en un par de meses. ¡Estamos trabajando duro para traértelas pronto!"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Ayuda y Más
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-2">
            {faqItems.map((item) => (
              <FAQItem key={item.id} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Feedback Section - TEXTO ACTUALIZADO */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">¿Tienes algo que decirnos?</h2>
          <p className="text-white/80 mb-6">Tu feedback nos ayuda a mejorar FluentBlocks</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            Compártenos tu feedback
          </button>
        </section>

        {/* Credits Section */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Créditos</h2>
            <p className="text-gray-600 mb-4">
              ¡Hola! Soy Bryan Murgas, creador de FluentBlocks 👋
            </p>
            <p className="text-gray-600 mb-4">
              Después de años estudiando inglés sin poder formar una sola oración fluida, estaba a punto de rendirme. Conocía cientos de palabras, pero cuando intentaba hablar, mi mente se bloqueaba completamente.
            </p>
            <p className="text-gray-600 mb-4">
              Todo cambió cuando descubrí el secreto: no necesitas más vocabulario, necesitas entender los PATRONES.
            </p>
            <p className="text-gray-600 mb-4">
              Una vez que aprendí que el inglés funciona como bloques LEGO que se conectan siguiendo reglas específicas, todo hizo clic. De repente, las palabras tenían un orden lógico, las oraciones fluían naturalmente, y por primera vez pude expresar mis ideas sin traducir en mi cabeza.
            </p>
            <p className="text-gray-600 mb-4">
              FluentBlocks nació de esa revelación. Mi misión es simple: ayudar a cada hispanohablante a experimentar ese momento mágico donde el inglés finalmente &quot;hace sentido&quot;.
            </p>
            <p className="text-gray-600">
              ¿Preguntas? ¿Sugerencias? Escríbeme:{' '}
              <a
                href="mailto:bryan.murgas@mutechlabs.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                bryan.murgas@mutechlabs.com
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Advanced Feedback Modal */}
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}