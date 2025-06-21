export type InteractionType = 
  | 'INTRO_COMPLETE'
  | 'INTRO_SKIPPED'
  | 'SESSION_STARTED'
  | 'AUDIO_HINT_USED'
  | 'WORD_SELECTED'
  | 'ANSWER_CORRECT'
  | 'ANSWER_INCORRECT'
  | 'RETRY_ATTEMPT'
  | 'EXERCISE_SKIPPED'
  | 'SESSION_COMPLETE'
  | 'SESSION_CANCELLED';

interface BaseInteraction {
  type: InteractionType;
  timestamp: number;
}

interface IntroStartedData {
  title: string;
}

interface IntroCompleteData {
  title: string;
  totalMessages: number;
  timeSpent: number;
}

interface IntroSkippedData {
  title: string;
  currentMessageIndex: number;
  totalMessages: number;
  timeSpent: number;
}

interface AudioHintUsedData {
  sentence: string;
}

interface AnswerData {
  englishSentence: string;
  spanishSentence: string;
  userAnswer: string;
}

interface RetryAttemptData {
  englishSentence: string;
  spanishSentence: string;
  userAnswer: string;
  attemptNumber: number;
}

interface ExerciseSkippedData {
  englishSentence: string;
  spanishSentence: string;
  userAnswer: string;
  skippedAfterMistake: boolean;
}

interface WordSelectedData {
  word: string;
  englishSentence: string;
  spanishSentence: string;
  currentAnswer: string;
}

interface SessionCancelledData {
  goingTo: string;
}

interface SessionCompleteData {
  totalTime: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  retries: number;
}

export type UserInteraction = BaseInteraction & {
  data?: IntroStartedData | IntroCompleteData | IntroSkippedData | AudioHintUsedData | AnswerData | RetryAttemptData | ExerciseSkippedData | WordSelectedData | SessionCancelledData | SessionCompleteData;
};

export interface SessionStats {
  startTime: number;
  endTime: number;
  interactions: UserInteraction[];
  totalTime: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  retries: number;
} 