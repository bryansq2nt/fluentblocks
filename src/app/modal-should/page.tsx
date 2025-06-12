'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useFeedback } from '../../components/game/FeedbackProvider';
import { MobileSentenceBuilder, StepConfig, StepOption } from '../../components/game/MobileSentenceBuilder';
import { ShareButton } from '../../components/game/ShareButton';
import { AudioPlayer } from '../../components/game/AudioPlayer';
import { useSession } from 'next-auth/react';

// --- DATA DEFINITIONS FOR LEVEL 9 (SHOULD) ---
const subjectOptions: StepOption[] = [
  { key: 'I', label: 'I', es: 'Yo' }, 
  { key: 'You', label: 'You', es: 'Tú' }, 
  { key: 'He', label: 'He', es: 'Él' },
  { key: 'She', label: 'She', es: 'Ella' }, 
  { key: 'We', label: 'We', es: 'Nosotros' }, 
  { key: 'They', label: 'They', es: 'Ellos/Ellas' }
];

interface VerbWithExtra extends StepOption {
  es_inf: string;
  extras: StepOption[];
}

const verbOptions: VerbWithExtra[] = [
  { key: 'rest', label: 'rest', es_inf: 'descansar',
    extras: [
      { key: 'if you are tired', label: 'if you are tired', es: 'si estás cansado' },
      { key: 'a little bit', label: 'a little bit', es: 'un poco' },
      { key: 'more on weekends', label: 'more on weekends', es: 'más los fines de semana' },
      { key: 'before the trip', label: 'before the trip', es: 'antes del viaje' },
      { key: 'for a while', label: 'for a while', es: 'por un rato' },
    ]
  },
  { key: 'drink', label: 'drink', es_inf: 'beber',
    extras: [
      { key: 'more water', label: 'more water', es: 'más agua' },
      { key: 'less soda', label: 'less soda', es: 'menos refresco' },
      { key: 'a cup of tea', label: 'a cup of tea', es: 'una taza de té' },
      { key: 'something hot', label: 'something hot', es: 'algo caliente' },
      { key: 'eight glasses a day', label: 'eight glasses a day', es: 'ocho vasos al día' },
    ]
  },
  { key: 'talk', label: 'talk', es_inf: 'hablar',
    extras: [
      { key: 'to a friend', label: 'to a friend', es: 'con un amigo' },
      { key: 'to your parents', label: 'to your parents', es: 'con tus padres' },
      { key: 'about it', label: 'about it', es: 'sobre eso' },
      { key: 'to the teacher', label: 'to the teacher', es: 'con el profesor' },
      { key: 'more clearly', label: 'more clearly', es: 'más claramente' },
    ]
  },
  { key: 'study', label: 'study', es_inf: 'estudiar',
    extras: [
      { key: 'more for the exam', label: 'more for the exam', es: 'más para el examen' },
      { key: 'every day', label: 'every day', es: 'todos los días' },
      { key: 'with a group', label: 'with a group', es: 'con un grupo' },
      { key: 'in a quiet place', label: 'in a quiet place', es: 'en un lugar tranquilo' },
      { key: 'the first lesson', label: 'the first lesson', es: 'la primera lección' },
    ]
  },
  { key: 'eat', label: 'eat', es_inf: 'comer',
    extras: [
      { key: 'more fruits', label: 'more fruits', es: 'más frutas' },
      { key: 'something healthy', label: 'something healthy', es: 'algo saludable' },
      { key: 'before you go', label: 'before you go', es: 'antes de irte' },
      { key: 'less junk food', label: 'less junk food', es: 'menos comida chatarra' },
      { key: 'a good breakfast', label: 'a good breakfast', es: 'un buen desayuno' },
    ]
  },
  { key: 'go', label: 'go', es_inf: 'ir',
    extras: [
      { key: 'to the doctor', label: 'to the doctor', es: 'al doctor' },
      { key: 'to bed earlier', label: 'to bed earlier', es: 'a la cama más temprano' },
      { key: 'to the gym', label: 'to the gym', es: 'al gimnasio' },
      { key: 'for a walk', label: 'for a walk', es: 'a caminar' },
      { key: 'outside', label: 'outside', es: 'afuera' },
    ]
  }
];

