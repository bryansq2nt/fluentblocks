// components/game/AudioHint.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Volume2 } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

export default function AudioHint({ sentence }: { sentence: string }) {
  // Estado para controlar la visibilidad del reproductor de audio
  const [isHintVisible, setIsHintVisible] = useState(false);

  const handleHintClick = () => {
    // Si la pista ya está visible, no hacemos nada más al tocar el texto.
    // El usuario ahora debe interactuar con el AudioPlayer.
    if (isHintVisible) return;
    setIsHintVisible(true);
  };

  return (
    // El contenedor principal ahora alinea los elementos horizontalmente
    <div className="flex items-center justify-center gap-4 mt-4">
      
      {/* Botón/Etiqueta que revela la pista */}
      <motion.button
        onClick={handleHintClick}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isHintVisible} // Se desactiva una vez que la pista está visible
        whileTap={{ scale: 0.95 }}
      >
        <Lightbulb className="w-5 h-5" />
        <span>Pedir una pista</span>
      </motion.button>
      
      {/* Contenedor para el AudioPlayer que aparecerá con una animación */}
      <div className="relative h-10">
        <AnimatePresence>
          {isHintVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <AudioPlayer sentence={sentence} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}