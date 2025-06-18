// components/game/EngagingLoadingScreen.tsx
'use client'; // ¡Esta directiva es crucial ahora!

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
    "Tip: Cambia el idioma de tu celular y redes sociales a inglés. Aprenderás vocabulario sin darte cuenta.",
    "Tip: Habla en inglés desde el primer día, aunque cometas errores. Así es como aprende el cerebro.",
    "Tip: Escucha podcasts o música en inglés y repite en voz alta lo que escuches. Imitar es aprender.",
    "Tip: Aprende frases completas como 'Can I have…?' en vez de solo palabras sueltas. Así hablas más natural.",
    "Tip: Escribe un diario en inglés con frases cortas todos los días. Refuerzas vocabulario y gramática.",
    "Tip: Usa la técnica 'shadowing': escucha y repite en voz alta al mismo tiempo que un hablante nativo.",
    "Tip: Para palabras difíciles, empieza por el final y avanza hacia el inicio. Ejemplo: '-tion', luego 'na-tion'.",
    "Tip: Cada palabra nueva agrégale un sinónimo y un antónimo. Esto amplía tu comprensión del idioma.",
    "Tip: Pide correcciones a nativos o usa apps con IA que te den feedback. Mejorarás mucho más rápido.",
    "Tip: Ponte metas claras y cortas, como aprender 10 frases útiles por semana. Avanzarás sin frustrarte."
  ];

interface EngagingLoadingScreenProps {
  category: string;
}

export function EngagingLoadingScreen({ category }: EngagingLoadingScreenProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Función asíncrona para cargar la animación.
    const loadAnimation = async () => {
      try {
        // 1. Llamamos a nuestra API con la categoría proporcionada.
        const apiResponse = await fetch(`/api/lottie/${category}`);
        if (!apiResponse.ok) throw new Error('Failed to get lottie path from API');
        
        const { path } = await apiResponse.json();
        
        // 2. Usamos la ruta devuelta por la API para cargar el archivo JSON.
        const lottieResponse = await fetch(path);
        if (!lottieResponse.ok) throw new Error('Failed to fetch lottie JSON');

        const data = await lottieResponse.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error al cargar la animación Lottie:", error);
      }
    };

    loadAnimation();
  }, [category]); // El efecto se vuelve a ejecutar si la categoría cambia.

  // Efecto para el carrusel de tips (sin cambios)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTipIndex(prevIndex => (prevIndex + 1) % tips.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

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
        Nuestra IA está preparando los mejores ejercicios para ti.
      </p>

      <div className="h-16 mt-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTipIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 italic"
          >
            {tips[currentTipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}