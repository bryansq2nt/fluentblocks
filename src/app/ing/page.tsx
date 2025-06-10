'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { ShareButton } from '../../components/game/ShareButton';
import { AudioPlayer } from '../../components/game/AudioPlayer'; // Nuevo nombre
// --- DATA STRUCTURES FOR THIS LEVEL ---
interface IngOption {
  text: string;
  isCorrect: boolean;
}

interface VerbIngProblem {
  id: number;
  base: string;
  options: IngOption[];
  rule_title: string;
  rule_explanation: string;
  example_sentence?: string;
}

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

const verbProblemsBank: VerbIngProblem[] = [
  { id: 1, base: 'work', options: [{ text: 'working', isCorrect: true }, { text: 'workking', isCorrect: false }, { text: 'workeing', isCorrect: false }], rule_title: "Regla General", rule_explanation: "A la mayoría de los verbos, simplemente se les añade '-ing' al final.", example_sentence: "She is working hard." },
  { id: 2, base: 'make', options: [{ text: 'making', isCorrect: true }, { text: 'makeing', isCorrect: false }, { text: 'macking', isCorrect: false }], rule_title: "Verbos terminados en '-e' muda", rule_explanation: "Si un verbo termina en una '-e' que no se pronuncia, se quita la '-e' y se añade '-ing'.", example_sentence: "He is making a cake." },
  { id: 3, base: 'run', options: [{ text: 'running', isCorrect: true }, { text: 'runing', isCorrect: false }, { text: 'runnning', isCorrect: false }], rule_title: "Verbos CVC Cortos", rule_explanation: "Si un verbo corto termina en Consonante-Vocal-Consonante (CVC), se dobla la última consonante.", example_sentence: "They are running fast." },
  { id: 4, base: 'sit', options: [{ text: 'sitting', isCorrect: true }, { text: 'siting', isCorrect: false }, { text: 'sittting', isCorrect: false }], rule_title: "Verbos CVC Cortos", rule_explanation: "Si un verbo corto termina en Consonante-Vocal-Consonante (CVC), se dobla la última consonante.", example_sentence: "The cat is sitting on the mat." },
  { id: 5, base: 'lie', options: [{ text: 'lying', isCorrect: true }, { text: 'lieing', isCorrect: false }, { text: 'lieng', isCorrect: false }], rule_title: "Verbos terminados en '-ie'", rule_explanation: "Si un verbo termina en '-ie', se cambia la '-ie' por una 'y' y se añade '-ing'.", example_sentence: "He is lying on the beach." },
  { id: 6, base: 'study', options: [{ text: 'studying', isCorrect: true }, { text: 'studing', isCorrect: false }, { text: 'studyng', isCorrect: false }], rule_title: "Verbos terminados en '-y'", rule_explanation: "A los verbos terminados en '-y', generalmente solo se les añade '-ing' sin cambiar nada.", example_sentence: "She is studying for her exam." },
  { id: 7, base: 'begin', options: [{ text: 'beginning', isCorrect: true }, { text: 'begining', isCorrect: false }, { text: 'beginninng', isCorrect: false }], rule_title: "Verbos de 2+ Sílabas (Acento en la última CVC)", rule_explanation: "Si el acento de voz recae en la última sílaba (que es CVC), se dobla la consonante final.", example_sentence: "The show is beginning soon." },
  { id: 8, base: 'visit', options: [{ text: 'visiting', isCorrect: true}, {text: 'visitting', isCorrect: false}, {text: 'visitng', isCorrect: false}], rule_title: "Verbos de 2+ Sílabas (Acento NO en la última CVC)", rule_explanation: "Si el acento de voz NO recae en la última sílaba (que es CVC), no se dobla la consonante.", example_sentence: "We are visiting our grandparents." }
];

