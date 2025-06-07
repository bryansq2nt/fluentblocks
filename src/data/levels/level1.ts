import type { Level, Exercise, Word } from '@/types/game';

// Common word styles
const subjectStyle: Word['style'] = {
  backgroundColor: '#60a5fa', // blue
  color: 'white',
  fontWeight: 'bold',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
};

const auxiliaryStyle: Word['style'] = {
  backgroundColor: '#4ade80', // green
  color: 'white',
  fontWeight: 'bold',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
};

const verbStyle: Word['style'] = {
  backgroundColor: '#f87171', // red
  color: 'white',
  fontWeight: 'bold',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
};

// Create words for all exercises
const words: Record<string, Word> = {
  // Subjects
  i: {
    id: 'i',
    text: 'I',
    type: 'pronoun',
    isDraggable: true,
    style: subjectStyle,
  },
  you: {
    id: 'you',
    text: 'You',
    type: 'pronoun',
    isDraggable: true,
    style: subjectStyle,
  },
  he: {
    id: 'he',
    text: 'He',
    type: 'pronoun',
    isDraggable: true,
    style: subjectStyle,
  },
  she: {
    id: 'she',
    text: 'She',
    type: 'pronoun',
    isDraggable: true,
    style: subjectStyle,
  },
  // Auxiliaries
  am: {
    id: 'am',
    text: 'am',
    type: 'verb',
    isDraggable: true,
    style: auxiliaryStyle,
  },
  is: {
    id: 'is',
    text: 'is',
    type: 'verb',
    isDraggable: true,
    style: auxiliaryStyle,
  },
  are: {
    id: 'are',
    text: 'are',
    type: 'verb',
    isDraggable: true,
    style: auxiliaryStyle,
  },
  // Main verbs
  eating: {
    id: 'eating',
    text: 'eating',
    type: 'main-verb',
    isDraggable: true,
    style: verbStyle,
  },
  sleeping: {
    id: 'sleeping',
    text: 'sleeping',
    type: 'main-verb',
    isDraggable: true,
    style: verbStyle,
  },
  studying: {
    id: 'studying',
    text: 'studying',
    type: 'main-verb',
    isDraggable: true,
    style: verbStyle,
  },
  working: {
    id: 'working',
    text: 'working',
    type: 'main-verb',
    isDraggable: true,
    style: verbStyle,
  },
};

// Create exercises
const exercises: Exercise[] = [
  {
    id: 'ex1',
    type: 'drag-and-drop',
    targetSentence: {
      id: 's1',
      pattern: 'I am eating',
      words: [words.i, words.am, words.eating],
      isComplete: false,
      isCorrect: false,
    },
    options: [words.eating, words.am, words.i], // Scrambled order
    hints: [
      'Recuerda: El orden es [Sujeto] + [Verbo auxiliar] + [Verbo principal]',
      'En español sería: "Yo estoy comiendo"',
      'El verbo auxiliar "am" se usa con "I"',
    ],
    feedback: {
      correct: '¡Excelente! Has formado la oración correctamente.',
      incorrect: 'Inténtalo de nuevo. Recuerda el orden: Sujeto + am/is/are + verbo+ing',
      partial: 'Casi lo tienes. Revisa el orden de las palabras.',
    },
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'ex2',
    type: 'drag-and-drop',
    targetSentence: {
      id: 's2',
      pattern: 'You are sleeping',
      words: [words.you, words.are, words.sleeping],
      isComplete: false,
      isCorrect: false,
    },
    options: [words.sleeping, words.you, words.are],
    hints: [
      'Recuerda: El orden es [Sujeto] + [Verbo auxiliar] + [Verbo principal]',
      'En español sería: "Tú estás durmiendo"',
      'El verbo auxiliar "are" se usa con "You"',
    ],
    feedback: {
      correct: '¡Perfecto! Has formado la oración correctamente.',
      incorrect: 'Inténtalo de nuevo. Recuerda el orden: Sujeto + am/is/are + verbo+ing',
      partial: 'Casi lo tienes. Revisa el orden de las palabras.',
    },
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'ex3',
    type: 'drag-and-drop',
    targetSentence: {
      id: 's3',
      pattern: 'He is studying',
      words: [words.he, words.is, words.studying],
      isComplete: false,
      isCorrect: false,
    },
    options: [words.studying, words.he, words.is],
    hints: [
      'Recuerda: El orden es [Sujeto] + [Verbo auxiliar] + [Verbo principal]',
      'En español sería: "Él está estudiando"',
      'El verbo auxiliar "is" se usa con "He"',
    ],
    feedback: {
      correct: '¡Muy bien! Has formado la oración correctamente.',
      incorrect: 'Inténtalo de nuevo. Recuerda el orden: Sujeto + am/is/are + verbo+ing',
      partial: 'Casi lo tienes. Revisa el orden de las palabras.',
    },
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'ex4',
    type: 'drag-and-drop',
    targetSentence: {
      id: 's4',
      pattern: 'She is working',
      words: [words.she, words.is, words.working],
      isComplete: false,
      isCorrect: false,
    },
    options: [words.working, words.she, words.is],
    hints: [
      'Recuerda: El orden es [Sujeto] + [Verbo auxiliar] + [Verbo principal]',
      'En español sería: "Ella está trabajando"',
      'El verbo auxiliar "is" se usa con "She"',
    ],
    feedback: {
      correct: '¡Fantástico! Has formado la oración correctamente.',
      incorrect: 'Inténtalo de nuevo. Recuerda el orden: Sujeto + am/is/are + verbo+ing',
      partial: 'Casi lo tienes. Revisa el orden de las palabras.',
    },
    difficulty: 'easy',
    points: 10,
  },
];

// Create the level
const level1: Level = {
  id: 1,
  pattern: 'Present Continuous',
  title: 'I am eating',
  description: 'Aprende a formar oraciones en presente continuo usando el patrón [Sujeto] + am/is/are + [verbo+ing]',
  icon: '🍎',
  exercises,
  prerequisites: [],
  rewards: {
    points: 40,
    badges: ['present-continuous-master'],
    unlocks: [2],
  },
  metadata: {
    difficulty: 'basic',
    estimatedTime: 10,
    category: 'Present Continuous',
    tags: ['present-continuous', 'basic', 'verbs'],
  },
};

export default level1; 