// components/ChatMockup.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageList, Message } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

// Mensajes iniciales (sin cambios)
const initialAgentMessages: Omit<Message, 'id' | 'sender'>[] = [
  { text: '¡Hola! Bienvenido a FluentBlocks.' },
  { text: 'Puedes pedirme cosas como "enséñame a pedir café en inglés" o "cómo se dice \'tengo una reunión\'".' },
];

export default function ChatMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // useEffect para mensajes iniciales (sin cambios)
  useEffect(() => {
    // ...
  }, []);
  const processAgentResponse = async (currentMessages: Message[]) => {
    setIsAgentTyping(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages.map(({ text, sender }) => ({
            role: sender === 'user' ? 'user' : 'assistant',
            content: text,
          })),
        }),
      });

      if (!response.ok) throw new Error('Respuesta del servidor no fue exitosa');
      
      const data = await response.json();
      
      // Añade los mensajes de la respuesta secuencialmente
      for (let i = 0; i < data.messages.length; i++) {
        // Pausa entre mensajes para un efecto natural
        await new Promise(resolve => setTimeout(resolve, 1200)); 
        const agentMessage: Message = {
          id: Date.now() + i,
          text: data.messages[i],
          sender: 'agent',
        };
        setMessages(prev => [...prev, agentMessage]);
      }
      
      // Si el modelo indica que necesita seguir explicando, volvemos a llamar a la función
      if (data.requiresMoreContext) {
        // Necesitamos obtener el estado más reciente de los mensajes para la siguiente llamada
        setMessages(prev => {
          processAgentResponse(prev); // Llamada recursiva con el historial actualizado
          return prev;
        });
      } else {
        // Si ya terminó, desactivamos el "escribiendo..." y el usuario puede responder.
        setIsAgentTyping(false);
      }

    } catch (error) {
      console.error('Error al contactar la API de chat:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un problema. Por favor, intenta de nuevo. 🛠️',
        sender: 'agent',
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsAgentTyping(false);
    }
  };
  
  // useEffect para scroll (sin cambios)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAgentTyping) return;

    const userMessage: Message = { id: Date.now(), text, sender: 'user' };
    
    // Actualiza la UI con el mensaje del usuario y luego llama al procesador
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      processAgentResponse(newMessages); // Inicia el ciclo de respuesta de la IA
      return newMessages;
    });
  };

  return (
    <div className="w-full h-full bg-white flex flex-col md:max-w-3xl md:h-[80vh] md:rounded-2xl md:shadow-2xl md:border md:border-gray-200/50">
      <ChatHeader />
      <MessageList messages={messages} isAgentTyping={isAgentTyping} />
      <div ref={chatEndRef} /> 
      <ChatInput onSendMessage={handleSendMessage} isAgentTyping={isAgentTyping} />
    </div>
  );
}