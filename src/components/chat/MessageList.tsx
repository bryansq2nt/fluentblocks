// components/chat/MessageList.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentAvatar } from './AgentAvatar';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { InteractiveExampleCard } from './InteractiveExampleCard';

// --- TIPO DE MENSAJE ACTUALIZADO ---
export type Message = {
  id: number;
  sender: 'user' | 'agent';
  timestamp: string;
} & (
  {
    type: 'text';
    content: string;
  } | {
    type: 'examples';
    content: {
      pattern: string;
      examples: {
        blocks: { text: string; es: string; type: string }[];
        spanish_translation: string;
        note: string;
      }[];
      challenge: string;
    };
  }
);

// Componente para mostrar la fecha como un separador
function DateSeparator({ date }: { date: string }) {
  return (
    <div className="text-center my-4">
      <span className="text-xs text-gray-500 bg-gray-100/80 backdrop-blur-sm px-3 py-1 rounded-full">
        {date}
      </span>
    </div>
  );
}

// Función para obtener la etiqueta de fecha ("Hoy", "Ayer", etc.)
function getFormattedDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hoy';
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// El componente principal de la lista
export function MessageList({ messages, isAgentTyping }: { messages: Message[], isAgentTyping: boolean }) {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto" style={{fontFamily: 'Inter, sans-serif'}}>
      {messages.map((msg, index) => {
        const prevMsg = messages[index - 1];
        
        const showAvatar = msg.sender === 'agent' && (prevMsg?.sender !== 'agent' || !prevMsg);
        const isFirstInGroup = prevMsg?.sender !== msg.sender || !prevMsg;
        const showDateSeparator = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
        
        return (
          <React.Fragment key={msg.id}>
            {showDateSeparator && <DateSeparator date={getFormattedDate(msg.timestamp)} />}
            
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex items-start gap-2 ${isFirstInGroup ? 'mt-4' : 'mt-1'} ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {showAvatar && <AgentAvatar />}
              {!showAvatar && msg.sender === 'agent' && <div className="w-8 flex-shrink-0" />} 

              {msg.type === 'text' && (
                <ChatBubble
                  text={msg.content}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                  isFirstInGroup={isFirstInGroup}
                />
              )}
              
              {msg.type === 'examples' && msg.sender === 'agent' && (
          <div className="interactive-card-wrapper">
          <InteractiveExampleCard data={{
            pattern: msg.content.pattern,
            example: msg.content.examples[0], 
            note: msg.content.examples[0]?.note || '',
            challenge: msg.content.challenge
          }} />
        </div>
              )}
            </motion.div>
          </React.Fragment>
        );
      })}

      <AnimatePresence>
        {isAgentTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 mt-4">
            <AgentAvatar />
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}