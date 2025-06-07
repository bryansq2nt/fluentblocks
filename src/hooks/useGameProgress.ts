import { useState, useEffect } from 'react';

interface ProgressState {
  completedExercises: number;
  totalMistakes: number;
  startTime: number | null;
  endTime: number | null;
  stars: number;
}

export const useGameProgress = (totalExercises: number) => {
  const [progress, setProgress] = useState<ProgressState>({
    completedExercises: 0,
    totalMistakes: 0,
    startTime: null,
    endTime: null,
    stars: 0
  });

  useEffect(() => {
    // Start timing when the hook is initialized
    setProgress(prev => ({
      ...prev,
      startTime: Date.now()
    }));
  }, []);

  const addMistake = () => {
    setProgress(prev => ({
      ...prev,
      totalMistakes: prev.totalMistakes + 1
    }));
  };

  const completeExercise = () => {
    setProgress(prev => ({
      ...prev,
      completedExercises: prev.completedExercises + 1
    }));
  };

  const completeLevel = () => {
    const endTime = Date.now();
    const stars = calculateStars(progress.totalMistakes);
    
    setProgress(prev => ({
      ...prev,
      endTime,
      stars
    }));
  };

  const calculateStars = (mistakes: number): number => {
    if (mistakes === 0) return 3;
    if (mistakes <= 2) return 2;
    return 1;
  };

  const getProgressPercentage = (): number => {
    return (progress.completedExercises / totalExercises) * 100;
  };

  const getTimeElapsed = (): number => {
    if (!progress.startTime) return 0;
    const end = progress.endTime || Date.now();
    return Math.floor((end - progress.startTime) / 1000);
  };

  const resetProgress = () => {
    setProgress({
      completedExercises: 0,
      totalMistakes: 0,
      startTime: Date.now(),
      endTime: null,
      stars: 0
    });
  };

  return {
    progress,
    addMistake,
    completeExercise,
    completeLevel,
    getProgressPercentage,
    getTimeElapsed,
    resetProgress
  };
}; 