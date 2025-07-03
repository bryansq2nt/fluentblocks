// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { tropicalizedEnglishSystemPrompt } from '@/Features/ChatPractice/Lib/OpenAI/prompts'; 
import { performConsultation } from '@/Features/ChatPractice/Lib/OpenAI/consultation';  
import { getUserFromRequest } from '@/lib/auth/middleware';

export async function POST(request: Request) {
  try {
    // Obtener información del usuario autenticado
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron mensajes' }, { status: 400 });
    }

    // Log del uso para monitoreo
    console.log(`[CHAT] Usuario ${user.id} (${user.role}) inició conversación`);

    const agentResponseData = await performConsultation({
      systemPrompt: tropicalizedEnglishSystemPrompt,
      userContext: messages,
    });
    
    // Log de respuesta exitosa
    console.log(`[CHAT] Usuario ${user.id} completó conversación exitosamente`);
    
    return NextResponse.json(agentResponseData);

  } catch (error) {
    console.error('Error en la ruta /api/chat:', error);
    return NextResponse.json(
        { error: 'Lo siento, no pude procesar tu solicitud en este momento. Intenta de nuevo. 🛠️' }, 
        { status: 500 }
    );
  }
}