'use client';

import { useRouter } from 'next/navigation';
import { motion} from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';

const Level4Page = () => {
  const router = useRouter();
  const {  trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  // State management
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null); // This will be the base form of the verb
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSubjectEs, setSelectedSubjectEs] = useState<string | null>(null);
  const [selectedVerbEs, setSelectedVerbEs] = useState<string | null>(null); // Spanish base verb or placeholder
  const [selectedTimeEs, setSelectedTimeEs] = useState<string | null>(null);

  // Handle word selection
  const handleSubjectSelect = (subject: { en: string; es: string }) => {
    setSelectedSubject(subject.en);
    setSelectedSubjectEs(subject.es);
  };

  const handleVerbSelect = (verb: { base: string; es: string }) => { // 'base' for English base verb
    setSelectedVerb(verb.base);
    setSelectedVerbEs(verb.es); // This 'es' is a placeholder like "cocinaré/cocinarás..."
  };

  const handleTimeSelect = (time: { en: string; es: string }) => {
    setSelectedTime(time.en);
    setSelectedTimeEs(time.es);
  };



  // Smart translation for Future Simple
  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedTime) return null;

    // Spanish future tense conjugations for "will + verb"
    const translations: { [key: string]: { [key: string]: string } } = {
      'I': {
        'cook': 'cocinaré',
        'play': 'jugaré',
        'clean': 'limpiaré',
        'study': 'estudiaré',
        'watch': 'veré',
        'visit': 'visitaré'
      },
      'You': {
        'cook': 'cocinarás',
        'play': 'jugarás',
        'clean': 'limpiarás',
        'study': 'estudiarás',
        'watch': 'verás',
        'visit': 'visitarás'
      },
      'He': {
        'cook': 'cocinará',
        'play': 'jugará',
        'clean': 'limpiará',
        'study': 'estudiará',
        'watch': 'verá',
        'visit': 'visitará'
      },
      'She': {
        'cook': 'cocinará',
        'play': 'jugará',
        'clean': 'limpiará',
        'study': 'estudiará',
        'watch': 'verá',
        'visit': 'visitará'
      },
      'We': {
        'cook': 'cocinaremos',
        'play': 'jugaremos',
        'clean': 'limpiaremos',
        'study': 'estudiaremos',
        'watch': 'veremos',
        'visit': 'visitaremos'
      },
      'They': {
        'cook': 'cocinarán',
        'play': 'jugarán',
        'clean': 'limpiarán',
        'study': 'estudiarán',
        'watch': 'verán',
        'visit': 'visitarán'
      }
    };

    // Use the specific conjugation if available, otherwise selectedVerbEs (which is a placeholder)
    const verbTranslation = translations[selectedSubject]?.[selectedVerb] || selectedVerbEs;
    return `${selectedSubjectEs} ${verbTranslation} ${selectedTimeEs}`;
  };

  const handleNextLevel = () => {
    trackLevelCompletion(4);
    router.push('/level5');
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
          <h1 className="text-xl font-bold text-gray-900">Level 4: Future Simple</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Demo Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">
            Nivel 4: Future Simple
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
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)', // Shades of green
              borderColor: 'rgba(16, 185, 129, 0.2)', // Emerald border
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
            }}>
              <div className="p-8">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                    background: 'linear-gradient(145deg, #10b981, #059669)', // Emerald green
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                  }}>
                    <span className="text-3xl">🔮</span> {/* Future icon */}
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
                    border: '2px solid rgba(16, 185, 129, 0.3)', // Emerald border for example
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)'
                  }}>
                    {/* "Example" badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{
                        background: 'linear-gradient(145deg, #3b82f6, #2563eb)' // Blue badge, consistent with prompt
                      }}>
                        EJEMPLO
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        ✨ I will cook dinner tomorrow
                      </p>
                      <p className="text-lg text-gray-600 italic">
                        (Yo cocinaré la cena mañana)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation with icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #10b981, #059669)' // Emerald
                    }}>
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Future Simple</h4>
                      <p className="text-gray-600 text-sm">
                        Lo usamos para hablar de planes, predicciones y promesas en el futuro.
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
                        Combina palabras de las tres columnas para crear oraciones.
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
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-gray-700">&quot;She will study tonight&quot;</span>
                      <span className="text-gray-500">→ (Ella estudiará esta noche)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-gray-700">&quot;They will visit next week&quot;</span>
                      <span className="text-gray-500">→ (Ellos visitarán la próxima semana)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Patrón: Future Simple
              </div>
              <div className="text-gray-500 text-lg font-medium">
                [Sujeto] + [will] + [verbo base] + [expresión de tiempo]
              </div>
            </div>

            {/* LEGO Blocks - Sentence Builder */}
            <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
              {/* Subject Block */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}}
                className={`
                  text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30
                  ${selectedSubject 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedSubject 
                    ? 'linear-gradient(145deg, #3b82f6, #2563eb)' // Blue for subject
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedSubject 
                    ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)'
                    : 'none',
                  borderRadius: selectedSubject ? '0px' : '12px 0 0 12px',
                  boxShadow: selectedSubject 
                    ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {selectedSubject || 'Sujeto'}
              </motion.div>

              {/* Will Block (Auxiliary) */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}} // Hover active when subject is selected
                className={`
                  text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20
                  ${selectedSubject // "will" block is active if subject is selected
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedSubject 
                    ? 'linear-gradient(145deg, #10b981, #059669)' // Emerald green for "will"
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedSubject 
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  marginLeft: '-12px',
                  marginRight: '-12px',
                  borderRadius: selectedSubject ? '0px' : '0px',
                  boxShadow: selectedSubject 
                    ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                will
              </motion.div>

              {/* Verb Block */}
              <motion.div
                whileHover={selectedVerb ? { y: -2 } : {}}
                className={`
                  text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 
                  ${selectedVerb 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedVerb 
                    ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' // Purple for verb
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedVerb 
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  marginLeft: '-12px', // Overlap with "will" block
                  marginRight: '-12px', // Overlap with time block
                  borderRadius: selectedVerb ? '0px' : '0px',
                  boxShadow: selectedVerb 
                    ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {selectedVerb || 'verbo base'}
              </motion.div>

              {/* Time Block */}
              <motion.div
                whileHover={selectedTime ? { y: -2 } : {}}
                className={`
                  text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10
                  ${selectedTime 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedTime 
                    ? 'linear-gradient(145deg, #06b6d4, #0891b2)' // Cyan/Teal for time
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedTime 
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  borderRadius: selectedTime ? '0px' : '0 12px 12px 0',
                  boxShadow: selectedTime 
                    ? '0 8px 25px rgba(6, 182, 212, 0.25), 0 3px 0 rgba(8, 145, 178, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {selectedTime || 'tiempo'}
              </motion.div>
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
              animate={selectedSubject && selectedVerb && selectedTime ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              {selectedSubject && selectedVerb && selectedTime ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    {getSmartTranslation()}
                  </div>
                  <div className="text-lg text-gray-500 font-medium italic">
                    ({selectedSubject} will {selectedVerb} {selectedTime})
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-lg font-medium">
                  Selecciona un sujeto, un verbo y un tiempo para crear una oración
                </div>
              )}
            </motion.div>

            {/* Word Columns */}
            <div className="flex justify-around gap-4 flex-wrap">
              {/* Subjects Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
              }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">
                  Sujetos
                </div>
                <div className="space-y-2">
                  {[
                    { en: 'I', es: 'Yo' },
                    { en: 'You', es: 'Tú' },
                    { en: 'He', es: 'Él' },
                    { en: 'She', es: 'Ella' },
                    { en: 'We', es: 'Nosotros' },
                    { en: 'They', es: 'Ellos' }
                  ].map((subject) => (
                    <motion.button
                      key={subject.en}
                      onClick={() => handleSubjectSelect(subject)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                        ${selectedSubject === subject.en
                          ? 'text-white transform scale-95'
                          : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                        }
                      `}
                      style={{
                        background: selectedSubject === subject.en
                          ? 'linear-gradient(145deg, #3b82f6, #2563eb)' // Blue selected button
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedSubject === subject.en ? '#2563eb' : 'rgba(0, 0, 0, 0.06)',
                        boxShadow: selectedSubject === subject.en
                          ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                          : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                      }}
                    >
                      {subject.en}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Verbs Column (Base Verbs) */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
              }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">
                  Verbos Base
                </div>
                <div className="space-y-2">
                  {[
                    { base: 'cook', es: 'cocinaré/cocinarás...' },
                    { base: 'play', es: 'jugaré/jugarás...' },
                    { base: 'clean', es: 'limpiaré/limpiarás...' },
                    { base: 'study', es: 'estudiaré/estudiarás...' },
                    { base: 'watch', es: 'veré/verás...' },
                    { base: 'visit', es: 'visitaré/visitarás...' }
                  ].map((verb) => (
                    <motion.button
                      key={verb.base}
                      onClick={() => handleVerbSelect(verb)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                        ${selectedVerb === verb.base
                          ? 'text-white transform scale-95'
                          : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                        }
                      `}
                      style={{
                        background: selectedVerb === verb.base
                          ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' // Purple selected button
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedVerb === verb.base ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)',
                        boxShadow: selectedVerb === verb.base
                          ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                          : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                      }}
                    >
                      {verb.base}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Expressions Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
              }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">
                  Expresiones Futuras
                </div>
                <div className="space-y-2">
                  {[
                    { en: 'tomorrow', es: 'mañana' },
                    { en: 'tonight', es: 'esta noche' },
                    { en: 'next week', es: 'la próxima semana' },
                    { en: 'next year', es: 'el próximo año' },
                    { en: 'soon', es: 'pronto' },
                    { en: 'later', es: 'más tarde' }
                  ].map((time) => (
                    <motion.button
                      key={time.en}
                      onClick={() => handleTimeSelect(time)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                        ${selectedTime === time.en
                          ? 'text-white transform scale-95'
                          : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                        }
                      `}
                      style={{
                        background: selectedTime === time.en
                          ? 'linear-gradient(145deg, #06b6d4, #0891b2)' // Cyan/Teal selected button
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedTime === time.en ? '#0891b2' : 'rgba(0, 0, 0, 0.06)',
                        boxShadow: selectedTime === time.en
                          ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                          : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                      }}
                    >
                      {time.en}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Final encouragement message */}
            <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-emerald-800 mb-2">
                  🎯 ¡Fantástico!
                </h3>
                <p className="text-emerald-700">
                  Ahora ya sabes cómo usar Future Simple. Puedes hacer muchas combinaciones diferentes seleccionando de las tres columnas.
                </p>
                <p className="text-emerald-600 text-sm mt-2">
                  Practica cambiando entre diferentes sujetos, verbos y tiempos para crear nuevas oraciones sobre el futuro.
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

export default Level4Page;