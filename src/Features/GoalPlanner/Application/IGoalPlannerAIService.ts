// src/Features/GoalPlanner/Application/IGoalPlannerAIService.ts

import { RoadmapData } from "../Domain/Roadmap";
import { MilestoneData } from "../Domain/Milestone";

// --- Definimos los tipos de respuestas que la IA puede dar ---

// La IA necesita hacer otra pregunta para aclarar
export type AIQuestionResponse = {
  type: 'QUESTION';
  text: string;
};

// La IA tiene suficiente información y genera la propuesta
export type AIProposalResponse = {
  type: 'PROPOSAL';
  data: {
    goal: string;
    milestones: Omit<MilestoneData, 'id' | 'status'>[];
  };
  accompanyingMessage: string; 
};

// La IA está confundida o necesita ayuda
export type AIErrorResponse = {
    type: 'ERROR';
    text: string;
}

// Un tipo unión para todas las posibles respuestas
export type AIResponse = AIQuestionResponse | AIProposalResponse | AIErrorResponse;


// --- La interfaz del servicio (ACTUALIZADA) ---
export interface IGoalPlannerAIService {
  /**
   * Dada la conversación actual y el último mensaje del usuario,
   * decide cuál es el siguiente paso.
   * @param roadmap - El estado actual de la conversación.
   * @param conversationHistory - El historial completo de mensajes.
   */
  getNextStep(
    roadmap: RoadmapData, 
    conversationHistory: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<AIResponse>;
}