'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTest: () => void;
  onViewCommunity: () => void;
  onShareCommunity: () => void;
}

export default function ActionModal({
  isOpen,
  onClose,
  onTest,
  onViewCommunity,
  onShareCommunity,
}: ActionModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            ¿Qué deseas hacer?
          </h2>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => { onTest(); onClose(); }}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Probar la app
            </button>

            <button
              onClick={() => { onViewCommunity(); onClose(); }}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Mural de la comunidad
            </button>

            <button
              onClick={() => { onShareCommunity(); onClose(); }}
              className="w-full py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Compartir en el mural de la comunidad
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </>
  );
}
