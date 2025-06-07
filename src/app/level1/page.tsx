'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Level1Page = () => {
  const router = useRouter();

  // State management
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedAuxiliary, setSelectedAuxiliary] = useState<string | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
  const [selectedSubjectEs, setSelectedSubjectEs] = useState<string | null>(null);
  const [selectedVerbEs, setSelectedVerbEs] = useState<string | null>(null);

  // Handle word selection
  const handleSubjectSelect = (subject: string) => {
    const auxiliary = subject === 'I' ? 'am' : 
                     ['He', 'She', 'It'].includes(subject) ? 'is' : 'are';
    const subjectEs = subject === 'I' ? 'Yo' :
                     subject === 'You' ? 'Tú' :
                     subject === 'He' ? 'Él' :
                     subject === 'She' ? 'Ella' :
                     subject === 'We' ? 'Nosotros' :
                     subject === 'They' ? 'Ellos' : '';

    setSelectedSubject(subject);
    setSelectedAuxiliary(auxiliary);
    setSelectedSubjectEs(subjectEs);
  };

  const handleVerbSelect = (verb: string) => {
    const verbEs = verb === 'eating' ? 'comiendo' :
                  verb === 'sleeping' ? 'durmiendo' :
                  verb === 'studying' ? 'estudiando' :
                  verb === 'working' ? 'trabajando' :
                  verb === 'playing' ? 'jugando' :
                  verb === 'reading' ? 'leyendo' : '';

    setSelectedVerb(verb);
    setSelectedVerbEs(verbEs);
  };

  const getSpanishAuxiliary = () => {
    if (selectedSubject === 'I') return 'estoy';
    if (selectedSubject === 'You') return 'estás';
    if (selectedSubject === 'He') return 'está';
    if (selectedSubject === 'She') return 'está';
    if (selectedSubject === 'We') return 'estamos';
    if (selectedSubject === 'They') return 'están';
    return '';
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
          <h1 className="text-xl font-bold text-gray-900">Level 1: Present Continuous</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Demo Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">
            Nivel 1: Present Continuous
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
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #d1fae5 100%)',
              borderColor: 'rgba(34, 197, 94, 0.2)',
              boxShadow: '0 10px 25px rgba(34, 197, 94, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
            }}>
              <div className="p-8">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                    background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)'
                  }}>
                    <span className="text-3xl">🚀</span>
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
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)'
                  }}>
                    {/* "Example" badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{
                        background: 'linear-gradient(145deg, #f59e0b, #d97706)'
                      }}>
                        EJEMPLO
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        ✨ I am eating pizza
                      </p>
                      <p className="text-lg text-gray-600 italic">
                        (Yo estoy comiendo pizza)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation with icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #22c55e, #16a34a)'
                    }}>
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Present Continuous</h4>
                      <p className="text-gray-600 text-sm">
                        Lo usamos para decir que estamos haciendo algo ahora mismo.
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
                        Combina palabras de las dos columnas para crear oraciones.
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
                      <span className="text-gray-700">&quot;She is studying English&quot;</span>
                      <span className="text-gray-500">→ (Ella está estudiando inglés)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="text-gray-700">&quot;They are playing soccer&quot;</span>
                      <span className="text-gray-500">→ (Ellos están jugando fútbol)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Patrón: Present Continuous
              </div>
              <div className="text-gray-500 text-lg font-medium">
                [Sujeto] + [am/is/are] + [verbo+ing]
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

              {/* Auxiliary Block */}
              <motion.div
                whileHover={selectedAuxiliary ? { y: -2 } : {}}
                className={`
                  text-white px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20
                  ${selectedAuxiliary 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedAuxiliary 
                    ? 'linear-gradient(145deg, #10b981, #059669)'
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedAuxiliary 
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  marginLeft: '-12px',
                  marginRight: '-12px',
                  borderRadius: selectedAuxiliary ? '0px' : '0px',
                  boxShadow: selectedAuxiliary 
                    ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {selectedAuxiliary || 'am/is/are'}
              </motion.div>

              {/* Verb Block */}
              <motion.div
                whileHover={selectedVerb ? { y: -2 } : {}}
                className={`
                  text-white px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10
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
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  borderRadius: selectedVerb ? '0px' : '0 12px 12px 0',
                  boxShadow: selectedVerb 
                    ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {selectedVerb || 'verbo+ing'}
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
              animate={selectedSubject && selectedVerb ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              {selectedSubject && selectedVerb ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    {selectedSubjectEs} {getSpanishAuxiliary()} {selectedVerbEs}
                  </div>
                  <div className="text-lg text-gray-500 font-medium italic">
                    ({selectedSubject} {selectedAuxiliary} {selectedVerb})
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-lg font-medium">
                  Selecciona un sujeto y un verbo para crear una oración
                </div>
              )}
            </motion.div>

            {/* Word Columns */}
            <div className="flex justify-around gap-6 flex-wrap">
              {/* Subjects Column */}
              <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{
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
                    { subject: 'I', aux: 'am', es: 'Yo' },
                    { subject: 'You', aux: 'are', es: 'Tú' },
                    { subject: 'He', aux: 'is', es: 'Él' },
                    { subject: 'She', aux: 'is', es: 'Ella' },
                    { subject: 'We', aux: 'are', es: 'Nosotros' },
                    { subject: 'They', aux: 'are', es: 'Ellos' }
                  ].map(({ subject }) => (
                    <motion.button
                      key={subject}
                      onClick={() => handleSubjectSelect(subject)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                        ${selectedSubject === subject
                          ? 'text-white transform scale-95'
                          : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                        }
                      `}
                      style={{
                        background: selectedSubject === subject
                          ? 'linear-gradient(145deg, #3b82f6, #2563eb)'
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedSubject === subject ? '#2563eb' : 'rgba(0, 0, 0, 0.06)',
                        boxShadow: selectedSubject === subject
                          ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                          : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                      }}
                    >
                      {subject}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Verbs Column */}
              <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
              }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">
                  Verbos
                </div>
                <div className="space-y-2">
                  {[
                    { verb: 'eating', es: 'comiendo' },
                    { verb: 'sleeping', es: 'durmiendo' },
                    { verb: 'studying', es: 'estudiando' },
                    { verb: 'working', es: 'trabajando' },
                    { verb: 'playing', es: 'jugando' },
                    { verb: 'reading', es: 'leyendo' }
                  ].map(({ verb}) => (
                    <motion.button
                      key={verb}
                      onClick={() => handleVerbSelect(verb)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                        ${selectedVerb === verb
                          ? 'text-white transform scale-95'
                          : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                        }
                      `}
                      style={{
                        background: selectedVerb === verb
                          ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedVerb === verb ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)',
                        boxShadow: selectedVerb === verb
                          ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                          : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                      }}
                    >
                      {verb}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Final encouragement message */}
            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  🎯 ¡Muy bien!
                </h3>
                <p className="text-green-700">
                  Ahora ya sabes cómo usar Present Continuous. Puedes hacer muchas combinaciones diferentes seleccionando de las dos columnas.
                </p>
                <p className="text-green-600 text-sm mt-2">
                  Practica cambiando entre diferentes sujetos y verbos para crear nuevas oraciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level1Page;