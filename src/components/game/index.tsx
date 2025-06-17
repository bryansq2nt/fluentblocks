import { Question } from './types';
import { useSentenceBuilder } from './controllers/useSentenceBuilder';
import { DynamicSentenceBuilderView } from './views/DynamicSentenceBuilderView';

interface DynamicSentenceBuilderProps {
  questions: Question[];
  onComplete: () => void;
}

export function DynamicSentenceBuilder({ questions, onComplete }: DynamicSentenceBuilderProps) {
  const {
    currentQuestion,
    wordBankOptions,
    userAnswer,
    feedbackStatus,
    progress,
    isAudioHintVisible,
    handleWordTap,
    handleAnswerTap,
    handleCheck,
    handleNext,
    handleRetry,
    toggleAudioHint,
  } = useSentenceBuilder({ questions, onComplete });

  return (
    <DynamicSentenceBuilderView
      currentQuestion={currentQuestion}
      wordBankOptions={wordBankOptions}
      userAnswer={userAnswer}
      feedbackStatus={feedbackStatus}
      progress={progress}
      isAudioHintVisible={isAudioHintVisible}
      handleWordTap={handleWordTap}
      handleAnswerTap={handleAnswerTap}
      handleCheck={handleCheck}
      handleNext={handleNext}
      handleRetry={handleRetry}
      toggleAudioHint={toggleAudioHint}
    />
  );
} 