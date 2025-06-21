// components/game/LottiePlayer.tsx
'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface LottiePlayerProps {
  animationPath: string;
}

export function LottiePlayer({ animationPath }: LottiePlayerProps) {
  const [animationData, setAnimationData] = useState<unknown | null>(null);

  useEffect(() => {
    // Hacemos fetch del archivo JSON específico que nos dijo el Server Component.
    fetch(animationPath)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Error cargando el archivo Lottie JSON:", error));
  }, [animationPath]); // Se vuelve a ejecutar si la ruta cambia.

  if (!animationData) {
    return null; // No muestra nada mientras carga los datos del JSON.
  }

  return <Lottie animationData={animationData} loop={true} />;
}