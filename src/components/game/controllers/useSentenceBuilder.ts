import { useState, useEffect } from 'react';
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
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('idle');
  const [isAudioHintVisible, setIsAudioHintVisible] = useState(false);

  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  useEffect(() => {
    if (currentQuestion) {
      const options = currentQuestion.englishCorrect.map((word, index) => ({ id: index, word }));
      setWordBankOptions(shuffleArray(options));
      setUserAnswer([]);
      setFeedbackStatus('idle');
      setIsAudioHintVisible(false); 
    }
  }, [currentQuestion]);

  const handleWordTap = (option: WordOption) => {
    setUserAnswer([...userAnswer, option]);
    setWordBankOptions(wordBankOptions.filter((opt) => opt.id !== option.id));
    setFeedbackStatus('idle');
  };

  const handleAnswerTap = (option: WordOption) => {
    setWordBankOptions(shuffleArray([...wordBankOptions, option]));
    setUserAnswer(userAnswer.filter((opt) => opt.id !== option.id));
    setFeedbackStatus('idle');
  };

  const handleCheck = () => {
    const userAnswerString = userAnswer.map((opt) => opt.word).join(' ');
    const correctAnswerString = currentQuestion.englishCorrect.join(' ');

    if (userAnswerString === correctAnswerString) {
      setFeedbackStatus('correct');
    } else {
      setFeedbackStatus('incorrect');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAudioHintVisible(false);
    } else {
      onComplete();
    }
  };

  const handleRetry = () => {
    if (currentQuestion) {
        setUserAnswer([]);
        setWordBankOptions(shuffleArray(currentQuestion.englishCorrect.map((word, index) => ({ id: index, word }))));
        setFeedbackStatus('idle');
    }
  };

  const toggleAudioHint = () => {
    setIsAudioHintVisible(prev => !prev);
  };

  return {
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
  };
} 