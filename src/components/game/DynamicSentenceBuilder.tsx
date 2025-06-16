// components/game/DynamicSentenceBuilder.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Lightbulb, Sparkles } from 'lucide-react';
import useSound from 'use-sound';
import { AudioPlayer } from './AudioPlayer'; // Reutilizamos tu AudioPlayer

// --- Tipos que el componente espera recibir ---
interface Question {
  spanish: string;
  englishCorrect: string[];
}
interface DynamicBuilderProps {
  questions: Question[];
  onSessionComplete: () => void; // Función para llamar cuando se completan todas las preguntas
}

type WordOption = { id: number; word: string };
type FeedbackStatus = 'idle' | 'correct' | 'incorrect';

// --- Funciones Helper ---
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
  const [wordBankOptions, setWordBankOptions] = useState<WordOption[]>([]);
  const [feedback, setFeedback] = useState<{ status: FeedbackStatus; message: string }>({ status: 'idle', message: '' });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const [playError]   = useSound('/sounds/error.mp3',   { volume: 0.5 });
  const [mistakeCount, setMistakeCount] = useState(0);

  // --- Memoización de la pregunta actual ---
  const currentQuestionData = useMemo(() => {
    if (!questions || questions.length === 0) return null;
    const question = questions[currentQuestionIndex];
    return {
      ...question,
      options: shuffleArray(question.englishCorrect.map((word, index) => ({ id: index, word }))),
    };
  }, [currentQuestionIndex, questions]);

  // --- Efectos ---
  useEffect(() => {
    if (currentQuestionData) {
      setWordBankOptions(currentQuestionData.options);
      setUserAnswer([]);
      setFeedback({ status: 'idle', message: '' });
    }
  }, [currentQuestionData]);

  useEffect(() => {
    if (feedback.status === 'correct') playSuccess();
    if (feedback.status === 'incorrect') playError();
  }, [feedback.status, playSuccess, playError]);


  // --- Handlers del Juego ---
  const handleWordBankTap = (wordOption: WordOption) => {
    setUserAnswer([...userAnswer, wordOption]);
    setWordBankOptions(wordBankOptions.filter(opt => opt.id !== wordOption.id));
    setFeedback({ status: 'idle', message: '' });
  };

  const handleAnswerTap = (wordOption: WordOption) => {
    setWordBankOptions(shuffleArray([...wordBankOptions, wordOption]));
    setUserAnswer(userAnswer.filter(opt => opt.id !== wordOption.id));
  };

  const handleCheckAnswer = () => {
    const userAnswerString = userAnswer.map(opt => opt.word).join(' ').replace(/\s*\.\s*$/, '').trim();
    const correctAnswerString = currentQuestionData?.englishCorrect.join(' ').replace(/\s*\.\s*$/, '').trim();

    if (userAnswerString === correctAnswerString) {
      setFeedback({ status: 'correct', message: '¡Perfecto!' });
    } else {
      setMistakeCount(prev => prev + 1);
      const feedbackMessage = `¡Casi! La respuesta correcta es: "${correctAnswerString}"`;
      setFeedback({ status: 'incorrect', message: feedbackMessage });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsSessionComplete(true);
      // trackLevelCompletion(X); // Esta lógica ahora viviría en la página padre
    }
  };

  const handleRetry = () => {
    // Resetea la respuesta del usuario y el banco de palabras
    if (currentQuestionData) {
        setUserAnswer([]);
        setWordBankOptions(currentQuestionData.options);
        setFeedback({ status: 'idle', message: '' });
    }
  }

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  
  if (isSessionComplete) {
     return (
        <div className="p-8 text-center">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Lección Completada!</h2>
                <p className="text-gray-600 text-lg mb-6">Has practicado este patrón con éxito.</p>
                <button onClick={onSessionComplete} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">
                    Volver
                </button>
            </motion.div>
        </div>
     )
  }

  if (!currentQuestionData) {
    return <div>Cargando pregunta...</div>
  }

  // --- Renderizado del Ejercicio ---
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} />
      </div>

      <main className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Construye la oración:</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">"{currentQuestionData.spanish}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
            <motion.div className="min-h-[60px] p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl flex flex-wrap gap-2">
              <AnimatePresence>
                {userAnswer.map(opt => (
                  <motion.button key={opt.id} layoutId={`word-${opt.id}`} onClick={() => handleAnswerTap(opt)} className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 font-medium text-gray-800">
                    {opt.word}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
            <div className="flex justify-center md:justify-start">
              {feedback.status === 'correct' && (
                <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                  <AudioPlayer sentence={userAnswer.map(w => w.word).join(' ')} />
                </motion.div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Toca las palabras en el orden correcto:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <AnimatePresence>
                {wordBankOptions.map(opt => (
                  <motion.button key={opt.id} layoutId={`word-${opt.id}`} onClick={() => handleWordBankTap(opt)} className="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-800 font-medium text-center">
                    {opt.word}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {wordBankOptions.length === 0 && feedback.status === 'idle' && (
            <motion.button onClick={handleCheckAnswer} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-lg">
              Revisar
            </motion.button>
          )}
        </div>
      </main>

      <AnimatePresence>
        {feedback.status !== 'idle' && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`fixed inset-x-4 bottom-6 p-4 rounded-xl shadow-lg border ${
              feedback.status === 'correct' 
                ? 'bg-green-100 border-green-200' 
                : 'bg-red-100 border-red-200'
            }`}
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {feedback.status === 'correct' ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
                <p
                  className={`font-semibold ${
                    feedback.status === 'correct' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {feedback.message}
                </p>
              </div>

              {/* --- BOTONES CON NUEVOS ESTILOS --- */}
              <div className="flex-shrink-0 flex items-center gap-3">
                {feedback.status === 'incorrect' && mistakeCount < 2 && (
                  // Botón secundario "Reintentar"
                  <button
                    onClick={handleRetry}
                    className="px-5 py-2 rounded-lg font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Reintentar
                  </button>
                )}

                {/* Botón primario "Continuar" */}
                <button
                  onClick={handleNextQuestion}
                  className={`px-5 py-2 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg ${
                    feedback.status === 'correct'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}