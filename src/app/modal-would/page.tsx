'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { MobileSentenceBuilder, StepConfig, StepOption } from '../../components/game/MobileSentenceBuilder';

// --- DATA DEFINITIONS FOR LEVEL 8 (WOULD) - FINAL & CORRECTED ---
const subjectOptions: StepOption[] = [
  { key: 'I', label: 'I', es: 'Yo', es_pronoun: 'A mí me' }, 
  { key: 'You', label: 'You', es: 'Tú', es_pronoun: 'A ti te' }, 
  { key: 'He', label: 'He', es: 'Él', es_pronoun: 'A él le' },
  { key: 'She', label: 'She', es: 'Ella', es_pronoun: 'A ella le' }, 
  { key: 'We', label: 'We', es: 'Nosotros', es_pronoun: 'A nosotros nos' }, 
  { key: 'They', label: 'They', es: 'Ellos/Ellas', es_pronoun: 'A ellos/ellas les' }
];

interface VerbWithExtra extends StepOption {
  es_inf: string;
  extras: StepOption[];
}

const verbOptions: VerbWithExtra[] = [
  { key: 'like', label: 'like', es_inf: 'gustar',
    extras: [
      { key: 'to go out tonight', label: 'to go out tonight', es: 'salir esta noche' },
      { key: 'to watch a movie', label: 'to watch a movie', es: 'ver una película' },
      { key: 'a bigger apartment', label: 'a bigger apartment', es: 'un apartamento más grande' },
      { key: 'to learn piano', label: 'to learn piano', es: 'aprender piano' },
      { key: 'to have more free time', label: 'to have more free time', es: 'tener más tiempo libre' },
    ]
  },
  { key: 'help', label: 'help', es_inf: 'ayudar',
    extras: [
      { key: 'my friend', label: 'my friend', es: 'a mi amigo' },
      { key: 'the kids', label: 'the kids', es: 'a los niños' },
      { key: 'my parents', label: 'my parents', es: 'a mis padres' },
      { key: 'with the project', label: 'with the project', es: 'con el proyecto' },
      { key: 'in the kitchen', label: 'in the kitchen', es: 'en la cocina' },
    ]
  },
  { key: 'go', label: 'go', es_inf: 'ir',
    extras: [
      { key: 'to the beach', label: 'to the beach', es: 'a la playa' },
      { key: 'to the party', label: 'to the party', es: 'a la fiesta' },
      { key: 'to Italy', label: 'to Italy', es: 'a Italia' },
      { key: 'on vacation', label: 'on vacation', es: 'de vacaciones' },
      { key: 'by train', label: 'by train', es: 'en tren' },
    ]
  },
  { key: 'buy', label: 'buy', es_inf: 'comprar',
    extras: [
      { key: 'a new car', label: 'a new car', es: 'un coche nuevo' },
      { key: 'a bigger house', label: 'a bigger house', es: 'una casa más grande' },
      { key: 'the tickets', label: 'the tickets', es: 'los boletos' },
      { key: 'a different one', label: 'a different one', es: 'uno diferente' },
      { key: 'something to eat', label: 'something to eat', es: 'algo de comer' },
    ]
  },
  { key: 'eat', label: 'eat', es_inf: 'comer',
    extras: [
      { key: 'a pizza', label: 'a pizza', es: 'una pizza' },
      { key: 'at that restaurant', label: 'at that restaurant', es: 'en ese restaurante' },
      { key: 'something healthy', label: 'something healthy', es: 'algo saludable' },
      { key: 'less meat', label: 'less meat', es: 'menos carne' },
      { key: 'more vegetables', label: 'more vegetables', es: 'más verduras' },
    ]
  },
  { key: 'live', label: 'live', es_inf: 'vivir',
    extras: [
      { key: 'in another country', label: 'in another country', es: 'en otro país' },
      { key: 'near the sea', label: 'near the sea', es: 'cerca del mar' },
      { key: 'in a big city', label: 'in a big city', es: 'en una ciudad grande' },
      { key: 'in a small town', label: 'in a small town', es: 'en un pueblo pequeño' },
      { key: 'with my friends', label: 'with my friends', es: 'con mis amigos' },
    ]
  },
  { key: 'call', label: 'call', es_inf: 'llamar',
    extras: [
      { key: 'my mom', label: 'my mom', es: 'a mi mamá' },
      { key: 'a friend', label: 'a friend', es: 'a un amigo' },
      { key: 'a taxi', label: 'a taxi', es: 'un taxi' },
      { key: 'the doctor', label: 'the doctor', es: 'al doctor' },
      { key: 'later', label: 'later', es: 'más tarde' },
    ]
  },
  { key: 'watch', label: 'watch', es_inf: 'ver',
    extras: [
        { key: 'a movie', label: 'a movie', es: 'una película' },
        { key: 'a series', label: 'a series', es: 'una serie' },
        { key: 'the game', label: 'the game', es: 'el partido' },
        { key: 'less TV', label: 'less TV', es: 'menos tele' },
        { key: 'the sunset', label: 'the sunset', es: 'el atardecer' },
    ]
  }
];

