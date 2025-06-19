// components/tutorial/TutorialPopover.tsx
'use client';

import { useState, useLayoutEffect, useRef } from 'react';
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

// --- HOOK PERSONALIZADO PARA OBTENER LA POSICIÓN DEL ELEMENTO OBJETIVO ---
function useElementRect(elementSelector: string | undefined) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (!elementSelector) {
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
      setRect(null); // Resetea si no se encuentra
      return;
    }

    const updateRect = () => {
      setRect(element.getBoundingClientRect());
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [elementSelector]);

  return rect;
}

// --- COMPONENTE PRINCIPAL ---
export function TutorialPopover({ step, stepIndex, totalSteps, onNext, onSkip }: TutorialPopoverProps) {
  const targetRect = useElementRect(step.targetElement);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, opacity: 0 });

  useLayoutEffect(() => {
    if (!targetRect || !popoverRef.current) return;

    const popoverEl = popoverRef.current;
    const popoverRect = popoverEl.getBoundingClientRect();
    const { innerWidth: vw, innerHeight: vh } = window;
    const GAP = 12; // Espacio entre el objetivo y el popover

    let top: number;
    let left: number;

    // Posición horizontal: intentar centrar con el objetivo
    left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);

    // Posición vertical: preferir abajo, si no cabe, ir arriba
    const spaceBelow = vh - targetRect.bottom - popoverRect.height - GAP;
    if (spaceBelow > 0 || targetRect.top < popoverRect.height + GAP) {
      // Hay espacio abajo (o no hay espacio arriba, así que forzamos abajo)
      top = targetRect.bottom + GAP;
    } else {
      // No hay espacio abajo, vamos arriba
      top = targetRect.top - popoverRect.height - GAP;
    }

    // Ajuste de bordes (Clamping)
    if (left < GAP) left = GAP;
    if (left + popoverRect.width > vw - GAP) left = vw - popoverRect.width - GAP;
    if (top < GAP) top = GAP;
    if (top + popoverRect.height > vh - GAP) top = vh - popoverRect.height - GAP;

    setPosition({ top, left, opacity: 1 });
  }, [targetRect]);

  const isLastStep = stepIndex === totalSteps - 1;
  const canSkip = step.isSkippable !== false;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        style={{
            clipPath: targetRect ? `polygon(
                0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                ${targetRect.x}px ${targetRect.y}px,
                ${targetRect.x}px ${targetRect.bottom}px,
                ${targetRect.right}px ${targetRect.bottom}px,
                ${targetRect.right}px ${targetRect.y}px,
                ${targetRect.x}px ${targetRect.y}px
            )` : 'none'
        }}
      />
      
      <motion.div
        ref={popoverRef}
        className="absolute w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl p-5 text-gray-800 pointer-events-auto"
        style={{
          top: position.top,
          left: position.left,
          opacity: position.opacity,
        }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        role="dialog"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-content"
      >
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
              {isLastStep ? 'Terminar' : 'Siguiente'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}