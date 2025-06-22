'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
// 1. Importamos nuestro nuevo componente de tips
import { TipsCarousel } from '../TipsCarousel'; 

interface EngagingLoadingScreenProps {
  category: string;
}

export function EngagingLoadingScreen({ category }: EngagingLoadingScreenProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Seleccionar una animación al azar basada en la categoría
    const getRandomAnimation = async () => {
      const loadingAnimations = [
        '/animations/lotties/loading/geek-cat.json',
        '/animations/lotties/loading/llama.json',
        '/animations/lotties/loading/planetjson.json',
        '/animations/lotties/loading/robotjson.json',
        '/animations/lotties/loading/sleeping-bird.json'
      ];
      
      const randomIndex = Math.floor(Math.random() * loadingAnimations.length);
      const randomPath = loadingAnimations[randomIndex];
      
      try {
        const response = await fetch(randomPath);
        if (!response.ok) throw new Error('Failed to fetch lottie JSON');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error al cargar la animación Lottie:", error);
      }
    };

    // Para la categoría 'loading', usamos las animaciones de loading
    if (category === 'loading') {
      getRandomAnimation();
    }
    // Aquí puedes agregar más categorías si las necesitas
  }, [category]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div style={{ width: 250, height: 250 }}>
        {animationData && (
          <Lottie animationData={animationData} loop={true} />
        )}
      </div>
      
      <h2 className="text-2xl font-bold text-blue-600 mt-4">
        Creando tu lección personalizada...
      </h2>
      <p className="text-gray-500 mt-2">
        Fluent Blocks AI está preparando los mejores ejercicios para ti.
      </p>

      {/* 2. Aquí simplemente renderizamos el componente de tips. ¡Mucho más limpio! */}
      <TipsCarousel />

    </div>
  );
}