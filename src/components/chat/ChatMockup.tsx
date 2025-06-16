// components/ChatMockup.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageList, Message } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

// Mensajes de bienvenida, ahora con la estructura completa del tipo Message
const initialMessages: Message[] = [
  { 
    id: 1, type: 'text', sender: 'agent', content: '¡Bienvenido a FluentBlocks AI! Soy su compañero virtual de inglés y juntos haremos cada lección práctica y divertida.', 
    timestamp: new Date(Date.now() + 1000).toISOString() // Timestamps ligeramente diferentes
  },
  { 
    id: 2, type: 'text', sender: 'agent', content: '¿Tiene un objetivo en mente? Por ejemplo, “pedir un café en Nueva York” o “presentarse en una entrevista de trabajo”. ¡Yo le ayudo a conseguirlo!', 
    timestamp: new Date(Date.now() + 2000).toISOString()
  },
  { 
    id: 3, type: 'text', sender: 'agent', content: 'Usted decide el ritmo y el tema: desde vocabulario básico hasta expresiones coloquiales reales de la calle.', 
    timestamp: new Date(Date.now() + 3000).toISOString()
  },
  { 
    id: 4, type: 'text', sender: 'agent', content: 'Por ejemplo, podemos explorar la diferencia entre “there” y “here”, o ver cómo usar “in”, “at” y “on” sin confusiones.', 
    timestamp: new Date(Date.now() + 4000).toISOString()
  },
  { 
    id: 5, type: 'text', sender: 'agent', content: 'Cuando esté listo, simplemente pregunte o elija un tema, y empezaré con ejemplos interactivos que usted podrá practicar al instante.', 
    timestamp: new Date(Date.now() + 5000).toISOString()
  },
];



export default function ChatMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const effectRan = useRef(false);

 // --- CAMBIO CLAVE: useEffect para mensajes de bienvenida secuenciales ---
 useEffect(() => {
  // Si el efecto ya se ejecutó, no hacer nada.
  // En modo estricto, effectRan.current será `true` en el segundo montaje.
  if (effectRan.current === true) {
    return;
  }

  const introduceAgent = async () => {
    // No necesitamos la comprobación de `messages.length` gracias al cerrojo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < initialMessages.length; i++) {
      setIsAgentTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));
      
      setIsAgentTyping(false);
      setMessages(prev => [...prev, initialMessages[i]]);

      // No esperamos después del último mensaje
      if (i < initialMessages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  introduceAgent();

  // --- CAMBIO CLAVE 2: Marcar que el efecto se ha ejecutado ---
  // La función de limpieza se ejecuta en el desmontaje.
  // Aquí es donde activamos el "cerrojo" para el siguiente montaje.
  return () => {
    effectRan.current = true;
  };
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