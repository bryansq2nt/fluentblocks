// src/components/game/AudioPlayer.tsx

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2, Snail } from 'lucide-react';

interface AudioPlayerProps {
  sentence: string;
}

const slowSpeeds = [0.75, 0.5]; // [Lento, Súper Lento]

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ sentence }) => {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [slowSpeedIndex, setSlowSpeedIndex] = useState(0); // Índice para el array de velocidades

  const playAudio = async (speed: number) => {
    if (!sentence || status === 'loading') return;
    setStatus('loading');

    const fileName = sentence.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.mp3';
    const audioUrl = `/audios/${fileName}`;

    const performPlay = (url: string) => {
      const audio = new Audio(url);
      audio.playbackRate = speed;
      audio.play();
      audio.onended = () => setStatus('idle');
      audio.onerror = () => {
        console.error("Error al reproducir audio.");
        setStatus('idle'); // Resetea incluso si hay error
      };
    };

    try {
      const response = await fetch(audioUrl);
      if (response.ok) {
        performPlay(audioUrl);
      } else if (response.status === 404) {
        const generateResponse = await fetch('/api/generate-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sentence }),
        });
        if (!generateResponse.ok) throw new Error("La generación en el servidor falló.");
        performPlay(audioUrl);
      } else {
        throw new Error(`Error inesperado: ${response.status}`);
      }
    } catch (error) {
      console.error("Error en el proceso de reproducción/generación:", error);
      setStatus('idle');
    }
  };

  const handleNormalPlay = () => {
    playAudio(1.0); // Velocidad normal
  };

  const handleSlowPlay = () => {
    const currentSpeed = slowSpeeds[slowSpeedIndex];
    playAudio(currentSpeed);
    // Avanza al siguiente índice de velocidad, volviendo al principio si llega al final
    setSlowSpeedIndex((prevIndex) => (prevIndex + 1) % slowSpeeds.length);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón de Reproducir Normal */}
      <motion.button 
        onClick={handleNormalPlay} 
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors disabled:opacity-50"
        disabled={status === 'loading'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Escuchar a velocidad normal"
      >
        {status === 'loading' ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Loader2 size={24} />
          </motion.div>
        ) : (
          <Volume2 size={24} />
        )}
      </motion.button>
      
      {/* Botón de Reproducir Lento (Tortuguita) */}
      <motion.button
        onClick={handleSlowPlay}
        disabled={status === 'loading'}
        className="flex items-center justify-center h-10 px-3 rounded-full border-2 transition-all duration-200 bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Escuchar lentamente"
      >
        <Snail size={20} />
        {/* Indicador de velocidad */}
        <span className="ml-1.5 text-xs font-semibold">
          {slowSpeeds[slowSpeedIndex]}x
        </span>
      </motion.button>
    </div>
  );
};