// hooks/useFeedbackTracker.ts
import { useState, useEffect } from 'react';

interface FeedbackState {
  interactions: number;
  levelsCompleted: number;
  hasShownFeedback: boolean;
  lastInteractionTime: number;
}

export const useFeedbackTracker = () => {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    interactions: 0,
    levelsCompleted: 0,
    hasShownFeedback: false,
    lastInteractionTime: 0
  });

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Cargar estado del localStorage al inicializar
  useEffect(() => {
    const savedState = localStorage.getItem('feedbackState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setFeedbackState(parsed);
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('feedbackState', JSON.stringify(feedbackState));
  }, [feedbackState]);

  const trackInteraction = () => {
    const now = Date.now();
    setFeedbackState(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
      lastInteractionTime: now
    }));

    // Lógica para mostrar feedback
    checkIfShouldShowFeedback();
  };

  const trackLevelCompletion = (level: number) => {
    setFeedbackState(prev => ({
      ...prev,
      levelsCompleted: Math.max(prev.levelsCompleted, level)
    }));

    // Lógica para mostrar feedback
    checkIfShouldShowFeedback();
  };

  const checkIfShouldShowFeedback = () => {
    if (feedbackState.hasShownFeedback) return;

    // Escenario 1: Completó nivel 2 (ya probó la app)
    if (feedbackState.levelsCompleted >= 2) {
      setShowFeedbackModal(true);
      return;
    }

    // Escenario 2: Muchas interacciones en niveles avanzados
    if (feedbackState.levelsCompleted >= 4 && feedbackState.interactions >= 8) {
      setShowFeedbackModal(true);
      return;
    }

    // Escenario 3: Usuario muy activo (muchas interacciones)
    if (feedbackState.interactions >= 15) {
      setShowFeedbackModal(true);
      return;
    }
  };

  const markFeedbackShown = () => {
    setFeedbackState(prev => ({
      ...prev,
      hasShownFeedback: true
    }));
    setShowFeedbackModal(false);
  };

  return {
    trackInteraction,
    trackLevelCompletion,
    showFeedbackModal,
    setShowFeedbackModal,
    markFeedbackShown,
    hasShownFeedback: feedbackState.hasShownFeedback
  };
};