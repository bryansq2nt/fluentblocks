// app/api/goal-planner/message/route.ts

import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/middleware'; 

import { ProcessUserMessage, ProcessUserMessageCommand } from '@/Features/GoalPlanner/Application/ProcessUserMessage';
import { InMemoryRoadmapRepository } from '@/Features/GoalPlanner/Infrastructure/InMemoryRoadmapRepository';
import { OpenAIGoalPlanner } from '@/Features/GoalPlanner/Infrastructure/OpenAIGoalPlanner';

function composeProcessUserMessageUseCase() {
  const roadmapRepository = new InMemoryRoadmapRepository();
  const aiService = new OpenAIGoalPlanner();
  const useCase = new ProcessUserMessage({
    roadmapRepository,
    aiService,
  });
  return useCase;
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { message, roadmapId, conversationHistory } = body;

    if (!message || !conversationHistory) {
      return NextResponse.json({ error: 'Faltan el mensaje o el historial de la conversación' }, { status: 400 });
    }

    const processUserMessage = composeProcessUserMessageUseCase();

    const command: ProcessUserMessageCommand = {
      userId: user.id,
      message,
      roadmapId,
      conversationHistory,
    };

    // Obtenemos el resultado completo del caso de uso
    const { aiResponse, roadmap } = await processUserMessage.execute(command);
    
    console.log(`[GOAL_PLANNER] Comando completado para roadmap ${roadmap.id}`);

    // Devolvemos la nueva estructura de respuesta, incluyendo el ID
    return NextResponse.json({
      aiResponse: aiResponse,
      roadmapId: roadmap.id,
    });

  } catch (error) {
    console.error('Error en la ruta /api/goal-planner/message:', error);
    return NextResponse.json(
        { 
          type: 'ERROR',
          text: 'Ha ocurrido un error inesperado en el servidor. Por favor, intenta más tarde.'
        }, 
        { status: 500 }
    );
  }
}