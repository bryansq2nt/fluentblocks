// --- START OF FILE page.tsx ---

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { MobileSentenceBuilder, StepConfig, StepOption } from '../../components/game/MobileSentenceBuilder';
import { ShareButton } from '../../components/game/ShareButton';

// --- DATA DEFINITIONS FOR LEVEL 3 ---
// --- AHORA CON ESTRUCTURA DE COMPLEMENTOS ANIDADA ---

const subjectOptions: StepOption[] = [
  { key: 'I', label: 'I', es: 'Yo' },
  { key: 'You', label: 'You', es: 'Tú' },
  { key: 'He', label: 'He', es: 'Él' },
  { key: 'She', label: 'She', es: 'Ella' },
  { key: 'We', label: 'We', es: 'Nosotros' },
  { key: 'They', label: 'They', es: 'Ellos' }
];

// NUEVA ESTRUCTURA: Los verbos ahora contienen sus posibles complementos.
interface VerbWithComplementsOption extends StepOption {
  complements: StepOption[];
  es_base: string; // Verbo base en español para conjugación
}

const verbOptions: VerbWithComplementsOption[] = [
  { key: 'cooked', label: 'cooked', es: 'cocinó', es_base: 'cocinar',
    complements: [
      { key: 'dinner', label: 'dinner', es: 'la cena' },
      { key: 'pasta', label: 'pasta', es: 'pasta' },
      { key: 'breakfast', label: 'breakfast', es: 'el desayuno' }
    ]
  },
  { key: 'played', label: 'played', es: 'jugó', es_base: 'jugar',
    complements: [
      { key: 'soccer', label: 'soccer', es: 'al fútbol' },
      { key: 'video games', label: 'video games', es: 'videojuegos' },
      { key: 'the guitar', label: 'the guitar', es: 'la guitarra', es_verb: 'tocar' } // Caso especial
    ]
  },
  { key: 'cleaned', label: 'cleaned', es: 'limpió', es_base: 'limpiar',
    complements: [
      { key: 'the house', label: 'the house', es: 'la casa' },
      { key: 'my room', label: 'my room', es: 'mi habitación' },
      { key: 'the kitchen', label: 'the kitchen', es: 'la cocina' }
    ]
  },
  { key: 'watched', label: 'watched', es: 'vio', es_base: 'ver',
    complements: [
      { key: 'a movie', label: 'a movie', es: 'una película' },
      { key: 'a series', label: 'a series', es: 'una serie' },
      { key: 'the game', label: 'the game', es: 'el partido' }
    ]
  },
  { key: 'studied', label: 'studied', es: 'estudió', es_base: 'estudiar',
    complements: [
      { key: 'for the exam', label: 'for the exam', es: 'para el examen' },
      { key: 'English', label: 'English', es: 'inglés' },
      { key: 'history', label: 'history', es: 'historia' }
    ]
  }
];

const timeOptions: StepOption[] = [
  { key: 'yesterday', label: 'yesterday', es: 'ayer' },
  { key: 'last night', label: 'last night', es: 'anoche' },
  { key: 'this morning', label: 'this morning', es: 'esta mañana' },
  { key: 'on Saturday', label: 'on Saturday', es: 'el sábado' },
  { key: 'two days ago', label: 'two days ago', es: 'hace dos días' }
];


