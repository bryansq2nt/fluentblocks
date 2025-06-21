'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Los tips ahora viven dentro de su propio componente.
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

// Función para obtener un índice inicial aleatorio.
const getRandomInitialIndex = () => Math.floor(Math.random() * tips.length);

export function TipsCarousel() {
  // 2. ¡El cambio clave! Inicializamos el estado con un índice aleatorio.
  // Usamos una función en useState para que el cálculo solo se ejecute una vez.
  const [currentTipIndex, setCurrentTipIndex] = useState(getRandomInitialIndex);

  // 3. El efecto para cambiar de tip cada 4 segundos sigue igual.
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Avanza al siguiente tip de forma circular.
      setCurrentTipIndex(prevIndex => (prevIndex + 1) % tips.length);
    }, 4000); // Cambia el tip cada 4 segundos

    // Limpieza del intervalo cuando el componente se desmonte.
    return () => clearInterval(intervalId);
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez.

  // 4. El JSX para mostrar el tip se ha movido aquí.
  return (
    <div className="h-16 mt-8 flex items-center justify-center w-full max-w-md">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentTipIndex} // La key es crucial para que AnimatePresence detecte el cambio
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
  );
}