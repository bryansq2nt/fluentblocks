'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { MobileSentenceBuilder, StepConfig, StepOption } from '../../components/game/MobileSentenceBuilder';
import { ShareButton } from '../../components/game/ShareButton';
import { AudioPlayer } from '../../components/game/AudioPlayer';

// --- DATA DEFINITIONS FOR LEVEL 1 (EXPANDED & MORE USEFUL) ---
const subjectOptions: StepOption[] = [
  { key: 'I', label: 'I', es: 'Yo', aux: 'am', spanishAux: 'estoy' },
  { key: 'You', label: 'You', es: 'Tú', aux: 'are', spanishAux: 'estás' },
  { key: 'He', label: 'He', es: 'Él', aux: 'is', spanishAux: 'está' },
  { key: 'She', label: 'She', es: 'Ella', aux: 'is', spanishAux: 'está' },
  { key: 'We', label: 'We', es: 'Nosotros', aux: 'are', spanishAux: 'estamos' },
  { key: 'They', label: 'They', es: 'Ellos', aux: 'are', spanishAux: 'están' }
];

interface VerbWithExtra extends StepOption {
  extras: StepOption[];
}

const verbOptions: VerbWithExtra[] = [
  { 
    key: 'eating', label: 'eating', es: 'comiendo', 
    extras: [
      { key: 'pizza', label: 'pizza', es: 'pizza' },
      { key: 'a salad', label: 'a salad', es: 'una ensalada' },
      { key: 'tacos', label: 'tacos', es: 'tacos' },
      { key: 'an apple', label: 'an apple', es: 'una manzana' },
      { key: 'my lunch', label: 'my lunch', es: 'mi almuerzo' },
      { key: 'popcorn', label: 'popcorn', es: 'palomitas' },
    ]
  },
  { 
    key: 'studying', label: 'studying', es: 'estudiando', 
    extras: [
      { key: 'English', label: 'English', es: 'inglés' },
      { key: 'for an exam', label: 'for an exam', es: 'para un examen' },
      { key: 'math', label: 'math', es: 'matemáticas' },
      { key: 'online', label: 'online', es: 'en línea' },
      { key: 'at the library', label: 'at the library', es: 'en la biblioteca' },
      { key: 'a new skill', label: 'a new skill', es: 'una nueva habilidad' },
    ]
  },
  { 
    key: 'working', label: 'working', es: 'trabajando', 
    extras: [
      { key: 'on a project', label: 'on a project', es: 'en un proyecto' },
      { key: 'from home', label: 'from home', es: 'desde casa' },
      { key: 'at the office', label: 'at the office', es: 'en la oficina' },
      { key: 'late', label: 'late', es: 'hasta tarde' },
      { key: 'on my computer', label: 'on my computer', es: 'en mi computadora' },
      { key: 'a lot', label: 'a lot', es: 'mucho' },
    ]
  },
  { 
    key: 'playing', label: 'playing', es: 'jugando', 
    extras: [
      { key: 'video games', label: 'video games', es: 'videojuegos' },
      { key: 'soccer', label: 'soccer', es: 'fútbol' },
      { key: 'cards', label: 'cards', es: 'a las cartas' },
      { key: 'the guitar', label: 'the guitar', es: 'la guitarra', es_verb: 'tocando' },
      { key: 'with my friends', label: 'with my friends', es: 'con mis amigos' },
      { key: 'in the park', label: 'in the park', es: 'en el parque' },
    ]
  },
  { 
    key: 'reading', label: 'reading', es: 'leyendo', 
    extras: [
      { key: 'a book', label: 'a book', es: 'un libro' },
      { key: 'the news', label: 'the news', es: 'las noticias' },
      { key: 'an email', label: 'an email', es: 'un correo electrónico' },
      { key: 'a magazine', label: 'a magazine', es: 'una revista' },
      { key: 'my messages', label: 'my messages', es: 'mis mensajes' },
      { key: 'a comic', label: 'a comic', es: 'un cómic' },
    ]
  },
    { 
    key: 'watching', label: 'watching', es: 'viendo', 
    extras: [
      { key: 'a movie', label: 'a movie', es: 'una película' },
      { key: 'a series', label: 'a series', es: 'una serie' },
      { key: 'TV', label: 'TV', es: 'la tele' },
      { key: 'the game', label: 'the game', es: 'el partido' },
      { key: 'YouTube', label: 'YouTube', es: 'YouTube' },
      { key: 'the rain', label: 'the rain', es: 'la lluvia' },
    ]
  }
];

