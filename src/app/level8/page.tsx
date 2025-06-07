'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';

// --- Definiciones de Tipos Mejoradas ---
type NounKey = 'animal' | 'car' | 'house' | 'tree' | 'person' | 'building' | 'player' | 'river' | 'mountain' | 'book' | 'city' | 'food';

interface NounDetails {
  key: NounKey;
  en: string;
  es: string;
  gender_es: 'el' | 'la';
}

interface SuperlativeAdjectiveOption {
  superlative_en: string;
  base_es_masculine: string;
  base_es_feminine: string;
  applicable_noun_keys: NounKey[];
}

// --- Datos Maestros ---
const allNounsData: Record<NounKey, NounDetails> = {
  animal: { key: 'animal', en: 'animal', es: 'animal', gender_es: 'el' },
  car: { key: 'car', en: 'car', es: 'carro', gender_es: 'el' },
  house: { key: 'house', en: 'house', es: 'casa', gender_es: 'la' },
  tree: { key: 'tree', en: 'tree', es: 'árbol', gender_es: 'el' },
  person: { key: 'person', en: 'person', es: 'persona', gender_es: 'la' },
  building: { key: 'building', en: 'building', es: 'edificio', gender_es: 'el' },
  player: { key: 'player', en: 'player', es: 'jugador', gender_es: 'el' },
  river: { key: 'river', en: 'river', es: 'río', gender_es: 'el' },
  mountain: { key: 'mountain', en: 'mountain', es: 'montaña', gender_es: 'la' },
  book: { key: 'book', en: 'book', es: 'libro', gender_es: 'el' },
  city: { key: 'city', en: 'city', es: 'ciudad', gender_es: 'la' },
  food: { key: 'food', en: 'food', es: 'comida', gender_es: 'la' },
};

const adjectivesData: SuperlativeAdjectiveOption[] = [
  { superlative_en: 'biggest', base_es_masculine: 'grande', base_es_feminine: 'grande', applicable_noun_keys: ['animal', 'house', 'tree', 'building', 'mountain', 'city'] },
  { superlative_en: 'smallest', base_es_masculine: 'pequeño', base_es_feminine: 'pequeña', applicable_noun_keys: ['animal', 'car', 'house', 'book'] },
  { superlative_en: 'fastest', base_es_masculine: 'rápido', base_es_feminine: 'rápida', applicable_noun_keys: ['animal', 'car', 'player', 'person'] },
  { superlative_en: 'slowest', base_es_masculine: 'lento', base_es_feminine: 'lenta', applicable_noun_keys: ['animal', 'car', 'person', 'river'] },
  { superlative_en: 'tallest', base_es_masculine: 'alto', base_es_feminine: 'alta', applicable_noun_keys: ['tree', 'person', 'building', 'mountain'] },
  { superlative_en: 'shortest', base_es_masculine: 'bajo', base_es_feminine: 'baja', applicable_noun_keys: ['tree', 'person'] },
  { superlative_en: 'oldest', base_es_masculine: 'viejo', base_es_feminine: 'vieja', applicable_noun_keys: ['person', 'tree', 'house', 'book', 'city'] },
  { superlative_en: 'youngest', base_es_masculine: 'joven', base_es_feminine: 'joven', applicable_noun_keys: ['person', 'animal', 'player'] },
  { superlative_en: 'longest', base_es_masculine: 'largo', base_es_feminine: 'larga', applicable_noun_keys: ['river', 'book', 'building'] },
  { superlative_en: 'cheapest', base_es_masculine: 'barato', base_es_feminine: 'barata', applicable_noun_keys: ['car', 'house', 'book', 'food']},
];


