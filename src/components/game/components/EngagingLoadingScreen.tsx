'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
// 1. Importamos nuestro nuevo componente de tips
import { TipsCarousel } from '../TipsCarousel'; 

interface EngagingLoadingScreenProps {
  category: string;
}

export function EngagingLoadingScreen({ category }: EngagingLoadingScreenProps) {
  // La lógica de los tips (estado e intervalo) se ha eliminado de aquí.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  // El efecto para cargar la animación Lottie no cambia.
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const apiResponse = await fetch(`/api/lottie/${category}`);
        if (!apiResponse.ok) throw new Error('Failed to get lottie path from API');
        
        const { path } = await apiResponse.json();
        
        const lottieResponse = await fetch(path);
        if (!lottieResponse.ok) throw new Error('Failed to fetch lottie JSON');

        const data = await lottieResponse.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error al cargar la animación Lottie:", error);
      }
    };

    loadAnimation();
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