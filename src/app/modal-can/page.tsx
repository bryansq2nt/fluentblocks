'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { MobileSentenceBuilder, StepConfig, StepOption } from '../../components/game/MobileSentenceBuilder';
import { ShareButton } from '../../components/game/ShareButton';

// --- DATA DEFINITIONS FOR LEVEL 5 (EXPANDED & MORE USEFUL) ---
const subjectOptions: StepOption[] = [
  { key: 'I', label: 'I', es: 'Yo' }, { key: 'You', label: 'You', es: 'Tú' }, { key: 'He', label: 'He', es: 'Él' },
  { key: 'She', label: 'She', es: 'Ella' }, { key: 'We', label: 'We', es: 'Nosotros' }, { key: 'They', label: 'They', es: 'Ellos/Ellas' }
];

interface VerbWithExtra extends StepOption {
  es: string; // Verbo en infinitivo para la traducción
  extras: StepOption[];
}

const verbOptions: VerbWithExtra[] = [
  { key: 'speak', label: 'speak', es: 'hablar', 
    extras: [
      { key: 'English', label: 'English', es: 'inglés' }, { key: 'two languages', label: 'two languages', es: 'dos idiomas' },
      { key: 'fluently', label: 'fluently', es: 'con fluidez' }, { key: 'in public', label: 'in public', es: 'en público' },
      { key: 'clearly', label: 'clearly', es: 'claramente' }, { key: 'with her', label: 'with her', es: 'con ella' }
    ]
  },
  { key: 'cook', label: 'cook', es: 'cocinar', 
    extras: [
      { key: 'pasta', label: 'pasta', es: 'pasta' }, { key: 'very well', label: 'very well', es: 'muy bien' },
      { key: 'dinner tonight', label: 'dinner tonight', es: 'la cena esta noche' }, { key: 'for ten people', label: 'for ten people', es: 'para diez personas' },
      { key: 'without a recipe', label: 'without a recipe', es: 'sin receta' }, { key: 'something simple', label: 'something simple', es: 'algo simple' }
    ]
  },
  { key: 'play', label: 'play', es: 'jugar',
    extras: [
      { key: 'soccer', label: 'soccer', es: 'fútbol' }, { key: 'the guitar', label: 'the guitar', es: 'la guitarra' },
      { key: 'chess', label: 'chess', es: 'ajedrez' }, { key: 'the piano', label: 'the piano', es: 'el piano' },
      { key: 'video games', label: 'video games', es: 'videojuegos' }, { key: 'on the team', label: 'on the team', es: 'en el equipo' }
    ]
  },
  { key: 'run', label: 'run', es: 'correr', 
    extras: [
      { key: 'fast', label: 'fast', es: 'rápido' }, { key: 'a marathon', label: 'a marathon', es: 'un maratón' },
      { key: 'for an hour', label: 'for an hour', es: 'por una hora' }, { key: 'every morning', label: 'every morning', es: 'cada mañana' },
      { key: 'in the park', label: 'in the park', es: 'en el parque' }, { key: 'without stopping', label: 'without stopping', es: 'sin parar' }
    ]
  },
  { key: 'see', label: 'see', es: 'ver',
    extras: [
      { key: 'the difference', label: 'the difference', es: 'la diferencia' }, { key: 'the screen', label: 'the screen', es: 'la pantalla' },
      { key: 'you tomorrow', label: 'you tomorrow', es: 'te mañana' }, { key: 'without glasses', label: 'without glasses', es: 'sin lentes' },
      { key: 'the mountains', label: 'the mountains', es: 'las montañas' }, { key: 'what you mean', label: 'what you mean', es: 'lo que quieres decir' }
    ]
  },
  { key: 'help', label: 'help', es: 'ayudar', 
    extras: [
      { key: 'you', label: 'you', es: 'te' }, { key: 'me', label: 'me', es: 'me' },
      { key: 'with this', label: 'with this', es: 'con esto' }, { key: 'my friends', label: 'my friends', es: 'a mis amigos' },
      { key: 'if you want', label: 'if you want', es: 'si quieres' }, { key: 'later', label: 'later', es: 'más tarde' }
    ]
  }
];