const Level8Page = () => {
  const router = useRouter();
  const { trackInteraction, trackLevelCompletion } = useFeedback();

  // State management
  const [selectedAdjective, setSelectedAdjective] = useState<SuperlativeAdjectiveOption | null>(null);
  const [selectedNoun, setSelectedNoun] = useState<NounDetails | null>(null);
  const [availableNouns, setAvailableNouns] = useState<NounDetails[]>([]);
  
  // Handle word selection
  const handleAdjectiveSelect = (adjective: SuperlativeAdjectiveOption) => {
    trackInteraction();
    setSelectedAdjective(adjective);
    const nounsToShow = adjective.applicable_noun_keys
        .map(key => allNounsData[key])
        .filter(Boolean); // Filtra por si alguna key no existe
    setAvailableNouns(nounsToShow);
    setSelectedNoun(null); // Reset noun selection
  };

  const handleNounSelect = (noun: NounDetails) => {
    trackInteraction();
    setSelectedNoun(noun);
  };
  
  const getSpanishAdjectiveForm = () => {
    if (!selectedAdjective || !selectedNoun) return "";
    return selectedNoun.gender_es === 'el'
      ? selectedAdjective.base_es_masculine
      : selectedAdjective.base_es_feminine;
  }

  const getSmartTranslation = () => {
    if (!selectedAdjective || !selectedNoun) return null;
    const adjectiveInSpanish = getSpanishAdjectiveForm();
    return `${selectedNoun.gender_es} ${selectedNoun.es} más ${adjectiveInSpanish}`;
  };

  const getContextualSentence = () => {
    if (!selectedAdjective || !selectedNoun) return "";
    let subjectPronoun = "It";
    if (selectedNoun.key === "person" || selectedNoun.key === "player") {
      subjectPronoun = selectedNoun.gender_es === 'la' ? "She" : "He"; // Basic gender assumption
    }
    // Could be more sophisticated by checking if noun is plural
    const verbToBe = (selectedNoun.key === 'animal' && selectedNoun.en.endsWith('s')) ? 'are' : 'is'; // Very basic plural check

    return `${subjectPronoun} ${verbToBe} the ${selectedAdjective.superlative_en} ${selectedNoun.en}.`;
  }

  const handleNextLevel = () => {
    trackLevelCompletion(8);
    router.push('/level9');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
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
          <h1 className="text-xl font-bold text-gray-900">Level 8: Comparatives (-er)</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">Nivel 8: Superlativos (-est)</h1>
          <div className="rounded-3xl p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #6366f1 100%)', borderColor: 'rgba(79, 70, 229, 0.2)', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #4f46e5, #3730a3)', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)' }}><span className="text-3xl">🏆</span></div>
                  <h3 className="text-2xl font-bold text-white mb-3">¿Qué vas a aprender?</h3>
                  <p className="text-indigo-100 text-lg">A identificar lo máximo de un grupo usando superlativos:</p>
                </div>
                <div className="relative mb-6">
                  <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '2px solid rgba(79, 70, 229, 0.3)', boxShadow: '0 8px 25px rgba(79, 70, 229, 0.15)' }}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{ background: 'linear-gradient(145deg, #f59e0b, #d97706)' }}>EJEMPLO</span></div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">✨ The cheetah is the fastest animal.</p>
                      <p className="text-lg text-gray-600 italic">(El guepardo es el animal más rápido.)</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #4f46e5, #3730a3)' }}><span className="text-white text-sm font-bold">💡</span></div>
                    <div><h4 className="font-bold text-white mb-1">Superlativos con &quot;-est&quot;</h4><p className="text-indigo-100 text-sm">Para adjetivos cortos, usamos &quot;the&quot;, añadimos &quot;-est&quot; al adjetivo, y luego el sustantivo.</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)' }}><span className="text-white text-sm font-bold">🔧</span></div>
                    <div><h4 className="font-bold text-white mb-1">Cómo funciona</h4><p className="text-indigo-100 text-sm">Combina &quot;The&quot;, un adjetivo superlativo y un sustantivo apropiado.</p></div>
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <h4 className="text-center font-bold text-indigo-100 mb-3">Más ejemplos (frase corta):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-300"></span><span className="text-indigo-100">&quot;The tallest tree&quot;</span><span className="text-indigo-200">→ (El árbol más alto)</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-300"></span><span className="text-indigo-100">&quot;The smallest car&quot;</span><span className="text-indigo-200">→ (El carro más pequeño)</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Superlativo</div>
              <div className="text-gray-600 text-lg font-medium">The + [Adjetivo-EST] + [Sustantivo]</div>
            </div>

            <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
  {/* Primer bloque "The" - siempre seleccionado, texto blanco */}
  <motion.div 
    whileHover={{ y: -2 }} 
    className={`text-white px-7 py-4 font-semibold text-lg relative min-w-[120px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 shadow-lg`} 
    style={{ 
      background: 'linear-gradient(145deg, #4f46e5, #3730a3)', 
      clipPath: 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)', 
      borderRadius: '0px', 
      boxShadow: '0 8px 25px rgba(79,70,229,0.25),0 3px 0 rgba(55,48,163,0.6),inset 0 1px 0 rgba(255,255,255,0.3)'
    }}
  >
    The
  </motion.div>

  {/* Segundo bloque - condicional */}
  <motion.div 
    whileHover={selectedAdjective ? { y: -2 } : {}} 
    className={`px-7 py-4 font-semibold text-lg relative min-w-[150px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${
      selectedAdjective 
        ? 'text-white shadow-lg' 
        : 'text-gray-800 border-2 border-dashed border-gray-300 shadow-sm'
    }`} 
    style={{ 
      background: selectedAdjective ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', 
      clipPath: selectedAdjective ? 'polygon(0% 20%,10% 20%,15% 0%,85% 0%,90% 20%,100% 20%,100% 80%,90% 80%,85% 100%,15% 100%,10% 80%,0% 80%)' : 'none', 
      marginLeft: '-12px', 
      marginRight: '-12px', 
      borderRadius: selectedAdjective ? '0px' : '0px', 
      boxShadow: selectedAdjective ? '0 8px 25px rgba(139,92,246,0.25),0 3px 0 rgba(124,58,237,0.6),inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.8)'
    }}
  >
    {selectedAdjective?.superlative_en || 'Adjetivo-est'}
  </motion.div>

  {/* Tercer bloque - condicional */}
  <motion.div 
    whileHover={selectedNoun ? { y: -2 } : {}} 
    className={`px-7 py-4 font-semibold text-lg relative min-w-[150px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${
      selectedNoun 
        ? 'text-white shadow-lg' 
        : 'text-gray-800 border-2 border-dashed border-gray-300 shadow-sm'
    }`} 
    style={{ 
      background: selectedNoun ? 'linear-gradient(145deg, #f97316, #ea580c)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', 
      clipPath: selectedNoun ? 'polygon(0% 20%,10% 20%,15% 0%,100% 0%,100% 100%,15% 100%,10% 80%,0% 80%)' : 'none', 
      borderRadius: selectedNoun ? '0px' : '0 12px 12px 0', 
      boxShadow: selectedNoun ? '0 8px 25px rgba(249,115,22,0.25),0 3px 0 rgba(234,88,12,0.6),inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.8)'
    }}
  >
    {selectedNoun?.en || 'Sustantivo'}
  </motion.div>
