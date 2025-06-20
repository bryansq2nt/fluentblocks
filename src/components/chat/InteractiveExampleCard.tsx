// components/chat/InteractiveExampleCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';
import { AudioPlayer } from '../game/AudioPlayer';

// --- Tipos y Constantes (sin cambios) ---
type Block = { text: string; es: string; type: string };
type Example = {
  blocks: Block[];
  spanish_translation: string;
  note: string;
};
type InteractiveCardData = {
  pattern: string;
  examples: Example[];
  challenge: string;
};
const blockColors: { [key: string]: string } = {
  subject: 'text-blue-600',
  modal: 'text-emerald-600',
  verb: 'text-purple-600',
  extra: 'text-pink-600',
  default: 'text-gray-700',
};

// --- Componente InteractiveBlock (sin cambios) ---
function InteractiveBlock({ block, color }: { block: Block; color: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTapStart={() => setIsHovered(true)}
      onTapCancel={() => setIsHovered(false)}
      onTap={() => setTimeout(() => setIsHovered(false), 1500)}
      className={`relative cursor-pointer px-1 py-1 font-bold text-xl ${color}`}
    >
      {block.text}
      <motion.div
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5, scale: isHovered ? 1 : 0.95 }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-lg pointer-events-none z-10"
      >
        {block.es}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
      </motion.div>
    </motion.div>
  );
}

// --- Componente Principal de la Tarjeta Interactiva ---
export function InteractiveExampleCard({ data }: { data: InteractiveCardData }) {
  const currentExample = data.examples[0];
  const fullSentence = currentExample.blocks.map(b => b.text).join(' ');


  // Prepara los datos para pasarlos en la URL
  const lessonDataString = encodeURIComponent(JSON.stringify(data));

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200/50 rounded-2xl p-4 md:p-5 text-gray-800 space-y-4 max-w-md shadow-lg">
      
      <div className='flex items-center gap-3 border-b border-blue-200/60 pb-3'>
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h3 className="font-bold text-lg text-blue-900">{data.pattern}</h3>
      </div>
      
      <div className="space-y-3">
        {/* Oración Interactiva con Bloques */}
        <div id="interactive-blocks" className="flex flex-wrap gap-x-1 items-center justify-center p-3 bg-white/60 rounded-lg min-h-[60px]">
          {currentExample.blocks.map((block, i) => (
            <InteractiveBlock 
              key={i} 
              block={block} 
              color={blockColors[block.type] || blockColors.default}
            />
          ))}
        </div>

        {/* Reproductor y Traducción Completa */}
        <div  className="flex items-center justify-between gap-4 p-2">
          <p className="text-base text-gray-700 italic text-left">&quot;{currentExample.spanish_translation}&quot;</p>
          <AudioPlayer sentence={fullSentence} />
        </div>
{/*         
        <p className="text-xs text-center text-blue-800/80 bg-blue-100/70 p-2 rounded-md">
          <strong>💡 Nota del Profe:</strong> {currentExample.note}
        </p> */}
      </div>

      {/* Navegación y Reto */}
      {/* <div className="pt-3 border-t border-blue-200/60">
        <div className="flex items-center justify-between">
            <button onClick={goToPrev} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-500">
            Ejemplo {currentIndex + 1} de {data.examples.length}
            </span>
            <button onClick={goToNext} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>
      </div> */}
       {/* <div className="flex items-start gap-3 mt-2 pt-3 border-t border-blue-200/50">
        <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold">?</div>
        <p className="text-gray-700 font-medium text-sm">{data.challenge}</p>
      </div> */}

      {/* --- BOTÓN DE PRÁCTICA CORREGIDO --- */}
      {/* El Link ahora solo envuelve al botón sin añadirle estilos de layout */}
      <div id="practice-button" className="mt-4">
        <Link href={`/exercises/generated-exercise?lesson=${lessonDataString}`} passHref legacyBehavior>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Practicar</span>
          </motion.a>
        </Link>
      </div>
    </div>
  );
}