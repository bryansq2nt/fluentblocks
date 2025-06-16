// components/ChatMockup.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageList, Message } from './MessageList';
import { ChatInput } from './ChatInput';  
import { ChatHeader } from './ChatHeader';

// --- NUEVO: Definimos los mensajes iniciales en un array ---
const initialAgentMessages: Omit<Message, 'id' | 'sender'>[] = [
  { text: '¡Hola! Bienvenido a FluentBlocks.' },
  { text: 'Puedes pedirme cosas como "enséñame a pedir café en inglés" o "cómo se dice \'tengo una reunión\'".' },
];

export default function ChatMockup() {
  // --- CAMBIO 1: El estado de mensajes empieza VACÍO ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Efecto para hacer scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);
  
  // --- CAMBIO 2: Nuevo useEffect para cargar los mensajes iniciales ---
  useEffect(() => {
    // Para evitar que se ejecute en los re-renders de desarrollo, podemos usar un truco
    let isMounted = true; 
    
    // Inicia el indicador de "escribiendo" para el primer mensaje
    setIsAgentTyping(true);

    // Bucle para añadir mensajes secuencialmente
    initialAgentMessages.forEach((msg, index) => {
      setTimeout(() => {
        if (!isMounted) return; // Si el componente se desmontó, no hagas nada

        // Apaga el indicador de "escribiendo" justo antes de mostrar el mensaje
        setIsAgentTyping(false);
        
        const newMessage: Message = {
          id: Date.now() + index,
          text: msg.text,
          sender: 'agent',
        };
        setMessages(prev => [...prev, newMessage]);

        // Si no es el último mensaje, vuelve a encender el indicador
        if (index < initialAgentMessages.length - 1) {
          setTimeout(() => {
            if (isMounted) setIsAgentTyping(true);
          }, 500); // Pequeña pausa antes de empezar a "escribir" el siguiente
        }

      }, (index + 1) * 1500); // Retraso de 1.5s para el primer mensaje, 3s para el segundo, etc.
    });
    
    // Función de limpieza
    return () => {
      isMounted = false;
    };
  }, []); // El array vacío `[]` asegura que esto se ejecute solo una vez


  const handleSendMessage = (text: string) => {
    if (!text.trim() || isAgentTyping) return;

    const userMessage: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsAgentTyping(true);

    setTimeout(() => {
      const agentResponse: Message = {
        id: Date.now() + 1,
        text: `¡Excelente pregunta! En lugar de solo traducir "${text}", vamos a construir el patrón. Empecemos con el bloque principal...`,
        sender: 'agent',
      };
      setIsAgentTyping(false);
      setMessages(prev => [...prev, agentResponse]);
    }, 2500);
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