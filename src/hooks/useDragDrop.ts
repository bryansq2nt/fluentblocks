import { useState, useCallback } from 'react';
import type { Word } from '@/types/game';

interface DragState {
  isDragging: boolean;
  draggedWord: Word | null;
  activeDropZone: number | null;
}

export const useDragDrop = (onDragStateChange: (isDragging: boolean) => void) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedWord: null,
    activeDropZone: null
  });

  const handleDragStart = useCallback((word: Word) => {
    setDragState({
      isDragging: true,
      draggedWord: word,
      activeDropZone: null
    });
    onDragStateChange(true);
  }, [onDragStateChange]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedWord: null,
      activeDropZone: null
    });
    onDragStateChange(false);
  }, [onDragStateChange]);

  const handleDragOver = useCallback((index: number) => {
    setDragState(prev => ({
      ...prev,
      activeDropZone: index
    }));
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      activeDropZone: null
    }));
  }, []);

  const handleDrop = useCallback((word: Word, index: number) => {
    setDragState({
      isDragging: false,
      draggedWord: null,
      activeDropZone: null
    });
    onDragStateChange(false);
    return { word, index };
  }, [onDragStateChange]);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}; 