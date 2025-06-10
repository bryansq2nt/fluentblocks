// src/components/game/ShareButton.tsx

'use client';

import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  text: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    // La lógica de compartir no cambia, es correcta.
    const shareData = {
      title: title,
      text: text,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500); // Un poco más de tiempo para leer
      } catch (err) {
        console.error('No se pudo copiar el enlace:', err);
        alert('No se pudo copiar el enlace. Por favor, cópialo manualmente.');
      }
    }
  };
  
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      // --- CAMBIOS DE ESTILO AQUÍ ---
      className={`w-full max-w-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-base
        ${isCopied 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }
      `}
    >
      {isCopied ? (
        <>
          <Check className="w-5 h-5" />
          <span>¡Enlace Copiado!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Compartir Nivel</span>
        </>
      )}
    </motion.button>
  );
};