'use client';

import { ReactNode } from 'react';
import { ExerciseTrackingProvider as Provider } from '@/context/ExerciseTrackingContext';

export function ExerciseTrackingProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
} 