// components/game/components/WordBank.tsx

import { motion } from 'framer-motion';
import { useMemo } from 'react';

type WordOption = { id: number; word: string };

interface WordBankProps {
  options: WordOption[];
  selectedOptions: WordOption[]; // NUEVO: Para saber cuáles ocultar
  onSelect: (option: WordOption) => void;
}

export function WordBank({ options, selectedOptions, onSelect }: WordBankProps) {
  // Creamos un Set de los IDs seleccionados para una búsqueda eficiente (O(1))
  const selectedIds = useMemo(() =>
    new Set(selectedOptions.map(opt => opt.id)),
    [selectedOptions]
  );

  return (
    <div className="flex flex-wrap gap-3">
      {/* ELIMINADO: <AnimatePresence> ya no es necesario aquí */}
      {options.map(opt => {
        const isSelected = selectedIds.has(opt.id);

        // Si la palabra ha sido seleccionada, renderiza un marcador de posición
        if (isSelected) {
          return (
            <div
              key={opt.id}
              // Estilos para el marcador de posición. Debe ocupar el mismo espacio que el botón.
              className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 min-w-[80px] h-[42px] transition-colors duration-150"
            />
          );
        }

        // Si la palabra está disponible, renderiza el botón animado
        return (
          <motion.button
            key={opt.id}
            layoutId={`word-${opt.id}`} // La magia de la animación sigue funcionando gracias a esto
            onClick={() => onSelect(opt)}
            whileHover={{ y: -2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-gray-800 text-center min-w-[80px] transition-colors duration-150"
          >
            {opt.word}
          </motion.button>
        );
      })}
    </div>
  );
}