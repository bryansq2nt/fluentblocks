// components/game/DynamicSentenceBuilder.tsx
'use client';

// Los imports ahora son solo para la UI y el nuevo hook.
import { AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { AudioPlayer } from './AudioPlayer';
import { ProgressBar } from './components/ProgressBar';
import { SentencePrompt } from './components/SentencePrompt';
import { AnswerArea } from './components/AnswerArea';
import { WordBank } from './components/WordBank';
import { FeedbackToast } from './components/FeedbackToast';
import { CompletionScreen } from './components/CompletionScreen';
import { CheckButton } from './components/CheckButton';
import { useSentenceBuilder } from './controllers/useSentenceBuilder'; 

// --- Tipos de Datos (la definición de las props del componente sigue aquí) ---
interface Question {
  spanish: string;
  englishCorrect: string[];
}
interface DynamicBuilderProps {
  questions: Question[];
  onSessionComplete: () => void;
}

// Este componente ahora es solo una "Vista". No contiene lógica de juego.
export default function DynamicSentenceBuilder({ questions, onSessionComplete }: DynamicBuilderProps) {
  // Toda la lógica compleja se ha abstraído en esta única llamada al hook.
  const {
    currentQuestionData,
    userAnswer,
    feedback,
    isSessionComplete,
    mistakeCount,
    showConfetti,
    progressPercentage,
    isAnswerChecked,
    autoAudioPlayerRef,
    handleWordBankTap,
    handleAnswerTap,
    handleCheckAnswer,
    handleNextQuestion,
    handleRetry,
    setShowConfetti,
  } = useSentenceBuilder(questions, onSessionComplete);
  
  // El renderizado condicional principal sigue aquí.
  if (isSessionComplete) {
    return <CompletionScreen onSessionComplete={onSessionComplete} />;
  }

  if (!currentQuestionData) {
    return <div>Cargando pregunta...</div>;
  }

  // El JSX es idéntico al de antes, pero ahora es mucho más claro
  // de dónde provienen los datos y las funciones.
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {showConfetti && (
        <Confetti
          numberOfPieces={400}
          recycle={false}
          gravity={0.15}
          onConfettiComplete={() => setShowConfetti(false)}
          style={{ opacity: 0.8 }}
        />
      )}
      <div className="hidden">
        <AudioPlayer 
          ref={autoAudioPlayerRef} 
          sentence={currentQuestionData.englishCorrect.join(' ')} 
        />
      </div>

      <ProgressBar progress={progressPercentage} />

      <main className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-8 space-y-6">
        <SentencePrompt question={currentQuestionData} />

          
          <AnswerArea
              answer={userAnswer}
              onRemove={handleAnswerTap}
              status={feedback.status}
            />

          <WordBank
              options={currentQuestionData.options}
              selectedOptions={userAnswer}
              onSelect={handleWordBankTap}
              isDisabled={isAnswerChecked}
            />
          <CheckButton
            isVisible={userAnswer.length > 0 && feedback.status === 'idle'}
            onClick={handleCheckAnswer}
          />
         
        </div>
      </main>

      <AnimatePresence>
        <FeedbackToast
          status={feedback.status}
          message={feedback.message}
          onNext={handleNextQuestion}
          onRetry={handleRetry}
          canRetry={feedback.status === 'incorrect' && mistakeCount < 3}
        />
      </AnimatePresence>
    </div>
  );
}