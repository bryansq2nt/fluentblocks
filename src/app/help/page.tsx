'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, X } from 'lucide-react';

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

// Feedback Modal Component
const FeedbackModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">¡Nos encanta escucharte!</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Cuéntanos qué piensas de FluentBlocks..."
                className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow"
                >
                  Enviar feedback
                </button>
              </div>
            </form>
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

        {/* Feedback Section */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">¿Tienes algo que decirnos?</h2>
          <p className="text-white/80 mb-6">Tu opinión nos ayuda a mejorar FluentBlocks</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            Comparte tu experiencia
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

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
} 