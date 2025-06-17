import AudioHint from '../AudioHint';
import { Question } from '../types';

interface SentencePromptProps {
  question: Question;
  isAudioHintVisible: boolean;
  onToggleAudioHint: () => void;
}

export function SentencePrompt({ 
  question, 
  isAudioHintVisible, 
  onToggleAudioHint 
}: SentencePromptProps) {
  return (
    <div className="text-center mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Construye la oración:</h3>
      <p className="text-2xl font-bold text-blue-600">
        &quot;{question.spanish}&quot;
      </p>
      <AudioHint
        sentence={question.englishCorrect.join(' ')}
        isVisible={isAudioHintVisible}
        onToggle={onToggleAudioHint}
      />
    </div>
  );
} 