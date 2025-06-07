'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';

interface NounOption {
  en: string;
  es: string;
  isAre: 'is' | 'are'; // Determines if "is" or "are" should be used
  esSon: 'es' | 'son';
}

interface AdjectiveOption {
  comparative: string; // e.g., "bigger"
  base_es: string; // e.g., "grande" (for "más grande")
}

const Level7Page = () => {
  const router = useRouter();
  const { trackInteraction, trackLevelCompletion } = useFeedback();

  // State management
  const [selectedNoun1, setSelectedNoun1] = useState<NounOption | null>(null);
  const [selectedAdjective, setSelectedAdjective] = useState<AdjectiveOption | null>(null);
  const [selectedNoun2, setSelectedNoun2] = useState<NounOption | null>(null);

  // Data for the selection columns
  const nouns1Data: NounOption[] = [
    { en: 'The elephant', es: 'El elefante', isAre: 'is', esSon: 'es' },
    { en: 'A car', es: 'Un carro', isAre: 'is', esSon: 'es' },
    { en: 'My house', es: 'Mi casa', isAre: 'is', esSon: 'es' },
    { en: 'Apples', es: 'Las manzanas', isAre: 'are', esSon: 'son' },
    { en: 'The sun', es: 'El sol', isAre: 'is', esSon: 'es' },
  ];

  const adjectivesData: AdjectiveOption[] = [
    { comparative: 'bigger', base_es: 'grande' },
    { comparative: 'smaller', base_es: 'pequeño' },
    { comparative: 'faster', base_es: 'rápido' },
    { comparative: 'slower', base_es: 'lento' },
    { comparative: 'taller', base_es: 'alto' },
    { comparative: 'shorter', base_es: 'bajo' },
  ];

  const nouns2Data: NounOption[] = [
    { en: 'the mouse', es: 'el ratón', isAre: 'is', esSon: 'es' }, // isAre/esSon here are just for consistency if reused, not directly used for Noun2 verb
    { en: 'a bicycle', es: 'una bicicleta', isAre: 'is', esSon: 'es' },
    { en: 'your house', es: 'tu casa', isAre: 'is', esSon: 'es' },
    { en: 'oranges', es: 'las naranjas', isAre: 'are', esSon: 'son' },
    { en: 'the moon', es: 'la luna', isAre: 'is', esSon: 'es' },
  ];
  
  // Handle word selection
  const handleNoun1Select = (noun: NounOption) => {
    setSelectedNoun1(noun);
  };

  const handleAdjectiveSelect = (adjective: AdjectiveOption) => {
    setSelectedAdjective(adjective);
  };

  const handleNoun2Select = (noun: NounOption) => {
    setSelectedNoun2(noun);
  };
  
  // Smart translation for comparatives
  const getSmartTranslation = () => {
    if (!selectedNoun1 || !selectedAdjective || !selectedNoun2) return null;
    return `${selectedNoun1.es} ${selectedNoun1.esSon} más ${selectedAdjective.base_es} que ${selectedNoun2.es}`;
  };

  const handleWordSelect = (word: string) => {
    trackInteraction();
    // ... existing word selection logic ...
  };

  const handleNextLevel = () => {
    trackLevelCompletion(7);
    router.push('/level8');
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
    }}>
      {/* Header */}
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
          <h1 className="text-xl font-bold text-gray-900">Level 7: 'Going to' Future</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">Nivel 7: Comparativos (-er)</h1>

          <div className="rounded-3xl p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            {/* Educational Section */}
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #fde047 50%, #eab308 100%)', borderColor: 'rgba(202, 138, 4, 0.2)', boxShadow: '0 10px 25px rgba(202, 138, 4, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #ca8a04, #a16207)', boxShadow: '0 8px 20px rgba(202, 138, 4, 0.3)' }}>
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">¿Qué vas a aprender?</h3>
                  <p className="text-gray-700 text-lg">A comparar dos cosas usando adjetivos cortos:</p>
                </div>
                <div className="relative mb-6">
                  <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '2px solid rgba(202, 138, 4, 0.3)', boxShadow: '0 8px 25px rgba(202, 138, 4, 0.15)' }}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{ background: 'linear-gradient(145deg, #16a34a, #15803d)' }}>EJEMPLO</span></div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">✨ An elephant is bigger than a mouse</p>
                      <p className="text-lg text-gray-600 italic">(Un elefante es más grande que un ratón)</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #ca8a04, #a16207)' }}><span className="text-white text-sm font-bold">💡</span></div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Comparativos con &quot;-er&quot;</h4>
                      <p className="text-gray-700 text-sm">Para adjetivos cortos (una sílaba, o dos terminadas en -y), añadimos &quot;-er&quot; y usamos &quot;than&quot;.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)' }}><span className="text-white text-sm font-bold">🔧</span></div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Cómo funciona</h4>
                      <p className="text-gray-700 text-sm">Combina los elementos para crear oraciones comparativas.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <h4 className="text-center font-bold text-gray-700 mb-3">Más ejemplos:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-gray-700">&quot;A car is faster than a bicycle&quot;</span><span className="text-gray-600">→ (Un carro es más rápido que una bicicleta)</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-gray-700">&quot;My house is taller than your house&quot;</span><span className="text-gray-600">→ (Mi casa es más alta que tu casa)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Comparativo</div>
              <div className="text-gray-600 text-lg font-medium">[Sust. 1] + [is/are] + [Adj.-ER] + [than] + [Sust. 2]</div>
            </div>

            {/* LEGO Blocks */}
            <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
              {/* Noun 1 + is/are Block */}
              <motion.div whileHover={selectedNoun1 ? { y: -2 } : {}}
                className={`${selectedNoun1 ? 'text-white' : 'text-black' } px-6 py-4 font-semibold text-base sm:text-lg relative min-w-[130px] sm:min-w-[150px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-50 ${selectedNoun1 ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{ background: selectedNoun1 ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedNoun1 ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none', borderRadius: selectedNoun1 ? '0px' : '12px 0 0 12px', boxShadow: selectedNoun1 ? '0 8px 25px rgba(59,130,246,0.25),0 3px 0 rgba(37,99,235,0.6),inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.8)'}}
              >{selectedNoun1 ? `${selectedNoun1.en} ${selectedNoun1.isAre}` : 'Sustantivo 1 + (be)'}</motion.div>

              {/* Adjective-er Block */}
              <motion.div whileHover={selectedAdjective ? { y: -2 } : {}}
                className={`${selectedAdjective ? 'text-white' : 'text-black' } px-6 py-4 font-semibold text-base sm:text-lg relative min-w-[130px] sm:min-w-[150px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedAdjective ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{ background: selectedAdjective ? 'linear-gradient(145deg, #ca8a04, #a16207)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedAdjective ? 'polygon(0% 20%,10% 20%,15% 0%,85% 0%,90% 20%,100% 20%,100% 80%,90% 80%,85% 100%,15% 100%,10% 80%,0% 80%)' : 'none', marginLeft: '-12px', marginRight: '-12px', borderRadius: selectedAdjective ? '0px' : '0px', boxShadow: selectedAdjective ? '0 8px 25px rgba(202,138,4,0.25),0 3px 0 rgba(161,98,7,0.6),inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.8)'}}
              >{selectedAdjective?.comparative || 'Adjetivo-er'}</motion.div>

              {/* Than Block */}
              <motion.div whileHover={selectedNoun1 && selectedAdjective ? { y: -2 } : {}}
                className={`${selectedNoun1 && selectedAdjective ? 'text-white' : 'text-black' } px-6 py-4 font-semibold text-base sm:text-lg relative min-w-[100px] sm:min-w-[120px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedNoun1 && selectedAdjective ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{ background: selectedNoun1 && selectedAdjective ? 'linear-gradient(145deg, #84cc16, #65a30d)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedNoun1 && selectedAdjective ? 'polygon(0% 20%,10% 20%,15% 0%,85% 0%,90% 20%,100% 20%,100% 80%,90% 80%,85% 100%,15% 100%,10% 80%,0% 80%)' : 'none', marginLeft: '-12px', marginRight: '-12px', borderRadius: selectedNoun1 && selectedAdjective ? '0px' : '0px', boxShadow: selectedNoun1 && selectedAdjective ? '0 8px 25px rgba(132,204,22,0.25),0 3px 0 rgba(101,163,13,0.6),inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.8)'}}
              >than</motion.div>

              {/* Noun 2 Block */}
              <motion.div whileHover={selectedNoun2 ? { y: -2 } : {}}
                className={`${selectedNoun2 ? 'text-white' : 'text-black' } px-6 py-4 font-semibold text-base sm:text-lg relative min-w-[130px] sm:min-w-[150px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedNoun2 ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{ background: selectedNoun2 ? 'linear-gradient(145deg, #f97316, #ea580c)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedNoun2 ? 'polygon(0% 20%,10% 20%,15% 0%,100% 0%,100% 100%,15% 100%,10% 80%,0% 80%)' : 'none', borderRadius: selectedNoun2 ? '0px' : '0 12px 12px 0', boxShadow: selectedNoun2 ? '0 8px 25px rgba(249,115,22,0.25),0 3px 0 rgba(234,88,12,0.6),inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.8)'}}
              >{selectedNoun2?.en || 'Sustantivo 2'}</motion.div>
            </div>

            {/* Translation Area */}
            <motion.div className="rounded-2xl p-7 text-center border mb-8" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.08),0 1px 0 rgba(255,255,255,0.5) inset' }}
              animate={selectedNoun1 && selectedAdjective && selectedNoun2 ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.6 }}
            >
              {selectedNoun1 && selectedAdjective && selectedNoun2 ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{getSmartTranslation()}</div>
                  <div className="text-lg text-gray-600 font-medium italic">({selectedNoun1.en} {selectedNoun1.isAre} {selectedAdjective.comparative} than {selectedNoun2.en})</div>
                </div>
              ) : (
                <div className="text-gray-500 text-lg font-medium">Selecciona los elementos para comparar</div>
              )}
            </motion.div>

            {/* Word Columns */}
            <div className="flex justify-around gap-4 flex-wrap">
              {/* Noun 1 Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.08),0 1px 0 rgba(255,255,255,0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Sustantivo 1</div>
                <div className="space-y-2">
                  {nouns1Data.map((noun) => (
                    <motion.button key={noun.en} onClick={() => handleNoun1Select(noun)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedNoun1?.en === noun.en ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                      style={{ background: selectedNoun1?.en === noun.en ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.9)', borderColor: selectedNoun1?.en === noun.en ? '#2563eb' : 'rgba(0,0,0,0.06)', boxShadow: selectedNoun1?.en === noun.en ? '0 2px 8px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.5)'}}
                    >{noun.en}</motion.button>
                  ))}
                </div>
              </div>

              {/* Adjectives Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.08),0 1px 0 rgba(255,255,255,0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Adjetivo Comparativo</div>
                <div className="space-y-2">
                  {adjectivesData.map((adj) => (
                    <motion.button key={adj.comparative} onClick={() => handleAdjectiveSelect(adj)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedAdjective?.comparative === adj.comparative ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                      style={{ background: selectedAdjective?.comparative === adj.comparative ? 'linear-gradient(145deg, #ca8a04, #a16207)' : 'rgba(255,255,255,0.9)', borderColor: selectedAdjective?.comparative === adj.comparative ? '#a16207' : 'rgba(0,0,0,0.06)', boxShadow: selectedAdjective?.comparative === adj.comparative ? '0 2px 8px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.5)'}}
                    >{adj.comparative}</motion.button>
                  ))}
                </div>
              </div>
              
              {/* Noun 2 Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.08),0 1px 0 rgba(255,255,255,0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Sustantivo 2</div>
                <div className="space-y-2">
                  {nouns2Data.map((noun) => (
                    <motion.button key={noun.en} onClick={() => handleNoun2Select(noun)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedNoun2?.en === noun.en ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                      style={{ background: selectedNoun2?.en === noun.en ? 'linear-gradient(145deg, #f97316, #ea580c)' : 'rgba(255,255,255,0.9)', borderColor: selectedNoun2?.en === noun.en ? '#ea580c' : 'rgba(0,0,0,0.06)', boxShadow: selectedNoun2?.en === noun.en ? '0 2px 8px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.5)'}}
                    >{noun.en}</motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Final encouragement message */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">⚖️ ¡Comparando como un experto!</h3>
                <p className="text-yellow-700">¡Muy bien! Ya sabes cómo formar comparaciones con adjetivos cortos.</p>
                <p className="text-yellow-600 text-sm mt-2">Sigue practicando para describir las diferencias entre las cosas que te rodean.</p>
              </div>
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

export default Level7Page;