'use client';

import { ReactNode, useEffect } from 'react';
import { useExerciseTracking } from '@/context/ExerciseTrackingContext';

interface GeneratedExerciseUserInteractionsProps {
  children: ReactNode;
  onSessionComplete?: () => void;
}

export const GeneratedExerciseUserInteractions: React.FC<GeneratedExerciseUserInteractionsProps> = ({
  children,
  onSessionComplete
}) => {
  const { startSession, endSession } = useExerciseTracking();

  useEffect(() => {
    // Iniciar la sesión cuando el componente se monta
    startSession();

    // Limpiar cuando el componente se desmonta
    return () => {
      endSession();
      if (onSessionComplete) {
        onSessionComplete();
      }
    };
  }, []); // Solo se ejecuta al montar y desmontar

  return <>{children}</>;
}; 