// --- LEVEL 1 COMPONENT ---
const PresenteContinuo = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  // State
  const [selectedSubject, setSelectedSubject] = useState<StepOption | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<VerbWithExtra | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<StepOption | null>(null);
  const [availableExtras, setAvailableExtras] = useState<StepOption[]>([]);

  // Handlers
  const handleSubjectSelect = (option: StepOption) => {
    setSelectedSubject(option);
  };
  const handleVerbSelect = (option: VerbWithExtra) => {
    setSelectedVerb(option);
    setAvailableExtras(option.extras);
    setSelectedExtra(null);
  };
  const handleExtraSelect = (option: StepOption) => {
    setSelectedExtra(option);
  };
  const handleNextLevel = () => {
    trackLevelCompletion(2);
    router.push('/presente-perfecto');
  };

  // Preview Logic
  const partialSentence = [
    selectedSubject?.label,
    selectedSubject?.aux,
    selectedVerb?.label,
    selectedExtra?.label
  ].filter(Boolean).join(' ');
  const isComplete = !!(selectedSubject && selectedVerb && selectedExtra);

  const getSmartTranslation = () => {
    if (!isComplete) return null;
    const verbInSpanish = selectedExtra?.es_verb || selectedVerb?.es;
    return `${selectedSubject.es} ${selectedSubject.spanishAux} ${verbInSpanish} ${selectedExtra.es}`;
  }

  const fullSentenceEs = getSmartTranslation();

  // Steps configuration for Mobile Builder
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
      onSelect: (option) => handleVerbSelect(option as VerbWithExtra),
      selectedValue: selectedVerb?.label || null,
      isCompleted: !!selectedVerb,
      isDisabled: !selectedSubject,
      colorClasses: { bg: 'bg-purple-100', selectedBg: 'bg-purple-500', border: 'border-purple-400', accent: 'text-purple-600' },
    },
    {
      stepNumber: 3,
      title: '3. Añade un Extra',
      icon: <span className="text-xl font-bold">🧩</span>,
      options: availableExtras,
      onSelect: handleExtraSelect,
      selectedValue: selectedExtra?.label || null,
      isCompleted: !!selectedExtra,
      isDisabled: !selectedVerb,
      colorClasses: { bg: 'bg-green-100', selectedBg: 'bg-green-500', border: 'border-green-400', accent: 'text-green-600' },
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="hidden sm:inline">Back to Map</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Level 2: Present Continuous</h1>
          <div className="w-24" />
        </div>
      </header>
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-4 lg:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', borderColor: 'rgba(59, 130, 246, 0.2)', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #3b82f6, #2563eb)', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)' }}>
                    <span className="text-3xl">⚡️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Qué vas a aprender?</h3>
                  <p className="text-gray-600 text-lg mb-6">A hablar de acciones que están pasando <strong className="font-semibold">ahora mismo</strong>.</p>
                  <div className="bg-white/60 rounded-lg p-3 text-lg font-mono tracking-wide text-gray-700 border border-gray-200">
                    <span className="font-bold text-blue-600">[Sujeto]</span> +
                    <span className="font-bold text-emerald-600"> [am/is/are] </span> +
                    <span className="font-bold text-purple-600">[verbo+ing]</span>
                  </div>
                  <p className="mt-6 font-semibold text-gray-700">Por ejemplo:</p>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">&quot;She is eating pizza&quot;</p>
                    <p className="text-lg text-gray-600 italic">Ella está comiendo pizza</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/80 max-w-sm mx-auto">
                    <ul className="text-left space-y-2 text-gray-600 text-lg">
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-blue-600">She</strong><span>→ Sujeto (Ella)</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-emerald-600">is</strong><span>→ Verbo &apos;to be&apos; (para He, She)</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-purple-600">eating</strong><span>→ Verbo+ing (comiendo)</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-green-600">pizza</strong><span>→ Extra (pizza)</span></li>
                    </ul>
                  </div>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-800 font-semibold text-left">
                      <span className="font-bold">¡Recuerda!</span><br/>
                      <strong className="text-emerald-600">am</strong> → para <strong className="font-bold">I</strong><br/>
                      <strong className="text-emerald-600">is</strong> → para <strong className="font-bold">He, She, It</strong><br/>
                      <strong className="text-emerald-600">are</strong> → para <strong className="font-bold">You, We, They</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:hidden">
              <MobileSentenceBuilder steps={steps} partialSentence={partialSentence} fullSentenceEs={fullSentenceEs} isComplete={isComplete} audioPlayer={isComplete ? <AudioPlayer sentence={partialSentence} /> : null}/>
            </div>
            
            <div className="hidden lg:block">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Present Continuous</div>
                <div className="text-gray-500 text-lg font-medium">[Sujeto] + [am/is/are] + [verbo+ing] + [extra]</div>
              </div>
              <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none', borderRadius: selectedSubject ? '0px' : '12px 0 0 12px', boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.label || 'Sujeto'}
                </motion.div>
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #10b981, #059669)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginLeft: '-12px', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedSubject ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.aux || 'am/is/are'}
                </motion.div>
                <motion.div whileHover={selectedVerb ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedVerb ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedVerb ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedVerb?.label || 'verbo+ing'}
                </motion.div>
                <motion.div whileHover={selectedExtra ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-0 ${selectedExtra ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedExtra ? 'linear-gradient(145deg, #22c55e, #16a34a)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedExtra ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', borderRadius: selectedExtra ? '0px' : '0 12px 12px 0', boxShadow: selectedExtra ? '0 8px 25px rgba(34, 197, 94, 0.25), 0 3px 0 rgba(22, 163, 74, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedExtra?.label || 'extra'}
                </motion.div>
              </div>
              <motion.div 
  className="relative rounded-2xl p-7 text-center border mb-8" 
  style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }} 
  animate={isComplete ? { scale: [1, 1.02, 1] } : {}} 
  transition={{ duration: 0.6 }}
