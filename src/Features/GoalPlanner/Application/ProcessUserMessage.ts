// src/Features/GoalPlanner/Application/ProcessUserMessage.ts

import { Roadmap } from '../Domain/Roadmap';
import { IRoadmapRepository } from '../Domain/IRoadmapRepository';
import { IGoalPlannerAIService, AIResponse } from './IGoalPlannerAIService';

// --- Dependencias que el caso de uso necesita ---
export interface ProcessUserMessageDependencies {
  roadmapRepository: IRoadmapRepository;
  aiService: IGoalPlannerAIService;
}

// --- Datos de entrada para el caso de uso (ACTUALIZADO) ---
export interface ProcessUserMessageCommand {
  userId: string;
  message: string;
  roadmapId?: string;
  // Añadimos el historial de la conversación
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
}

// --- El caso de uso en sí ---
export class ProcessUserMessage {
  private readonly roadmapRepository: IRoadmapRepository;
  private readonly aiService: IGoalPlannerAIService;

  constructor({ roadmapRepository, aiService }: ProcessUserMessageDependencies) {
    this.roadmapRepository = roadmapRepository;
    this.aiService = aiService;
  }

  public async execute(command: ProcessUserMessageCommand): Promise<AIResponse> {
    // 1. Cargar o crear el Roadmap (nuestro estado de conversación)
    let roadmap = await this.findOrCreateRoadmap(command.userId, command.roadmapId);

    // 2. Actualizar el dominio con la acción del usuario
    if (roadmap.conversationState === 'GREETING_SENT') {
        roadmap.defineGoal(command.message);
    }
    
    // 3. Obtener la siguiente acción de la IA (ACTUALIZADO)
    // Pasamos el historial completo de la conversación
    const aiResponse = await this.aiService.getNextStep(
      roadmap.toData(), 
      command.conversationHistory // Pasamos el historial
    );
    
    // 4. Actualizar el dominio con la respuesta de la IA
    if (aiResponse.type === 'PROPOSAL') {
      roadmap.generateProposal(aiResponse.data.milestones);
    }
    
    // 5. Guardar el estado actualizado
    await this.roadmapRepository.save(roadmap);

    // 6. Devolver la respuesta de la IA para que la UI la muestre
    return aiResponse;
  }

  private async findOrCreateRoadmap(userId: string, roadmapId?: string): Promise<Roadmap> {
    if (roadmapId) {
      const roadmap = await this.roadmapRepository.findById(roadmapId);
      if (roadmap) return roadmap;
    }

    const existingRoadmap = await this.roadmapRepository.findByUserId(userId);
    if (existingRoadmap && existingRoadmap.conversationState !== 'COMPLETED') {
      return existingRoadmap;
    }

    const newRoadmap = Roadmap.startConversation(userId);
    return newRoadmap;
  }
}