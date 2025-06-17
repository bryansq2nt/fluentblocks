import { useState, useEffect, useMemo } from 'react';
import useSound from 'use-sound';
import { useExerciseTracking } from '../../../context/ExerciseTrackingContext';
import { Question, WordOption, FeedbackStatus } from '../types';
import shuffleArray from '../utils/shuffleArray';

interface UseSentenceBuilderProps {
  questions: Question[];
  onComplete: () => void;
}

export function useSentenceBuilder({ questions, onComplete }: UseSentenceBuilderProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wordBankOptions, setWordBankOptions] = useState<WordOption[]>([]);
  const [userAnswer, setUserAnswer] = useState<WordOption[]>([]);
  const [feedback, setFeedback] = useState<FeedbackStatus>('idle');
  const [isAudioHintVisible, setIsAudioHintVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { trackInteraction } = useExerciseTracking();
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const [playError]   = useSound('/sounds/error.mp3',   { volume: 0.5 });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  useEffect(() => {
    if (currentQuestion) {
      const options = currentQuestion.englishCorrect.map((word, index) => ({ id: index, word }));
      setWordBankOptions(shuffleArray(options));
      setUserAnswer([]);
      setFeedback('idle');
      setIsAudioHintVisible(false); 
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (feedback === 'correct') playSuccess();
    if (feedback === 'incorrect') playError();
  }, [feedback, playSuccess, playError]);

  const handleWordBankTap = (wordOption: { id: number; word: string }) => {
    setUserAnswer([...userAnswer, wordOption]);
    setWordBankOptions(wordBankOptions.filter(opt => opt.id !== wordOption.id));
    setFeedback('idle');
    if (currentQuestion) {
      trackInteraction({
        type: 'WORD_SELECTED',
        timestamp: Date.now(),
        data: {
          word: wordOption.word,
          englishSentence: currentQuestion.englishCorrect.join(' '),
          spanishSentence: currentQuestion.spanish,
          currentAnswer: [...userAnswer, wordOption].map(opt => opt.word).join(' ')
        }
      });
    }
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    const userAnswerString = userAnswer.map(opt => opt.word).join(' ').replace(/\s*\.\s*$/, '').trim();
    const correctAnswerString = currentQuestion.englishCorrect.join(' ').replace(/\s*\.\s*$/, '').trim();
    if (userAnswerString === correctAnswerString) {
      setFeedback('correct');
      trackInteraction({
        type: 'ANSWER_CORRECT',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestion.englishCorrect.join(' '),
          spanishSentence: currentQuestion.spanish,
          userAnswer: userAnswerString
        }
      });
    } else {
      setFeedback('incorrect');
      trackInteraction({
        type: 'ANSWER_INCORRECT',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestion.englishCorrect.join(' '),
          spanishSentence: currentQuestion.spanish,
          userAnswer: userAnswerString
        }
      });
    }
  };

  const handleNextQuestion = () => {
    if (feedback === 'incorrect' && currentQuestion) {
      trackInteraction({
        type: 'EXERCISE_SKIPPED',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestion.englishCorrect.join(' '),
          spanishSentence: currentQuestion.spanish,
          userAnswer: userAnswer.map(opt => opt.word).join(' '),
          skippedAfterMistake: true
        }
      });
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAudioHintVisible(false);
    } else {
      onComplete();
    }
  };

  const handleRetry = () => {
    if (currentQuestion) {
      trackInteraction({
        type: 'RETRY_ATTEMPT',
        timestamp: Date.now(),
        data: {
          englishSentence: currentQuestion.englishCorrect.join(' '),
          spanishSentence: currentQuestion.spanish,
          userAnswer: userAnswer.map(opt => opt.word).join(' '),
          attemptNumber: retryCount + 1
        }
      });
      setRetryCount(retryCount + 1);
      setUserAnswer([]);
      setWordBankOptions(shuffleArray(currentQuestion.englishCorrect.map((word, index) => ({ id: index, word }))));
      setFeedback('idle');
    }
  };

  const toggleAudioHint = () => {
    setIsAudioHintVisible(prev => !prev);
  };

  return {
    currentQuestion,
    wordBankOptions,
    userAnswer,
    feedback,
    progress,
    isAudioHintVisible, 
    retryCount,
    handleWordBankTap,
    handleCheckAnswer,
    handleNextQuestion,
    handleRetry,
    toggleAudioHint, 
  };
} 