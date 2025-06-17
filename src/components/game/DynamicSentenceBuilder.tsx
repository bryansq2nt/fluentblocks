// components/game/DynamicSentenceBuilder.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { AudioPlayer, PlayerHandle } from './AudioPlayer';
import { useExerciseTracking } from '../../context/ExerciseTrackingContext';
import { ProgressBar } from './components/ProgressBar';
import { SentencePrompt } from './components/SentencePrompt';
import { AnswerArea } from './components/AnswerArea';
import { WordBank } from './components/WordBank';
import { FeedbackToast } from './components/FeedbackToast';
import { CompletionScreen } from './components/CompletionScreen';

// --- Tipos de Datos ---
interface Question {
  spanish: string;
  englishCorrect: string[];
}
interface DynamicBuilderProps {
  questions: Question[];
  onSessionComplete: () => void;
}
type WordOption = { id: number; word: string };
type FeedbackStatus = 'idle' | 'correct' | 'incorrect';

// --- Función Helper ---
const shuffleArray = (array: WordOption[]): WordOption[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function DynamicSentenceBuilder({ questions, onSessionComplete }: DynamicBuilderProps) {
  // --- Estados del Juego ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<WordOption[]>([]);
  // Este estado ya no se usa para renderizar, pero sí para el reset inicial en useEffect.
  const [wordBankOptions, setWordBankOptions] = useState<WordOption[]>([]);
  const [feedback, setFeedback] = useState<{ status: FeedbackStatus; message: string }>({ status: 'idle', message: '' });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  
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
      setWordBankOptions(currentQuestionData.options);
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

  const handleWordBankTap = (wordOption: WordOption) => {
    setUserAnswer([...userAnswer, wordOption]);
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
    setUserAnswer(userAnswer.filter(opt => opt.id !== wordOption.id));
  };

  const handleCheckAnswer = () => {
    if (!currentQuestionData) return;
    const userAnswerString = userAnswer.map(opt => opt.word).join(' ').replace(/\s*\.\s*$/, '').trim();
    const correctAnswerString = currentQuestionData.englishCorrect.join(' ').replace(/\s*\.\s*$/, '').trim();
    
    if (userAnswerString === correctAnswerString) {
      setFeedback({ status: 'correct', message: '¡Perfecto!' });
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
      setRetryCount(retryCount + 1);
      setUserAnswer([]);
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  
  if (isSessionComplete) {
    return <CompletionScreen onSessionComplete={onSessionComplete} />;
  }

  if (!currentQuestionData) {
    return <div>Cargando pregunta...</div>;
  }

  const isAnswerChecked = feedback.status !== 'idle';

  const handleReorder = (newOrder: WordOption[]) => {
    setUserAnswer(newOrder);
    
    // Opcional: Registrar la interacción si es relevante para tus métricas.
    // if (currentQuestionData) {
    //   trackInteraction({
    //     type: 'WORDS_REORDERED',
    //     timestamp: Date.now(),
    //     data: {
    //       englishSentence: currentQuestionData.englishCorrect.join(' '),
    //       spanishSentence: currentQuestionData.spanish,
    //       newAnswerOrder: newOrder.map(opt => opt.word).join(' ')
    //     }
    //   });
    
  };
  // --- Renderizado del Ejercicio Principal ---
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="hidden">
        <AudioPlayer 
          ref={autoAudioPlayerRef} 
          sentence={currentQuestionData.englishCorrect.join(' ')} 
        />
      </div>

      <ProgressBar progress={progressPercentage} />

      <main className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-8 space-y-6">
          <div>
            <SentencePrompt question={currentQuestionData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
          <AnswerArea
              answer={userAnswer}
              onRemove={handleAnswerTap}
              onReorder={handleReorder}
              status={feedback.status}
            />
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-3">Toca las palabras en el orden correcto:</p>
            <WordBank
              options={currentQuestionData.options}
              selectedOptions={userAnswer}
              onSelect={handleWordBankTap}
              isDisabled={isAnswerChecked}
            />
          </div>

          <AnimatePresence>
            {userAnswer.length > 0 && feedback.status === 'idle' && (
              <motion.button
                key="check-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={handleCheckAnswer}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg"
              >
                Revisar
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        <FeedbackToast
          status={feedback.status}
          message={feedback.message}
          onNext={handleNextQuestion}
          onRetry={handleRetry}
          canRetry={feedback.status === 'incorrect' && mistakeCount < 3}
        />
      </AnimatePresence>
    </div>
  );
}