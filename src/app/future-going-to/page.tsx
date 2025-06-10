'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { MobileSentenceBuilder, StepConfig, StepOption } from '../../components/game/MobileSentenceBuilder';
import { ShareButton } from '../../components/game/ShareButton';

// --- DATA DEFINITIONS FOR LEVEL 6 (EXPANDED & MORE USEFUL) ---
const subjectOptions: StepOption[] = [
  { key: 'I', label: 'I', es: 'Yo', aux: 'am going to', spanishAux: 'voy a' },
  { key: 'You', label: 'You', es: 'Tú', aux: 'are going to', spanishAux: 'vas a' },
  { key: 'He', label: 'He', es: 'Él', aux: 'is going to', spanishAux: 'va a' },
  { key: 'She', label: 'She', es: 'Ella', aux: 'is going to', spanishAux: 'va a' },
  { key: 'We', label: 'We', es: 'Nosotros', aux: 'are going to', spanishAux: 'vamos a' },
  { key: 'They', label: 'They', es: 'Ellos', aux: 'are going to', spanishAux: 'van a' }
];

interface VerbWithExtra extends StepOption {
  extras: StepOption[];
}

const verbOptions: VerbWithExtra[] = [
  { key: 'watch', label: 'watch', es: 'ver',
    extras: [
      { key: 'a movie', label: 'a movie', es: 'una película' }, { key: 'the game', label: 'the game', es: 'el partido' },
      { key: 'a new series', label: 'a new series', es: 'una serie nueva' }, { key: 'TV tonight', label: 'TV tonight', es: 'tele esta noche' },
      { key: 'a documentary', label: 'a documentary', es: 'un documental' }, { key: 'the sunset', label: 'the sunset', es: 'el atardecer' }
    ]
  },
  { key: 'visit', label: 'visit', es: 'visitar',
    extras: [
      { key: 'my family', label: 'my family', es: 'a mi familia' }, { key: 'my friends', label: 'my friends', es: 'a mis amigos' },
      { key: 'a museum', label: 'a museum', es: 'un museo' }, { key: 'another city', label: 'another city', es: 'otra ciudad' },
      { key: 'the doctor', label: 'the doctor', es: 'al doctor' }, { key: 'my grandparents', label: 'my grandparents', es: 'a mis abuelos' }
    ]
  },
  { key: 'study', label: 'study', es: 'estudiar',
    extras: [
      { key: 'English', label: 'English', es: 'inglés' }, { key: 'for the exam', label: 'for the exam', es: 'para el examen' },
      { key: 'more often', label: 'more often', es: 'más seguido' }, { key: 'at the library', label: 'at the library', es: 'en la biblioteca' },
      { key: 'with friends', label: 'with friends', es: 'con amigos' }, { key: 'tonight', label: 'tonight', es: 'esta noche' }
    ]
  },
  { key: 'eat', label: 'eat', es: 'comer',
    extras: [
      { key: 'pizza', label: 'pizza', es: 'pizza' }, { key: 'at home', label: 'at home', es: 'en casa' },
      { key: 'something healthy', label: 'something healthy', es: 'algo saludable' }, { key: 'with my family', label: 'with my family', es: 'con mi familia' },
      { key: 'in that restaurant', label: 'in that restaurant', es: 'en ese restaurante' }, { key: 'later', label: 'later', es: 'más tarde' }
    ]
  },
  { key: 'start', label: 'start', es: 'empezar',
    extras: [
      { key: 'a new project', label: 'a new project', es: 'un proyecto nuevo' }, { key: 'a new book', label: 'a new book', es: 'un libro nuevo' },
      { key: 'exercising', label: 'exercising', es: 'a hacer ejercicio' }, { key: 'my homework', label: 'my homework', es: 'mi tarea' },
      { key: 'a new course', label: 'a new course', es: 'un curso nuevo' }, { key: 'soon', label: 'soon', es: 'pronto' }
    ]
  },
  { key: 'buy', label: 'buy', es: 'comprar',
    extras: [
      { key: 'a new phone', label: 'a new phone', es: 'un teléfono nuevo' }, { key: 'groceries', label: 'groceries', es: 'el mandado' },
      { key: 'a gift', label: 'a gift', es: 'un regalo' }, { key: 'new shoes', label: 'new shoes', es: 'zapatos nuevos' },
      { key: 'a coffee', label: 'a coffee', es: 'un café' }, { key: 'the tickets', label: 'the tickets', es: 'los boletos' }
    ]
  }
];

