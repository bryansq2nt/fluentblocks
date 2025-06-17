// components/landing/AIPromoCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AIPromoCard() {
  return (
    <Link href="/chat">
      <motion.a
        // Animaciones de entrada y hover
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ y: -5, boxShadow: '0 25px 40px -12px rgba(0, 0, 0, 0.2)' }}
        viewport={{ once: true, amount: 0.5 }}
        className="
          block max-w-4xl mx-auto
          p-6 sm:p-8 rounded-3xl
          bg-gradient-to-r from-blue-600 via-indigo-600 to-green-500
          shadow-lg
          relative overflow-hidden
          cursor-pointer
          text-white
        "
      >
        {/* Efecto de brillo de fondo */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-white/10 rounded-full opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
          {/* Icono */}
          <div className="flex-shrink-0">
            <div className="p-4 bg-white/20 rounded-full border-2 border-white/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          {/* Texto */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              Conoce a tu Tutor Personal AI
            </h3>
            <p className="text-base sm:text-lg text-white/80">
              ¿Tienes una duda? Chatea con nuestra IA y obtén explicaciones y ejemplos de la vida real al instante.
            </p>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}