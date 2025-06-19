// components/ChatMockup.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageList, Message } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useTutorial } from '@/context/TutorialContext';




export default function ChatMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const effectRan = useRef(false);

  const { isLoading, isTutorialActive, currentStep, nextStep } = useTutorial();
  // --- LÓGICA DE INICIO: TUTORIAL O SALUDO NORMAL ---
  useEffect(() => {
    if (isLoading) {
      return;
    }
    const isChatEmpty = messages.length === 0;

    
    // Si NO hay tutorial activo y el chat está vacío, es un usuario recurrente.
    if (!isTutorialActive && isChatEmpty) {
      const fetchGreeting = async () => {
        setIsAgentTyping(true);
      
        await new Promise(resolve => setTimeout(resolve, 1500));
        const greetingMessage: Message = {
          id: Date.now(),
          type: 'text',
          sender: 'agent',
          content: '¡De vuelta a la acción! ¿Qué quieres aprender hoy?',
          timestamp: new Date().toISOString()
        };
        setMessages([greetingMessage]);
        setIsAgentTyping(false);
      };

      fetchGreeting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isTutorialActive, messages.length]);

    // --- MANEJO DE PASOS DEL TUTORIAL ---
    useEffect(() => {
      if (!isTutorialActive || !currentStep) return;
      if (currentStep.action?.type === 'PREFILL_INPUT') {
        setInputValue(currentStep.action.payload.text); 
      }
    }, [isTutorialActive, currentStep]);

    // Mantiene el scroll al final de la conversación
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isAgentTyping]);




  // Mantiene el scroll al final de la conversación
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isAgentTyping]);

  // Maneja el envío de mensajes del usuario
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAgentTyping) return;

    // 2. Si el tutorial está activo, avanza al siguiente paso
    if (isTutorialActive) {
      nextStep();
    }
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
      if (isTutorialActive && currentStep?.action?.type === 'WAIT_FOR_AI_RESPONSE') {
        nextStep();
      }

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
    setInputValue('');
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
    <ChatInput 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        onSendMessage={handleSendMessage} 
        isAgentTyping={isAgentTyping}
      />
</div>
  );
}