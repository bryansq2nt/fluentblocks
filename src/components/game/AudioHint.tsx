// components/game/AudioHint.tsx
'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { useOnClickOutside } from '../../hooks/useOnClickOutside'; // Asegúrate de que la ruta sea correcta
import { useExerciseTracking } from '../../context/ExerciseTrackingContext';


interface AudioHintProps {
  sentence: string;
  isVisible: boolean;
  onToggle: () => void;
}

export default function AudioHint({ sentence, isVisible, onToggle }: AudioHintProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { trackInteraction } = useExerciseTracking();

  // Usa el hook para cerrar el popover si se hace clic fuera
  // Solo se cierra si está visible
  useOnClickOutside(popoverRef, () => {
    if (isVisible) {
      trackInteraction({
        type: 'AUDIO_HINT_USED',
        timestamp: Date.now(),
        data: {
          sentence: sentence
        }
      });
      onToggle();
    }
  });

  return (
    // Envolvemos todo en un div con ref para que el hook sepa qué elemento "ignorar"
    <div ref={popoverRef} className="relative flex items-center justify-center gap-4 mt-4">
      
      <motion.button
        onClick={() => onToggle()}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        // No necesitamos `disabled` porque el popover se cerrará solo
        whileTap={{ scale: 0.95 }}
      >
        <Lightbulb className="w-5 h-5" />
        <span>{isVisible ? 'Ocultar pista' : 'Pedir una pista'}</span>
      </motion.button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            // El popover ahora se posiciona de forma absoluta respecto al contenedor con ref
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-10"
          >
            <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
              <AudioPlayer sentence={sentence} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}