'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';

interface QuestionData {
  id: number;
  scrambledWords: string[];
  correctOrder: string[]; // Array of words in correct order
  translation_es: string;
  full_question_en: string; // For display after correct answer
}

const questionsBank: QuestionData[] = [
  { id: 1, scrambledWords: ['you', 'like', 'Do', 'apples', '?'], correctOrder: ['Do', 'you', 'like', 'apples', '?'], translation_es: '¿Te gustan las manzanas?', full_question_en: 'Do you like apples?' },
  { id: 2, scrambledWords: ['soccer', 'he', 'play', 'Does', '?'], correctOrder: ['Does', 'he', 'play', 'soccer', '?'], translation_es: '¿Él juega fútbol?', full_question_en: 'Does he play soccer?' },
  { id: 3, scrambledWords: ['English', 'study', 'they', 'Do', '?'], correctOrder: ['Do', 'they', 'study', 'English', '?'], translation_es: '¿Ellos estudian Inglés?', full_question_en: 'Do they study English?' },
  { id: 4, scrambledWords: ['movies', 'watch', 'she', 'Does', '?'], correctOrder: ['Does', 'she', 'watch', 'movies', '?'], translation_es: '¿Ella ve películas?', full_question_en: 'Does she watch movies?' },
  { id: 5, scrambledWords: ['to', 'want', 'Do', 'learn', 'you', 'Spanish', '?'], correctOrder: ['Do', 'you', 'want', 'to', 'learn', 'Spanish', '?'], translation_es: '¿Quieres aprender Español?', full_question_en: 'Do you want to learn Spanish?' },
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

const Level9Page = () => {
  const router = useRouter();
  const {  trackLevelCompletion } = useFeedback();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(questionsBank[0]);
  const [userAnswerWords, setUserAnswerWords] = useState<string[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    const q = questionsBank[currentQuestionIndex];
    setCurrentQuestion(q);
    setRemainingWords(shuffleArray([...q.scrambledWords])); // Shuffle words for display
    setUserAnswerWords([]);
    setFeedback(null);
    setShowCorrect(false);
  }, [currentQuestionIndex]);

  const handleWordClick = (word: string, index: number) => {
    if (showCorrect) return; // Don't allow changes after showing correct answer

    setUserAnswerWords([...userAnswerWords, word]);
    const newRemainingWords = [...remainingWords];
    newRemainingWords.splice(index, 1);
    setRemainingWords(newRemainingWords);
    setFeedback(null); // Reset feedback on new word click
  };

  const handleConstructedWordClick = (word: string, index: number) => {
    if (showCorrect) return;

    const newConstructedWords = [...userAnswerWords];
    newConstructedWords.splice(index, 1);
    setUserAnswerWords(newConstructedWords);
    setRemainingWords(shuffleArray([...remainingWords, word])); // Add back and reshuffle
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (userAnswerWords.join(' ') === currentQuestion.correctOrder.join(' ')) {
      setFeedback('correct');
      setShowCorrect(true);
    } else {
      setFeedback('incorrect');
      // Optionally, reset for another try or show correct answer
      // For now, just shows incorrect. User can try again or click "Next"
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questionsBank.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of questions, maybe navigate to a summary or back to map
      router.push('/map'); // Or a "Level Complete" page
    }
  };
  
  const resetCurrentAttempt = () => {
    setRemainingWords(shuffleArray([...currentQuestion.scrambledWords]));
    setUserAnswerWords([]);
    setFeedback(null);
    setShowCorrect(false);
  }

  

  const handleNextLevel = () => {
    trackLevelCompletion(9);
    router.push('/level10');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff0e6 0%, #ffd8cc 100%)' }}> {/* Light Coral/Orange */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/map')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Map</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Level 9: Superlatives (-est)</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">Nivel 9: ¡Ordena la Pregunta!</h1>
          
          <div className="rounded-3xl p-6 sm:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(15px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            {/* Educational Section / Instructions */}
            <div className="mb-6 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffccb3 0%, #ffb399 50%, #ff9980 100%)', borderColor: 'rgba(255, 126, 95, 0.3)', boxShadow: '0 10px 25px rgba(255, 126, 95, 0.1)' }}>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3" style={{ background: 'linear-gradient(145deg, #ff7e5f, #e65c3d)', boxShadow: '0 8px 20px rgba(255, 126, 95, 0.3)' }}>
                    <span className="text-4xl text-white">❓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Forma la Pregunta Correcta</h3>
                  <p className="text-gray-700 text-sm">Haz clic en las palabras en el orden correcto para construir la pregunta. Luego, ¡verifica tu respuesta!</p>
                </div>
              </div>
            </div>

            {/* Constructed Answer Area */}
            <div className="mb-4 p-4 border-2 border-dashed border-orange-300 rounded-xl min-h-[60px] bg-white/50 flex flex-wrap gap-2 items-center justify-center">
              {userAnswerWords.length === 0 && !showCorrect && <span className="text-gray-500 italic">Tu respuesta aparecerá aquí...</span>}
              {userAnswerWords.map((word, index) => (
                <motion.button
                  key={`${word}-${index}-ans`}
                  layout // Animate reordering
                  onClick={() => handleConstructedWordClick(word, index)}
                  className="px-3 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 text-lg font-medium"
                  disabled={showCorrect}
                >
                  {word}
                </motion.button>
              ))}
            </div>

            {/* Scrambled Words Area */}
            <div className="mb-6 p-4 border border-orange-200 rounded-xl min-h-[100px] bg-orange-50/50 flex flex-wrap gap-2 items-center justify-center">
              {remainingWords.length === 0 && !showCorrect && <span className="text-orange-600 font-semibold">¡Todas las palabras usadas!</span>}
              {remainingWords.map((word, index) => (
                <motion.button
                  key={`${word}-${index}-rem`}
                  layout
                  onClick={() => handleWordClick(word, index)}
                  className="px-3 py-2 bg-white border border-orange-400 text-orange-700 rounded-lg shadow hover:bg-orange-100 hover:border-orange-500 text-lg font-medium"
                  whileHover={{ y: -2 }}
                  disabled={showCorrect}
                >
                  {word}
                </motion.button>
              ))}
            </div>
            
            {/* Action Buttons & Feedback */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
              <button 
                onClick={resetCurrentAttempt} 
                className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors disabled:opacity-50 w-full sm:w-auto"
                disabled={showCorrect || userAnswerWords.length === 0}
              >
                Reiniciar Intento
              </button>
              <button 
                onClick={checkAnswer} 
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors text-lg font-semibold disabled:opacity-50 w-full sm:w-auto"
                disabled={remainingWords.length > 0 || showCorrect || userAnswerWords.length === 0}
              >
                Verificar
              </button>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 mb-6 rounded-lg text-center font-semibold ${feedback === 'correct' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}
              >
                {feedback === 'correct' ? '¡Correcto! 🎉' : 'Intenta de nuevo. Revisa el orden.'}
              </motion.div>
            )}

            {showCorrect && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="p-6 mb-6 bg-blue-50 border border-blue-200 rounded-xl text-center"
              >
                <p className="text-xl font-bold text-blue-700 mb-2">{currentQuestion.full_question_en}</p>
                <p className="text-lg text-blue-600 italic">{currentQuestion.translation_es}</p>
              </motion.div>
            )}

            <button 
              onClick={nextQuestion} 
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 transition-colors text-lg font-semibold disabled:opacity-70"
              // disabled={!showCorrect} // Enable to force correct answer before next
            >
              {currentQuestionIndex < questionsBank.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Nivel'}
            </button>
          </div>

          {/* Siguiente Ejercicio Button */}
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextLevel}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <span>Siguiente Ejercicio</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level9Page;