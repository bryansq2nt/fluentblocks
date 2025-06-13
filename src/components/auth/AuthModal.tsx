'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/home' });
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  // const handleFacebookPopup = () => {
  //   const origin = window.location.origin
  //   const fbSignInUrl = `${origin}/api/auth/signin/facebook?` +
  //     `callbackUrl=${encodeURIComponent(origin + "/home")}`
  
  //   window.open(
  //     fbSignInUrl,
  //     "fbLogin",
  //     "width=500,height=600,toolbar=0,status=0"
  //   )
  // }
  
  

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
                disabled={!acceptedTerms}
              >
                <Image src="/google.svg" alt="Google" width={24} height={24} />
                <span className="font-medium" style={{ color: 'black' }}>Continuar con Google</span>
              </button>
              {/* <button
                onClick={handleFacebookPopup}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={!acceptedTerms}
              >
                <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
                <span className="font-medium" style={{ color: 'black' }}>Continuar con Facebook</span>
              </button> */}
              
              {/* Aquí se pueden agregar más botones de login en el futuro */}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="accept-terms"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded"
              />
              <label htmlFor="accept-terms" className="text-sm text-gray-700 select-none">
                He leído y acepto los
                <a href="/terms-and-conditions" target="_blank" className="text-blue-600 underline mx-1">Términos y Condiciones</a>
                y la
                <a href="/privacy-policy" target="_blank" className="text-blue-600 underline mx-1">Política de Privacidad</a>.
              </label>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 