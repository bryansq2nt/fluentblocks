// components/chat/ChatBubble.tsx
'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type ChatBubbleProps = {
  text: string;
  sender: 'user' | 'agent';
  timestamp: string; // Necesitamos el timestamp para mostrarlo al hacer hover
  isFirstInGroup: boolean; // Para aplicar el border-radius asimétrico
};

export function ChatBubble({ text, sender, timestamp, isFirstInGroup }: ChatBubbleProps) {
  const isUser = sender === 'user';
  const time = new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // Clases base para todas las burbujas
  const baseClasses = 'group relative max-w-[75%] px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200';
  
  // Clases específicas para el remitente
  const senderClasses = isUser
    ? `bg-[#05668D] text-white ${isFirstInGroup ? 'rounded-t-2xl rounded-bl-2xl' : 'rounded-l-2xl rounded-r-2xl'}`
    : `bg-[#F5F7FA] text-[#333] ${isFirstInGroup ? 'rounded-t-2xl rounded-br-2xl' : 'rounded-l-2xl rounded-r-2xl'}`;

  return (
    <div className={`${baseClasses} ${senderClasses}`}>
      <p className="text-[16px] leading-[24px] whitespace-pre-wrap">{text}</p>
      
      {/* Metadatos que aparecen al hacer hover */}
      <div className="absolute bottom-1 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-xs text-gray-400">{time}</span>
        {isUser && <Check className="w-3 h-3 text-gray-400" />}
      </div>
    </div>
  );
}