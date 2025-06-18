// components/game/components/WordBank.tsx

import { motion } from 'framer-motion';
import { useMemo } from 'react';

type WordOption = { id: number; word: string };

interface WordBankProps {
  options: WordOption[];
  selectedOptions: WordOption[];
  onSelect: (option: WordOption) => void;
  // AÑADIDO: Prop para saber si los botones deben estar deshabilitados.
  isDisabled: boolean;
}

export function WordBank({ options, selectedOptions, onSelect, isDisabled }: WordBankProps) {
  const selectedIds = useMemo(() =>
    new Set(selectedOptions.map(opt => opt.id)),
    [selectedOptions]
  );

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-3">Toca las palabras en el orden correcto:</p>
            <div className="flex flex-wrap gap-3">
      {options.map(opt => {
        const isSelected = selectedIds.has(opt.id);

        if (isSelected) {
          return (
            <div
              key={opt.id}
              className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 min-w-[80px] h-[42px] transition-colors duration-150"
            />
          );
        }

        return (
          <motion.button
            key={opt.id}
            layoutId={`word-${opt.id}`}
            onClick={() => onSelect(opt)}
            // AÑADIDO: Deshabilitar animaciones si el banco está inactivo.
            whileHover={isDisabled ? {} : { y: -2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            whileTap={isDisabled ? {} : { scale: 0.95 }}
            // AÑADIDO: Propiedad `disabled` y clases de Tailwind para el estado deshabilitado.
            disabled={isDisabled}
            className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-gray-800 text-center min-w-[80px] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {opt.word}
          </motion.button>
        );
      })}
    </div>
          </div>

    
  );
}