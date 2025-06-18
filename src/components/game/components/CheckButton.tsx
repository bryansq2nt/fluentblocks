// components/game/components/CheckButton.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

// Definimos las props que necesitará nuestro botón.
interface CheckButtonProps {
  /**
   * Función que se ejecuta cuando se hace clic en el botón.
   */
  onClick: () => void;
  /**
   * Determina si el botón debe ser visible.
   */
  isVisible: boolean;
}

export function CheckButton({ onClick, isVisible }: CheckButtonProps) {
  return (
    // AnimatePresence es crucial para que la animación de salida (exit) funcione
    // cuando `isVisible` se vuelve `false`.
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="check-button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg"
        >
          Revisar
        </motion.button>
      )}
    </AnimatePresence>
  );
}