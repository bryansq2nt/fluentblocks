'use client';
// components/FeedbackProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useFeedbackTracker } from '../../hooks/useFeedbackTracker';
import { FeedbackModal } from './FeedbackModal';

const FeedbackContext = createContext<ReturnType<typeof useFeedbackTracker> | null>(null);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
};

interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const feedbackTracker = useFeedbackTracker();

  return (
    <FeedbackContext.Provider value={feedbackTracker}>
      {children}
      <FeedbackModal
        isOpen={feedbackTracker.showFeedbackModal}
        onClose={() => feedbackTracker.setShowFeedbackModal(false)}
        onSubmit={feedbackTracker.markFeedbackShown}
      />
    </FeedbackContext.Provider>
  );
};