>
  {isComplete ? (
    <div>
      {/* El texto permanece centrado */}
      <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{fullSentenceEs}</div>
      <div className="text-lg text-gray-500 font-medium italic">({partialSentence})</div>
      
      {/* El AudioPlayer se posiciona a la derecha */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <AudioPlayer sentence={partialSentence} />
      </div>
    </div>
  ) : (
    <div className="text-gray-400 text-lg font-medium">Completa los 3 pasos para crear una oración</div>
  )}
</motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div>
                  <div className="space-y-2">{subjectOptions.map((option) => (<motion.button key={option.key} onClick={() => handleSubjectSelect(option)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedSubject?.key === option.key ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject?.key === option.key ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div>
                </div>
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos</div>
                  <div className="space-y-2">{verbOptions.map((option) => (<motion.button key={option.key} onClick={() => handleVerbSelect(option as VerbWithExtra)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedVerb?.key === option.key ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb?.key === option.key ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div>
                </div>
                <div className={`rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedVerb ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">Extra</div>
                  <div className="space-y-2">{availableExtras.map((option) => (<motion.button key={option.key} onClick={() => handleExtraSelect(option)} disabled={!selectedVerb} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedExtra?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedExtra?.key === option.key ? 'linear-gradient(145deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedExtra?.key === option.key ? '#16a34a' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedExtra?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎯 ¡Muy bien!</h3>
                <p className="text-green-700">Ahora ya sabes cómo usar Present Continuous.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
          <ShareButton
  title="¿Qué estoy haciendo? ¡Aprendiendo inglés!"
  text="Practicando el Presente Continuo en FluentBlocks para hablar de lo que pasa ahora mismo."
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

export default PresenteContinuo;