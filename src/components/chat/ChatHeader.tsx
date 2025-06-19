// components/chat/ChatHeader.tsx
'use client';

import { Bot, HelpCircle, BookOpen } from 'lucide-react';
import { useTutorial } from '@/context/TutorialContext';
import * as Popover from '@radix-ui/react-popover';

export function ChatHeader() {
  const { startTutorial, isTutorialActive } = useTutorial();

  const handleStartTutorial = () => {
    startTutorial('chat-onboarding');
  };

  return (
    <div id="chat-header" className="p-4 border-b border-gray-200 flex items-center justify-between space-x-3">
      {/* Lado izquierdo: Info del Agente */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">Agente FluentBlocks</h3>
          <p className="text-sm text-green-600 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            En línea
          </p>
        </div>
      </div>

      {/* Lado derecho: El nuevo botón de ayuda interactivo */}
      <div>
        {!isTutorialActive && (
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
        )}
      </div>
    </div>
  );
}