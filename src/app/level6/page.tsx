'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface SubjectOption {
  en: string;
  es: string;
  toBe: string; // "am", "is", "are"
  vaIrA: string; // "voy a", "vas a", "va a"
}

interface VerbOption {
  base: string;
  es: string; // Spanish infinitive
  complements: { en: string; es: string }[];
}

const Level6Page = () => {
  const router = useRouter();

  // State management
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<VerbOption | null>(null);
  const [selectedComplement, setSelectedComplement] = useState<string | null>(null);
  const [selectedComplementEs, setSelectedComplementEs] = useState<string | null>(null);

  const [availableComplements, setAvailableComplements] = useState<{ en: string; es: string }[]>([]);

  // Handle word selection
  const handleSubjectSelect = (subject: SubjectOption) => {
    setSelectedSubject(subject);
    // Reset verb and complement when subject changes, as "to be" form might change
    setSelectedVerb(null);
    setAvailableComplements([]);
    setSelectedComplement(null);
    setSelectedComplementEs(null);
  };

  const handleVerbSelect = (verb: VerbOption) => {
    setSelectedVerb(verb);
    setAvailableComplements(verb.complements);
    setSelectedComplement(null); // Reset complement when verb changes
    setSelectedComplementEs(null);
  };

  const handleComplementSelect = (complement: { en: string; es: string }) => {
    setSelectedComplement(complement.en);
    setSelectedComplementEs(complement.es);
  };

  // Smart translation for "going to"
  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedComplement) return null;
    return `${selectedSubject.es} ${selectedSubject.vaIrA} ${selectedVerb.es} ${selectedComplementEs}`;
  };

  const subjectsData: SubjectOption[] = [
    { en: 'I', es: 'Yo', toBe: 'am', vaIrA: 'voy a' },
    { en: 'You', es: 'Tú', toBe: 'are', vaIrA: 'vas a' },
    { en: 'He', es: 'Él', toBe: 'is', vaIrA: 'va a' },
    { en: 'She', es: 'Ella', toBe: 'is', vaIrA: 'va a' },
    { en: 'We', es: 'Nosotros', toBe: 'are', vaIrA: 'vamos a' },
    { en: 'They', es: 'Ellos/Ellas', toBe: 'are', vaIrA: 'van a' }
  ];

  const verbsData: VerbOption[] = [
    { base: 'watch', es: 'ver', complements: [{ en: 'a movie', es: 'una película' }, { en: 'TV tonight', es: 'TV esta noche' }, { en: 'the game', es: 'el partido' }] },
    { base: 'visit', es: 'visitar', complements: [{ en: 'my family', es: 'a mi familia' }, { en: 'a museum', es: 'un museo' }, { en: 'Paris next year', es: 'París el próximo año' }] },
    { base: 'study', es: 'estudiar', complements: [{ en: 'English', es: 'Inglés' }, { en: 'for the exam', es: 'para el examen' }, { en: 'later', es: 'más tarde' }] },
    { base: 'eat', es: 'comer', complements: [{ en: 'pizza', es: 'pizza' }, { en: 'at a restaurant', es: 'en un restaurante' }, { en: 'healthy food', es: 'comida saludable' }] },
    { base: 'travel', es: 'viajar', complements: [{ en: 'to Spain', es: 'a España' }, { en: 'next summer', es: 'el próximo verano' }, { en: 'by train', es: 'en tren' }] },
    { base: 'buy', es: 'comprar', complements: [{ en: 'a new phone', es: 'un teléfono nuevo' }, { en: 'some groceries', es: 'algunas compras' }, { en: 'a gift', es: 'un regalo' }] }
  ];


  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)' // Light Cyan gradient
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
          <h1 className="text-xl font-bold text-gray-900">Level 6: &apos;Going to&apos; Future</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Demo Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-tight">
            Nivel 6: Futuro con &quot;Going to&quot;
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
              background: 'linear-gradient(135deg, #a5f3fc 0%, #67e8f9 50%, #22d3ee 100%)', // Shades of Cyan
              borderColor: 'rgba(14, 165, 233, 0.2)', // Cyan border
              boxShadow: '0 10px 25px rgba(14, 165, 233, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
            }}>
              <div className="p-8">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                    background: 'linear-gradient(145deg, #0ea5e9, #0284c7)', // Sky blue / Cyan
                    boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'
                  }}>
                    <span className="text-3xl">📅</span> {/* Calendar icon for plans */}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    ¿Qué vas a aprender?
                  </h3>
                  <p className="text-gray-600 text-lg">
                    En este ejercicio construirás frases sobre planes e intenciones futuras:
                  </p>
                </div>

                {/* Main highlighted example */}
                <div className="relative mb-6">
                  <div className="rounded-2xl p-6 text-center" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(14, 165, 233, 0.3)', 
                    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.15)'
                  }}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-bold text-white rounded-full" style={{
                        background: 'linear-gradient(145deg, #ef4444, #dc2626)' // Contrasting red badge
                      }}>
                        EJEMPLO
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        ✨ I am going to watch a movie
                      </p>
                      <p className="text-lg text-gray-600 italic">
                        (Voy a ver una película)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation with icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(145deg, #0ea5e9, #0284c7)' 
                    }}>
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Futuro con &quot;Going to&quot;</h4>
                      <p className="text-gray-600 text-sm">
                        Usamos &quot;am/is/are going to&quot; para hablar de planes e intenciones que ya hemos decidido.
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
                        Combina sujeto, la forma correcta de &quot;(be) going to&quot;, verbo base y un complemento.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  <h4 className="text-center font-bold text-gray-700 mb-3">Más ejemplos:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-500"></span><span className="text-gray-700">&quot;She is going to visit her family&quot;</span><span className="text-gray-500">→ (Ella va a visitar a su familia)</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500"></span><span className="text-gray-700">&quot;They are going to study English&quot;</span><span className="text-gray-500">→ (Ellos van a estudiar Inglés)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Futuro con &quot;Going to&quot;</div>
              <div className="text-gray-500 text-lg font-medium">[Sujeto] + [am/is/are + going to] + [verbo base] + [complemento]</div>
            </div>

            {/* LEGO Blocks - Sentence Builder */}
            <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
              {/* Subject Block */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}}
                className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedSubject ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{
                  background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', // Blue
                  clipPath: selectedSubject ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none',
                  borderRadius: selectedSubject ? '0px' : '12px 0 0 12px',
                  boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >{selectedSubject?.en || 'Sujeto'}</motion.div>

              {/* "am/is/are going to" Block */}
              <motion.div
                whileHover={selectedSubject ? { y: -2 } : {}}
                className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[180px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{
                  background: selectedSubject ? 'linear-gradient(145deg, #0ea5e9, #0284c7)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', // Cyan/Sky Blue
                  clipPath: selectedSubject ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none',
                  marginLeft: '-12px', marginRight: '-12px', borderRadius: selectedSubject ? '0px' : '0px',
                  boxShadow: selectedSubject ? '0 8px 25px rgba(14, 165, 233, 0.25), 0 3px 0 rgba(2, 132, 199, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >{selectedSubject ? `${selectedSubject.toBe} going to` : '(be) going to'}</motion.div>

              {/* Verb Block */}
              <motion.div
                whileHover={selectedVerb ? { y: -2 } : {}}
                className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedVerb ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
                style={{
                  background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', // Purple
                  clipPath: selectedVerb ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none',
                  marginLeft: '-12px', marginRight: '-12px', borderRadius: selectedVerb ? '0px' : '0px',
                  boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >{selectedVerb?.base || 'verbo base'}</motion.div>
              
              {/* Complement/Time Block */}
              <motion.div
                whileHover={selectedComplement ? { y: -2 } : {}}
                className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedComplement ? 'shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`}
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
              style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}
              animate={selectedSubject && selectedVerb && selectedComplement ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              {selectedSubject && selectedVerb && selectedComplement ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{getSmartTranslation()}</div>
                  <div className="text-lg text-gray-500 font-medium italic">({selectedSubject.en} {selectedSubject.toBe} going to {selectedVerb.base} {selectedComplement})</div>
                </div>
              ) : (
                <div className="text-gray-400 text-lg font-medium">Selecciona sujeto, verbo y complemento para tus planes</div>
              )}
            </motion.div>

            {/* Word Columns */}
            <div className="flex justify-around gap-4 flex-wrap">
              {/* Subjects Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div>
                <div className="space-y-2">
                  {subjectsData.map((subject) => (
                    <motion.button key={subject.en} onClick={() => handleSubjectSelect(subject)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject?.en === subject.en ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                      style={{ background: selectedSubject?.en === subject.en ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject?.en === subject.en ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject?.en === subject.en ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)'}}
                    >{subject.en}</motion.button>
                  ))}
                </div>
              </div>

              {/* Verbs (Base) Column */}
              <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                <div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos Base</div>
                <div className="space-y-2">
                  {verbsData.map((verb) => (
                    <motion.button key={verb.base} onClick={() => handleVerbSelect(verb)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb?.base === verb.base ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`}
                      style={{ background: selectedVerb?.base === verb.base ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb?.base === verb.base ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb?.base === verb.base ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)'}}
                    >{verb.base}</motion.button>
                  ))}
                </div>
              </div>

              {/* Complements Column */}
              {selectedVerb && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                  className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" 
                  style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}
                >
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">Complementos / Tiempo</div>
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
            <div className="mt-8 p-4 bg-sky-50 rounded-xl border border-sky-200"> {/* Cyan/Sky Blue theme */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-sky-800 mb-2">
                  📅 ¡Bien planeado!
                </h3>
                <p className="text-sky-700">
                  Ahora sabes cómo usar &quot;going to&quot; para hablar de tus planes futuros. ¡Sigue practicando!
                </p>
                <p className="text-sky-600 text-sm mt-2">
                  Crea diferentes oraciones combinando los elementos para expresar tus intenciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level6Page;