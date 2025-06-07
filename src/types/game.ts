// Word Types
export interface Word {
  id: string;
  text: string;
  type: WordType;
  isDraggable: boolean;
  isCorrect?: boolean;
  position?: Position;
  style?: WordStyle;
}

export type WordType = 
  | 'pronoun'    // I, you, he, she, etc.
  | 'verb'       // am, is, are, etc.
  | 'auxiliary'  // have, has, etc.
  | 'main-verb'  // eating, walking, etc.
  | 'noun'       // apple, book, etc.
  | 'adjective'  // big, small, etc.
  | 'adverb'     // quickly, slowly, etc.
  | 'preposition'// in, on, at, etc.
  | 'article'    // a, an, the
  | 'conjunction'// and, but, or
  | 'punctuation';// ., ?, !

export interface Position {
  x: number;
  y: number;
  z?: number; // For 3D effects
}

export interface WordStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  transform?: string;
  transition?: string;
}

// Sentence Types
export interface Sentence {
  id: string;
  pattern: string;
  words: Word[];
  isComplete: boolean;
  isCorrect: boolean;
  feedback?: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  type: ExerciseType;
  targetSentence: Sentence;
  options: Word[];
  hints: string[];
  feedback: {
    correct: string;
    incorrect: string;
    partial: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  points: number;
}

export type ExerciseType = 
  | 'drag-and-drop'  // Basic word ordering
  | 'fill-in-blank'  // Missing words
  | 'multiple-choice'// Select correct word
  | 'translation'    // Translate to/from English
  | 'listening'      // Listen and type
  | 'speaking';      // Speak the sentence

// Level Types
export interface Level {
  id: number;
  pattern: string;
  title: string;
  description: string;
  icon: string;
  exercises: Exercise[];
  prerequisites: number[]; // IDs of required completed levels
  rewards: {
    points: number;
    badges?: string[];
    unlocks?: number[]; // IDs of unlocked levels
  };
  metadata: {
    difficulty: 'basic' | 'intermediate' | 'advanced';
    estimatedTime: number;
    category: string;
    tags: string[];
  };
}

// Game State Types
export interface GameState {
  currentLevel: Level;
  currentExercise: Exercise;
  progress: {
    completedExercises: number;
    totalExercises: number;
    score: number;
    timeSpent: number;
    mistakes: number;
  };
  dragState: {
    isDragging: boolean;
    draggedWord?: Word;
    sourcePosition?: Position;
    targetPosition?: Position;
  };
  feedback: {
    message: string;
    type: 'success' | 'error' | 'hint' | 'info';
    visible: boolean;
  };
}

// Component Prop Types
export interface BlockyProps {
  emotion: 'happy' | 'thinking' | 'excited' | 'confused';
  message?: string;
  position?: Position;
  animation?: string;
}

export interface WordBlockProps {
  word: Word;
  onDragStart: (word: Word) => void;
  onDragEnd: (word: Word) => void;
  onDrop: (word: Word, position: Position) => void;
  isDragging: boolean;
  isCorrect?: boolean;
}

export interface ExerciseContainerProps {
  exercise: Exercise;
  onComplete: (exercise: Exercise, isCorrect: boolean) => void;
  onHint: () => void;
  onSkip: () => void;
}

export interface ProgressBarProps {
  progress: number;
  total: number;
  showTime?: boolean;
  timeRemaining?: number;
}

export interface FeedbackMessageProps {
  message: string;
  type: 'success' | 'error' | 'hint' | 'info';
  duration?: number;
  onClose?: () => void;
}

// Animation Types
export interface AnimationConfig {
  type: 'fade' | 'slide' | 'bounce' | 'shake' | 'rotate';
  duration: number;
  delay?: number;
  easing?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// Sound Types
export interface SoundEffect {
  id: string;
  url: string;
  volume: number;
  loop: boolean;
}

// Theme Types
export interface GameTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    background: string;
    text: string;
  };
  fonts: {
    main: string;
    heading: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
} 