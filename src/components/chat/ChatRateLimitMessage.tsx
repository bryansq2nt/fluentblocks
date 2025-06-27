'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ChatRateLimitMessageProps {
  retryAfter: number;
  message?: string;
  onTimeout: () => void;
}

export function ChatRateLimitMessage({ retryAfter, message, onTimeout }: ChatRateLimitMessageProps) {
  const [timeLeft, setTimeLeft] = useState(retryAfter);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⏰</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          ¡Ups! Has enviado demasiados mensajes
        </h3>
        <p className="text-gray-600 mb-4">
          {message || 'Has excedido el límite de 5 mensajes por minuto.'}
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold text-blue-600">
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <p className="text-sm text-gray-500">
          Puedes enviar otro mensaje cuando el temporizador llegue a cero
        </p>
      </div>
    </div>
  );
} 