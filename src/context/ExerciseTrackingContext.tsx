'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { UserInteraction, SessionStats } from '../types/exercise-tracking';
import { ExerciseLogger } from '../utils/exerciseLogger';
import { StorageProvider, StorageFactory } from '../types/storage';

interface ExerciseTrackingContextType {
  trackInteraction: (interaction: UserInteraction) => void;
  startSession: () => void;
  endSession: () => void;
  getSessionStats: () => SessionStats;
  getStoredInteractions: () => Promise<UserInteraction[]>;
  getStoredSessionStats: () => Promise<SessionStats[]>;
  clearStoredData: () => Promise<void>;
}

const ExerciseTrackingContext = createContext<ExerciseTrackingContextType | null>(null);

export function ExerciseTrackingProvider({ children }: { children: React.ReactNode }) {
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [storageProvider] = useState<StorageProvider>(() => StorageFactory.createProvider());

  const trackInteraction = useCallback(async (interaction: UserInteraction) => {
    setInteractions(prev => [...prev, interaction]);
    ExerciseLogger.logInteraction(interaction);
    await storageProvider.saveInteraction(interaction);
  }, [storageProvider]);

  const startSession = useCallback(() => {
    const startTime = Date.now();
    setSessionStartTime(startTime);
    trackInteraction({
      type: 'SESSION_STARTED',
      timestamp: startTime
    });
  }, [trackInteraction]);

  const endSession = useCallback(async () => {
    if (!sessionStartTime) return;
    
    const stats = getSessionStats();
    ExerciseLogger.logSessionStats(stats);
    await storageProvider.saveSessionStats(stats);
  }, [sessionStartTime, storageProvider]);

  const getSessionStats = useCallback((): SessionStats => {
    if (!sessionStartTime) {
      throw new Error('Session not started');
    }

    const endTime = Date.now();
    const totalTime = endTime - sessionStartTime;

    return {
      startTime: sessionStartTime,
      endTime,
      interactions,
      totalTime,
      correctAnswers: interactions.filter(i => i.type === 'ANSWER_CORRECT').length,
      incorrectAnswers: interactions.filter(i => i.type === 'ANSWER_INCORRECT').length,
      hintsUsed: interactions.filter(i => i.type === 'AUDIO_HINT_USED').length,
      retries: interactions.filter(i => i.type === 'RETRY_ATTEMPT').length
    };
  }, [sessionStartTime, interactions]);

  const getStoredInteractions = useCallback(() => {
    return storageProvider.getInteractions();
  }, [storageProvider]);

  const getStoredSessionStats = useCallback(() => {
    return storageProvider.getSessionStats();
  }, [storageProvider]);

  const clearStoredData = useCallback(() => {
    return storageProvider.clearStorage();
  }, [storageProvider]);

  return (
    <ExerciseTrackingContext.Provider value={{
      trackInteraction,
      startSession,
      endSession,
      getSessionStats,
      getStoredInteractions,
      getStoredSessionStats,
      clearStoredData
    }}>
      {children}
    </ExerciseTrackingContext.Provider>
  );
}

export function useExerciseTracking() {
  const context = useContext(ExerciseTrackingContext);
  if (!context) {
    throw new Error('useExerciseTracking must be used within an ExerciseTrackingProvider');
  }
  return context;
} 