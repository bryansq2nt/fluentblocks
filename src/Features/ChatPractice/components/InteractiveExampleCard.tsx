// components/chat/InteractiveExampleCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Lightbulb } from 'lucide-react';
import { AudioPlayer } from '@/components/game/AudioPlayer';
import { useTutorial } from '@/context/TutorialContext';

// --- TIPOS DE DATOS (Basados en nuestro nuevo prompt) ---
type Block = { text: string; es: string; type: string };
type ExampleData = {
  blocks: Block[];
  spanish_translation: string;
};
type LessonData = {
  pattern: string;
  example: ExampleData;
  note: string;
  challenge: string;
};


const blockColors: { [key: string]: string } = {
  subject: 'text-blue-700',
  modal: 'text-emerald-600',
  verb: 'text-purple-600',
  expression: 'text-pink-600',
  preposition: 'text-orange-500',
  object: 'text-sky-600',
  context: 'text-amber-600',
};

// --- SUB-COMPONENTE: Título ---
function LessonTitle({ htmlPattern }: { htmlPattern: string }) {



  return (
    <div id="interactive-card-lesson-title" className="flex items-center gap-3">
      <span className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-blue-600" />
      </span>
      {/* Usamos dangerouslySetInnerHTML para renderizar el HTML del prompt */}
      <h3
        className="
          font-bold text-lg text-slate-700
          [&_strong]:text-blue-600
          [&_code]:text-pink-600 [&_code]:font-mono [&_code]:bg-pink-100/60 [&_code]:px-1.5 [&_code]:py-1 [&_code]:rounded-md
        "
        dangerouslySetInnerHTML={{ __html: htmlPattern }}
      />
    </div>
  );
}

// --- SUB-COMPONENTE: El "Aha!" Moment ---
function BlockyTip({ note }: { note: string }) {
  return (
    <div id="interactive-card-blocky-tip" className="bg-yellow-100/60 border-l-4 border-yellow-400 p-3 rounded-r-lg">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-800">{note}</p>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE: El Ejemplo Interactivo ---
function ExampleSentence({ example }: { example: ExampleData }) {
  const fullSentence = example.blocks.map(b => b.text).join(' ');

  // Componente de bloque individual
  function InteractiveBlock({ block, color }: { block: Block; color: string }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <motion.div
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        className={`relative cursor-pointer px-1 py-1 font-bold text-2xl ${color}`}
      >
        {block.text}
        <motion.div
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs font-medium rounded-md px-2 py-1 shadow-lg pointer-events-none z-10"
        >
          {block.es}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div id="interactive-blocks" className="flex flex-wrap gap-x-1 items-center justify-center p-4 bg-gray-100/80 rounded-xl min-h-[70px]">
        {example.blocks.map((block, i) => (
          <InteractiveBlock key={i} block={block} color={blockColors[block.type] || '#374151'} />
        ))}
      </div>
      <div id="audio-player-section" className="flex items-center justify-between gap-4 px-2">
        <p className="text-base text-gray-600 italic">&quot;{example.spanish_translation}&quot;</p>
        <AudioPlayer sentence={fullSentence} />
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE: El Reto y Botón de Práctica ---
function PracticeChallenge({ challenge, lessonDataString }: { challenge: string; lessonDataString: string; }) {
  const { skipTutorial } = useTutorial();

  const handlePracticeClick = () => {
    skipTutorial(); // Cerrar el tutorial cuando el usuario hace clic en practicar
  };

  return (
    <div id="practice-button" className="mt-4 pt-4 border-t border-gray-200/80 space-y-4">
      <div className="text-center">
        <p className="font-semibold text-gray-700">Tu Turno:</p>
        <p className="text-sm text-gray-500">{challenge}</p>
      </div>
      <Link href={`/exercises/generated-exercise?lesson=${lessonDataString}`} passHref legacyBehavior>
        <motion.a
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handlePracticeClick}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <GraduationCap className="w-5 h-5" />
          <span>Practicar</span>
        </motion.a>
      </Link>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL ENSAMBLADO ---
export function InteractiveExampleCard({ data }: { data: LessonData }) {
  const lessonDataString = encodeURIComponent(JSON.stringify(data));

  return (
    <div className="bg-white border border-gray-200/70 rounded-2xl p-4 md:p-5 text-gray-800 space-y-5 max-w-md shadow-lg w-full">
      <LessonTitle htmlPattern={data.pattern} />
      <BlockyTip note={data.note} />
      <ExampleSentence example={data.example} />
      <PracticeChallenge challenge={data.challenge} lessonDataString={lessonDataString} />
    </div>
  );
}