// --- LEVEL 6 COMPONENT ---
const Level6Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  const [selectedSubject, setSelectedSubject] = useState<StepOption | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<VerbWithExtra | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<StepOption | null>(null);
  const [availableExtras, setAvailableExtras] = useState<StepOption[]>([]);

  const handleSubjectSelect = (option: StepOption) => {
    setSelectedSubject(option);
  };
  
  const handleVerbSelect = (option: VerbWithExtra) => {
    setSelectedVerb(option);
    setAvailableExtras(option.extras);
    setSelectedExtra(null);
  };

  const handleExtraSelect = (option: StepOption) => setSelectedExtra(option);

  const handleNextLevel = () => {
    trackLevelCompletion(5);
    router.push('/pasado-simple'); 
  };

  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedExtra) return null;
    return `${selectedSubject.es} ${selectedSubject.spanishAux} ${selectedVerb.es} ${selectedExtra.es}`;
  };

  const partialSentence = [
    selectedSubject?.label, selectedSubject?.aux, selectedVerb?.label, selectedExtra?.label
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
      colorClasses: { bg: 'bg-green-100', selectedBg: 'bg-green-500', border: 'border-green-400', accent: 'text-green-600' },
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="hidden sm:inline">Back to Map</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Level 5: Futuro con &quot;Going to&quot;</h1>
          <div className="w-24" />
        </div>
      </header>
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-4 lg:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #c7d2fe 100%)', borderColor: 'rgba(79, 70, 229, 0.2)', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #c7d2fe 100%)', borderColor: 'rgba(79, 70, 229, 0.2)', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
  <div className="p-8">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #6366f1, #4f46e5)', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)' }}>
        <span className="text-3xl">🧠</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">La Gran Duda: ¿Will o Going to?</h3>
      <p className="text-gray-600 text-lg mb-6">
        Ambos hablan del futuro, pero la diferencia está en <strong className="font-semibold">cuándo tomaste la decisión</strong>.
      </p>

      {/* COMPARACIÓN MEJORADA */}
      <div className="text-left bg-white/60 rounded-xl border border-gray-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Columna WILL */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚡️</span>
              <p className="font-bold text-gray-700">Futuro con &quot;Will&quot;</p>
            </div>
            <p className="text-gray-600 font-semibold">Decisión en el momento.</p>
            <p className="text-gray-600 text-sm">Lo decides <strong className="font-medium">mientras hablas</strong>. No era un plan.</p>
            <div className="mt-2 text-sm text-gray-500 italic bg-gray-100 p-2 rounded-lg">
              <p>— &quot;The phone is ringing.&quot; (El teléfono suena)</p>
              <p>— &quot;<strong className="text-gray-800">I will get it!</strong>&quot; (¡Yo contesto!)</p>
            </div>
          </div>

          {/* Columna GOING TO */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📅</span>
              <p className="font-bold text-gray-700">Futuro con &quot;Going to&quot;</p>
            </div>
            <p className="text-gray-600 font-semibold">Plan o intención previa.</p>
            <p className="text-gray-600 text-sm">Ya lo habías pensado <strong className="font-medium">antes de hablar</strong>.</p>
             <div className="mt-2 text-sm text-gray-500 italic bg-gray-100 p-2 rounded-lg">
              <p>— &quot;Do you have plans for the weekend?&quot; (¿Tienes planes?)</p>
              <p>— &quot;Yes, <strong className="text-gray-800">I am going to visit</strong> my parents.&quot; (Sí, voy a visitar a mis padres)</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-lg mb-4">En este nivel, practicarás cómo hablar de tus <strong className="font-semibold">planes</strong> con <strong className="font-semibold">&quot;Going to&quot;</strong>:</p>
      
      {/* El Patrón */}
      <div className="bg-white/60 rounded-lg p-3 text-lg font-mono tracking-wide text-gray-700 border border-gray-200 mb-6">
        <span className="font-bold text-blue-600">[Sujeto]</span> + 
        <span className="font-bold text-emerald-600"> [am/is/are] </span> + 
        <span className="font-bold"> going to </span> + 
        <span className="font-bold text-purple-600">[Verbo]</span>
      </div>
      
      {/* NOTA CLAVE de conjugación */}
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <p className="text-emerald-800 font-semibold text-left">
          <span className="font-bold">¡Recuerda la conjugación del verbo &quot;to be&quot;!</span><br/>
          <strong className="text-emerald-600">am</strong> → para <strong className="font-bold">I</strong><br/>
          <strong className="text-emerald-600">is</strong> → para <strong className="font-bold">He, She, It</strong><br/>
          <strong className="text-emerald-600">are</strong> → para <strong className="font-bold">You, We, They</strong>
        </p>
      </div>

    </div>
  </div>
</div>
            </div>
            
            <div className="lg:hidden">
              <MobileSentenceBuilder steps={steps} partialSentence={partialSentence} fullSentenceEs={fullSentenceEs} isComplete={isComplete}/>
            </div>
            
            <div className="hidden lg:block">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Futuro con &quot;Going to&quot;</div>
                <div className="text-gray-500 text-lg font-medium">[Sujeto] + [am/is/are going to] + [verbo] + [extra]</div>
              </div>
              <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none', borderRadius: selectedSubject ? '0px' : '12px 0 0 12px', boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.label || 'Sujeto'}
                </motion.div>
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #10b981, #059669)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginLeft: '-12px', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedSubject ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.aux || 'am/is/are...'}
                </motion.div>
                <motion.div whileHover={selectedVerb ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedVerb ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedVerb ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedVerb?.label || 'verbo'}
                </motion.div>
                <motion.div whileHover={selectedExtra ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-0 ${selectedExtra ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedExtra ? 'linear-gradient(145deg, #22c55e, #16a34a)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedExtra ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', borderRadius: '0px', boxShadow: selectedExtra ? '0 8px 25px rgba(34, 197, 94, 0.25), 0 3px 0 rgba(22, 163, 74, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedExtra?.label || 'extra'}
                </motion.div>
              </div>
              <motion.div className="rounded-2xl p-7 text-center border mb-8" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }} animate={isComplete ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.6 }}>
                {isComplete ? (<div><div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{fullSentenceEs}</div><div className="text-lg text-gray-500 font-medium italic">({partialSentence})</div></div>) : (<div className="text-gray-400 text-lg font-medium">Completa los 3 pasos para crear una oración</div>)}
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div><div className="space-y-2">{subjectOptions.map((option) => (<motion.button key={option.key} onClick={() => handleSubjectSelect(option)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedSubject?.key === option.key ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject?.key === option.key ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos</div><div className="space-y-2">{verbOptions.map((option) => (<motion.button key={option.key} onClick={() => handleVerbSelect(option as VerbWithExtra)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedVerb?.key === option.key ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb?.key === option.key ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className={`rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedVerb ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Extra</div><div className="space-y-2">{availableExtras.map((option) => (<motion.button key={option.key} onClick={() => handleExtraSelect(option)} disabled={!selectedVerb} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedExtra?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedExtra?.key === option.key ? 'linear-gradient(145deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedExtra?.key === option.key ? '#16a34a' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedExtra?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎯 ¡Muy bien!</h3>
                <p className="text-green-700">Ahora sabes cómo usar el futuro con &quot;going to&quot; para hablar de tus planes.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
          <ShareButton
  title="¡Tengo un plan! Aprender inglés."
  text="Estoy practicando el futuro con 'going to' en FluentBlocks para hablar de mis intenciones."
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

export default Level6Page;