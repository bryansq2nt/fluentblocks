'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface RateLimitMessageProps {
  retryAfter: number;
  message?: string;
}

export function RateLimitMessage({ retryAfter, message }: RateLimitMessageProps) {
  const [countdown, setCountdown] = useState(retryAfter);

  useEffect(() => {
    // Cuando la cuenta llega a cero, recargamos la página.
    if (countdown <= 0) {
      window.location.reload();
      return;
    }

    // Creamos un intervalo que se ejecuta cada segundo.
    const timerId = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    // Limpiamos el intervalo si el componente se desmonta.
    return () => clearInterval(timerId);
  }, [countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-yellow-800 p-8 text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md"
      >
        <h2 className="text-3xl font-bold mb-3 text-yellow-900">¡Vas muy rápido!</h2>
        <p className="mb-6 text-lg">
          {message || 'Para proteger nuestros servicios, hemos limitado temporalmente tus peticiones.'}
        </p>
        
        <div className="flex items-center justify-center gap-3 p-4 bg-yellow-100 rounded-lg text-xl font-semibold">
          <Timer className="w-8 h-8 flex-shrink-0" />
          <span>
            Puedes volver a intentarlo en {countdown} segundo{countdown !== 1 ? 's' : ''}...
          </span>
        </div>
        <p className="mt-4 text-sm text-yellow-700">
          La página se recargará automáticamente cuando el tiempo termine.
        </p>
      </motion.div>
    </div>
  );
} 