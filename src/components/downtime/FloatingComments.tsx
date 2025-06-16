// components/FloatingComments.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mapa de emojis actualizado
const ratingEmojis: { [key: number]: string } = {
  1: '😐',
  2: '🙂', 
  3: '😊',
  4: '🤩',
  5: '❤️‍🔥',
};

type Comment = {
  rating: number;
  comment: string;
};

// Función optimizada para móvil que genera posiciones sin superposición
function generateMobileOptimizedPositions(numBubbles: number) {
  const positions: { top: string; left: string }[] = [];
  
  // Configuración para móvil - grid más estructurado
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const gridCols = isMobile ? 2 : 3; // 2 columnas en móvil, 3 en desktop
  const gridRows = Math.ceil(numBubbles / gridCols);
  
  // Márgenes más grandes para móvil
  const marginX = isMobile ? 8 : 12; // 8% en móvil, 12% en desktop
  const marginY = isMobile ? 15 : 20; // 15% arriba/abajo en móvil
  
  // Espacio disponible
  const availableWidth = 100 - (marginX * 2);
  const availableHeight = 100 - (marginY * 2);
  
  // Tamaño de cada celda del grid
  const cellWidth = availableWidth / gridCols;
  const cellHeight = availableHeight / gridRows;
  
  for (let i = 0; i < numBubbles; i++) {
    const row = Math.floor(i / gridCols);
    const col = i % gridCols;
    
    // Posición base de la celda
    const baseCellX = marginX + (col * cellWidth);
    const baseCellY = marginY + (row * cellHeight);
    
    // Agregar variación aleatoria dentro de la celda (más pequeña en móvil)
    const randomX = baseCellX + (cellWidth * 0.1) + Math.random() * (cellWidth * 0.8 - cellWidth * 0.2);
    const randomY = baseCellY + (cellHeight * 0.1) + Math.random() * (cellHeight * 0.8 - cellHeight * 0.2);
    
    positions.push({
      top: `${Math.min(Math.max(randomY, marginY), 100 - marginY - 15)}%`,
      left: `${Math.min(Math.max(randomX, marginX), 100 - marginX - 20)}%`
    });
  }
  
  return positions;
}

