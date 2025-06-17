export interface Question {
  spanish: string;
  englishCorrect: string[];
}

export type WordOption = { id: number; word: string; };

export type FeedbackStatus = 'idle' | 'correct' | 'incorrect'; 