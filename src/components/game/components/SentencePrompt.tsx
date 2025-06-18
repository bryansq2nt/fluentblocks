// components/game/components/SentencePrompt.tsx

import AudioHint from '../AudioHint'; 

interface Question {
  spanish: string;
  englishCorrect: string[];
}

interface SentencePromptProps {
  question: Question;
}

export function SentencePrompt({ question }: SentencePromptProps) {
  return (
    <div>
  <div className="text-center mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Construye la oración:</h3>
      <p className="text-2xl font-bold text-blue-600">
      &quot;{question.spanish}&quot;
      </p>
      
      <AudioHint
        sentence={question.englishCorrect.join(' ')}
      />
    </div>  </div>
  
  );
}