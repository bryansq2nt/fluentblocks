'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';

interface IngOption {
  text: string;
  isCorrect: boolean;
}

interface VerbIngProblem {
  id: number;
  base: string;
  options: IngOption[]; // Incluye la correcta y distractores
  rule_title: string;
  rule_explanation: string; // Explicación más detallada
  example_sentence?: string; // Oración de ejemplo usando la forma -ing
}

const verbProblemsBank: VerbIngProblem[] = [
  { 
    id: 1, base: 'work', 
    options: shuffleArray([{ text: 'working', isCorrect: true }, { text: 'workking', isCorrect: false }, { text: 'workeing', isCorrect: false }]),
    rule_title: "Regla General",
    rule_explanation: "A la mayoría de los verbos, simplemente se les añade &apos;-ing&apos; al final. Ejemplo: work -&gt; working.",
    example_sentence: "She is working hard."
  },
  { 
    id: 2, base: 'make', 
    options: shuffleArray([{ text: 'making', isCorrect: true }, { text: 'makeing', isCorrect: false }, { text: 'macking', isCorrect: false }]),
    rule_title: "Verbos terminados en &apos;-e&apos; muda",
    rule_explanation: "Si un verbo termina en una &apos;-e&apos; que no se pronuncia (e muda), se quita la &apos;-e&apos; y se añade &apos;-ing&apos;. Ejemplo: make -&gt; making.",
    example_sentence: "He is making a cake."
  },
  { 
    id: 3, base: 'run', 
    options: shuffleArray([{ text: 'running', isCorrect: true }, { text: 'runing', isCorrect: false }, { text: 'runnning', isCorrect: false }]),
    rule_title: "Verbos CVC Cortos",
    rule_explanation: "Si un verbo corto de una sílaba termina en Consonante-Vocal-Consonante (CVC), se dobla la última consonante y se añade &apos;-ing&apos;. Ejemplo: run (CVC) -&gt; running.",
    example_sentence: "They are running fast."
  },
  { 
    id: 4, base: 'sit', 
    options: shuffleArray([{ text: 'sitting', isCorrect: true }, { text: 'siting', isCorrect: false }, { text: 'sittting', isCorrect: false }]),
    rule_title: "Verbos CVC Cortos",
    rule_explanation: "Si un verbo corto de una sílaba termina en Consonante-Vocal-Consonante (CVC), se dobla la última consonante y se añade &apos;-ing&apos;. Ejemplo: sit (CVC) -&gt; sitting.",
    example_sentence: "The cat is sitting on the mat."
  },
  { 
    id: 5, base: 'lie', 
    options: shuffleArray([{ text: 'lying', isCorrect: true }, { text: 'lieing', isCorrect: false }, { text: 'lieng', isCorrect: false }]),
    rule_title: "Verbos terminados en &apos;-ie&apos;",
    rule_explanation: "Si un verbo termina en &apos;-ie&apos;, se cambia la &apos;-ie&apos; por una &apos;y&apos; y se añade &apos;-ing&apos;. Ejemplo: lie -&gt; lying.",
    example_sentence: "He is lying on the beach."
  },
  { 
    id: 6, base: 'study', 
    options: shuffleArray([{ text: 'studying', isCorrect: true }, { text: 'studing', isCorrect: false }, { text: 'studyng', isCorrect: false }]),
    rule_title: "Verbos terminados en &apos;-y&apos;",
    rule_explanation: "A los verbos terminados en &apos;-y&apos; (precedida por consonante o vocal), generalmente solo se les añade &apos;-ing&apos;. Ejemplo: study -&gt; studying, play -&gt; playing.",
    example_sentence: "She is studying for her exam."
  },
  { 
    id: 7, base: 'begin', 
    options: shuffleArray([{ text: 'beginning', isCorrect: true }, { text: 'begining', isCorrect: false }, { text: 'beginninng', isCorrect: false }]),
    rule_title: "Verbos de 2+ Sílabas (Acento en la última CVC)",
    rule_explanation: "Si un verbo de dos o más sílabas termina en Consonante-Vocal-Consonante (CVC) y el acento recae en la última sílaba, se dobla la última consonante. Ejemplo: begin -&gt; beginning.",
    example_sentence: "The show is beginning soon."
  },
  {
    id: 8, base: 'visit',
    options: shuffleArray([{ text: 'visiting', isCorrect: true}, {text: 'visitting', isCorrect: false}, {text: 'visitng', isCorrect: false}]),
    rule_title: "Verbos de 2+ Sílabas (Acento NO en la última CVC)",
    rule_explanation: "Si un verbo de dos o más sílabas termina en Consonante-Vocal-Consonante (CVC) pero el acento NO recae en la última sílaba, NO se dobla la consonante. Ejemplo: visit -&gt; visiting.",
    example_sentence: "We are visiting our grandparents."
  }
];

