// components/game/AudioHint.tsx
'use client';

// CAMBIO: Solo necesitamos importar AudioPlayer.
import { AudioPlayer } from './AudioPlayer';

// CAMBIO: La interfaz de props ahora es mucho más simple.
interface AudioHintProps {
  sentence: string;
}

// CAMBIO: El componente ahora es puramente de presentación.
export default function AudioHint({ sentence }: AudioHintProps) {
  // ELIMINADO: Toda la lógica de `useRef`, `useOnClickOutside`, `trackInteraction` y `onToggle`.

  return (
    // Simplemente un contenedor para centrar el AudioPlayer con un poco de margen,
    // exactamente como en tu imagen.
    <div className="flex justify-center mt-4 mb-4">
      <AudioPlayer sentence={sentence} />
    </div>
  );
}