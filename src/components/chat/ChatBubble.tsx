// components/chat/ChatBubble.tsx
import { motion } from 'framer-motion';

type ChatBubbleProps = {
  text: string;
  sender: 'user' | 'agent';
};

export function ChatBubble({ text, sender }: ChatBubbleProps) {
  const isUser = sender === 'user';
  
  return (
    <div
      className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-lg'
          : 'bg-gray-100 text-gray-800 rounded-bl-lg'
      }`}
    >
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}