const Level10Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<VerbIngProblem>(verbProblemsBank[0]);
  
  const [selectedOption, setSelectedOption] = useState<IngOption | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAttemptMade, setIsAttemptMade] = useState(false);
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  const initializeProblem = useCallback(() => {
    const problemData = {...verbProblemsBank[currentProblemIndex]};
    problemData.options = shuffleArray([...problemData.options]);
    setCurrentProblem(problemData);
    setSelectedOption(null);
    setFeedback(null);
    setIsAttemptMade(false);
  }, [currentProblemIndex]);

  useEffect(() => {
    initializeProblem();
  }, [initializeProblem]);

  const handleOptionSelect = (option: IngOption) => {
    if (isAttemptMade) return;

    setSelectedOption(option);
    setIsAttemptMade(true);
    if (option.isCorrect) {
      setFeedback('¡Correcto! 👍');
      if (currentProblemIndex === verbProblemsBank.length - 1) {
        setIsLevelFinished(true);
        trackLevelCompletion(1); // Track completion on the last correct answer
      }
    } else {
      const correctAnswer = currentProblem.options.find(opt => opt.isCorrect)?.text;
      setFeedback(`Incorrecto. La forma correcta de "${currentProblem.base}" es "${correctAnswer}".`);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < verbProblemsBank.length - 1) {
      setCurrentProblemIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handleNextLevel = () => {
    // Según tu mapa, este es el Nivel 1, y el siguiente es el 2 (Present Continuous)
    trackLevelCompletion(1);
    router.push('/presente-continuo');
  };

  const handleRestartLevel = () => {
    setIsLevelFinished(false);
    setCurrentProblemIndex(0);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Back to Map</span>
          </button>
          <h1 className="text-xl font-bold text-slate-800">Level 1: The &quot;ing&quot; Form</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-lg mx-auto"> 
          <div className="rounded-2xl p-5 sm:p-7 bg-white shadow-xl border border-slate-200">
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #d9f99d 0%, #bef264 100%)', borderColor: 'rgba(132, 204, 22, 0.2)', boxShadow: '0 10px 25px rgba(132, 204, 22, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8"><div className="text-center"><div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #a3e635, #84cc16)', boxShadow: '0 8px 20px rgba(132, 204, 22, 0.3)' }}>
                <span className="text-3xl">⚙️</span></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">El Secreto del &quot;ing&quot;</h3>
                <p className="text-gray-600 text-lg mb-6">El sufijo <strong className="font-semibold">&quot;ing&quot;</strong> en inglés es como añadir <strong className="font-semibold text-lime-700">&quot;ando&quot;</strong> o <strong className="font-semibold text-lime-700">&quot;endo&quot;</strong> en español.</p><div className="text-left bg-white/60 rounded-xl border border-gray-200 p-4 mb-8"><h4 className="text-lg font-bold text-center text-gray-800 mb-3">ing = ando / endo</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"><div><p className="text-gray-700">comer → comi<strong className="text-lime-700 font-bold">endo</strong></p><p className="text-gray-900 font-medium">eat → eat<strong className="text-lime-700 font-bold">ing</strong></p></div><div><p className="text-gray-700">hablar → habl<strong className="text-lime-700 font-bold">ando</strong></p><p className="text-gray-900 font-medium">talk → talk<strong className="text-lime-700 font-bold">ing</strong></p></div></div></div><p className="text-gray-600 text-lg mb-4">Aunque la idea es simple, ¡hay algunas <strong className="font-semibold">reglas de ortografía</strong> importantes que practicarás a continuación!</p></div></div>
            </div>

            <div className="rounded-xl border border-purple-300 bg-gradient-to-br from-purple-500 to-violet-600 p-5 text-white shadow-lg">
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
            
            <p className="text-center text-slate-600 my-5 text-sm sm:text-base">Selecciona la forma correcta del verbo con &quot;ing&quot;:</p>

            <div className="space-y-3 mb-6">
                {currentProblem.options.map((option) => (
                    <motion.button 
                        key={`${currentProblem.id}-${option.text}`}
                        whileHover={!isAttemptMade ? { scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" } : {}}
                        whileTap={!isAttemptMade ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isAttemptMade}
                        className={`w-full p-4 rounded-lg border-2 text-lg font-medium transition-all duration-200 ease-in-out text-center ${isAttemptMade && option.isCorrect ? 'bg-green-500 border-green-600 text-white transform scale-105 shadow-xl' : ''} ${isAttemptMade && selectedOption?.text === option.text && !option.isCorrect ? 'bg-red-500 border-red-600 text-white shadow-md' : ''} ${!isAttemptMade ? 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500' : ''} ${isAttemptMade && selectedOption?.text !== option.text && !option.isCorrect ? 'bg-slate-100 border-slate-300 text-slate-500 opacity-70' : ''}`}
                    >{option.text}</motion.button>
                ))}
            </div>
            
            <AnimatePresence>
  {feedback && (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 1. Muestra el feedback (Correcto/Incorrecto) */}
      <div
        className={`p-3 rounded-md text-center font-medium text-sm shadow ${
          selectedOption?.isCorrect 
            ? 'bg-green-100 text-green-700 border-green-300' 
            : 'bg-red-100 text-red-700 border-red-300' 
        }`}
      >
        {feedback}
      </div>

      {/* 2. Muestra SIEMPRE la oración de ejemplo (si existe) después de un intento */}
      {currentProblem.example_sentence && (
        <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-gray-100 rounded-md">
          <p className="text-sm italic text-gray-700">
            Ej: &quot;{currentProblem.example_sentence}&quot;
          </p>
          {/* Aquí es donde se usa el nuevo componente */}
          <AudioPlayer sentence={currentProblem.example_sentence} />
        </div>
      )}
    </motion.div>
  )}
</AnimatePresence>
            
            {/* --- BLOQUE DE BOTONES CORREGIDO --- */}
            <div className="mt-6 space-y-3">
              {isLevelFinished ? (
                <>
                  <button onClick={handleNextLevel} className="w-full px-4 py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition-colors text-base sm:text-lg font-medium">
                    Siguiente Ejercicio
                  </button>
                  <button onClick={handleRestartLevel} className="w-full px-4 py-2 bg-amber-500 text-white rounded-md shadow hover:bg-amber-600 transition-colors text-sm font-medium">
                    Reiniciar Nivel
                  </button>
                </>
              ) : (
                <button onClick={handleNextProblem} className="w-full px-4 py-3 bg-purple-600 text-white rounded-md shadow-lg hover:bg-purple-700 transition-colors text-base sm:text-lg font-medium disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={!isAttemptMade}>
                  Siguiente
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-4">
          <ShareButton
  title="¡Estoy aprendiendo en FluentBlocks!"
  text="Dominando las reglas del '-ing' en inglés. ¡Es más fácil de lo que parece!"
/>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNextLevel} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
            <span>Siguiente Ejercicio</span>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
            </motion.button>
            {!hasShownFeedback && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFeedbackModal(true)} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <span>Enviar Feedback</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </motion.button>
            )}
           
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level10Page;