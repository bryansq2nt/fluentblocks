// components/tutorial/TutorialPlayer.tsx
'use client';

import { useEffect } from 'react';
import { useTutorial } from '@/context/TutorialContext';
import { AnimatePresence, motion } from 'framer-motion';
import { TutorialPopover } from './TutorialPopover';

export function TutorialPlayer() {
  // 1. LLAMA A TODOS LOS HOOKS INCONDICIONALMENTE EN LA CIMA
  const { isTutorialActive, activeTutorial, currentStep, currentStepIndex, nextStep, skipTutorial } = useTutorial();

  // El useEffect también se llama siempre. Su lógica interna puede ser condicional.
  useEffect(() => {
    // La condición va DENTRO del hook, no fuera.
    if (isTutorialActive && currentStep?.type === 'action') {
        console.log('Executing action:', currentStep.action);
    }
    // Añadimos isTutorialActive a las dependencias porque lo usamos dentro.
  }, [isTutorialActive, currentStep, nextStep]);

  // 2. AHORA, PUEDES TENER UN RETURN TEMPRANO DESPUÉS DE LLAMAR A TODOS LOS HOOKS

  if (!isTutorialActive || !currentStep || !activeTutorial) { 
    return null;
  }

  const isVisibleStep = currentStep.type === 'popover' 
  || currentStep.type === 'highlight' 
  || currentStep.type === 'action';
  return (
    <AnimatePresence>
    {isVisibleStep && (
      <motion.div>
        <TutorialPopover
          step={currentStep}
          stepIndex={currentStepIndex} 
          totalSteps={activeTutorial.steps.length} 
          onNext={nextStep}
          onSkip={skipTutorial}
        />
      </motion.div>
    )}
  </AnimatePresence>
  );
}