// --- LEVEL 9 COMPONENT ---
const Level9Page = () => {
  const router = useRouter();
  const { trackLevelCompletion, setShowFeedbackModal, hasShownFeedback } = useFeedback();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

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

  const handleNextLevel = async () => {
    if (!session?.user) {
      router.push('/');
      return;
    }
    setSaving(true);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          levelId: 'modal-should',
          completed: true,
          score: 100,
          attempts: 1
        })
      });
      trackLevelCompletion(10);
      router.push('/map'); 
    } catch (e) {
      alert('Error guardando el progreso');
    } finally {
      setSaving(false);
    }
  };

  const getSmartTranslation = () => {
    if (!selectedSubject || !selectedVerb || !selectedExtra) return null;

    const subjectEs = selectedSubject.es;
    const verbInf = selectedVerb.es_inf;
    const extraEs = selectedExtra.es;

    const conjugations: {[key: string]: string} = {
      I: 'debería', You: 'deberías', He: 'debería', She: 'debería', We: 'deberíamos', They: 'berían'
    };
    let conjugatedShould = conjugations[selectedSubject.key] || 'debería';
    // Fix para 'They' -> 'Ellos deberían'
    if (selectedSubject.key === 'They') {
      conjugatedShould = 'deberían';
    }
    
    return `${subjectEs} ${conjugatedShould} ${verbInf} ${extraEs}`;
  };

  const partialSentence = [
    selectedSubject?.label, selectedSubject ? 'should' : null, selectedVerb?.label, selectedExtra?.label
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
      colorClasses: { bg: 'bg-rose-100', selectedBg: 'bg-rose-500', border: 'border-rose-400', accent: 'text-rose-600' },
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    
    {/* Botón Izquierdo (sin cambios) */}
    <div className="flex-1 flex justify-start">
      <button type="button" onClick={() => router.push('/map')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back to Map</span>
      </button>
    </div>

    {/* --- SECCIÓN CENTRAL MODIFICADA --- */}
    <div className="flex-1 flex items-center justify-center gap-2">
      <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">Level 10: Should</h1>
      {/* Reproductor para la palabra clave del nivel */}
      <div className="scale-75"> {/* Hacemos el reproductor un poco más pequeño */}
        <AudioPlayer sentence="Should" />
      </div>
    </div>
    
    {/* Contenedor Derecho (para mantener el centrado) */}
    <div className="flex-1" />

  </div>
</header>
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-4 lg:p-8 w-full shadow-2xl border" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
            <div className="mb-8 rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', borderColor: 'rgba(244, 63, 94, 0.2)', boxShadow: '0 10px 25px rgba(244, 63, 94, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(145deg, #f43f5e, #e11d48)', boxShadow: '0 8px 20px rgba(244, 63, 94, 0.3)' }}>
                    <span className="text-3xl">🦉</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Qué significa &quot;Should&quot;?</h3>
                  <p className="text-gray-600 text-lg mb-6">&quot;Should&quot; es el verbo modal para dar <strong className="font-semibold">consejos y recomendaciones</strong>. Es tu &quot;deberías&quot; en español.</p>
                  <div className="text-left bg-white/60 rounded-xl border border-gray-200 p-4 mb-8">
                    <h4 className="text-lg font-bold text-center text-gray-800 mb-3">Should = Deberías</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div><p className="text-gray-700">Tú comes → <strong className="text-gray-900">You eat</strong></p><p className="text-gray-700">Tú deber<strong className="text-rose-700 font-bold">ías</strong> comer → <strong className="text-gray-900">You should eat</strong></p></div>
                      <div><p className="text-gray-700">Ella descansa → <strong className="text-gray-900">She rests</strong></p><p className="text-gray-700">Ella deber<strong className="text-rose-700 font-bold">ía</strong> descansar → <strong className="text-gray-900">She should rest</strong></p></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-4">Usa este patrón para dar buenos consejos:</p>
                  <div className="bg-white/60 rounded-lg p-3 text-lg font-mono tracking-wide text-gray-700 border border-gray-200 mb-6">
                    <span className="font-bold text-blue-600">[Sujeto]</span> + <span className="font-bold text-emerald-600"> should </span> + <span className="font-bold text-purple-600">[Verbo base]</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-800 font-semibold text-left"><span className="font-bold">¡La regla de oro!</span><br/>La palabra <strong className="text-emerald-600">should</strong> <strong className="font-bold">NUNCA cambia.</strong> ¡Es la misma para todos los sujetos!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:hidden"><MobileSentenceBuilder audioPlayer={isComplete ? <AudioPlayer sentence={partialSentence} /> : null} steps={steps} partialSentence={partialSentence} fullSentenceEs={fullSentenceEs} isComplete={isComplete}/></div>
            
            <div className="hidden lg:block">
            <div className="text-center mb-8">
  {/* Contenedor Flex para alinear el título y el reproductor */}
  <div className="flex items-center justify-center gap-3 mb-2">
    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Patrón: Should</h2>
    <AudioPlayer sentence="Should" />
  </div>
  <div className="text-gray-500 text-lg font-medium">[Sujeto] + should + [verbo base] + [extra]</div>
</div>
              <div className="flex justify-center items-center gap-0 mb-10 flex-wrap min-h-[80px]">
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-40 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 0% 100%)', borderRadius: selectedSubject ? '0px' : '12px 0 0 12px', boxShadow: selectedSubject ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 3px 0 rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>{selectedSubject?.label || 'Sujeto'}</motion.div>
                <motion.div whileHover={selectedSubject ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-30 ${selectedSubject ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedSubject ? 'linear-gradient(145deg, #10b981, #059669)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)', marginLeft: '-12px', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedSubject ? '0 8px 25px rgba(16, 185, 129, 0.25), 0 3px 0 rgba(5, 150, 105, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>should</motion.div>
                <motion.div whileHover={selectedVerb ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-20 ${selectedVerb ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedVerb ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 20%, 10% 20%, 15% 0%, 85% 0%, 90% 20%, 100% 20%, 100% 80%, 90% 80%, 85% 100%, 15% 100%, 10% 80%, 0% 80%)', marginRight: '-12px', borderRadius: '0px', boxShadow: selectedVerb ? '0 8px 25px rgba(139, 92, 246, 0.25), 0 3px 0 rgba(124, 58, 237, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>{selectedVerb?.label || 'verbo base'}</motion.div>
                <motion.div whileHover={selectedExtra ? { y: -2 } : {}} className={`text-black px-7 py-4 font-semibold text-lg relative min-w-[140px] text-center transition-all duration-400 h-[60px] flex items-center justify-center z-10 ${selectedExtra ? 'text-white shadow-lg' : 'text-gray-400 border-2 border-dashed border-gray-300 shadow-sm'}`} style={{ background: selectedExtra ? 'linear-gradient(145deg, #f43f5e, #e11d48)' : 'linear-gradient(145deg, #f8fafc, #e2e8f0)', clipPath: 'polygon(0% 20%, 10% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 10% 80%, 0% 80%)', borderRadius: '0 12px 12px 0', boxShadow: selectedExtra ? '0 8px 25px rgba(244, 63, 94, 0.25), 0 3px 0 rgba(225, 29, 72, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)' }}>{selectedExtra?.label || 'extra'}</motion.div>
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
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Sujetos</div><div className="space-y-2">{subjectOptions.map((option) => (<motion.button key={option.key} onClick={() => handleSubjectSelect(option)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedSubject?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedSubject?.key === option.key ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedSubject?.key === option.key ? '#2563eb' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedSubject?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className="rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Verbos</div><div className="space-y-2">{verbOptions.map((option) => (<motion.button key={option.key} onClick={() => handleVerbSelect(option as VerbWithExtra)} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedVerb?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedVerb?.key === option.key ? 'linear-gradient(145deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedVerb?.key === option.key ? '#7c3aed' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedVerb?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
                <div className={`rounded-2xl p-6 min-w-[200px] flex-1 border shadow-lg transition-opacity duration-300 ${!selectedVerb ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`} style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}><div className="text-gray-700 text-lg font-bold text-center mb-4">Extra</div><div className="space-y-2">{availableExtras.map((option) => (<motion.button key={option.key} onClick={() => handleExtraSelect(option as StepOption)} disabled={!selectedVerb} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }} className={`w-full px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border ${selectedExtra?.key === option.key ? 'text-white transform scale-95' : 'text-gray-700 border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-gray-300'}`} style={{ background: selectedExtra?.key === option.key ? 'linear-gradient(145deg, #f43f5e, #e11d48)' : 'rgba(255, 255, 255, 0.9)', borderColor: selectedExtra?.key === option.key ? '#e11d48' : 'rgba(0, 0, 0, 0.06)', boxShadow: selectedExtra?.key === option.key ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.5) inset' }}>{option.label}</motion.button>))}</div></div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎯 ¡Muy bien!</h3>
                <p className="text-green-700">Ahora sabes cómo usar &quot;should&quot; para dar consejos y hacer recomendaciones.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
          <ShareButton
  title="Un buen consejo: ¡Prueba FluentBlocks!"
  text="Aprendiendo a dar recomendaciones y consejos con 'should'. ¡Deberías probarlo!"
/>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNextLevel} disabled={saving} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
              <span>{saving ? 'Guardando...' : 'Siguiente Ejercicio'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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

export default Level9Page;