// --- LEVEL 8 COMPONENT ---
const Level8Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  const [selectedSubject, setSelectedSubject] = useState<StepOption | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<VerbWithExtra | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<StepOption | null>(null);
  const [availableExtras, setAvailableExtras] = useState<StepOption[]>([]);

  useEffect(() => {
    if (selectedVerb) {
      setAvailableExtras(selectedVerb.extras);
    }
  }, [selectedVerb]);

  const handleSubjectSelect = (option: StepOption) => setSelectedSubject(option);
  
  const handleVerbSelect = (option: VerbWithExtra) => {
    setSelectedVerb(option);
    setSelectedExtra(null);
  };

  const handleExtraSelect = (option: StepOption) => setSelectedExtra(option);

  const handleNextLevel = () => {
    trackLevelCompletion(9);
    router.push('/modal-should'); 
  };

  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedExtra) return null;

    const subjectEs = selectedSubject.es;
    const verbInf = selectedVerb.es_inf;
    const extraEs = selectedExtra.es;

    // Mapa de sufijos condicionales en español
    const endings: {[key: string]: string} = {
      I: 'ía', You: 'ías', He: 'ía', She: 'ía', We: 'íamos', They: 'ían'
    };
    const suffix = endings[selectedSubject.key] || 'ía';

    // Tratamiento especial para "gustar" y "encantar"
    if (verbInf === 'gustar' || verbInf === 'encantar') {
      const conjugatedVerb = verbInf + 'ía'; // Siempre es singular "gustaría", "encantaría" con estos extras
      return `${selectedSubject.es_pronoun} ${conjugatedVerb} ${extraEs}`;
    }
    
    // Lógica de conjugación general y correcta
    const conjugatedVerb = verbInf + suffix; // Ej: "ayudar" + "ía" = "ayudaría"
    
    return `${subjectEs} ${conjugatedVerb} ${extraEs}`;
  };

  const partialSentence = [
    selectedSubject?.label, selectedSubject ? 'would' : null, selectedVerb?.label, selectedExtra?.label
  ].filter(Boolean).join(' ');
  const isComplete = !!(selectedSubject && selectedVerb && selectedExtra);
  const fullSentenceEs = isComplete ? getSmartTranslation() : null;

  const steps: StepConfig[] = [
    {
      stepNumber: 1, title: '1. Elige un Sujeto', icon: <span className="text-xl font-bold">👤</span>,
      options: subjectOptions, onSelect: handleSubjectSelect, selectedValue: selectedSubject?.label || null,
      isCompleted: !!selectedSubject, isDisabled: false,
      colorClasses: { bg: 'bg-blue-100', selectedBg: 'bg-blue-500', border: 'border-blue-400', accent: 'text-blue-600' },
    },
    {
      stepNumber: 2, title: '2. Elige un Verbo', icon: <span className="text-xl font-bold">🏃</span>,
      options: verbOptions, onSelect: (option) => handleVerbSelect(option as VerbWithExtra), selectedValue: selectedVerb?.label || null,
      isCompleted: !!selectedVerb, isDisabled: !selectedSubject,
      colorClasses: { bg: 'bg-purple-100', selectedBg: 'bg-purple-500', border: 'border-purple-400', accent: 'text-purple-600' },
    },
    {
      stepNumber: 3, title: '3. Añade un Extra', icon: <span className="text-xl font-bold">🧩</span>,
      options: availableExtras, onSelect: handleExtraSelect, selectedValue: selectedExtra?.label || null,
      isCompleted: !!selectedExtra, isDisabled: !selectedVerb,
      colorClasses: { bg: 'bg-teal-100', selectedBg: 'bg-teal-500', border: 'border-teal-400', accent: 'text-teal-600' },
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="hidden sm:inline">Back to Map</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Level 9: Would</h1>
          <div className="w-24" />
        </div>
      </header>
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-4 lg:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderColor: 'rgba(16, 185, 129, 0.2)', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #10b981, #059669)', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>
                    <span className="text-3xl">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">El Secreto de &quot;Would&quot;</h3>
                  <p className="text-gray-600 text-lg mb-6">La forma más fácil de entender &quot;would&quot; es pensar en él como la terminación <strong className="font-semibold text-emerald-700">&quot;-ía&quot;</strong> del español.</p>
                  <div className="text-left bg-white/60 rounded-xl border border-gray-200 p-4 mb-8">
                    <h4 className="text-lg font-bold text-center text-gray-800 mb-3">Would = -ía</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div><p className="text-gray-700">Yo como → <strong className="text-gray-900">I eat</strong></p><p className="text-gray-700">Yo comer<strong className="text-emerald-700 font-bold">ía</strong> → <strong className="text-gray-900">I would eat</strong></p></div>
                      <div><p className="text-gray-700">Yo voy → <strong className="text-gray-900">I go</strong></p><p className="text-gray-700">Yo ir<strong className="text-emerald-700 font-bold">ía</strong> → <strong className="text-gray-900">I would go</strong></p></div>
                      <div><p className="text-gray-700">Me gusta → <strong className="text-gray-900">I like</strong></p><p className="text-gray-700">Me gustar<strong className="text-emerald-700 font-bold">ía</strong> → <strong className="text-gray-900">I would like</strong></p></div>
                      <div><p className="text-gray-700">Yo vivo → <strong className="text-gray-900">I live</strong></p><p className="text-gray-700">Yo vivir<strong className="text-emerald-700 font-bold">ía</strong> → <strong className="text-gray-900">I would live</strong></p></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-4">Lo usamos para hablar de <strong className="font-semibold">situaciones imaginarias</strong> o para ser <strong className="font-semibold">educados</strong>. ¡Ahora practica con el patrón!</p>
                  <div className="bg-white/60 rounded-lg p-3 text-lg font-mono tracking-wide text-gray-700 border border-gray-200 mb-6">
                    <span className="font-bold text-blue-600">[Sujeto]</span> + <span className="font-bold text-emerald-600"> would </span> + <span className="font-bold text-purple-600">[Verbo base]</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-800 font-semibold text-left"><span className="font-bold">¡La regla de oro!</span><br/>La palabra <strong className="text-emerald-600">would</strong> <strong className="font-bold">NUNCA cambia.</strong> ¡Es la misma para todos los sujetos!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:hidden"><MobileSentenceBuilder steps={steps} partialSentence={partialSentence} fullSentenceEs={fullSentenceEs} isComplete={isComplete}/></div>
            
            <div className="hidden lg:block">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Would</div>
                <div className="text-gray-500 text-lg font-medium">[Sujeto] + would + [verbo base] + [extra]</div>
              </div>
              <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)', borderRadius: selectedSubject ? '0px' : '12px 0 0 12px', boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>{selectedSubject?.label || 'Sujeto'}</motion.div>
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #10b981, #059669)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)', marginLeft: '-12px', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedSubject ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>would</motion.div>
                <motion.div whileHover={selectedVerb ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedVerb ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>{selectedVerb?.label || 'verbo base'}</motion.div>
                <motion.div whileHover={selectedExtra ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedExtra ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedExtra ? 'linear-gradient(145deg, #14b8a6, #0d9488)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)', borderRadius: '0 12px 12px 0', boxShadow: selectedExtra ? '0 8px 25px rgba(20, 184, 166, 0.25), 0 3px 0 rgba(13, 148, 136, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>{selectedExtra?.label || 'extra'}</motion.div>
              </div>
              <motion.div className="rounded-2xl p-7 text-center border mb-8" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }} animate={isComplete ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.6 }}>
                {isComplete ? (<div><div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{fullSentenceEs}</div><div className="text-lg text-gray-500 font-medium italic">({partialSentence})</div></div>) : (<div className="text-gray-400 text-lg font-medium">Selecciona sujeto, verbo y extra</div>)}
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div><div className="space-y-2">{subjectOptions.map((option) => (<motion.button key={option.key} onClick={() => handleSubjectSelect(option)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedSubject?.key === option.key ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject?.key === option.key ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos</div><div className="space-y-2">{verbOptions.map((option) => (<motion.button key={option.key} onClick={() => handleVerbSelect(option as VerbWithExtra)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedVerb?.key === option.key ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb?.key === option.key ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className={`rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedVerb ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Extra</div><div className="space-y-2">{availableExtras.map((option) => (<motion.button key={option.key} onClick={() => handleExtraSelect(option as StepOption)} disabled={!selectedVerb} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedExtra?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedExtra?.key === option.key ? 'linear-gradient(145deg, #14b8a6, #0d9488)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedExtra?.key === option.key ? '#0d9488' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedExtra?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎯 ¡Muy bien!</h3>
                <p className="text-green-700">Ahora sabes cómo usar &quot;would&quot; para situaciones hipotéticas y ser más educado.</p>
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

export default Level8Page;