// --- LEVEL 3 COMPONENT ---
const Level3Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  // State - Añadimos estado para el complemento
  const [selectedSubject, setSelectedSubject] = useState<StepOption | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<VerbWithComplementsOption | null>(null);
  const [selectedComplement, setSelectedComplement] = useState<StepOption | null>(null); // NUEVO ESTADO
  const [selectedTime, setSelectedTime] = useState<StepOption | null>(null);

  // Handlers - Modificamos el handler del verbo
  const handleSubjectSelect = (option: StepOption) => setSelectedSubject(option);
  const handleVerbSelect = (option: VerbWithComplementsOption) => {
    setSelectedVerb(option);
    setSelectedComplement(null); // Reseteamos el complemento al cambiar el verbo
  };
  const handleComplementSelect = (option: StepOption) => setSelectedComplement(option); // NUEVO HANDLER
  const handleTimeSelect = (option: StepOption) => setSelectedTime(option);
  
  const handleNextLevel = () => {
    trackLevelCompletion(6);
    router.push('/modal-can');
  };

  // Smart translation logic - Ahora mucho más potente
  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedComplement || !selectedTime) return null;

    const verbBase = selectedComplement?.es_verb || selectedVerb.es_base;

    const conjugations: { [key: string]: { [key: string]: string } } = {
      'cocinar': { 'I': 'cociné', 'You': 'cocinaste', 'He': 'cocinó', 'She': 'cocinó', 'We': 'cocinamos', 'They': 'cocinaron' },
      'jugar': { 'I': 'jugué', 'You': 'jugaste', 'He': 'jugó', 'She': 'jugó', 'We': 'jugamos', 'They': 'jugaron' },
      'tocar': { 'I': 'toqué', 'You': 'tocaste', 'He': 'tocó', 'She': 'tocó', 'We': 'tocamos', 'They': 'tocaron' },
      'limpiar': { 'I': 'limpié', 'You': 'limpiaste', 'He': 'limpió', 'She': 'limpió', 'We': 'limpiamos', 'They': 'limpiaron' },
      'ver': { 'I': 'vi', 'You': 'viste', 'He': 'vio', 'She': 'vio', 'We': 'vimos', 'They': 'vieron' },
      'estudiar': { 'I': 'estudié', 'You': 'estudiaste', 'He': 'estudió', 'She': 'estudió', 'We': 'estudiamos', 'They': 'estudiaron' }
    };

    const conjugatedVerb = conjugations[verbBase]?.[selectedSubject.key] || `(${verbBase})`;
    return `${selectedSubject.es} ${conjugatedVerb} ${selectedComplement.es} ${selectedTime.es}`;
  };

  // Preview Logic
  const partialSentence = [selectedSubject?.label, selectedVerb?.label, selectedComplement?.label, selectedTime?.label].filter(Boolean).join(' ');
  const isComplete = !!(selectedSubject && selectedVerb && selectedComplement && selectedTime);
  const fullSentenceEs = isComplete ? getSmartTranslation() : null;
  
  // Opciones de complemento dinámicas basadas en el verbo seleccionado
  const complementOptions = selectedVerb ? selectedVerb.complements : [];

  // Steps configuration for Mobile Builder - Ahora con 4 pasos
  const steps: StepConfig[] = [
    {
      stepNumber: 1,
      title: '1. Elige un Sujeto',
      icon: <span className="text-xl font-bold">👤</span>,
      options: subjectOptions,
      onSelect: handleSubjectSelect,
      selectedValue: selectedSubject?.label || null,
      isCompleted: !!selectedSubject,
      isDisabled: false,
      colorClasses: { bg: 'bg-blue-100', selectedBg: 'bg-blue-500', border: 'border-blue-400', accent: 'text-blue-600' },
    },
    {
      stepNumber: 2,
      title: '2. Elige un Verbo',
      icon: <span className="text-xl font-bold">🏃</span>,
      options: verbOptions,
      onSelect: (option) => handleVerbSelect(option as VerbWithComplementsOption),
      selectedValue: selectedVerb?.label || null,
      isCompleted: !!selectedVerb,
      isDisabled: !selectedSubject,
      colorClasses: { bg: 'bg-purple-100', selectedBg: 'bg-purple-500', border: 'border-purple-400', accent: 'text-purple-600' },
    },
    { // NUEVO PASO
      stepNumber: 3,
      title: '3. Añade un Complemento',
      icon: <span className="text-xl font-bold">🧩</span>,
      options: complementOptions,
      onSelect: handleComplementSelect,
      selectedValue: selectedComplement?.label || null,
      isCompleted: !!selectedComplement,
      isDisabled: !selectedVerb,
      colorClasses: { bg: 'bg-green-100', selectedBg: 'bg-green-500', border: 'border-green-400', accent: 'text-green-600' },
    },
    {
      stepNumber: 4,
      title: '4. Elige un Tiempo',
      icon: <span className="text-xl font-bold">⏰</span>,
      options: timeOptions,
      onSelect: handleTimeSelect,
      selectedValue: selectedTime?.label || null,
      isCompleted: !!selectedTime,
      isDisabled: !selectedComplement, // Ahora depende del complemento
      colorClasses: { bg: 'bg-orange-100', selectedBg: 'bg-orange-500', border: 'border-orange-400', accent: 'text-orange-600' },
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
          {/* ... (Header sin cambios) ... */}
           <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                <span className="hidden sm:inline">Back to Map</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Level 6: Past Simple (Useful)</h1>
            <div className="w-24" />
        </div>
      </header>
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-5xl mx-auto"> {/* Aumentado el max-width para 4 columnas */}
          <div className="rounded-3xl p-4 lg:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            {/* ... (Sección "¿Qué vas a aprender?" sin cambios) ... */}
             <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #d1fae5 100%)', borderColor: 'rgba(34, 197, 94, 0.2)', boxShadow: '0 10px 25px rgba(34, 197, 94, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
             <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)', borderColor: 'rgba(245, 158, 11, 0.2)', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
  <div className="p-8">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #f59e0b, #d97706)', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)' }}>
        <span className="text-3xl">🕰️</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Qué vas a aprender?</h3>
      <p className="text-gray-600 text-lg mb-6">A formar oraciones sobre acciones terminadas en el pasado usando este patrón:</p>

      {/* El Patrón */}
      <div className="bg-white/60 rounded-lg p-3 text-lg font-mono tracking-wide text-gray-700 border border-gray-200">
        <span className="font-bold text-blue-600">[Sujeto]</span> + 
        <span className="font-bold text-purple-600"> [Verbo en pasado] </span> + 
        <span className="font-bold text-green-600">[Complemento]</span>
      </div>

      <p className="mt-6 font-semibold text-gray-700">Por ejemplo:</p>

      {/* Ejemplo y Traducción */}
      <div className="mt-2">
        <p className="text-2xl font-bold text-gray-900">&quot;She played soccer yesterday&quot;</p>
        <p className="text-lg text-gray-600 italic">Ella jugó al fútbol ayer</p>
      </div>

      {/* Desglose del Ejemplo */}
      <div className="mt-4 pt-4 border-t border-gray-200/80 max-w-sm mx-auto">
        <ul className="text-left space-y-2 text-gray-600 text-lg">
          <li className="flex items-center gap-4">
            <strong className="w-1/3 font-semibold text-blue-600">She</strong>
            <span>→ Sujeto (Ella)</span>
          </li>
          <li className="flex items-center gap-4">
            <strong className="w-1/3 font-semibold text-purple-600">played</strong>
            <span>→ Verbo en pasado</span>
          </li>
          <li className="flex items-center gap-4">
            <strong className="w-1/3 font-semibold text-green-600">soccer</strong>
            <span>→ Complemento (al fútbol)</span>
          </li>
           <li className="flex items-center gap-4">
            <strong className="w-1/3 font-semibold text-orange-600">yesterday</strong>
            <span>→ Tiempo (ayer)</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</div>
            </div>
            
            {/* --- MOBILE VIEW --- */}
            <div className="lg:hidden">
              <MobileSentenceBuilder
                steps={steps}
                partialSentence={partialSentence}
                fullSentenceEs={fullSentenceEs}
                isComplete={isComplete}
              />
            </div>
            
            {/* --- DESKTOP VIEW --- */}
            <div className="hidden lg:block">
              {/* Pattern Display */}
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Simple Past Completo</div>
                <div className="text-gray-500 text-lg font-medium">[Sujeto] + [verbo] + [complemento] + [tiempo]</div>
              </div>

              {/* LEGO Blocks - Añadimos un 4º bloque */}
              <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
                {/* Subject Block (sin cambios) */}
                 <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none', borderRadius: selectedSubject ? '0px' : '12px 0 0 12px', boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.label || 'Sujeto'}
                </motion.div>

                {/* Verb Block (sin cambios en estilo) */}
                <motion.div whileHover={selectedVerb ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedVerb ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedVerb ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginLeft: '-12px', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedVerb?.label || 'verbo'}
                </motion.div>

                {/* NUEVO Complement Block */}
                <motion.div whileHover={selectedComplement ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedComplement ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedComplement ? 'linear-gradient(145deg, #22c55e, #16a34a)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedComplement ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedComplement ? '0 8px 25px rgba(34, 197, 94, 0.25), 0 3px 0 rgba(22, 163, 74, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedComplement?.label || 'complemento'}
                </motion.div>

                {/* Time Block (z-index ajustado) */}
                <motion.div whileHover={selectedTime ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedTime ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedTime ? 'linear-gradient(145deg, #f59e0b, #d97706)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedTime ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', borderRadius: selectedTime ? '0px' : '0 12px 12px 0', boxShadow: selectedTime ? '0 8px 25px rgba(245, 158, 11, 0.25), 0 3px 0 rgba(217, 119, 6, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedTime?.label || 'tiempo'}
                </motion.div>
              </div>

              {/* Translation Area (sin cambios) */}
              <motion.div className="rounded-2xl p-7 text-center border mb-8" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }} animate={isComplete ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.6 }}>
                {isComplete ? (<div> <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{fullSentenceEs}</div> <div className="text-lg text-gray-500 font-medium italic">({partialSentence})</div></div>) : (<div className="text-gray-400 text-lg font-medium">Completa los 4 pasos para crear una oración</div>)}
              </motion.div>

              {/* Word Columns - Añadimos una 4ª columna */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Subjects Column */}
                <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div><div className="space-y-2">{subjectOptions.map((option) => (<motion.button key={option.key} onClick={() => handleSubjectSelect(option)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedSubject?.key === option.key ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject?.key === option.key ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                {/* Verbs Column */}
                <div className="rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos</div><div className="space-y-2">{verbOptions.map((option) => (<motion.button key={option.key} onClick={() => handleVerbSelect(option)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedVerb?.key === option.key ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb?.key === option.key ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                {/* NUEVA Complement Column */}
                <div className={`rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedVerb ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Complemento</div><div className="space-y-2">{complementOptions.map((option) => (<motion.button key={option.key} onClick={() => handleComplementSelect(option)} disabled={!selectedVerb} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedComplement?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedComplement?.key === option.key ? 'linear-gradient(145deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedComplement?.key === option.key ? '#16a34a' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedComplement?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                {/* Time Column */}
                <div className={`rounded-2xl p-6 min-w-[180px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedComplement ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Tiempo</div><div className="space-y-2">{timeOptions.map((option) => (<motion.button key={option.key} onClick={() => handleTimeSelect(option)} disabled={!selectedComplement} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedTime?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedTime?.key === option.key ? 'linear-gradient(145deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedTime?.key === option.key ? '#d97706' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedTime?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
              </div>
            </div>

            {/* ... (Sección "¡Muy bien!" y botones de navegación sin cambios) ... */}
            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎯 ¡Muy bien!</h3>
                <p className="text-green-700">Ahora ya sabes cómo usar Simple Past en frases completas.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
          <ShareButton
  title="¡Recordando el pasado en FluentBlocks!"
  text="Estoy aprendiendo a contar historias en Pasado Simple. ¡Mira cómo se forman las oraciones!"
/>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNextLevel} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
              <span>Siguiente Ejercicio</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.button>
            {!hasShownFeedback && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFeedbackModal(true)} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <span>Enviar Feedback</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </motion.button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level3Page;