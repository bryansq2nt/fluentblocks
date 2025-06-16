// components/chat/MessageList.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AgentAvatar } from './AgentAvatar';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';

export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'agent';
};

type MessageListProps = {
  messages: Message[];
  isAgentTyping: boolean;
};

export function MessageList({ messages, isAgentTyping }: MessageListProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.sender === 'agent' && <AgentAvatar />}
          <ChatBubble text={msg.text} sender={msg.sender} />
        </motion.div>
      ))}

      <AnimatePresence>
        {isAgentTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-3 justify-start"
          >
            <AgentAvatar />
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}