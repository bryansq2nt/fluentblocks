// components/SocialProof.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

export default function SocialProof() {
  const [supportCount, setSupportCount] = useState<number>(0);
  const [userSupported, setUserSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupportCount = async () => {
      try {
        const response = await fetch('/api/support');
        const data = await response.json();
        const countAsNumber = parseInt(data.count, 10) || 0;
        setSupportCount(countAsNumber);
      } catch (error) {
        console.error("Error al obtener contador de apoyo:", error);
        setSupportCount(128); // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupportCount();
  }, []);

  const handleSupportClick = async () => {
    if (userSupported) return;
    setUserSupported(true);
    setSupportCount(prev => prev + 1);
    try {
      await fetch('/api/support', { method: 'POST' });
    } catch (err) {
      console.error("Error al añadir apoyo:", err);
      setUserSupported(false);
      setSupportCount(prev => prev - 1);
    }
  };

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-600">
      <motion.button
        onClick={handleSupportClick}
        className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={userSupported || isLoading}
        whileTap={{ scale: userSupported ? 1 : 0.9 }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={userSupported ? 'filled' : 'outline'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            {userSupported ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
          </motion.span>
        </AnimatePresence>
        <span className="font-semibold">
          {isLoading ? 'Cargando...' : `${supportCount.toLocaleString()} personas apoyan este sueño`}
        </span>
      </motion.button>
      
      <a
        href="https://instagram.com/bryansq2nt"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors group"
      >
        <FaInstagram className="text-2xl group-hover:scale-110 transition-transform" />
        <span className="font-semibold">Acompáñame en Instagram</span>
      </a>
    </div>
  );
}