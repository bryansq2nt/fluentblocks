// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { tropicalizedEnglishSystemPrompt } from '@/lib/openai/prompts'; 
import { performConsultation } from '@/lib/openai/consultation';  

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron mensajes' }, { status: 400 });
    }

    const agentResponseData = await performConsultation({
      systemPrompt: tropicalizedEnglishSystemPrompt,
      userContext: messages,
    });
    
    return NextResponse.json(agentResponseData);

  } catch (error) {
    console.error('Error en la ruta /api/chat:', error);
    return NextResponse.json(
        { error: 'Lo siento, no pude procesar tu solicitud en este momento. Intenta de nuevo. 🛠️' }, 
        { status: 500 }
    );
  }
}