</div>

            <motion.div className="rounded-2xl p-7 text-center border mb-8" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.08),0 1px 0 rgba(255,255,255,0.5) inset' }} animate={selectedAdjective && selectedNoun ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.6 }}>
              {selectedAdjective && selectedNoun ? (
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 tracking-tight">{getSmartTranslation()}</div>
                  <div className="text-base sm:text-lg text-gray-600 font-medium italic mb-2">(The {selectedAdjective.superlative_en} {selectedNoun.en})</div>
                  <div className="text-sm sm:text-base text-indigo-700 font-semibold mt-2 border-t pt-2">Ejemplo contextual: <span className="font-normal italic">{getContextualSentence()}</span></div>
                </div>
              ) : ( <div className="text-gray-500 text-lg font-medium">Selecciona adjetivo y luego un sustantivo</div> )}
            </motion.div>

            <div className="flex justify-around gap-4 flex-wrap">
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.08),0 1px 0 rgba(255,255,255,0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Adjetivo Superlativo</div>
                <div className="space-y-2">
                  {adjectivesData.map((adj) => (
                    <motion.button key={adj.superlative_en} onClick={() => handleAdjectiveSelect(adj)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedAdjective?.superlative_en === adj.superlative_en ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedAdjective?.superlative_en === adj.superlative_en ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255,255,255,0.9)', borderColor: selectedAdjective?.superlative_en === adj.superlative_en ? '#7c3aed' : 'rgba(0,0,0,0.06)', boxShadow: selectedAdjective?.superlative_en === adj.superlative_en ? '0 2px 8px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.5)'}}>{adj.superlative_en}</motion.button>
                  ))}
                </div>
              </div>
              
              {/* Columna de Sustantivos Dinámica */}
              {selectedAdjective && availableNouns.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.08),0 1px 0 rgba(255,255,255,0.5) inset' }}>
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">Sustantivo</div>
                  <div className="space-y-2">
                    {availableNouns.map((noun) => (
                      <motion.button key={noun.key} onClick={() => handleNounSelect(noun)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedNoun?.key === noun.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedNoun?.key === noun.key ? 'linear-gradient(145deg, #f97316, #ea580c)' : 'rgba(255,255,255,0.9)', borderColor: selectedNoun?.key === noun.key ? '#ea580c' : 'rgba(0,0,0,0.06)', boxShadow: selectedNoun?.key === noun.key ? '0 2px 8px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.5)'}}>{noun.en}</motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="text-center"><h3 className="text-lg font-bold text-indigo-800 mb-2">🏆 ¡Eres el mejor!</h3><p className="text-indigo-700">¡Fantástico! Ahora sabes usar superlativos para destacar lo máximo de un grupo.</p><p className="text-indigo-600 text-sm mt-2">Continúa practicando para describir el mundo que te rodea con más precisión.</p></div>
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

export default Level8Page;