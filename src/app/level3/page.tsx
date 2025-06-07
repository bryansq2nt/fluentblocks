'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Level3Page = () => {
  const router = useRouter();

  // State management
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSubjectEs, setSelectedSubjectEs] = useState<string | null>(null);
  const [selectedVerbEs, setSelectedVerbEs] = useState<string | null>(null);
  const [selectedTimeEs, setSelectedTimeEs] = useState<string | null>(null);

  // Handle word selection with smarter translation logic
  const handleSubjectSelect = (subject: { en: string; es: string }) => {
    setSelectedSubject(subject.en);
    setSelectedSubjectEs(subject.es);
  };

  const handleVerbSelect = (verb: { past: string; es: string }) => {
    setSelectedVerb(verb.past);
    setSelectedVerbEs(verb.es);
  };

  const handleTimeSelect = (time: { en: string; es: string }) => {
    setSelectedTime(time.en);
    setSelectedTimeEs(time.es);
  };

  // Smart translation based on subject and verb combination
  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedTime) return null;

    // Create specific translations based on subject + verb combinations
    const translations: { [key: string]: { [key: string]: string } } = {
      'I': {
        'cooked': 'cociné',
        'played': 'jugué',
        'cleaned': 'limpié',
        'studied': 'estudié',
        'watched': 'vi',
        'walked': 'caminé'
      },
      'You': {
        'cooked': 'cocinaste',
        'played': 'jugaste',
        'cleaned': 'limpiaste',
        'studied': 'estudiaste',
        'watched': 'viste',
        'walked': 'caminaste'
      },
      'He': {
        'cooked': 'cocinó',
        'played': 'jugó',
        'cleaned': 'limpió',
        'studied': 'estudió',
        'watched': 'vio',
        'walked': 'caminó'
      },
      'She': {
        'cooked': 'cocinó',
        'played': 'jugó',
        'cleaned': 'limpió',
        'studied': 'estudió',
        'watched': 'vio',
        'walked': 'caminó'
      },
      'We': {
        'cooked': 'cocinamos',
        'played': 'jugamos',
        'cleaned': 'limpiamos',
        'studied': 'estudiamos',
        'watched': 'vimos',
        'walked': 'caminamos'
      },
      'They': {
        'cooked': 'cocinaron',
        'played': 'jugaron',
        'cleaned': 'limpiaron',
        'studied': 'estudiaron',
        'watched': 'vieron',
        'walked': 'caminaron'
      }
    };

    const verbTranslation = translations[selectedSubject]?.[selectedVerb] || selectedVerbEs;
    return `${selectedSubjectEs} ${verbTranslation} ${selectedTimeEs}`;
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'
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
          <h1 className="text-xl font-bold text-gray-900">Level 3: Simple Past</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Demo Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">
            Nivel 3: Simple Past
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
              background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)',
              borderColor: 'rgba(251, 146, 60, 0.2)',
              boxShadow: '0 10px 25px rgba(251, 146, 60, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
            }}>
              <div className="p-8">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                    background: 'linear-gradient(145deg, #f97316, #ea580c)',
                    boxShadow: '0 8px 20px rgba(249, 115, 22, 0.3)'
                  }}>
                    <span className="text-3xl">⏰</span>
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
                    border: '2px solid rgba(249, 115, 22, 0.3)',
                    boxShadow: '0 8px 25px rgba(249, 115, 22, 0.15)'
                  }}>
                    {/* "Example" badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{
                        background: 'linear-gradient(145deg, #dc2626, #b91c1c)'
                      }}>
                        EJEMPLO
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        ✨ I cooked dinner yesterday
                      </p>
                      <p className="text-lg text-gray-600 italic">
                        (Yo cociné la cena ayer)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation with icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #f97316, #ea580c)'
                    }}>
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Simple Past</h4>
                      <p className="text-gray-600 text-sm">
                        Lo usamos para hablar de acciones que ya terminaron en el pasado.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
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
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span className="text-gray-700">&quot;She studied last night&quot;</span>
                      <span className="text-gray-500">→ (Ella estudió anoche)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-gray-700">&quot;They played on Saturday&quot;</span>
                      <span className="text-gray-500">→ (Ellos jugaron el sábado)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Patrón: Simple Past
              </div>
              <div className="text-gray-500 text-lg font-medium">
                [Sujeto] + [verbo en pasado] + [expresión de tiempo]
              </div>
            </div>

            {/* LEGO Blocks - Sentence Builder */}
            <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
              {/* Subject Block */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}}
                className={`
                  text-white px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30
                  ${selectedSubject 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedSubject 
                    ? 'linear-gradient(145deg, #3b82f6, #2563eb)'
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

              {/* Verb Block */}
              <motion.div
                whileHover={selectedVerb ? { y: -2 } : {}}
                className={`
                  text-white px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20
                  ${selectedVerb 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedVerb 
                    ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedVerb 
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  marginLeft: '-12px',
                  marginRight: '-12px',
                  borderRadius: selectedVerb ? '0px' : '0px',
                  boxShadow: selectedVerb 
                    ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {selectedVerb || 'verbo pasado'}
              </motion.div>

              {/* Time Block */}
              <motion.div
                whileHover={selectedTime ? { y: -2 } : {}}
                className={`
                  text-white px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10
                  ${selectedTime 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedTime 
                    ? 'linear-gradient(145deg, #f97316, #ea580c)'
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedTime 
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  borderRadius: selectedTime ? '0px' : '0 12px 12px 0',
                  boxShadow: selectedTime 
                    ? '0 8px 25px rgba(249, 115, 22, 0.25), 0 3px 0 rgba(234, 88, 12, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
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
                    ({selectedSubject} {selectedVerb} {selectedTime})
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
                          ? 'linear-gradient(145deg, #3b82f6, #2563eb)'
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

              {/* Verbs Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
              }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">
                  Verbos en Pasado
                </div>
                <div className="space-y-2">
                  {[
                    { past: 'cooked', es: 'cociné/cocinaste/cocinó...' },
                    { past: 'played', es: 'jugué/jugaste/jugó...' },
                    { past: 'cleaned', es: 'limpié/limpiaste/limpió...' },
                    { past: 'studied', es: 'estudié/estudiaste/estudió...' },
                    { past: 'watched', es: 'vi/viste/vio...' },
                    { past: 'walked', es: 'caminé/caminaste/caminó...' }
                  ].map((verb) => (
                    <motion.button
                      key={verb.past}
                      onClick={() => handleVerbSelect(verb)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                        ${selectedVerb === verb.past
                          ? 'text-white transform scale-95'
                          : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                        }
                      `}
                      style={{
                        background: selectedVerb === verb.past
                          ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedVerb === verb.past ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)',
                        boxShadow: selectedVerb === verb.past
                          ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                          : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                      }}
                    >
                      {verb.past}
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
                  Expresiones de Tiempo
                </div>
                <div className="space-y-2">
                  {[
                    { en: 'yesterday', es: 'ayer' },
                    { en: 'last night', es: 'anoche' },
                    { en: 'this morning', es: 'esta mañana' },
                    { en: 'on Saturday', es: 'el sábado' },
                    { en: 'an hour ago', es: 'hace una hora' },
                    { en: 'two days ago', es: 'hace dos días' }
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
                          ? 'linear-gradient(145deg, #f97316, #ea580c)'
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedTime === time.en ? '#ea580c' : 'rgba(0, 0, 0, 0.06)',
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
            <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-orange-800 mb-2">
                  🎯 ¡Excelente!
                </h3>
                <p className="text-orange-700">
                  Ahora ya sabes cómo usar Simple Past. Puedes hacer muchas combinaciones diferentes seleccionando de las tres columnas.
                </p>
                <p className="text-orange-600 text-sm mt-2">
                  Practica cambiando entre diferentes sujetos, verbos y tiempos para crear nuevas oraciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level3Page;