'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { MobileSentenceBuilder, StepConfig, StepOption } from '../../components/game/MobileSentenceBuilder';

// --- DATA DEFINITIONS FOR LEVEL 2 (EXPANDED & MORE USEFUL) ---
const subjectOptions: StepOption[] = [
  { key: 'I', label: 'I', es: 'Yo', aux: 'have', spanishAux: 'he' },
  { key: 'You', label: 'You', es: 'Tú', aux: 'have', spanishAux: 'has' },
  { key: 'He', label: 'He', es: 'Él', aux: 'has', spanishAux: 'ha' },
  { key: 'She', label: 'She', es: 'Ella', aux: 'has', spanishAux: 'ha' },
  { key: 'We', label: 'We', es: 'Nosotros', aux: 'have', spanishAux: 'hemos' },
  { key: 'They', label: 'They', es: 'Ellos', aux: 'have', spanishAux: 'han' }
];

interface VerbWithExtra extends StepOption {
  extras: StepOption[];
}

const verbOptions: VerbWithExtra[] = [
  { 
    key: 'eaten', label: 'eaten', es: 'comido', 
    extras: [
      { key: 'sushi', label: 'sushi', es: 'sushi' },
      { key: 'tacos', label: 'tacos', es: 'tacos' },
      { key: 'pizza', label: 'pizza', es: 'pizza' },
      { key: 'at that restaurant', label: 'at that restaurant', es: 'en ese restaurante' },
      { key: 'breakfast', label: 'breakfast', es: 'el desayuno' },
      { key: 'too much', label: 'too much', es: 'demasiado' },
    ]
  },
  { 
    key: 'watched', label: 'watched', es: 'visto', 
    extras: [
      { key: 'a movie', label: 'a movie', es: 'una película' },
      { key: 'a series', label: 'a series', es: 'una serie' },
      { key: 'the game', label: 'the game', es: 'el partido' },
      { key: 'the news', label: 'the news', es: 'las noticias' },
      { key: 'a documentary', label: 'a documentary', es: 'un documental' },
      { key: 'that video', label: 'that video', es: 'ese video' },
    ]
  },
  { 
    key: 'cleaned', label: 'cleaned', es: 'limpiado', 
    extras: [
      { key: 'my room', label: 'my room', es: 'mi cuarto' },
      { key: 'the kitchen', label: 'the kitchen', es: 'la cocina' },
      { key: 'the bathroom', label: 'the bathroom', es: 'el baño' },
      { key: 'the house', label: 'the house', es: 'la casa' },
      { key: 'the dishes', label: 'the dishes', es: 'los platos' },
      { key: 'my car', label: 'my car', es: 'mi coche' },
    ]
  },
  { 
    key: 'read', label: 'read', es: 'leído', 
    extras: [
      { key: 'that book', label: 'that book', es: 'ese libro' },
      { key: 'the news', label: 'the news', es: 'las noticias' },
      { key: 'your email', label: 'your email', es: 'tu correo' },
      { key: 'the instructions', label: 'the instructions', es: 'las instrucciones' },
      { key: 'a magazine', label: 'a magazine', es: 'una revista' },
      { key: 'the menu', label: 'the menu', es: 'el menú' },
    ]
  },
  { 
    key: 'visited', label: 'visited', es: 'visitado', 
    extras: [
      { key: 'my family', label: 'my family', es: 'a mi familia' },
      { key: 'my friends', label: 'my friends', es: 'a mis amigos' },
      { key: 'that museum', label: 'that museum', es: 'ese museo' },
      { key: 'another country', label: 'another country', es: 'otro país' },
      { key: 'the beach', label: 'the beach', es: 'la playa' },
      { key: 'the capital city', label: 'the capital city', es: 'la capital' },
    ]
  },
  { 
    key: 'played', label: 'played', es: 'jugado', 
    extras: [
      { key: 'soccer', label: 'soccer', es: 'fútbol' },
      { key: 'video games', label: 'video games', es: 'videojuegos' },
      { key: 'basketball', label: 'basketball', es: 'básquetbol' },
      { key: 'the guitar', label: 'the guitar', es: 'la guitarra', es_verb: 'tocado' },
      { key: 'chess', label: 'chess', es: 'ajedrez' },
      { key: 'cards', label: 'cards', es: 'a las cartas' },
    ]
  }
];

