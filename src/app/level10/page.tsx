'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';

interface WordOption {
  text: string;
  type: 'pronoun' | 'auxiliary';
}

interface QuestionScenario {
  id: number;
  question_en: string;
  question_es: string;
  question_subject_pronouns_en: Array<'I' | 'you' | 'he' | 'she' | 'it' | 'we' | 'they'>;
  correct_answer_pronoun_en: 'I' | 'he' | 'she' | 'it' | 'we' | 'they';
  expected_answer_type: 'yes' | 'no';
  textual_cue: string;
}

// --- Datos Maestros ---
const scenariosBank: QuestionScenario[] = [
  { id: 1, question_en: 'Do you like apples?', question_es: '¿Te gustan las manzanas?', question_subject_pronouns_en: ['you'], correct_answer_pronoun_en: 'I', expected_answer_type: 'yes', textual_cue: '(Contexto: Te encantan ✅)' },
  { id: 2, question_en: 'Does he play soccer?', question_es: '¿Él juega fútbol?', question_subject_pronouns_en: ['he'], correct_answer_pronoun_en: 'he', expected_answer_type: 'no', textual_cue: '(Contexto: No le gusta ❌)' },
  { id: 3, question_en: 'Do they study English?', question_es: '¿Ellos estudian Inglés?', question_subject_pronouns_en: ['they'], correct_answer_pronoun_en: 'they', expected_answer_type: 'yes', textual_cue: '(Contexto: Sí, mucho ✅)' },
  { id: 4, question_en: 'Does your sister watch horror movies?', question_es: '¿Tu hermana ve películas de terror?', question_subject_pronouns_en: ['she'], correct_answer_pronoun_en: 'she', expected_answer_type: 'no', textual_cue: '(Contexto: Las odia ❌)' },
  { id: 5, question_en: 'Are we late?', question_es: '¿Llegamos tarde?', question_subject_pronouns_en: ['we'], correct_answer_pronoun_en: 'we', expected_answer_type: 'no', textual_cue: '(Contexto: No, justo a tiempo ❌)' },
];


