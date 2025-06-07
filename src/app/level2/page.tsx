'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Level2Page = () => {
  const router = useRouter();

  // State management
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedAuxiliary, setSelectedAuxiliary] = useState<string | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [selectedSubjectEs, setSelectedSubjectEs] = useState<string | null>(null);
  const [selectedVerbEs, setSelectedVerbEs] = useState<string | null>(null);
  const [selectedObjectEs, setSelectedObjectEs] = useState<string | null>(null);
  const [availableObjects, setAvailableObjects] = useState<{en: string, es: string}[]>([]);

  // Handle word selection
  const handleSubjectSelect = (subject: { en: string; es: string; aux: string }) => {
    setSelectedSubject(subject.en);
    setSelectedAuxiliary(subject.aux);
    setSelectedSubjectEs(subject.es);
  };

  const handleVerbSelect = (verb: { pastParticiple: string; es: string; objects: {en: string, es: string}[] }) => {
    setSelectedVerb(verb.pastParticiple);
    setSelectedVerbEs(verb.es);
    setAvailableObjects(verb.objects);
    setSelectedObject(null); // Reset object when verb changes
    setSelectedObjectEs(null);
  };

  const handleObjectSelect = (object: { en: string; es: string }) => {
    setSelectedObject(object.en);
    setSelectedObjectEs(object.es);
  };

  const getSpanishAuxiliary = () => {
    if (selectedSubject === 'I') return 'he';
    if (selectedSubject === 'You') return 'has';
    if (selectedSubject === 'He') return 'ha';
    if (selectedSubject === 'She') return 'ha';
    if (selectedSubject === 'We') return 'hemos';
    if (selectedSubject === 'They') return 'han';
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
          <h1 className="text-xl font-bold text-gray-900">Level 2: Present Perfect</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Demo Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">
            Nivel 2: Present Perfect
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
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)',
              borderColor: 'rgba(59, 130, 246, 0.2)',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
            }}>
              <div className="p-8">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                    background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                  }}>
                    <span className="text-3xl">🎯</span>
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
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                  }}>
                    {/* "Example" badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{
                        background: 'linear-gradient(145deg, #10b981, #059669)'
                      }}>
                        EJEMPLO
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        ✨ I have watched a movie
                      </p>
                      <p className="text-lg text-gray-600 italic">
                        (He visto una película)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation with icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
                    }}>
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Present Perfect</h4>
                      <p className="text-gray-600 text-sm">
                        Lo usamos para decir que ya hicimos algo en algún momento de la vida.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #f59e0b, #d97706)'
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
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-gray-700">&quot;She has visited Paris&quot;</span>
                      <span className="text-gray-500">→ (Ella ha visitado París)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="text-gray-700">&quot;They have finished homework&quot;</span>
                      <span className="text-gray-500">→ (Ellos han terminado la tarea)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Patrón: Present Perfect
              </div>
              <div className="text-gray-500 text-lg font-medium">
                [Sujeto] + [have/has] + [participio pasado] + [objeto]
              </div>
            </div>

            {/* LEGO Blocks - Sentence Builder */}
            <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
              {/* Subject Block */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}}
                className={`
                  text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40
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
                  text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30
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
                {selectedAuxiliary || 'have/has'}
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
                {selectedVerb || 'participio'}
              </motion.div>

              {/* Object Block */}
              <motion.div
                whileHover={selectedObject ? { y: -2 } : {}}
                className={`
                  text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10
                  ${selectedObject 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'
                  }
                `}
                style={{
                  background: selectedObject 
                    ? 'linear-gradient(145deg, #f59e0b, #d97706)'
                    : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                  clipPath: selectedObject 
                    ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)'
                    : 'none',
                  borderRadius: selectedObject ? '0px' : '0 12px 12px 0',
                  boxShadow: selectedObject 
                    ? '0 8px 25px rgba(245, 158, 11, 0.25), 0 3px 0 rgba(217, 119, 6, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {selectedObject || 'objeto'}
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
              animate={selectedSubject && selectedVerb && selectedObject ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              {selectedSubject && selectedVerb && selectedObject ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    {selectedSubjectEs} {getSpanishAuxiliary()} {selectedVerbEs} {selectedObjectEs}
                  </div>
                  <div className="text-lg text-gray-500 font-medium italic">
                    ({selectedSubject} {selectedAuxiliary} {selectedVerb} {selectedObject})
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-lg font-medium">
                  Selecciona un sujeto, un verbo y un objeto para crear una oración
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
                    { en: 'I', es: 'Yo', aux: 'have' },
                    { en: 'You', es: 'Tú', aux: 'have' },
                    { en: 'He', es: 'Él', aux: 'has' },
                    { en: 'She', es: 'Ella', aux: 'has' },
                    { en: 'We', es: 'Nosotros', aux: 'have' },
                    { en: 'They', es: 'Ellos', aux: 'have' }
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
                  Participios Pasados
                </div>
                <div className="space-y-2">
                  {[
                    { 
                      pastParticiple: 'watched', 
                      es: 'visto', 
                      objects: [
                        { en: 'a movie', es: 'una película' },
                        { en: 'the news', es: 'las noticias' },
                        { en: 'a tutorial', es: 'un tutorial' }
                      ]
                    },
                    { 
                      pastParticiple: 'cleaned', 
                      es: 'limpiado', 
                      objects: [
                        { en: 'my room', es: 'mi cuarto' },
                        { en: 'the dishes', es: 'los platos' }
                      ]
                    },
                    { 
                      pastParticiple: 'studied', 
                      es: 'estudiado', 
                      objects: [
                        { en: 'English', es: 'inglés' },
                        { en: 'math', es: 'matemáticas' },
                        { en: 'a book', es: 'un libro' }
                      ]
                    },
                    { 
                      pastParticiple: 'visited', 
                      es: 'visitado', 
                      objects: [
                        { en: 'my grandma', es: 'a mi abuela' },
                        { en: 'a museum', es: 'un museo' },
                        { en: 'Paris', es: 'París' }
                      ]
                    },
                    { 
                      pastParticiple: 'played', 
                      es: 'jugado', 
                      objects: [
                        { en: 'soccer', es: 'fútbol' },
                        { en: 'video games', es: 'videojuegos' },
                        { en: 'the piano', es: 'el piano' }
                      ]
                    },
                    { 
                      pastParticiple: 'finished', 
                      es: 'terminado', 
                      objects: [
                        { en: 'homework', es: 'la tarea' },
                        { en: 'a project', es: 'un proyecto' },
                        { en: 'the book', es: 'el libro' }
                      ]
                    }
                  ].map((verb) => (
                    <motion.button
                      key={verb.pastParticiple}
                      onClick={() => handleVerbSelect(verb)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                        ${selectedVerb === verb.pastParticiple
                          ? 'text-white transform scale-95'
                          : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                        }
                      `}
                      style={{
                        background: selectedVerb === verb.pastParticiple
                          ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
                          : 'rgba(255, 255, 255, 0.9)',
                        borderColor: selectedVerb === verb.pastParticiple ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)',
                        boxShadow: selectedVerb === verb.pastParticiple
                          ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                          : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                      }}
                    >
                      {verb.pastParticiple}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Objects Column - Only show when verb is selected */}
              {selectedVerb && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                  }}
                >
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">
                    Objeto Directo
                  </div>
                  <div className="space-y-2">
                    {availableObjects.map((object) => (
                      <motion.button
                        key={object.en}
                        onClick={() => handleObjectSelect(object)}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        className={`
                          w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border
                          ${selectedObject === object.en
                            ? 'text-white transform scale-95'
                            : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'
                          }
                        `}
                        style={{
                          background: selectedObject === object.en
                            ? 'linear-gradient(145deg, #f59e0b, #d97706)'
                            : 'rgba(255, 255, 255, 0.9)',
                          borderColor: selectedObject === object.en ? '#d97706' : 'rgba(0, 0, 0, 0.06)',
                          boxShadow: selectedObject === object.en
                            ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset'
                            : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
                        }}
                      >
                        {object.en}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Final encouragement message */}
            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  🎯 ¡Muy bien!
                </h3>
                <p className="text-green-700">
                  Ahora ya sabes cómo usar Present Perfect. Puedes hacer muchas combinaciones diferentes seleccionando de las tres columnas.
                </p>
                <p className="text-green-600 text-sm mt-2">
                  Practica cambiando entre diferentes sujetos, verbos y objetos para crear nuevas oraciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level2Page;