// hooks/useSentenceBuilder.ts
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import useSound from 'use-sound';
import { PlayerHandle } from '../AudioPlayer'; 
import { useExerciseTracking } from '../../../context/ExerciseTrackingContext';
import shuffleArray from '../utils/shuffleArray';

// --- Tipos de Datos (centralizados en el hook) ---
interface Question {
  spanish: string;
  englishCorrect: string[];
}
type WordOption = { id: number; word: string };
type FeedbackStatus = 'idle' | 'correct' | 'incorrect';

// --- El Custom Hook que contiene toda la lógica del juego ---
export function useSentenceBuilder(questions: Question[]) {
  // --- Estados del Juego ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<WordOption[]>([]);
  const [feedback, setFeedback] = useState<{ status: FeedbackStatus; message: string }>({ status: 'idle', message: '' });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const autoAudioPlayerRef = useRef<PlayerHandle>(null);

  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const [playError]   = useSound('/sounds/error.mp3',   { volume: 0.5 });
  const { trackInteraction, getSessionStats } = useExerciseTracking();

  // --- Lógica del Juego ---
  const currentQuestionData = useMemo(() => {
    if (!questions || questions.length === 0) return null;
    const question = questions[currentQuestionIndex];
    return {
      ...question,
      options: shuffleArray(question.englishCorrect.map((word, index) => ({ id: index, word }))),
    };
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (currentQuestionData) {
      setUserAnswer([]);
      setFeedback({ status: 'idle', message: '' });
      setMistakeCount(0);

      const timer = setTimeout(() => {
        autoAudioPlayerRef.current?.play();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentQuestionData]);

  useEffect(() => {
    if (feedback.status === 'correct') playSuccess();
    if (feedback.status === 'incorrect') playError();
  }, [feedback.status, playSuccess, playError]);

  // Auto-complete session when last question is answered correctly
  useEffect(() => {
    if (feedback.status === 'correct' && currentQuestionIndex === questions.length - 1) {
      const timer = setTimeout(() => {
        try {
          const stats = getSessionStats();
          trackInteraction({
            type: 'SESSION_COMPLETE',
            timestamp: Date.now(),
            data: {
              totalTime: stats.totalTime,
              correctAnswers: stats.correctAnswers,
              incorrectAnswers: stats.incorrectAnswers,
              hintsUsed: stats.hintsUsed,
              retries: stats.retries
            }
          });
        } catch (error) {
          console.warn('Could not get session stats:', error);
          // Still complete the session even if stats fail
          trackInteraction({
            type: 'SESSION_COMPLETE',
            timestamp: Date.now(),
            data: {
              totalTime: 0,
              correctAnswers: 0,
              incorrectAnswers: 0,
              hintsUsed: 0,
              retries: 0
            }
          });
        }
        setIsSessionComplete(true);
      }, 2000); // Wait 2 seconds to show the success feedback, then auto-complete

      return () => clearTimeout(timer);
    }
  }, [feedback.status, currentQuestionIndex, questions.length, getSessionStats, trackInteraction]);

  const handleWordBankTap = (wordOption: WordOption) => {
    setUserAnswer(prev => [...prev, wordOption]);
    setFeedback({ status: 'idle', message: '' });
    if (currentQuestionData) {
      trackInteraction({
        type: 'WORD_SELECTED',
        timestamp: Date.now(),
        data: {
          word: wordOption.word,
          englishSentence: currentQuestionData.englishCorrect.join(' '),
          spanishSentence: currentQuestionData.spanish,
          currentAnswer: [...userAnswer, wordOption].map(opt => opt.word).join(' ')
        }
      });
    }
  };

  const handleAnswerTap = (wordOption: WordOption) => {
    setUserAnswer(prev => prev.filter(opt => opt.id !== wordOption.id));
  };

  const handleCheckAnswer = () => {
    if (!currentQuestionData) return;
    const userAnswerString = userAnswer.map(opt => opt.word).join(' ').replace(/\s*\.\s*$/, '').trim();
    const correctAnswerString = currentQuestionData.englishCorrect.join(' ').replace(/\s*\.\s*$/, '').trim();
    
    if (userAnswerString === correctAnswerString) {
      setFeedback({ status: 'correct', message: '¡Perfecto!' });
      setShowConfetti(true);
      trackInteraction({
        type: 'ANSWER_CORRECT',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestionData.englishCorrect.join(' '),
          spanishSentence: currentQuestionData.spanish,
          userAnswer: userAnswerString,
        }
      });
    } else {
      setMistakeCount(prev => prev + 1);
      const feedbackMessage = `¡Casi! La respuesta correcta es: "${correctAnswerString}"`;
      setFeedback({ status: 'incorrect', message: feedbackMessage });
      trackInteraction({
        type: 'ANSWER_INCORRECT',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestionData.englishCorrect.join(' '),
          spanishSentence: currentQuestionData.spanish,
          userAnswer: userAnswerString,
        }
      });
    }
  };

  const handleNextQuestion = () => {
    if (feedback.status === 'incorrect' && currentQuestionData) {
      trackInteraction({
        type: 'EXERCISE_SKIPPED',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestionData.englishCorrect.join(' '),
          spanishSentence: currentQuestionData.spanish,
          userAnswer: userAnswer.map(opt => opt.word).join(' '),
          skippedAfterMistake: true
        }
      });
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      try {
        const stats = getSessionStats();
        trackInteraction({
          type: 'SESSION_COMPLETE',
          timestamp: Date.now(),
          data: {
            totalTime: stats.totalTime,
            correctAnswers: stats.correctAnswers,
            incorrectAnswers: stats.incorrectAnswers,
            hintsUsed: stats.hintsUsed,
            retries: stats.retries
          }
        });
      } catch (error) {
        console.warn('Could not get session stats:', error);
        // Still complete the session even if stats fail
        trackInteraction({
          type: 'SESSION_COMPLETE',
          timestamp: Date.now(),
          data: {
            totalTime: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            hintsUsed: 0,
            retries: 0
          }
        });
      }
      setIsSessionComplete(true);
    }
  };
  
  const handleRetry = () => {
    if (currentQuestionData) {
      trackInteraction({
        type: 'RETRY_ATTEMPT',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestionData.englishCorrect.join(' '),
          spanishSentence: currentQuestionData.spanish,
          userAnswer: userAnswer.map(opt => opt.word).join(' '),
          attemptNumber: retryCount + 1
        }
      });
      setRetryCount(prev => prev + 1);
      setUserAnswer([]);
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isAnswerChecked = feedback.status !== 'idle';

  // Devolvemos todos los estados y funciones que la UI necesitará.
  return {
    currentQuestionData,
    userAnswer,
    feedback,
    isSessionComplete,
    mistakeCount,
    retryCount,
    showConfetti,
    progressPercentage,
    isAnswerChecked,
    autoAudioPlayerRef,
    handleWordBankTap,
    handleAnswerTap,
    handleCheckAnswer,
    handleNextQuestion,
    handleRetry,
    setShowConfetti,
  };
}