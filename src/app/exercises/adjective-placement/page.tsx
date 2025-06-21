'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Loader2, BookOpen, RefreshCw } from 'lucide-react';
import { useFeedback } from '../../../components/game/FeedbackProvider';
import { AudioPlayer } from '../../../components/game/AudioPlayer';
import { LessonIntro } from '../../../components/game/LessonIntro'; 
import { adjectivePlacementQuestions } from '../../../data/exercises/adjective-placement';
import { adjectivePlacementExamples } from '../../../data/services/exercise.service';
import { Sparkles } from 'lucide-react';
import useSound from 'use-sound';

// --- Configuración de la Introducción ---
const introContent = {
    icon: <BookOpen className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />,
    title: 'Orden de los Adjetivos',
    messages: [
        {
          text: '¡Hola! Hoy vas a ver cómo describir cosas en <english>inglés</english> de <strong>forma muy sencilla</strong>.'
        },
        {
          text: 'La palabra <spanish>"roja"</spanish> te dice cómo es la casa:',
          list: [
            '<spanish>"roja"</spanish> = color o descripción',
            '<spanish>"casa"</spanish> = la cosa que describimos'
          ]
        },
        {
          text: 'En inglés hacemos esto <strong>al revés</strong>: <english>red house</english>'
        },
        {
          text: 'Primero pones la descripción (<english>red</english> = <spanish>rojo</spanish>) y luego la cosa (<english>house</english> = <spanish>casa</spanish>).'
        },
        {
          text: '¡Cuidado con el <mistake>"false friend"</mistake>! Aquí no aplica.'
        },
        {
          text: '¡Vamos a <strong>practicar</strong> para que te quede grabado!'
        }
      ]
      
      
      
  };

// --- Tipos y Helpers ---
interface Question {
  spanish: string;
  englishCorrect: string[];
}
type WordOption = { id: number; word: string };
type FeedbackStatus = 'idle' | 'correct' | 'incorrect';
type LoadingState = 'initial' | 'loading' | 'success' | 'error';

