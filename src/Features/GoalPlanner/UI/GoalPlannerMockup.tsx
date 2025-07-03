// src/Features/GoalPlanner/UI/GoalPlannerMockup.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

import { MessageList, Message } from '@/Features/ChatPractice/components/MessageList';
import { ChatInput } from '@/Features/ChatPractice/components/ChatInput';
import { AIResponse } from '../Application/IGoalPlannerAIService';
import { RoadmapProposalData } from './RoadmapProposalCard';

export function GoalPlannerMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [roadmapId, setRoadmapId] = useState<string | undefined>(undefined);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { authenticatedFetch } = useAuth();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  useEffect(() => {
    const greetingMessage: Message = {
      id: Date.now(),
      type: 'text',
      sender: 'agent',
      content: '¡Hola! Soy Athena, tu coach de aprendizaje. ¿Cuál es la primera gran meta que te gustaría alcanzar con el inglés?',
      timestamp: new Date().toISOString()
    };
    setMessages([greetingMessage]);
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };
  
  const handleConfirmProposal = async () => {
    addMessage({
        id: Date.now(),
        type: 'text',
        sender: 'agent',
        content: "¡Genial! Preparando tu mapa de aprendizaje... 🚀",
        timestamp: new Date().toISOString()
    });
    setIsAwaitingConfirmation(false);
    setTimeout(() => {
        router.push(`/roadmap/${roadmapId || 'default'}`);
    }, 1500);
  };
  
  const handleRequestRevision = () => {
    setIsAwaitingConfirmation(false);
    addMessage({
        id: Date.now(),
        type: 'text',
        sender: 'agent',
        content: "¡Claro! Dime qué te gustaría cambiar o ajustar en el plan.",
        timestamp: new Date().toISOString()
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAgentTyping) return;

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

    const conversationHistory = newMessages
        .filter(msg => msg.type === 'text')
        .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content as string
        }));
    // Quitamos el saludo inicial para no confundir a la IA
    if(conversationHistory.length > 0 && conversationHistory[0].role === 'assistant') {
        conversationHistory.shift();
    }


    try {
      const response = await authenticatedFetch('/api/goal-planner/message', {
        method: 'POST',
        body: JSON.stringify({ 
            message: text, 
            roadmapId, 
            conversationHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'La respuesta de la red no fue exitosa.');
      }

      const agentResponseData: AIResponse = await response.json();
      
      if (agentResponseData.type === 'PROPOSAL') {
        const proposalContent: RoadmapProposalData = {
          goal: agentResponseData.data.goal,
          milestones: agentResponseData.data.milestones,
          accompanyingMessage: agentResponseData.accompanyingMessage,
        };
        if (!roadmapId) setRoadmapId(Date.now().toString()); 
        
        addMessage({
          id: Date.now() + 1,
          type: 'roadmap_proposal',
          sender: 'agent',
          content: proposalContent,
          timestamp: new Date().toISOString()
        });
        setIsAwaitingConfirmation(true);
      } else {
         addMessage({
          id: Date.now() + 1,
          type: 'text',
          sender: 'agent',
          content: agentResponseData.type === 'QUESTION' ? agentResponseData.text : "Hubo un error, intenta de nuevo.",
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      addMessage({
        id: Date.now() + 1,
        type: 'text',
        sender: 'agent',
        content: 'Uups, algo salió mal. Por favor, intenta enviar tu mensaje de nuevo.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsAgentTyping(false);
    }
  };

  return (
     <div className="w-full h-full bg-white flex flex-col md:max-w-3xl md:h-[85vh] md:rounded-2xl md:shadow-2xl md:border md:border-gray-200/50">
      <MessageList 
        messages={messages} 
        isAgentTyping={isAgentTyping} 
        chatEndRef={chatEndRef}
        onConfirmProposal={handleConfirmProposal}
        onRequestRevision={handleRequestRevision}
      />
      <ChatInput 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          onSendMessage={handleSendMessage} 
          isAgentTyping={isAgentTyping || isAwaitingConfirmation}
        />
    </div>
  );
}