// components/ChatMockup.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageList, Message } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

// Mensajes de bienvenida, ahora con la estructura completa del tipo Message
const initialMessages: Message[] = [
  { 
    id: 1, 
    type: 'text', 
    sender: 'agent', 
    content: '¡Hola! Soy FluentBlocks AI. ¿Listo para aprender inglés de una manera distinta?', 
    timestamp: new Date().toISOString() 
  },
  { 
    id: 2, 
    type: 'text', 
    sender: 'agent', 
    content: 'Puedes preguntarme sobre cualquier tema de inglés. ¿Qué te gustaría aprender hoy?', 
    timestamp: new Date().toISOString() 
  },
  { 
    id: 3, 
    type: 'text', 
    sender: 'agent', 
    content: 'Por ejemplo, puedes preguntarme cual es la diferencia entre "There" y "Here".', 
    timestamp: new Date().toISOString() 
  },
  { 
    id: 4, 
    type: 'text', 
    sender: 'agent', 
    content: 'Como usar "In", "At", "On" de manera correcta ?', 
    timestamp: new Date().toISOString() 
  },
  { 
    id: 5, 
    type: 'text', 
    sender: 'agent', 
    content: 'Basicamente puedes preguntarme cualquier cosa sobre el inglés', 
    timestamp: new Date().toISOString() 
  },
];

export default function ChatMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Carga los mensajes de bienvenida al inicio
  useEffect(() => {
    setMessages(initialMessages);
  }, []);
  
  // Mantiene el scroll al final de la conversación
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isAgentTyping]);

  // Maneja el envío de mensajes del usuario
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAgentTyping) return;

    // 1. Añade el mensaje del usuario con su timestamp
    const userMessage: Message = { 
      id: Date.now(), 
      type: 'text', 
      sender: 'user', 
      content: text, 
      timestamp: new Date().toISOString() 
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsAgentTyping(true);

    try {
      // 2. Llama a la API con el historial
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.type === 'text')
            .map(({ sender, content }) => ({
              role: sender === 'user' ? 'user' : 'assistant',
              content: content,
            })),
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // 3. Crea el mensaje del agente con su timestamp
      const agentResponse: Message = {
        id: Date.now() + 1,
        type: 'examples',
        sender: 'agent',
        content: data,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentResponse]);

    } catch (error) {
      console.error('Error al contactar la API de chat:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        type: 'text',
        sender: 'agent',
        content: 'Lo siento, my G. Se me cruzaron los cables. Intenta de nuevo. 🛠️',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  return (
    <div 
    className="
        w-full h-full bg-white flex flex-col md:max-w-3xl md:h-[85vh] md:rounded-2xl md:shadow-2xl md:border md:border-gray-200/50
    "
>
    <ChatHeader />
    <MessageList messages={messages} isAgentTyping={isAgentTyping} />
    <div ref={chatEndRef} /> 
    <ChatInput onSendMessage={handleSendMessage} isAgentTyping={isAgentTyping} />
</div>
  );
}