// --- LEVEL 5 COMPONENT ---
const Level5Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();

  const [selectedSubject, setSelectedSubject] = useState<StepOption | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<VerbWithExtra | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<StepOption | null>(null);
  const [availableExtras, setAvailableExtras] = useState<StepOption[]>([]);

  const handleSubjectSelect = (option: StepOption) => setSelectedSubject(option);
  
  const handleVerbSelect = (option: VerbWithExtra) => {
    setSelectedVerb(option);
    setAvailableExtras(option.extras || []);
    setSelectedExtra(null);
  };

  const handleExtraSelect = (option: StepOption) => setSelectedExtra(option);

  const handleNextLevel = () => {
    trackLevelCompletion(7);
    router.push('/modal-could'); 
  };

  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedExtra) return null;
    const poderConjugations: { [key: string]: string } = {
      'I': 'puedo', 'You': 'puedes', 'He': 'puede', 'She': 'puede', 'We': 'podemos', 'They': 'pueden',
    };
    const spanishPoder = poderConjugations[selectedSubject.key] || 'puede';
    const verbText = (selectedVerb.key === 'play' && (selectedExtra.key === 'the guitar' || selectedExtra.key === 'the piano')) ? 'tocar' : selectedVerb.es;

    return `${selectedSubject.es} ${spanishPoder} ${verbText} ${selectedExtra.es}`;
  };

  const partialSentence = [
    selectedSubject?.label, selectedSubject ? 'can' : null, selectedVerb?.label, selectedExtra?.label
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
      colorClasses: { bg: 'bg-pink-100', selectedBg: 'bg-pink-500', border: 'border-pink-400', accent: 'text-pink-600' },
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="hidden sm:inline">Back to Map</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Level 7: Can (Ability)</h1>
          <div className="w-24" />
        </div>
      </header>
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-4 lg:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)', borderColor: 'rgba(236, 72, 153, 0.2)', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #ec4899, #db2777)', boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)' }}>
                    <span className="text-3xl">💪</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Qué vas a aprender?</h3>
                  <p className="text-gray-600 text-lg mb-6">A expresar <strong className="font-semibold">habilidades</strong> o cosas que son <strong className="font-semibold">posibles</strong>.</p>
                  <div className="bg-white/60 rounded-lg p-3 text-lg font-mono tracking-wide text-gray-700 border border-gray-200">
                    <span className="font-bold text-blue-600">[Sujeto]</span> + 
                    <span className="font-bold text-emerald-600"> can </span> + 
                    <span className="font-bold text-purple-600">[Verbo base]</span>
                  </div>
                  <p className="mt-6 font-semibold text-gray-700">Por ejemplo:</p>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">&quot;She can speak English&quot;</p>
                    <p className="text-lg text-gray-600 italic">Ella puede hablar inglés</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/80 max-w-sm mx-auto">
                    <ul className="text-left space-y-2 text-gray-600 text-lg">
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-blue-600">She</strong><span>→ Sujeto (Ella)</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-emerald-600">can</strong><span>→ Verbo modal (poder)</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-purple-600">speak</strong><span>→ Verbo base (hablar)</span></li>
                      <li className="flex items-center gap-4"><strong className="w-1/3 font-semibold text-pink-600">English</strong><span>→ Extra (inglés)</span></li>
                    </ul>
                  </div>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-800 font-semibold text-left">
                      <span className="font-bold">¡Lo más fácil de &quot;Can&quot;!</span><br/>
                      La palabra <strong className="text-emerald-600">can</strong> <strong className="font-bold">NUNCA cambia.</strong> Se usa la misma para todos los sujetos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:hidden">
              <MobileSentenceBuilder steps={steps} partialSentence={partialSentence} fullSentenceEs={fullSentenceEs} isComplete={isComplete}/>
            </div>
            
            <div className="hidden lg:block">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Patrón: Can (Ability)</div>
                <div className="text-gray-500 text-lg font-medium">[Sujeto] + can + [verbo base] + [extra]</div>
              </div>
              <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)' : 'none', borderRadius: selectedSubject ? '0px' : '12px 0 0 12px', boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedSubject?.label || 'Sujeto'}
                </motion.div>
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #10b981, #059669)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedSubject ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginLeft: '-12px', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedSubject ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  can
                </motion.div>
                <motion.div whileHover={selectedVerb ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedVerb ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedVerb ? 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedVerb?.label || 'verbo base'}
                </motion.div>
                <motion.div whileHover={selectedExtra ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedExtra ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedExtra ? 'linear-gradient(145deg, #ec4899, #db2777)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: selectedExtra ? 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)' : 'none', borderRadius: '0px', boxShadow: selectedExtra ? '0 8px 25px rgba(236, 72, 153, 0.25), 0 3px 0 rgba(219, 39, 119, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>
                  {selectedExtra?.label || 'extra'}
                </motion.div>
              </div>
              <motion.div className="rounded-2xl p-7 text-center border mb-8" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }} animate={isComplete ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.6 }}>
                {isComplete ? (<div><div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{fullSentenceEs}</div><div className="text-lg text-gray-500 font-medium italic">({partialSentence})</div></div>) : (<div className="text-gray-400 text-lg font-medium">Selecciona un sujeto, verbo y extra</div>)}
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div><div className="space-y-2">{subjectOptions.map((option) => (<motion.button key={option.key} onClick={() => handleSubjectSelect(option)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedSubject?.key === option.key ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject?.key === option.key ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos</div><div className="space-y-2">{verbOptions.map((option) => (<motion.button key={option.key} onClick={() => handleVerbSelect(option as VerbWithExtra)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedVerb?.key === option.key ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb?.key === option.key ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className={`rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedVerb ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Extra</div><div className="space-y-2">{availableExtras.map((option) => (<motion.button key={option.key} onClick={() => handleExtraSelect(option)} disabled={!selectedVerb} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedExtra?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedExtra?.key === option.key ? 'linear-gradient(145deg, #ec4899, #db2777)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedExtra?.key === option.key ? '#db2777' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedExtra?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎯 ¡Muy bien!</h3>
                <p className="text-green-700">Ahora ya sabes cómo usar &quot;can&quot; para expresar habilidad.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
          <ShareButton
  title="¡Claro que puedo!"
  text="Aprendiendo a expresar mis habilidades con el verbo modal 'can' en FluentBlocks."
/>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNextLevel} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
            <span>Siguiente Ejercicio</span>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
            </motion.button>
            {!hasShownFeedback && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFeedbackModal(true)} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <span>Enviar Feedback</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </motion.button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level5Page;