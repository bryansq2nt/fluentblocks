// components/game/components/SentencePrompt.tsx

// CAMBIO: Ya no necesitamos importar 'Question' o los tipos de props complejos.
import AudioHint from '../AudioHint'; // Asegúrate de que la ruta sea correcta

// CAMBIO: Tipos de props simplificados.
interface Question {
  spanish: string;
  englishCorrect: string[];
}

interface SentencePromptProps {
  question: Question;
  // ELIMINADO: isAudioHintVisible y onToggleAudioHint ya no son necesarios.
}

export function SentencePrompt({ question }: SentencePromptProps) {
  return (
    <div className="text-center mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Construye la oración:</h3>
      <p className="text-2xl font-bold text-blue-600">
        "{question.spanish}"
      </p>
      
      {/* CAMBIO: La llamada a AudioHint ahora es mucho más limpia y directa. */}
      <AudioHint
        sentence={question.englishCorrect.join(' ')}
      />
    </div>
  );
}