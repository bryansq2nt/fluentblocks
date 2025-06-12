'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/home' });
    } catch (error) {
      console.error('Error during Google login:', error);
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
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Image src="/google.svg" alt="Google" width={24} height={24} />
                <span className="font-medium" style={{ color: 'black' }}>Continuar con Google</span>
              </button>
              
              {/* Aquí se pueden agregar más botones de login en el futuro */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 