const Level10Page = () => {
  const router = useRouter();
  const { trackInteraction, trackLevelCompletion } = useFeedback();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentScenario, setCurrentScenario] = useState<QuestionScenario>(scenariosBank[0]);
  
  const [userYesNoChoice, setUserYesNoChoice] = useState<'yes' | 'no' | null>(null);
  // Partes que el usuario ha seleccionado para su respuesta
  const [selectedPronoun, setSelectedPronoun] = useState<string | null>(null);
  const [selectedAuxiliary, setSelectedAuxiliary] = useState<string | null>(null);

  // Opciones disponibles para el usuario en cada paso
  const [pronounOptions, setPronounOptions] = useState<WordOption[]>([]);
  const [auxiliaryOptions, setAuxiliaryOptions] = useState<WordOption[]>([]);
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  const getCorrectAuxiliary = useCallback((pronoun: string, isAffirmative: boolean) => {
    const isThirdPersonSingular = pronoun === 'he' || pronoun === 'she' || pronoun === 'it';
    // Manejo de preguntas con "to be" como "Are we late?" -> "Yes, we ARE" / "No, we AREN'T"
    // Para este nivel, nos enfocaremos en do/does. Si la pregunta usa "to be", la respuesta corta también.
    const qVerb = currentScenario.question_en.split(" ")[0].toLowerCase(); // "do", "does", "are", "is"
    
    if (qVerb === 'are' || qVerb === 'is' || qVerb === 'am') {
        if (pronoun === 'I' && qVerb === 'are') return isAffirmative ? 'am' : "am not"; // Are YOU ...? Yes, I AM
        if (pronoun === 'I' && qVerb === 'am') return isAffirmative ? 'am' : "am not"; // Am I ...? Yes, I AM

        const affirmativeToBe = (pronoun === 'we' || pronoun === 'you' || pronoun === 'they') ? 'are' : 'is';
        const negativeToBe = (pronoun === 'we' || pronoun === 'you' || pronoun === 'they') ? "aren't" : "isn't";
        if (pronoun === 'I') return isAffirmative ? 'am' : "am not"; // Exception for "I"

        return isAffirmative ? affirmativeToBe : negativeToBe;
    }

    // Default to do/does
    if (isAffirmative) {
      return isThirdPersonSingular ? 'does' : 'do';
    } else {
      return isThirdPersonSingular ? "doesn't" : "don't";
    }
  }, [currentScenario]);


  const initializeScenario = useCallback(() => {
    const scenario = scenariosBank[currentScenarioIndex];
    setCurrentScenario(scenario);
    setUserYesNoChoice(null);
    setSelectedPronoun(null);
    setSelectedAuxiliary(null);
    setPronounOptions([]);
    setAuxiliaryOptions([]);
    setFeedback(null);
    setIsCorrect(null);
    setShowFullAnswer(false);
  }, [currentScenarioIndex]);

  useEffect(() => {
    initializeScenario();
  }, [initializeScenario]);

  const nextScenario = () => {
    if (currentScenarioIndex < scenariosBank.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      // initializeScenario se llamará automáticamente por el useEffect
    } else {
      // Fin de los escenarios, redirigir o mostrar mensaje de finalización
      router.push('/map'); 
    }
  };

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

  const handleYesNoSelect = (choice: 'yes' | 'no') => {
    setUserYesNoChoice(choice);
    setSelectedPronoun(null); // Reset selections
    setSelectedAuxiliary(null);
    setAuxiliaryOptions([]);
    setIsCorrect(null);
    setFeedback(null);
    setShowFullAnswer(false);

    // Generar opciones de pronombres
    let pronouns: string[] = [];
    if (currentScenario.question_subject_pronouns_en.includes('you')) {
      pronouns = ['I', 'you']; // Si la pregunta es a "you", la respuesta puede ser "I" o a veces "you" (si se re-pregunta)
    } else {
      // Usar el pronombre de respuesta correcto y añadir un distractor plausible
      pronouns = [currentScenario.correct_answer_pronoun_en];
      if (currentScenario.correct_answer_pronoun_en === 'he') pronouns.push('she');
      else if (currentScenario.correct_answer_pronoun_en === 'she') pronouns.push('he');
      else if (currentScenario.correct_answer_pronoun_en === 'I') pronouns.push('you');
      else if (currentScenario.correct_answer_pronoun_en === 'we') pronouns.push('they');
      else if (currentScenario.correct_answer_pronoun_en === 'they') pronouns.push('we');
      else pronouns.push('it'); // Default distractor
      pronouns = Array.from(new Set(pronouns)); // Evitar duplicados si correct_answer_pronoun_en es 'it'
    }
    setPronounOptions(shuffleArray(pronouns.map((p) => ({ text: p, type: 'pronoun' }))));
  };

  const handlePronounSelect = (pronounText: string) => {
    setSelectedPronoun(pronounText);
    setSelectedAuxiliary(null); // Reset auxiliary si el pronombre cambia
    setIsCorrect(null);
    
    // Generar opciones de auxiliares (correcta + distractoras)
    const correctAux = getCorrectAuxiliary(pronounText, userYesNoChoice === 'yes');
    let auxChoices: string[] = [correctAux];

    // Añadir distractores para do/does/don't/doesn't
    const qVerb = currentScenario.question_en.split(" ")[0].toLowerCase();
    if (qVerb === 'do' || qVerb === 'does') {
        if (userYesNoChoice === 'yes') {
            auxChoices.push(correctAux === 'do' ? 'does' : 'do');
        } else { // No
            auxChoices.push(correctAux === "don't" ? "doesn't" : "don't");
        }
    } else if (qVerb === 'are' || qVerb === 'is' || qVerb === 'am') {
        // Añadir distractores para to be
        if (userYesNoChoice === 'yes') { // Yes
            if(correctAux === 'am') auxChoices.push('is', 'are');
            else if(correctAux === 'is') auxChoices.push('am', 'are');
            else if(correctAux === 'are') auxChoices.push('am', 'is');
        } else { // No
            if(correctAux === 'am not') auxChoices.push("isn't", "aren't");
            else if(correctAux === "isn't") auxChoices.push("am not", "aren't");
            else if(correctAux === "aren't") auxChoices.push("am not", "isn't");
        }
    }


    // Asegurarse de que no haya más de 2-3 opciones y que sean únicas
    auxChoices = Array.from(new Set(auxChoices)).slice(0, 3);
    setAuxiliaryOptions(shuffleArray(auxChoices.map((aux) => ({ text: aux, type: 'auxiliary' }))));
  };

  const handleAuxiliarySelect = (auxText: string) => {
    setSelectedAuxiliary(auxText);
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (!userYesNoChoice || !selectedPronoun || !selectedAuxiliary) {
        setFeedback("Por favor, completa todos los pasos de la respuesta.");
        setIsCorrect(false);
        return;
    }

    if (userYesNoChoice !== currentScenario.expected_answer_type) {
      setFeedback(`La pista indicaba una respuesta ${currentScenario.expected_answer_type === 'yes' ? 'AFIRMATIVA' : 'NEGATIVA'}. Elige "${currentScenario.expected_answer_type === 'yes' ? 'Yes' : 'No'}" y reconstruye.`);
      setIsCorrect(false);
      return;
    }
    
    const correctPronounForAnswer = currentScenario.correct_answer_pronoun_en;
    const correctAuxForAnswer = getCorrectAuxiliary(correctPronounForAnswer, userYesNoChoice === 'yes');

    if (selectedPronoun === correctPronounForAnswer && selectedAuxiliary === correctAuxForAnswer) {
      setFeedback('¡Correcto! 🎉');
      setIsCorrect(true);
      setShowFullAnswer(true);
    } else {
      let errorMsg = "Revisa tu respuesta. ";
      if (selectedPronoun !== correctPronounForAnswer) errorMsg += "El pronombre no es el correcto. ";
      if (selectedAuxiliary !== correctAuxForAnswer) errorMsg += "El auxiliar no es el correcto para ese pronombre. ";
      setFeedback(errorMsg.trim());
      setIsCorrect(false);
    }
  };
  
  const constructedResponsePreview = selectedPronoun && selectedAuxiliary 
    ? `${selectedPronoun} ${selectedAuxiliary}.` 
    : selectedPronoun 
    ? `${selectedPronoun} ...` 
    : "...";

  const fullCorrectAnswerEN = showFullAnswer && isCorrect ? 
    `${userYesNoChoice === 'yes' ? 'Yes' : 'No'}, ${currentScenario.correct_answer_pronoun_en} ${getCorrectAuxiliary(currentScenario.correct_answer_pronoun_en, userYesNoChoice === 'yes')}.`
    : "";

  const handleWordSelect = (word: string) => {
    trackInteraction();
    // ... existing word selection logic ...
  };

  const handleNextLevel = () => {
    trackLevelCompletion(10);
    router.push('/level11');
  };

  // --- INICIO DEL JSX ---
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 70%, #99f6e4 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Back to Map</span>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Level 10: Responding</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-700 text-center mb-6">Nivel 10: ¡Responde la Pregunta!</h1>
          
          <div className="rounded-2xl p-5 sm:p-7 bg-white shadow-xl border border-slate-200">
            {/* ... (Tarjeta de Pregunta y Pista sin cambios significativos en estructura) ... */}
            <div className="mb-6 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-500 to-emerald-500 p-5 text-white shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm"><span className="text-3xl">🗣️</span></div>
                <p className="text-lg sm:text-xl font-semibold mb-1">{currentScenario.question_en}</p>
                <p className="text-xs sm:text-sm text-teal-100 italic mb-3">{currentScenario.question_es}</p>
                <p className="text-sm sm:text-base font-medium bg-black/30 px-3 py-1.5 rounded-md ">{currentScenario.textual_cue}</p>
              </div>
            </div>

            {/* Paso 1: Yes/No */}
            {!userYesNoChoice && !showFullAnswer && (
              <div className="mb-6">
<p className="text-center text-slate-700 font-medium mb-3 text-base">
  1. Según la pista, ¿cómo responderías?
</p>                <div className="grid grid-cols-2 gap-3">
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={() => handleYesNoSelect('yes')} className="w-full px-4 py-3 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2">Yes</motion.button>
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={() => handleYesNoSelect('no')} className="w-full px-4 py-3 bg-red-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-offset-2">No</motion.button>
                </div>
              </div>
            )}
            
            {/* Preview de Respuesta Construida */}
            {userYesNoChoice && !showFullAnswer && (
                <div className="mb-4 p-3 border-2 border-dashed border-teal-400 rounded-lg min-h-[56px] bg-teal-50 flex items-center justify-center">
                    <span className="font-bold text-xl text-teal-700">
                        {userYesNoChoice === 'yes' ? 'Yes, ' : 'No, '}
                        {constructedResponsePreview}
                    </span>
                </div>
            )}

            {/* Paso 2: Elegir Pronombre */}
            {userYesNoChoice && !selectedPronoun && !showFullAnswer && pronounOptions.length > 0 && (
              <div className="mb-5">
                <p className="text-center text-slate-700 font-medium mb-3 text-base">2. Elige el pronombre correcto para la respuesta:</p>
                <div className="grid grid-cols-2 gap-3">
                  {pronounOptions.map(opt => (
                    <motion.button key={opt.text} whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => handlePronounSelect(opt.text)} className="w-full px-3 py-2.5 bg-sky-500 text-white rounded-md shadow hover:bg-sky-600 text-lg font-medium">{opt.text}</motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 3: Elegir Auxiliar */}
            {selectedPronoun && !selectedAuxiliary && !showFullAnswer && auxiliaryOptions.length > 0 && (
              <div className="mb-5">
                <p className="text-center text-slate-700 font-medium mb-3 text-base">3. Elige el auxiliar correcto:</p>
                <div className={`grid grid-cols-${auxiliaryOptions.length > 2 ? 3 : 2} gap-2`}> {/* Ajusta columnas según opciones */}
                  {auxiliaryOptions.map(opt => (
                    <motion.button key={opt.text} whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => handleAuxiliarySelect(opt.text)} className="w-full px-3 py-2.5 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 text-lg font-medium">{opt.text}</motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Botón de Verificar */}
            {userYesNoChoice && selectedPronoun && selectedAuxiliary && !showFullAnswer && (
                <div className="flex justify-center mb-5 mt-3">
                    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={checkAnswer} className="px-8 py-3 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition-colors text-lg font-semibold focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2">Verificar Respuesta</motion.button>
                </div>
            )}

            {/* ... (Feedback y Respuesta Correcta sin cambios significativos en estructura) ... */}
             {feedback && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`p-3 my-4 rounded-md text-center font-medium text-sm shadow ${ isCorrect === true ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border-red-300' }`}>
                {feedback}
              </motion.div>
            )}

            {showFullAnswer && isCorrect && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 my-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
                <p className="text-lg font-semibold text-teal-700 mb-1">{fullCorrectAnswerEN}</p>
              </motion.div>
            )}
            
            {/* ... (Botones de Reiniciar y Siguiente sin cambios significativos en estructura) ... */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={initializeScenario} className="w-full px-4 py-2.5 bg-amber-500 text-white rounded-md shadow hover:bg-amber-600 transition-colors text-sm sm:text-base font-medium focus:ring-2 focus:ring-amber-400 focus:ring-offset-2" >Reiniciar Intento</button>
                <button onClick={nextScenario} className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-md shadow hover:bg-teal-700 transition-colors text-sm sm:text-base font-medium focus:ring-2 focus:ring-teal-400 focus:ring-offset-2" disabled={!isCorrect && !showFullAnswer}>
                 {currentScenarioIndex < scenariosBank.length - 1 ? 'Siguiente' : 'Finalizar Nivel'}
                </button>
            </div>
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

export default Level10Page;