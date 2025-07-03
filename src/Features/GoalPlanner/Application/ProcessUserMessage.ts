// src/Features/GoalPlanner/Application/ProcessUserMessage.ts

import { Roadmap } from '../Domain/Roadmap';
import { IRoadmapRepository } from '../Domain/IRoadmapRepository';
import { IGoalPlannerAIService, AIResponse } from './IGoalPlannerAIService';

// --- Dependencias que el caso de uso necesita ---
export interface ProcessUserMessageDependencies {
  roadmapRepository: IRoadmapRepository;
  aiService: IGoalPlannerAIService;
}

// --- Datos de entrada para el caso de uso ---
export interface ProcessUserMessageCommand {
  userId: string;
  message: string;
  roadmapId?: string;
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

  public async execute(command: ProcessUserMessageCommand): Promise<{ aiResponse: AIResponse; roadmap: Roadmap }> {
    // 1. Cargar o crear el Roadmap (con la nueva lógica)
    let roadmap = await this.findOrCreateRoadmap(command.userId, command.roadmapId);

    // 2. Actualizar el dominio con la acción del usuario
    if (roadmap.conversationState === 'GREETING_SENT' && command.message) {
        roadmap.defineGoal(command.message);
    }
    
    // 3. Obtener la siguiente acción de la IA
    const aiResponse = await this.aiService.getNextStep(
      roadmap.toData(), 
      command.conversationHistory
    );
    
    // 4. Actualizar el dominio con la respuesta de la IA
    if (aiResponse.type === 'PROPOSAL') {
      roadmap.generateProposal(aiResponse.data.milestones);
    }
    
    // 5. Guardar el estado actualizado
    await this.roadmapRepository.save(roadmap);

    // 6. Devolver la respuesta y el roadmap completo
    return { aiResponse, roadmap };
  }

  /**
   * Lógica actualizada para encontrar o crear un Roadmap.
   * Ahora prioriza la intención del frontend.
   */
  private async findOrCreateRoadmap(userId: string, roadmapId?: string): Promise<Roadmap> {
    // Si el frontend nos da un ID, lo usamos. Es la fuente de verdad.
    if (roadmapId) {
      const roadmap = await this.roadmapRepository.findById(roadmapId);
      // Si se encontró, lo devolvemos. Si no (quizás se borró), caerá al siguiente paso y creará uno nuevo.
      if (roadmap) {
        return roadmap;
      }
    }

    // SI NO HAY ROADMAP ID (undefined), el frontend indica que quiere empezar una nueva conversación.
    // IGNORAMOS cualquier roadmap activo anterior y creamos uno nuevo.
    // Esto soluciona el problema de la "conversación zombie" al refrescar la página.
    
    const newRoadmap = Roadmap.startConversation(userId);
    
    // ¡Importante! Debemos guardarlo inmediatamente para que tenga un ID persistente
    // que se pueda usar en las siguientes interacciones de esta misma conversación.
    await this.roadmapRepository.save(newRoadmap); 
    
    return newRoadmap;
  }
}