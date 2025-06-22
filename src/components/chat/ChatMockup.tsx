// components/ChatMockup.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageList, Message } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatRateLimitMessage } from './ChatRateLimitMessage';
import { useTutorial } from '@/context/TutorialContext';
import { useAuth } from '@/hooks/useAuth';

export default function ChatMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { authenticatedFetch, refreshAuth, rateLimitInfo, clearRateLimit } = useAuth();

  const { isLoading, isTutorialActive, currentStep, nextStep,skipTutorial  } = useTutorial();
  
  
  useEffect(() => {
    if (!isTutorialActive) return;

    const lastMessage = messages[messages.length - 1];

   
    if (
      currentStep?.action?.type === 'WAIT_FOR_AI_RESPONSE' &&
      lastMessage?.sender === 'agent' &&
      lastMessage?.type === 'examples'
    ) {
      nextStep();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, currentStep]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const isChatEmpty = messages.length === 0;

    
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
  }, [isLoading, isTutorialActive, messages.length]);

    useEffect(() => {
      if (!isTutorialActive || !currentStep) return;
      if (currentStep.action?.type === 'PREFILL_INPUT') {
        setInputValue(currentStep.action.payload.text); 
      }
    }, [isTutorialActive, currentStep]);

  // Scroll automático optimizado
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages, isAgentTyping]); 

  // Limpiar la conversación cuando se activa el tutorial
  useEffect(() => {
    if (isTutorialActive) {
      setMessages([]);
      setInputValue('');
      setIsAgentTyping(false);
    }
  }, [isTutorialActive]);

  // Función para manejar el timeout del rate limit
  const handleRateLimitTimeout = () => {
    // Limpiar el estado de rate limit
    clearRateLimit();
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAgentTyping) return;

   if (isTutorialActive && currentStep?.action?.type === 'PREFILL_INPUT') {
      nextStep();
    }

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
    setInputValue('');
    

    try {
      const response = await authenticatedFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.type === 'text')
            .map(({ sender, content }) => ({
              role: sender === 'user' ? 'user' : 'assistant',
              content: content,
            })),
        }),
      });

      if (!response.ok) {
        // Si el error es 401, intentar refrescar la autenticación y reintentar
        if (response.status === 401) {
          console.warn('[AUTH] API key inválida. Intentando refrescar...');
          await refreshAuth();
          // Opcional: podrías reintentar el mensaje aquí
        }
        
        // Manejar específicamente el error de rate limit
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
          const minutes = Math.ceil(retryAfter / 60);
          
          throw new Error(`Has enviado demasiados mensajes muy rápido. Por favor espera ${minutes} minuto${minutes > 1 ? 's' : ''} antes de enviar otro mensaje.`);
        }
        
        // Para otros errores, intentar leer el body solo una vez
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

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
      
      let errorMessage = 'Lo siento, hubo algún error. Intenta de nuevo.';
      
      if (error instanceof Error) {
        // Si es un error de rate limit, usar el mensaje específico
        if (error.message.includes('demasiados mensajes') || error.message.includes('Rate limit')) {
          errorMessage = 'Has enviado demasiados mensajes muy rápido. Por favor espera un momento antes de enviar otro mensaje.';
        } else {
          errorMessage = error.message;
        }
      }
      
      const errorResponse: Message = {
        id: Date.now() + 1,
        type: 'text',
        sender: 'agent',
        content: errorMessage,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
      if (isTutorialActive) {
        skipTutorial();
      }
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
    {/* Mostrar mensaje de rate limit si el usuario está bloqueado */}
    {rateLimitInfo.isBlocked && (
      <ChatRateLimitMessage
        retryAfter={rateLimitInfo.retryAfter}
        message={rateLimitInfo.message}
        onTimeout={handleRateLimitTimeout}
      />
    )}
    
    {/* Chat normal cuando no está bloqueado */}
    {!rateLimitInfo.isBlocked && (
      <>
        <MessageList 
          messages={messages} 
          isAgentTyping={isAgentTyping} 
          chatEndRef={chatEndRef}
        />
        <ChatInput 
            inputValue={inputValue} 
            setInputValue={setInputValue} 
            onSendMessage={handleSendMessage} 
            isAgentTyping={isAgentTyping}
          />
      </>
    )}
</div>
  );
}