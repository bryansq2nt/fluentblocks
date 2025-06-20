// components/chat/ChatTutorialButton.tsx
'use client';

import { useTutorial } from '@/context/TutorialContext';
import * as Popover from '@radix-ui/react-popover';
import { HelpCircle, BookOpen } from 'lucide-react';

export function ChatTutorialButton() {
  const { startTutorial, isTutorialActive } = useTutorial();

  if (isTutorialActive) {
    // No mostrar el botón si el tutorial ya está activo
    return null; 
  }

  const handleStartTutorial = () => {
    startTutorial('chat-onboarding');
  };

  return (
    <Popover.Root>
            <Popover.Trigger asChild>
              <button
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Mostrar ayuda"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
            </Popover.Trigger>
            
            <Popover.Portal>
              <Popover.Content
                sideOffset={8}
                align="end"
                className="
                  z-50 w-64 bg-white rounded-xl shadow-2xl p-4
                  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
                  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
                  data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2
                  focus:outline-none
                "
              >
                <div className="flex flex-col items-center text-center">
                  <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
                  <h4 className="font-bold text-gray-800 mb-1">Guía Interactiva</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    ¿Olvidaste cómo funciona? Te mostramos el recorrido de nuevo.
                  </p>
                  <Popover.Close asChild>
                    <button
                      onClick={handleStartTutorial}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Mostrar Guía
                    </button>
                  </Popover.Close>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
  );
}