// views/DynamicSentenceBuilderView.tsx
import { Question, WordOption, FeedbackStatus } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { WordBank } from '../components/WordBank';
import { AnswerArea } from '../components/AnswerArea';
import { FeedbackToast } from '../components/FeedbackToast';
import AudioHint from '../AudioHint'; 

// --- Interfaz de Props actualizada ---
interface Props {
  currentQuestion: Question;
  wordBankOptions: WordOption[];
  userAnswer: WordOption[];
  feedbackStatus: FeedbackStatus;
  progress: number;
  isAudioHintVisible: boolean; 
  handleWordTap: (option: WordOption) => void;
  handleAnswerTap: (option: WordOption) => void;
  handleCheck: () => void;
  handleNext: () => void;
  handleRetry: () => void;
  toggleAudioHint: () => void; 
}

export function DynamicSentenceBuilderView({
  currentQuestion, wordBankOptions, userAnswer, feedbackStatus, progress,
  isAudioHintVisible, handleWordTap, handleAnswerTap, handleCheck,
  handleNext, handleRetry, toggleAudioHint
}: Props) {
  if (!currentQuestion) return null; // Guarda por si las preguntas no han cargado

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
      <ProgressBar progress={progress} />
      
      <main className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-6">
        <div className="px-6 py-8 space-y-6">
          {/* --- Renderizado de la pregunta y la pista --- */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Construye la oración:</h3>
            <p className="text-2xl font-bold text-blue-600">
            &quot;{currentQuestion.spanish}&quot;
            </p>
            <AudioHint
              sentence={currentQuestion.englishCorrect.join(' ')}
              isVisible={isAudioHintVisible}
              onToggle={toggleAudioHint}
            />
          </div>
          
          <AnswerArea answer={userAnswer} onRemove={handleAnswerTap} />
          <WordBank options={wordBankOptions} onSelect={handleWordTap} />

          {wordBankOptions.length === 0 && feedbackStatus === 'idle' && (
            <button onClick={handleCheck} /* ... */>Revisar respuesta</button>
          )}
        </div>
      </main>

      <FeedbackToast status={feedbackStatus} onNext={handleNext} onRetry={handleRetry} />
    </div>
  );
}