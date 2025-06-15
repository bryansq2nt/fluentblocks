// components/CommentModal.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Definimos los props que el componente recibirá
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCommentSubmitted: () => void; // Callback para refrescar la lista de comentarios
};

// Datos para la Barra de Pasión
// Mapea el valor numérico a un emoji y una etiqueta de texto
const passionLevels: { [key: number]: { emoji: string; label: string } } = {
  1: { emoji: '😐', label: 'Hmm...' },
  2: { emoji: '🙂', label: 'Interesante' },
  3: { emoji: '😊', label: 'Me gusta' },
  4: { emoji: '🤩', label: '¡Me encanta!' },
  5: { emoji: '❤️‍🔥', label: '¡Pura Pasión!' },
};

export default function CommentModal({ isOpen, onClose, onCommentSubmitted }: Props) {
  // Estado para el nivel de pasión (el valor numérico del slider)
  const [passionLevel, setPassionLevel] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        // Guardamos el nivel de pasión como 'rating' para mantener la consistencia con la DB
        rating: passionLevel,
        comment: comment.trim() || 'Sin comentario',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        appName: 'FluentBlocks',
        source: 'feedback-modal'
      };
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      onCommentSubmitted();
      onClose();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Hubo un error al enviar tu comentario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-serif font-bold mb-2 text-gray-800">Deja tu huella en este sueño.</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Tu reacción y tus palabras son el combustible que impulsa este proyecto. Serán publicadas anónimamente para inspirar a toda nuestra comunidad.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- INICIO DE LA BARRA DE PASIÓN --- */}
          <div className="pt-2">
            <label htmlFor="passion-slider" className="text-center block font-semibold text-gray-700 mb-4">
              ¿Cuánta pasión te transmite la idea?
            </label>
            
            <div className="relative h-10 flex items-center">
              <input
                id="passion-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={passionLevel}
                onChange={(e) => setPassionLevel(Number(e.target.value))}
                // Usamos clases de Tailwind para estilizar el slider
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer range-lg"
                style={{
                  // El estilo en línea calcula el gradiente de color dinámicamente
                  background: `linear-gradient(to right, #F43F5E ${((passionLevel - 1) / 4) * 100}%, #e5e7eb ${((passionLevel - 1) / 4) * 100}%)`
                }}
              />
              <div
                className="absolute text-4xl -top-5 transition-all duration-150 ease-out pointer-events-none"
                // Calculamos la posición del emoji para que siga al cursor del slider
                style={{ left: `calc(${((passionLevel - 1) / 4) * 100}% - 18px)` }}
              >
                {passionLevels[passionLevel as keyof typeof passionLevels].emoji}
              </div>
            </div>

            <p className="text-center text-rose-600 font-bold mt-2 h-6">
              {passionLevels[passionLevel as keyof typeof passionLevels].label}
            </p>
          </div>
          {/* --- FIN DE LA BARRA DE PASIÓN --- */}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ej: '¡Gran iniciativa! El mundo necesita más formas de aprender con pasión...'"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors text-gray-900"
          />
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Quizás luego
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Grabando..." : "Dejar mi Huella"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}