const timeOptions: StepOption[] = [
  { key: 'today', label: 'today', es: 'hoy' },
  { key: 'this week', label: 'this week', es: 'esta semana' },
  { key: 'this month', label: 'this month', es: 'este mes' },
  { key: 'recently', label: 'recently', es: 'recientemente' },
  { key: 'many times', label: 'many times', es: 'muchas veces' },
  { key: 'before', label: 'before', es: 'antes' },
];


// --- LEVEL 2 COMPONENT ---
const Level2Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  // State
  const [selectedSubject, setSelectedSubject] = useState<StepOption | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<VerbWithExtra | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<StepOption | null>(null);
  const [selectedTime, setSelectedTime] = useState<StepOption | null>(null);
  const [availableExtras, setAvailableExtras] = useState<StepOption[]>([]);

  // Handlers
  const handleSubjectSelect = (option: StepOption) => {
    setSelectedSubject(option);
  };

  const handleVerbSelect = (option: VerbWithExtra) => {
    setSelectedVerb(option);
    setAvailableExtras(option.extras || []);
    setSelectedExtra(null);
    setSelectedTime(null);
  };

  const handleExtraSelect = (option: StepOption) => {
    setSelectedExtra(option);
  };
  
  const handleTimeSelect = (option: StepOption) => {
    setSelectedTime(option);
  };

  const handleNextLevel = () => {
    trackLevelCompletion(3);
    router.push('/future-will');
  };

  // Preview Logic
  const partialSentence = [
    selectedSubject?.label,
    selectedSubject?.aux,
    selectedVerb?.label,
    selectedExtra?.label,
    selectedTime?.label
  ].filter(Boolean).join(' ');

  const isComplete = !!(selectedSubject && selectedVerb && selectedExtra && selectedTime);

  const getSmartTranslation = () => {
    if (!isComplete) return null;
    // Maneja casos especiales como "play the guitar" -> "tocado la guitarra"
    const verbInSpanish = selectedExtra?.es_verb || selectedVerb?.es;
    return `${selectedSubject.es} ${selectedSubject.spanishAux} ${verbInSpanish} ${selectedExtra.es} ${selectedTime.es}`;
  };

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
    },
    {
      stepNumber: 4,
      title: '4. Añade un Tiempo',
      icon: <span className="text-xl font-bold">⏰</span>,
      options: timeOptions,
      onSelect: handleTimeSelect,
      selectedValue: selectedTime?.label || null,
      isCompleted: !!selectedTime,
      isDisabled: !selectedExtra,
      colorClasses: { bg: 'bg-orange-100', selectedBg: 'bg-orange-500', border: 'border-orange-400', accent: 'text-orange-600' },
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
          <h1 className="text-xl font-bold text-gray-900">Level 3: Present Perfect</h1>
          <div className="w-24" />
        </div>
      </header>
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-4 lg:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            {/* Bloque de aprendizaje mejorado */}
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', borderColor: 'rgba(59, 130, 246, 0.2)', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #3b82f6, #2563eb)', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)' }}>
                    <span className="text-3xl">🔗</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Qué vas a aprender?</h3>
                  <p className="text-gray-600 text-lg mb-6">A hablar de <strong className="font-semibold">experiencias pasadas</strong> que tienen conexión con el <strong className="font-semibold">presente</strong>.</p>
                  <div className="bg-white/60 rounded-lg p-3 text-lg font-mono tracking-wide text-gray-700 border border-gray-200">
                    <span className="font-bold text-blue-600">[Sujeto]</span> + 
                    <span className="font-bold text-emerald-600"> [have/has] </span> + 
                    <span className="font-bold text-purple-600">[Verbo participio]</span>
                  </div>
                  <p className="mt-6 font-semibold text-gray-700">Por ejemplo:</p>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">&quot;He has visited Paris&quot;</p>
                    <p className="text-lg text-gray-600 italic">Él ha visitado París</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/80 max-w-sm mx-auto">
                    <ul className="text-left space-y-2 text-gray-600 text-lg">
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-blue-600">He</strong><span>→ Sujeto (Él)</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-emerald-600">has</strong><span>→ Auxiliar para &quot;He&quot;</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-purple-600">visited</strong><span>→ Verbo en participio (visitado)</span></li>
                    </ul>
                  </div>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-800 font-semibold text-left">
                      <span className="font-bold">¡Recuerda!</span><br/>
                      Usa <strong className="text-emerald-600">has</strong> para <span className="font-bold">He, She, It.</span><br/>
                      Usa <strong className="text-emerald-600">have</strong> para <span className="font-bold">I, You, We, They.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* --- MOBILE VIEW --- */}
            <div className="lg:hidden">
              <MobileSentenceBuilder steps={steps} partialSentence={partialSentence} fullSentenceEs={fullSentenceEs} isComplete={isComplete}/>
            </div>
            
            {/* --- DESKTOP VIEW --- */}
            <div className="hidden lg:block">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Present Perfect</div>
                <div className="text-gray-500 text-lg font-medium">[Sujeto] + [have/has] + [verbo] + [extra] + [tiempo]</div>
              </div>
              {/* LEGO Blocks */}
              <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none', borderRadius: selectedSubject ? '0px' : '12px 0 0 12px', boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.label || 'Sujeto'}
                </motion.div>
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #10b981, #059669)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginLeft: '-12px', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedSubject ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.aux || 'have/has'}
                </motion.div>
                <motion.div whileHover={selectedVerb ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedVerb ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedVerb ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedVerb?.label || 'verbo'}
                </motion.div>
                <motion.div whileHover={selectedExtra ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedExtra ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedExtra ? 'linear-gradient(145deg, #22c55e, #16a34a)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedExtra ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedExtra ? '0 8px 25px rgba(34, 197, 94, 0.25), 0 3px 0 rgba(22, 163, 74, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedExtra?.label || 'extra'}
                </motion.div>
                <motion.div whileHover={selectedTime ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-0 ${selectedTime ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedTime ? 'linear-gradient(145deg, #f59e0b, #d97706)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedTime ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', borderRadius: selectedTime ? '0px' : '0 12px 12px 0', boxShadow: selectedTime ? '0 8px 25px rgba(245, 158, 11, 0.25), 0 3px 0 rgba(217, 119, 6, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedTime?.label || 'tiempo'}
                </motion.div>
              </div>
              <motion.div className="rounded-2xl p-7 text-center border mb-8" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }} animate={isComplete ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.6 }}>
                {isComplete ? ( <div> <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight"> {fullSentenceEs} </div> <div className="text-lg text-gray-500 font-medium italic"> ({partialSentence}) </div> </div> ) : ( <div className="text-gray-400 text-lg font-medium"> Completa los 4 pasos para crear una oración </div> )}
              </motion.div>
              {/* Word Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className={`rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedExtra ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
                  <div className="text-gray-700 text-lg font-bold text-center mb-4">Tiempo</div>
                  <div className="space-y-2">{timeOptions.map((option) => (<motion.button key={option.key} onClick={() => handleTimeSelect(option)} disabled={!selectedExtra} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedTime?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedTime?.key === option.key ? 'linear-gradient(145deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedTime?.key === option.key ? '#d97706' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedTime?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎯 ¡Muy bien!</h3>
                <p className="text-green-700">Ahora ya sabes cómo usar Present Perfect en frases completas.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
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

export default Level2Page;