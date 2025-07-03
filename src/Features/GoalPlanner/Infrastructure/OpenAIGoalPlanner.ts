// src/Features/GoalPlanner/Infrastructure/OpenAIGoalPlanner.ts

import OpenAI from 'openai';
import { IGoalPlannerAIService, AIResponse } from '../Application/IGoalPlannerAIService';
import { RoadmapData } from '../Domain/Roadmap';
import { goalPlannerSystemPrompt } from './prompts';

export class OpenAIGoalPlanner implements IGoalPlannerAIService {
  private openai: OpenAI;
  private roadmapProposalSchema: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function = {
    name: "generateRoadmapProposal",
    description: "Genera un plan de estudios personalizado con hitos basado en la conversación con el usuario.",
    parameters: {
      type: "object",
      properties: {
        goal: {
          type: "string",
          description: "Un resumen conciso de la meta final del usuario, reformulada de forma clara y motivadora. Ej: 'Poder pedir comida y bebida en una cafetería con confianza'."
        },
        milestones: {
          type: "array",
          description: "Una lista de 3 a 5 hitos (lecciones principales) para alcanzar la meta.",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "El título del hito, corto y orientado a la acción. Ej: 'Hito 1: Saludos y Frases Esenciales'."
              },
              description: {
                type: "string",
                description: "Una descripción de 1-2 frases sobre lo que el usuario aprenderá en este hito."
              }
            },
            required: ["title", "description"]
          }
        },
        accompanyingMessage: {
            type: "string",
            description: "Un mensaje corto y amigable para presentarle el plan al usuario. Ej: '¡Listo! He diseñado este plan especialmente para ti. ¿Qué te parece?'"
        }
      },
      required: ["goal", "milestones", "accompanyingMessage"]
    }
  };

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set.");
    }
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  // Método ACTUALIZADO para aceptar el historial
  public async getNextStep(
    roadmap: RoadmapData, 
    conversationHistory: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<AIResponse> {
    
    // Construimos el historial de mensajes para la IA, ahora con el historial real
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: goalPlannerSystemPrompt },
        // Mapeamos el historial que nos llega de la UI al formato de OpenAI
        ...conversationHistory,
    ];

    try {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            functions: [this.roadmapProposalSchema],
            function_call: 'auto', 
        });

        const choice = response.choices[0].message;

        if (choice.function_call) {
            console.log('IA generó una propuesta:', choice.function_call.arguments);
            const parsedArgs = JSON.parse(choice.function_call.arguments);
            return {
                type: 'PROPOSAL',
                data: {
                    goal: parsedArgs.goal,
                    milestones: parsedArgs.milestones
                },
                accompanyingMessage: parsedArgs.accompanyingMessage
            };
        }

        if (choice.content) {
            console.log('IA hizo una pregunta:', choice.content);
            return {
                type: 'QUESTION',
                text: choice.content
            };
        }
        
        throw new Error('La IA no generó una respuesta válida.');

    } catch(error) {
        console.error("Error al llamar a OpenAI:", error);
        return {
            type: 'ERROR',
            text: 'Lo siento, estoy teniendo problemas para conectar. Por favor, inténtalo de nuevo en un momento.'
        }
    }
  }
}