// Fisher-Yates shuffle para las opciones
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const Level11Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<VerbIngProblem>(verbProblemsBank[0]);
  
  const [selectedOption, setSelectedOption] = useState<IngOption | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAttemptMade, setIsAttemptMade] = useState(false); // Para controlar el estado después de un intento

  const initializeProblem = useCallback(() => {
    // Re-barajar opciones para el problema actual si se reinicia
    const problemData = {...verbProblemsBank[currentProblemIndex]};
    problemData.options = shuffleArray([...problemData.options]); // Barajar una copia
    setCurrentProblem(problemData);
    setSelectedOption(null);
    setFeedback(null);
    setIsAttemptMade(false);
  }, [currentProblemIndex]);

  useEffect(() => {
    initializeProblem();
  }, [initializeProblem]);

  const handleOptionSelect = (option: IngOption) => {
    if (isAttemptMade) return; // No permitir cambiar después de un intento hasta "Siguiente"

    setSelectedOption(option);
    setIsAttemptMade(true);
    if (option.isCorrect) {
      setFeedback('¡Correcto! 👍');
    } else {
      const correctAnswer = currentProblem.options.find(opt => opt.isCorrect)?.text;
      setFeedback(`No es correcto. La forma correcta de "${currentProblem.base}" es "${correctAnswer}".`);
    }
  };

  const nextProblem = () => {
    if (currentProblemIndex < verbProblemsBank.length - 1) {
      setCurrentProblemIndex(prevIndex => prevIndex + 1);
    } else {
      router.push('/map'); 
    }
  };
  
  const handleFinishCourse = () => {
    trackLevelCompletion(11);
    router.push('/map');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 70%, #d8b4fe 100%)' }}> {/* Lavanda */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Back to Map</span>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Level 11: Final Challenge</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-lg mx-auto"> 
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 text-center mb-6">Nivel 11: Elige la forma &quot;-ing&quot;</h1>
          
          <div className="rounded-2xl p-5 sm:p-7 bg-white shadow-xl border border-slate-200">
            {/* Tarjeta del Verbo y Pista de Regla */}
            <div className="mb-6 rounded-xl border border-purple-300 bg-gradient-to-br from-purple-500 to-violet-600 p-5 text-white shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm"><span className="text-3xl">✍️</span></div>
                <p className="text-lg sm:text-xl font-medium mb-2">Verbo Base:</p>
                <p className="font-bold text-4xl text-yellow-300 mb-4 tracking-wider">{currentProblem.base}</p>
                <div className="bg-black/30 p-3 rounded-md w-full">
                    <p className="text-sm font-semibold text-purple-100 mb-1">{currentProblem.rule_title}:</p>
                    <p className="text-xs sm:text-sm text-purple-200">{currentProblem.rule_explanation}</p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-slate-600 mb-5 text-sm sm:text-base">Selecciona la forma correcta del verbo con &quot;-ing&quot;:</p>

            {/* Opciones Múltiples */}
            <div className="space-y-3 mb-6">
                {currentProblem.options.map((option, index) => (
                    <motion.button 
                        key={index}
                        whileHover={!isAttemptMade ? { scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" } : {}}
                        whileTap={!isAttemptMade ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isAttemptMade}
                        className={`w-full p-4 rounded-lg border-2 text-lg font-medium transition-all duration-200 ease-in-out
                            ${isAttemptMade && option.isCorrect ? 'bg-green-500 border-green-600 text-white transform scale-105 shadow-xl' : ''}
                            ${isAttemptMade && selectedOption?.text === option.text && !option.isCorrect ? 'bg-red-500 border-red-600 text-white shadow-md' : ''}
                            ${!isAttemptMade ? 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500' : ''}
                            ${isAttemptMade && selectedOption?.text !== option.text && !option.isCorrect ? 'bg-slate-100 border-slate-300 text-slate-500 opacity-70' : ''}
                        `}
                    >
                        {option.text}
                    </motion.button>
                ))}
            </div>
            
            {feedback && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`p-3 my-4 rounded-md text-center font-medium text-sm shadow ${ selectedOption?.isCorrect ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300' }`}>
                {feedback}
                 {selectedOption?.isCorrect && currentProblem.example_sentence && (
                    <p className="text-xs italic mt-1">Ej: &quot;{currentProblem.example_sentence}&quot;</p>
                 )}
              </motion.div>
            )}
            
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={initializeProblem} className="w-full px-4 py-2.5 bg-amber-500 text-white rounded-md shadow hover:bg-amber-600 transition-colors text-sm sm:text-base font-medium focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" disabled={!isAttemptMade}>Intentar de Nuevo</button>
                <button onClick={nextProblem} className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition-colors text-sm sm:text-base font-medium focus:ring-2 focus:ring-purple-400 focus:ring-offset-2" disabled={!isAttemptMade}>
                 {currentProblemIndex < verbProblemsBank.length - 1 ? 'Siguiente Verbo' : 'Finalizar Nivel'}
                </button>
            </div>
          </div>
          
          {/* Finalizar Curso Button */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinishCourse}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <span>Finalizar Curso</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.button>

            {/* Feedback Button */}
            {!hasShownFeedback && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeedbackModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <span>Enviar Feedback</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level11Page;