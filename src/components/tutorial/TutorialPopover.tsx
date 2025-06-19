// components/tutorial/TutorialPopover.tsx
'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { TutorialStep } from '@/tutorials/tutorial.types';

// --- PROPS ---
interface TutorialPopoverProps {
  step: TutorialStep;
  stepIndex: number; 
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

// --- HOOK PERSONALIZADO PARA OBTENER LA POSICIÓN DEL ELEMENTO ---
// Usamos este hook para que la lógica de cálculo sea reutilizable y limpia.
function useElementRect(elementSelector: string | undefined) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  // useLayoutEffect se ejecuta después de los cálculos de layout pero antes de que el navegador pinte.
  // Es ideal para mediciones de DOM para evitar parpadeos.
  useLayoutEffect(() => {
    if (!elementSelector) {
      // Si no hay selector, centramos el popover en la pantalla
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setRect({
        top: vh / 2, left: vw / 2, width: 0, height: 0,
        x: vw / 2, y: vh / 2, bottom: vh / 2, right: vw / 2,
        toJSON: () => ''
      });
      return;
    }

    const element = document.querySelector(elementSelector) as HTMLElement;
    if (!element) {
      console.warn(`Tutorial target not found: ${elementSelector}`);
      return;
    }

    const updateRect = () => {
      setRect(element.getBoundingClientRect());
    };

    updateRect(); // Medición inicial

    // Volver a medir si la ventana cambia de tamaño
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [elementSelector]);

  return rect;
}


// --- COMPONENTE PRINCIPAL ---
export function TutorialPopover({ step, stepIndex, totalSteps, onNext, onSkip }: TutorialPopoverProps) {
  const targetRect = useElementRect(step.targetElement);

  if (!targetRect) {
    // Aún no se ha encontrado el elemento o no es necesario, no renderizar nada.
    return null; 
  }

  // --- LÓGICA DE POSICIONAMIENTO INTELIGENTE ---
  // Decide si el popover debe ir arriba o abajo del elemento
  const isTargetInUpperHalf = targetRect.top < window.innerHeight / 2;
  const popoverVerticalPosition = isTargetInUpperHalf
    ? targetRect.bottom + 12 // Abajo del elemento
    : targetRect.top - 12; // Arriba del elemento
  
  const popoverTransformOrigin = isTargetInUpperHalf ? 'top center' : 'bottom center';
  const canSkip = step.isSkippable !== false;
  const isLastStep = stepIndex === totalSteps - 1;
  return (
    // Portal para renderizar en la raíz del body y evitar problemas de z-index y overflow
    // En Next.js 13+ con App Router, esto se manejaría en el layout principal.
    // Por ahora, asumimos que está en un lugar alto del árbol DOM.
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 1. EL FONDO OSCURO QUE CUBRE TODO MENOS EL OBJETIVO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        // Este estilo crea un "agujero" en el fondo oscuro
        style={{
          clipPath: `polygon(
            0 0, 100% 0, 100% 100%, 0 100%, 0 0,
            ${targetRect.x}px ${targetRect.y}px,
            ${targetRect.x}px ${targetRect.bottom}px,
            ${targetRect.right}px ${targetRect.bottom}px,
            ${targetRect.right}px ${targetRect.y}px,
            ${targetRect.x}px ${targetRect.y}px
          )`
        }}
      />
      
      {/* 2. EL POPOVER CON EL CONTENIDO DEL TUTORIAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: isTargetInUpperHalf ? -10 : 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl p-5 text-gray-800 pointer-events-auto"
        style={{
          left: targetRect.left + targetRect.width / 2 - 160, // 160 es la mitad del ancho (320px)
          top: popoverVerticalPosition,
          transformOrigin: popoverTransformOrigin
        }}
        // Para accesibilidad
        role="dialog"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-content"
      >
        {/* Botón para cerrar/saltar el tutorial completo */}
        {canSkip && (
          <button onClick={onSkip} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        )}

        <h3 id="tutorial-title" className="text-lg font-bold mb-2 text-blue-800">{step.title}</h3>
        <p id="tutorial-content" className="text-sm text-gray-600 mb-4">{step.content}</p>
        
        {!step.isBlocking && (
          <div className="flex justify-end">
            <button 
              onClick={onNext}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {/* Cambia el texto del botón si es el último paso */}
              {isLastStep ? 'Terminar' : 'Siguiente'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}