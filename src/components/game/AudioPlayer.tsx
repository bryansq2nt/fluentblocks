// src/components/game/AudioPlayer.tsx

'use client';

import { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2, Snail } from 'lucide-react';

interface AudioPlayerProps {
  sentence: string;
}

export interface PlayerHandle {
  play: (speed?: number) => void;
}

const slowSpeeds = [0.75, 0.5];

export const AudioPlayer = forwardRef<PlayerHandle, AudioPlayerProps>(({ sentence }, ref) => {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [slowSpeedIndex, setSlowSpeedIndex] = useState(0);

  const performPlay = useCallback((url: string, speed: number) => {
    const audio = new Audio(url);
    audio.playbackRate = speed;
    audio.play();
    audio.onended = () => setStatus('idle');
    audio.onerror = (e) => {
      console.error("Error al reproducir el audio:", e);
      setStatus('idle');
    };
  }, []);

  const handlePlay = useCallback(async (speed: number) => {
    if (!sentence || status === 'loading') return;
    setStatus('loading');

    const fileName = sentence.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.mp3';
    const publicUrl = `https://store_FwRpzKasFEerHgsb.public.blob.vercel-storage.com/audios/${fileName}`;

    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      
      if (response.ok) {
        performPlay(publicUrl, speed);
      } else {
        const generateResponse = await fetch('/api/generate-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sentence }),
        });

        if (!generateResponse.ok) throw new Error("La generación en el servidor falló.");

        const blobResult = await generateResponse.json();
        performPlay(blobResult.url, speed); 
      }
    } catch (error) {
      console.error("Error en el proceso de reproducción/generación:", error);
      setStatus('idle');
    }
  }, [sentence, status, performPlay]);

  // AÑADIDO: `useImperativeHandle` expone funciones al componente padre a través de la `ref`.
  // Aquí exponemos una única función llamada `play`.
  useImperativeHandle(ref, () => ({
    play(speed: number = 1.0) {
      handlePlay(speed);
    }
  }), [handlePlay]);


  const handleNormalPlay = () => handlePlay(1.0);
  const handleSlowPlay = () => {
    const currentSpeed = slowSpeeds[slowSpeedIndex];
    handlePlay(currentSpeed);
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
      
      {/* Botón de Reproducir Lento */}
      <motion.button
        onClick={handleSlowPlay}
        disabled={status === 'loading'}
        className="flex items-center justify-center h-10 px-3 rounded-full border-2 transition-all duration-200 bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Escuchar lentamente"
      >
        <Snail size={20} />
        <span className="ml-1.5 text-xs font-semibold">
          {slowSpeeds[slowSpeedIndex]}x
        </span>
      </motion.button>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';