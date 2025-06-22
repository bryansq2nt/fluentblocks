// src/components/game/AudioPlayer.tsx

'use client';

import { useState, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2, Snail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
  const { authenticatedFetch } = useAuth();
  const audioUrlCache = useRef(new Map<string, string>());

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
    
    if (audioUrlCache.current.has(sentence)) {
      const cachedUrl = audioUrlCache.current.get(sentence)!;
      performPlay(cachedUrl, speed);
      return;
    }

    setStatus('loading');
    try {
      const generateResponse = await authenticatedFetch('/api/generate-audio', {
        method: 'POST',
        body: JSON.stringify({ text: sentence }),
      });

      if (!generateResponse.ok) {
        throw new Error(`La generación en el servidor falló: ${generateResponse.statusText}`);
      }

      const result = await generateResponse.json();
      
      if (!result.url) {
        throw new Error("La respuesta de la API no contenía una URL de audio.");
      }

      audioUrlCache.current.set(sentence, result.url);
      performPlay(result.url, speed); 
      
    } catch (error) {
      console.error("Error en el proceso de reproducción/generación:", error);
      setStatus('idle');
    }
  }, [sentence, status, performPlay, authenticatedFetch]);

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
      <div>
      <motion.button 
      id="audio-player-section-normal"
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
          <Volume2  size={24} />
        )}
      </motion.button>
      </div>
      <div id="audio-player-section-slow">

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
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';