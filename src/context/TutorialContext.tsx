'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Tutorial, TutorialStep } from '../tutorials/tutorial.types';
import { allTutorials } from '../tutorials';

interface TutorialContextType {
  isLoading: boolean;
  isTutorialActive: boolean;
  activeTutorial: Tutorial | null;
  currentStep: TutorialStep | null;
  currentStepIndex: number;
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  skipTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const pathname = usePathname();

  // EFECTO 1: Disparar tutoriales basados en la ruta
  useEffect(() => {
    setIsLoading(true);
    // Si ya hay un tutorial activo, no buscar otro.
    if (activeTutorial) return;

    const tutorialForPath = allTutorials.find(t => t.path === pathname);
    if (tutorialForPath) {
      const isCompleted = localStorage.getItem(tutorialForPath.localStorageKey) === 'true';
      if (!isCompleted) {
        setActiveTutorial(tutorialForPath);
        setCurrentStepIndex(0);
      }
    }
    setIsLoading(false);
  }, [pathname, activeTutorial]);

  const startTutorial = (tutorialId: string) => {
    // Lógica para iniciar un tutorial manualmente si es necesario
  };

  const completeTutorial = () => {
    if (activeTutorial) {
      localStorage.setItem(activeTutorial.localStorageKey, 'true');
    }
    setActiveTutorial(null);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    if (activeTutorial && currentStepIndex < activeTutorial.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTutorial(); // El tutorial termina en el último paso
    }
  };

  const skipTutorial = () => {
    completeTutorial(); // Saltar hace lo mismo que completar
  };

  const value = {
    isLoading,
    isTutorialActive: !!activeTutorial,
    activeTutorial,
    currentStep: activeTutorial ? activeTutorial.steps[currentStepIndex] : null,
    startTutorial,
    nextStep,
    currentStepIndex,
    skipTutorial
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}