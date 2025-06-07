import { useState } from 'react';
import type { Level, Word } from '@/types/game';

interface GameLogicState {
  currentExerciseIndex: number;
  userAnswer: (Word | undefined)[];
  isDragging: boolean;
  isExerciseComplete: boolean;
  isLevelComplete: boolean;
  mistakes: number;
  blockyMessage: string;
  blockyEmotion: 'happy' | 'thinking' | 'excited' | 'sad';
}

export const useGameLogic = (level: Level) => {
  const [gameState, setGameState] = useState<GameLogicState>({
    currentExerciseIndex: 0,
    userAnswer: Array(level.exercises[0].targetSentence.words.length).fill(undefined),
    isDragging: false,
    isExerciseComplete: false,
    isLevelComplete: false,
    mistakes: 0,
    blockyMessage: '¡Arrastra las palabras para formar la oración!',
    blockyEmotion: 'happy'
  });

  const currentExercise = level.exercises[gameState.currentExerciseIndex];

  const checkAnswer = () => {
    const isCorrect = gameState.userAnswer.every((word, index) => {
      const correctWord = currentExercise.targetSentence.words[index];
      return word?.id === correctWord.id;
    });

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        isExerciseComplete: true,
        blockyMessage: '¡Excelente! ¡Lo has hecho muy bien!',
        blockyEmotion: 'excited'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1,
        blockyMessage: '¡Inténtalo de nuevo! ¡Tú puedes!',
        blockyEmotion: 'thinking'
      }));
    }

    return isCorrect;
  };

  const nextExercise = () => {
    if (gameState.currentExerciseIndex < level.exercises.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentExerciseIndex: prev.currentExerciseIndex + 1,
        userAnswer: Array(level.exercises[prev.currentExerciseIndex + 1].targetSentence.words.length).fill(undefined),
        isExerciseComplete: false,
        blockyMessage: '¡Arrastra las palabras para formar la oración!',
        blockyEmotion: 'happy'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        isLevelComplete: true,
        blockyMessage: '¡Felicidades! ¡Has completado el nivel!',
        blockyEmotion: 'excited'
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentExerciseIndex: 0,
      userAnswer: Array(level.exercises[0].targetSentence.words.length).fill(undefined),
      isDragging: false,
      isExerciseComplete: false,
      isLevelComplete: false,
      mistakes: 0,
      blockyMessage: '¡Arrastra las palabras para formar la oración!',
      blockyEmotion: 'happy'
    });
  };

  const handleWordDrop = (word: Word, index: number) => {
    setGameState(prev => ({
      ...prev,
      userAnswer: prev.userAnswer.map((w, i) => i === index ? word : w)
    }));
  };

  const setDragging = (isDragging: boolean) => {
    setGameState(prev => ({
      ...prev,
      isDragging
    }));
  };

  return {
    gameState,
    currentExercise,
    checkAnswer,
    nextExercise,
    resetGame,
    handleWordDrop,
    setDragging,
    isExerciseComplete: gameState.isExerciseComplete,
    isLevelComplete: gameState.isLevelComplete
  };
}; 