const shuffleArray = (array: WordOption[]): WordOption[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const AdjectivePlacementPage = () => {
  const router = useRouter();
  const { trackLevelCompletion } = useFeedback();

  // --- Estados del Componente ---
  const [introCompleted, setIntroCompleted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<WordOption[]>([]);
  const [feedback, setFeedback] = useState<{ status: FeedbackStatus; message: string }>({ status: 'idle', message: '' });
  const [isComplete, setIsComplete] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('initial');
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const [playError]   = useSound('/sounds/error.mp3',   { volume: 0.5 });

  useEffect(() => {
    if (feedback.status === 'correct') playSuccess();
    if (feedback.status === 'incorrect') playError();
  }, [feedback.status, playSuccess, playError]);
  
  const loadNewQuestions = useCallback(() => {
    setLoadingState('loading');
    setUsedQuestionIds(prevIds => {
      const newQuestions = adjectivePlacementExamples(adjectivePlacementQuestions, 10, [...prevIds]);
      
      if (newQuestions.length > 0) {
        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        setIsComplete(false);
        setFeedback({ status: 'idle', message: '' });
        setUserAnswer([]);
        setLoadingState('success');
        return [...prevIds, ...newQuestions.map(q => q.id)];
      } else {
        alert("¡Felicidades! Has completado todas las preguntas disponibles.");
        setIsComplete(true);
        setLoadingState('success');
        return prevIds;
      }
    });
    setTimeout(() => setLoadingState('success'), 300);
  }, []);

  useEffect(() => {
    if (introCompleted) {
      loadNewQuestions();
    }
  }, [introCompleted, loadNewQuestions]);
 


  // --- Handlers y Lógica Interna ---
  const handlePracticeAgain = () => loadNewQuestions();
  const handleIntroComplete = () => {
    setIntroCompleted(true);
  };

  const currentQuestionData = useMemo(() => {
    if (questions.length === 0) return null;
    const question = questions[currentQuestionIndex];
    return {
      ...question,
      options: shuffleArray(question.englishCorrect.map((word, index) => ({ id: index, word }))),
    };
  }, [currentQuestionIndex, questions]);
  
  const [wordBankOptions, setWordBankOptions] = useState<WordOption[]>([]);
  useEffect(() => { if (currentQuestionData) setWordBankOptions(currentQuestionData.options); }, [currentQuestionData]);

  const handleWordBankTap = (wordOption: WordOption) => {
    setUserAnswer([...userAnswer, wordOption]);
    setWordBankOptions(wordBankOptions.filter(opt => opt.id !== wordOption.id));
    setFeedback({ status: 'idle', message: '' });
  };

  const handleAnswerTap = (wordOption: WordOption) => {
    setWordBankOptions(shuffleArray([...wordBankOptions, wordOption]));
    setUserAnswer(userAnswer.filter(opt => opt.id !== wordOption.id));
    setFeedback({ status: 'idle', message: '' });
  };

  const handleCheckAnswer = () => {
    const userAnswerString = userAnswer.map(opt => opt.word).join(' ');
    const correctAnswerString = currentQuestionData?.englishCorrect.join(' ');
    if (userAnswerString === correctAnswerString) {
      setFeedback({ status: 'correct', message: '¡Perfecto! El orden es correcto.' });
    } else {
      setFeedback({ 
        status: 'incorrect', 
        message: '¡Casi! Recuerda, en inglés el adjetivo (la descripción) va ANTES del sustantivo (la cosa).'
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        setUserAnswer([]);
      setCurrentQuestionIndex(prev => prev + 1);
      
      setFeedback({ status: 'idle', message: '' });
    } else {
      setIsComplete(true);
      trackLevelCompletion(2);
    }
  };
  
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0;

  // --- Renderizado Principal ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <AnimatePresence>
        {!introCompleted && (
          <LessonIntro
            icon={introContent.icon}
            title={introContent.title}
            messages={introContent.messages}
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>
  
      {introCompleted && (
        <>
          {loadingState === 'loading' && (
            <div className="flex flex-col items-center justify-center flex-1">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg font-semibold">Preparando tu ejercicio...</p>
            </div>
          )}
  
          {loadingState === 'error' && (
            <div className="flex flex-col items-center justify-center flex-1">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-gray-800 text-lg font-bold mb-2">¡Oh, no! Algo salió mal.</p>
              <button
                onClick={() => setIntroCompleted(true)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Reintentar
              </button>
            </div>
          )}
  
          {loadingState === 'success' && (
            <div className="w-full max-w-3xl mx-auto space-y-6">
              {/* ——— Header ——— */}
              <header className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/map')}
                  className="text-gray-500 hover:text-gray-800 transition"
                >
                  ← Volver al Mapa
                </button>
                <h1 className="text-2xl font-extrabold text-gray-900">Orden de Adjetivos</h1>
              </header>
  
              {/* ——— Progress Bar ——— */}
              {!isComplete && (
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </div>
              )}
  
              {/* ——— Main Card ——— */}
              <main className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* — Rule of Gold — */}
                <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 border-l-4 border-blue-400">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="w-8 h-8 text-blue-500 flex-shrink-0 animate-pulse" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">La Regla de Oro</h2>
                      <p className="text-gray-700 mb-3">
                        En inglés, el{' '}
                        <span className="text-purple-600 font-semibold">adjetivo</span> (cómo es) va
                        antes del{' '}
                        <span className="text-pink-600 font-semibold">sustantivo</span> (la cosa).
                      </p>
                      <div className="flex items-center gap-2 bg-white/90 p-3 rounded-lg shadow-inner">
                        <Sparkles className="w-5 h-5 text-green-400" />
                        <p className="text-gray-800 italic">
                          Cada frase que construyas te acerca a tu meta. ¡Tú puedes! 🚀
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* — Exercise Section — */}
                {!isComplete && currentQuestionData && (
                  <div className="px-6 py-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Construye la oración:</h3>
                      <p className="mt-2 text-3xl font-bold text-blue-600">
                        &quot;{currentQuestionData.spanish}&quot;
                      </p>
                    </div>
  
                    {/* — Answer Drop Zone & Audio — */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
                      <motion.div
                        className="min-h-[60px] p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl flex flex-wrap gap-2"
                        whileHover={{ backgroundColor: '#E0F2FE' }}
                      >
                        <AnimatePresence>
                          {userAnswer.map(opt => (
                            <motion.button
                              key={opt.id}
                              layoutId={`word-${opt.id}`}
                              onClick={() => handleAnswerTap(opt)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 font-medium text-gray-800 cursor-pointer"
                            >
                              {opt.word}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </motion.div>
  
                      <div className="flex justify-center md:justify-start">
                        <AnimatePresence>
                          {feedback.status === 'correct' && (
                            <motion.div
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <AudioPlayer sentence={userAnswer.map(w => w.word).join(' ')} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
  
                    {/* — Word Bank — */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">Palabras disponibles:</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        <AnimatePresence>
                          {wordBankOptions.map(opt => (
                            <motion.button
                              key={opt.id}
                              layoutId={`word-${opt.id}`}
                              onClick={() => handleWordBankTap(opt)}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-800 font-medium text-center"
                            >
                              {opt.word}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
  
                    {/* — Check Button — */}
                    {wordBankOptions.length === 0 && feedback.status === 'idle' && (
                      <motion.button
                        onClick={handleCheckAnswer}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:from-indigo-600 hover:to-blue-600 transition"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Revisar respuesta
                      </motion.button>
                    )}
                  </div>
                )}
  
                {/* — Completion Screen — */}
                {isComplete && (
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Ronda Completada!</h2>
                      <p className="text-gray-600 text-lg mb-6">
                        Has practicado un nuevo set de oraciones. ¿Qué quieres hacer ahora?
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                          onClick={() => router.push('/exercises/ing')}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
                        >
                          Siguiente Ejercicio <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handlePracticeAgain}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition"
                        >
                          Volver a Practicar <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </main>
  
              {/* — Feedback Toast — */}
              <AnimatePresence>
                {feedback.status !== 'idle' && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className={`fixed inset-x-4 bottom-6 p-4 rounded-xl shadow-lg ${
                      feedback.status === 'correct' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <div className="max-w-3xl mx-auto flex items-center justify-between">
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
                      <button
                        onClick={handleNextQuestion}
                        className={`px-5 py-2 rounded-lg font-bold text-white transition ${
                          feedback.status === 'correct'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        Continuar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default AdjectivePlacementPage;