// Sub-componente optimizado para móvil
function CommentBubble({ 
  commentData, 
  delay = 0, 
  position 
}: { 
  commentData: Comment & { id: number }; 
  delay?: number;
  position: { top: string; left: string };
}) {
  const { rating, comment } = commentData;

  return (
    <motion.div
      layoutId={`comment-${commentData.id}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: [0, 0.5, -0.5, 0], // Movimiento más sutil para móvil
      }}
      exit={{ 
        scale: 0, 
        opacity: 0,
        transition: { duration: 0.4, ease: "easeInOut" }
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 100,
        damping: 25,
        delay,
        rotate: {
          duration: 8, // Más lento para menos distracción
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
      whileHover={{ 
        scale: 1.02, // Muy sutil en móvil
        rotate: 0,
        transition: { duration: 0.3 }
      }}
      className="absolute cursor-pointer group"
      style={position}
    >
      {/* Sombra más sutil para móvil */}
      <div className="absolute inset-0 bg-black/5 rounded-xl blur-sm transform translate-y-1" />
      
      {/* Burbuja principal - tamaños responsivos */}
      <div className="relative bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md border border-white/40 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] transition-all duration-500 group-hover:shadow-lg group-hover:border-blue-200/50">
        
        {/* Contenido del comentario - texto más pequeño en móvil */}
        <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed mb-2 line-clamp-3 md:line-clamp-4">
        &quot;{comment}&quot;
        </p>
        
        {/* Emoji de rating - más pequeño en móvil */}
        <div className="absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 bg-white rounded-full p-1.5 md:p-2 shadow-md border border-white">
          <span className="text-base md:text-xl">
            {ratingEmojis[rating] || '👍'}
          </span>
        </div>
        
        {/* Indicador de rating - más pequeño en móvil */}
        <div className="flex gap-0.5 md:gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-colors duration-300 ${
                i < rating ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Componente principal optimizado para móvil
export default function FloatingComments({ comments }: { comments: Comment[] }) {
  // Número de burbujas basado en tamaño de pantalla
  const [numBubbles, setNumBubbles] = useState(3);
  const [activeComments, setActiveComments] = useState<(Comment & { id: number })[]>([]);
  const [bubblePositions, setBubblePositions] = useState<{ top: string; left: string }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Detectar tamaño de pantalla y ajustar número de burbujas
  useEffect(() => {
    const updateBubbleCount = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm
        setNumBubbles(3);
      } else if (width < 1024) { // lg
        setNumBubbles(4);
      } else {
        setNumBubbles(5);
      }
    };

    updateBubbleCount();
    window.addEventListener('resize', updateBubbleCount);
    return () => window.removeEventListener('resize', updateBubbleCount);
  }, []);

  const getUniqueRandomComment = useCallback((currentComments: (Comment & { id: number })[]): Comment => {
    const availableComments = comments.filter(
      c => !currentComments.some(ac => ac.comment === c.comment)
    );
    const source = availableComments.length > 0 ? availableComments : comments;
    return source[Math.floor(Math.random() * source.length)];
  }, [comments]);

  // Inicializar posiciones y comentarios
  useEffect(() => {
    if (comments.length === 0 || isInitialized) return;

    // Generar posiciones optimizadas para móvil
    const positions = generateMobileOptimizedPositions(numBubbles);
    setBubblePositions(positions);

    // Inicializar comentarios
    const initialComments: (Comment & { id: number })[] = [];
    for (let i = 0; i < Math.min(numBubbles, comments.length); i++) {
      initialComments.push({ 
        ...getUniqueRandomComment(initialComments), 
        id: 1000 + i
      });
    }
    setActiveComments(initialComments);
    setIsInitialized(true);
  }, [comments, getUniqueRandomComment, isInitialized, numBubbles]);

  // Manejar rotación de comentarios
  useEffect(() => {
    if (!isInitialized || activeComments.length === 0) return;

    const timers = activeComments.map((_, index) => {
      const duration = 10000 + Math.random() * 5000; // Intervalos más largos
      return setTimeout(() => {
        const intervalId = setInterval(() => {
          setActiveComments(prev => {
            const newActives = [...prev];
            const newComment = getUniqueRandomComment(newActives);
            const newId = Date.now() + index * 1000;
            newActives[index] = { 
              ...newComment, 
              id: newId
            };
            return newActives;
          });
        }, duration);
        
        return intervalId;
      }, index * 2000); // Mayor delay inicial
    });

    return () => {
      timers.forEach(timer => {
        if (typeof timer === 'number') {
          clearTimeout(timer);
        } else {
          clearInterval(timer);
        }
      });
    };
  }, [isInitialized, getUniqueRandomComment, activeComments]);

  // Reposicionamiento menos frecuente
  useEffect(() => {
    if (!isInitialized) return;

    const repositionTimer = setInterval(() => {
      const newPositions = generateMobileOptimizedPositions(numBubbles);
      setBubblePositions(newPositions);
    }, 30000); // Cada 30 segundos

    return () => clearInterval(repositionTimer);
  }, [isInitialized, numBubbles]);

  if (!isInitialized || activeComments.length === 0) {
    return (
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl md:rounded-3xl flex items-center justify-center">
        <div className="text-gray-400 text-xs sm:text-sm">Cargando comentarios...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl md:rounded-3xl">
      {/* Efecto de fondo más sutil para móvil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,182,193,0.08),transparent_50%)] pointer-events-none" />
      
      <AnimatePresence mode="sync">
        {activeComments.map((commentData, index) => (
          <CommentBubble
            key={`bubble-${commentData.id}`}
            commentData={commentData}
            delay={index * 0.2}
            position={bubblePositions[index] || { top: '50%', left: '50%' }}
          />
        ))}
      </AnimatePresence>
      
      {/* Indicador adaptado para móvil */}
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white/60 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1 text-xs text-gray-600 font-medium">
        {comments.length}
      </div>
    </div>
  );
}