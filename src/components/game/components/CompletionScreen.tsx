import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface CompletionScreenProps {
  onSessionComplete: () => void;
}

export function CompletionScreen({ onSessionComplete }: CompletionScreenProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      const welldoneAnimations = [
        '/animations/lotties/welldone/check.json',
        '/animations/lotties/welldone/happy-girl.json',
        '/animations/lotties/welldone/happy-heart.json',
        '/animations/lotties/welldone/like.json'
      ];
      
      const randomIndex = Math.floor(Math.random() * welldoneAnimations.length);
      const randomPath = welldoneAnimations[randomIndex];
      
      try {
        const response = await fetch(randomPath);
        if (!response.ok) throw new Error('Failed to fetch lottie JSON');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error al cargar la animación Lottie:", error);
      }
    };

    loadAnimation();
  }, []);

  return (
    <div className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[60vh]">
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div style={{ width: 250, height: 250 }}>
        {animationData && (
          <Lottie animationData={animationData} loop={true} />
        )}
      </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Lección Completada!</h2>
        <p className="text-gray-600 text-lg mb-6">Lo has hecho muy bien. Ahora puedes ir a la sección de chat para seguir aprendiendo.</p>
        <motion.button
          onClick={onSessionComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          Volver
        </motion.button>
      </motion.div>
    </div>
  );
} 