'use client';

import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react'; // CAMBIO: Importar el ícono de Check
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import { useExerciseTracking } from '../../context/ExerciseTrackingContext';


interface Message {
  text: string;
  list?: string[];
}

interface LessonIntroProps {
  icon: React.ReactNode;
  title: string;
  messages: Message[];
  onComplete: () => void;
}

export const LessonIntro: React.FC<LessonIntroProps> = ({ icon, title, messages, onComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const { trackInteraction } = useExerciseTracking();



  const handleNext = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex(prev => prev + 1);
    } else {
      trackInteraction({
        type: 'INTRO_COMPLETE',
        timestamp: Date.now(),
        data: {
          title,
          totalMessages: messages.length,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          timeSpent: Date.now() - (window as any).__introStartTime
        }
      });
      onComplete();
    }
  };

  const handleSkip = () => {
    trackInteraction({
      type: 'INTRO_SKIPPED',
      timestamp: Date.now(),
      data: {
        title,
        currentMessageIndex: messageIndex,
        totalMessages: messages.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeSpent: Date.now() - (window as any).__introStartTime
      }
    });
    onComplete();
  };

  const isLastMessage = messageIndex === messages.length - 1;
  const currentMessage = messages[messageIndex];


const parserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode.type !== 'tag') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = (domNode.children[0] as any)?.data || '';

    switch (domNode.name) {
      case 'english':
        return <span className="text-blue-600 font-semibold">{text}</span>;
      case 'spanish':
        return <span className="text-green-600 font-semibold">{text}</span>;
      case 'mistake':
        return <span className="text-red-600 font-semibold">{text}</span>;
      case 'strong':
        return <strong className="font-bold">{text}</strong>;
      default:
        return;
    }
  }
};

function RenderText({ text }: { text: string }) {
  return <>{parse(text, parserOptions)}</>;
}

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        // CAMBIO: Se añade `relative` para posicionar el botón de saltar
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {/* CAMBIO: Botón para saltar la introducción */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 text-sm text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded"
          aria-label="Saltar introducción"
        >
          Saltar
        </button>

        <div className="mb-4 text-5xl">{icon}</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">{title}</h1>

        <div className="min-h-[120px] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
  <motion.div
    key={messageIndex}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-xl text-slate-700">
      <RenderText text={currentMessage.text} />
    </p>

    {currentMessage.list && (
      <ul className="mt-2 list-disc list-inside text-slate-600">
        {currentMessage.list.map((item, idx) => (
          <li key={idx}><RenderText text={item} /></li>
        ))}
      </ul>
    )}
  </motion.div>
</AnimatePresence>

</div>


        <motion.button
          onClick={handleNext}
          className={`mt-8 w-full py-3 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${isLastMessage ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLastMessage ? (
            <>
              ¡Entendido, a practicar!
              <Check className="inline w-5 h-5 ml-2" />
            </>
           ) : (
            <>
              Siguiente
              <ArrowRight className="inline w-5 h-5 ml-2" />
            </>
           )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};