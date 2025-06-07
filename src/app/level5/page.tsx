'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';

const Level5Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  // State management
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
  const [selectedComplement, setSelectedComplement] = useState<string | null>(null);

  const [selectedSubjectEs, setSelectedSubjectEs] = useState<string | null>(null);
  const [selectedVerbEs, setSelectedVerbEs] = useState<string | null>(null); // Spanish infinitive
  const [selectedComplementEs, setSelectedComplementEs] = useState<string | null>(null);

  const [availableComplements, setAvailableComplements] = useState<{ en: string; es: string }[]>([]);

  // Handle word selection
  const handleSubjectSelect = (subject: { en: string; es: string }) => {
    setSelectedSubject(subject.en);
    setSelectedSubjectEs(subject.es);
  };

  const handleVerbSelect = (verb: { base: string; es: string; complements: { en: string; es: string }[] }) => {
    setSelectedVerb(verb.base);
    setSelectedVerbEs(verb.es); // Spanish infinitive
    setAvailableComplements(verb.complements);
    setSelectedComplement(null); // Reset complement when verb changes
    setSelectedComplementEs(null);
  };

  const handleComplementSelect = (complement: { en: string; es: string }) => {
    setSelectedComplement(complement.en);
    setSelectedComplementEs(complement.es);
  };

 
  // Smart translation for "can"
  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedComplement) return null;

    const poderConjugations: { [key: string]: string } = {
      'I': 'puedo',
      'You': 'puedes',
      'He': 'puede',
      'She': 'puede',
      'We': 'podemos',
      'They': 'pueden',
    };

    const spanishPoder = poderConjugations[selectedSubject] || 'puede';

    return `${selectedSubjectEs} ${spanishPoder} ${selectedVerbEs} ${selectedComplementEs}`;
  };

  const handleNextLevel = () => {
    trackLevelCompletion(5);
    router.push('/level6');
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
    }}>
      {/* Header with glassmorphism */}
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
          <h1 className="text-xl font-bold text-gray-900">Level 5: Future Continuous</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Demo Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">
            Nivel 5: Modal &quot;Can&quot; (Habilidad)
          </h1>

          {/* Game Container */}
          <div className="rounded-3xl p-8 w-full shadow-2xl border" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
          }}>
            
            {/* Educational Description Section */}
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{
              background: 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 50%, #f472b6 100%)', // Shades of Pink/Fuchsia
              borderColor: 'rgba(236, 72, 153, 0.2)', // Fuchsia border
              boxShadow: '0 10px 25px rgba(236, 72, 153, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
            }}>
              <div className="p-8">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                    background: 'linear-gradient(145deg, #d946ef, #c026d3)', // Fuchsia
                    boxShadow: '0 8px 20px rgba(217, 70, 239, 0.3)'
                  }}>
                    <span className="text-3xl">💪</span> {/* Ability icon */}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    ¿Qué vas a aprender?
                  </h3>
                  <p className="text-gray-600 text-lg">
                    En este ejercicio vas a construir frases como:
                  </p>
                </div>

                {/* Main highlighted example */}
                <div className="relative mb-6">
                  <div className="rounded-2xl p-6 text-center" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(217, 70, 239, 0.3)', // Fuchsia border for example
                    boxShadow: '0 8px 25px rgba(217, 70, 239, 0.15)'
                  }}>
                    {/* "Example" badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{
                        background: 'linear-gradient(145deg, #0ea5e9, #0284c7)' // A contrasting blue badge
                      }}>
                        EJEMPLO
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        ✨ I can speak English
                      </p>
                      <p className="text-lg text-gray-600 italic">
                        (Yo puedo hablar Inglés)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation with icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #d946ef, #c026d3)' // Fuchsia
                    }}>
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Modal &quot;Can&quot; (Habilidad)</h4>
                      <p className="text-gray-600 text-sm">
                        Usamos &quot;can&quot; para hablar de cosas que sabemos o podemos hacer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)' // Purple for "how it works"
                    }}>
                      <span className="text-white text-sm font-bold">🔧</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Cómo funciona</h4>
                      <p className="text-gray-600 text-sm">
                        Combina sujeto, &quot;can&quot;, verbo base y un complemento.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional examples with improved design */}
                <div className="rounded-xl p-4" style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <h4 className="text-center font-bold text-gray-700 mb-3">Más ejemplos:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                      <span className="text-gray-700">&quot;She can swim fast&quot;</span>
                      <span className="text-gray-500">→ (Ella puede nadar rápido)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span className="text-gray-700">&quot;They can play soccer&quot;</span>
                      <span className="text-gray-500">→ (Ellos pueden jugar fútbol)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Patrón: Modal &quot;Can&quot; (Habilidad)
              </div>
              <div className="text-gray-500 text-lg font-medium">
                [Sujeto] + [can] + [verbo base] + [complemento]
              </div>
            </div>

            {/* LEGO Blocks - Sentence Builder */}
            <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
              {/* Subject Block */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}}
                className={`${selectedSubject ? 'text-white' : 'text-black' } px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedSubject ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{
                  background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', // Blue
                  clipPath: selectedSubject ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none',
                  borderRadius: selectedSubject ? '0px' : '12px 0 0 12px',
                  boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >{selectedSubject || 'Sujeto'}</motion.div>

              {/* "Can" Block (Modal) */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}}
                className={`${selectedSubject ? 'text-white' : 'text-black' } px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{
                  background: selectedSubject ? 'linear-gradient(145deg, #d946ef, #c026d3)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', // Fuchsia
                  clipPath: selectedSubject ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none',
                  marginLeft: '-12px', marginRight: '-12px', borderRadius: selectedSubject ? '0px' : '0px',
                  boxShadow: selectedSubject ? '0 8px 25px rgba(217, 70, 239, 0.25), 0 3px 0 rgba(192, 38, 211, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >can</motion.div>

              {/* Verb Block */}
              <motion.div
                whileHover={selectedVerb ? { y: -2 } : {}}
                className={`${selectedVerb ? 'text-white' : 'text-black' } px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedVerb ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{
                  background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', // Purple
                  clipPath: selectedVerb ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none',
                  marginLeft: '-12px', marginRight: '-12px', borderRadius: selectedVerb ? '0px' : '0px',
                  boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >{selectedVerb || 'verbo base'}</motion.div>
              
              {/* Complement Block */}
              <motion.div
                whileHover={selectedComplement ? { y: -2 } : {}}
                className={`${selectedComplement ? 'text-white' : 'text-black' }  px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedComplement ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{
                  background: selectedComplement ? 'linear-gradient(145deg, #f97316, #ea580c)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', // Orange
                  clipPath: selectedComplement ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none',
                  borderRadius: selectedComplement ? '0px' : '0 12px 12px 0',
                  boxShadow: selectedComplement ? '0 8px 25px rgba(249, 115, 22, 0.25), 0 3px 0 rgba(234, 88, 12, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >{selectedComplement || 'complemento'}</motion.div>
            </div>

            {/* Translation Area */}
            <motion.div 
              className="rounded-2xl p-7 text-center border mb-8"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
              }}
              animate={selectedSubject && selectedVerb && selectedComplement ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              {selectedSubject && selectedVerb && selectedComplement ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    {getSmartTranslation()}
                  </div>
                  <div className="text-lg text-gray-500 font-medium italic">
                    ({selectedSubject} can {selectedVerb} {selectedComplement})
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-lg font-medium">
                  Selecciona sujeto, verbo y complemento para formar una oración
                </div>
              )}
            </motion.div>

            {/* Word Columns */}
            <div className="flex justify-around gap-4 flex-wrap">
              {/* Subjects Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div>
                <div className="space-y-2">
                  {[
                    { en: 'I', es: 'Yo' }, { en: 'You', es: 'Tú' }, { en: 'He', es: 'Él' },
                    { en: 'She', es: 'Ella' }, { en: 'We', es: 'Nosotros' }, { en: 'They', es: 'Ellos/Ellas' }
                  ].map((subject) => (
                    <motion.button key={subject.en} onClick={() => handleSubjectSelect(subject)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject === subject.en ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                      style={{ background: selectedSubject === subject.en ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject === subject.en ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject === subject.en ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)'}}
                    >{subject.en}</motion.button>
                  ))}
                </div>
              </div>

              {/* Verbs (Base) Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos Base</div>
                <div className="space-y-2">
                  {[
                    { base: 'speak', es: 'hablar', complements: [{ en: 'English', es: 'Inglés' }, { en: 'fluently', es: 'con fluidez' }, { en: 'loudly', es: 'en voz alta'}] },
                    { base: 'swim', es: 'nadar', complements: [{ en: 'fast', es: 'rápido' }, { en: 'in the sea', es: 'en el mar' }, { en: 'well', es: 'bien'}] },
                    { base: 'cook', es: 'cocinar', complements: [{ en: 'dinner', es: 'la cena' }, { en: 'pasta', es: 'pasta' }, { en: 'delicious food', es: 'comida deliciosa'}] },
                    { base: 'play', es: 'jugar', complements: [{ en: 'soccer', es: 'fútbol' }, { en: 'the guitar', es: 'la guitarra' }, { en: 'chess', es: 'ajedrez'}] },
                    { base: 'see', es: 'ver', complements: [{ en: 'a bird', es: 'un pájaro' }, { en: 'clearly', es: 'claramente' }, { en: 'the future', es: 'el futuro'}] },
                    { base: 'run', es: 'correr', complements: [{ en: 'quickly', es: 'rápidamente' }, { en: 'a marathon', es: 'un maratón' }, { en: 'for an hour', es: 'por una hora'}] }
                  ].map((verb) => (
                    <motion.button key={verb.base} onClick={() => handleVerbSelect(verb)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb === verb.base ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                      style={{ background: selectedVerb === verb.base ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb === verb.base ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb === verb.base ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)'}}
                    >{verb.base}</motion.button>
                  ))}
                </div>
              </div>

              {/* Complements Column - Only show when verb is selected */}
              {selectedVerb && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                  className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" 
                  style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}
                >
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">Complementos</div>
                  <div className="space-y-2">
                    {availableComplements.map((complement) => (
                      <motion.button key={complement.en} onClick={() => handleComplementSelect(complement)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                        className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedComplement === complement.en ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                        style={{ background: selectedComplement === complement.en ? 'linear-gradient(145deg, #f97316, #ea580c)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedComplement === complement.en ? '#ea580c' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedComplement === complement.en ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)'}}
                      >{complement.en}</motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Final encouragement message */}
            <div className="mt-8 p-4 bg-pink-50 rounded-xl border border-pink-200"> {/* Fuchsia/Pink theme */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-pink-800 mb-2">
                  💪 ¡Increíble!
                </h3>
                <p className="text-pink-700">
                  Ahora sabes cómo usar el modal &quot;can&quot; para hablar de tus habilidades. ¡Puedes hacer muchas combinaciones!
                </p>
                <p className="text-pink-600 text-sm mt-2">
                  Sigue practicando para describir todo lo que puedes hacer.
                </p>
              </div>
            </div>
          </div> {/* End of Game Container */}

          {/* Siguiente Ejercicio Button */}
          <div className="mt-8 flex flex-col items-center gap-4">
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
        </div> {/* End of max-w-4xl mx-auto */}
      </main>
    </div>
  );
};

export default Level5Page;