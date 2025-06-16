// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { tropicalizedEnglishSystemPrompt } from '@/lib/openai/prompts'; // Importamos el "cerebro"
import { performConsultation } from '@/lib/openai/consultation';     // Importamos el "motor"

export async function POST(request: Request) {
  try {
    // 1. Recibe el historial de mensajes del frontend
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron mensajes' }, { status: 400 });
    }

    // 2. Llama a nuestra función de consulta reutilizable
    const agentResponseData = await performConsultation({
      systemPrompt: tropicalizedEnglishSystemPrompt,
      userContext: messages,
    });
    
    // 3. Devuelve el JSON estructurado que recibimos de la consulta
    return NextResponse.json(agentResponseData);

  } catch (error) {
    console.error('Error en la ruta /api/chat:', error);
    // Devolvemos un error estructurado para que el frontend pueda mostrar un mensaje amigable
    return NextResponse.json(
        { error: 'Lo siento, no pude procesar tu solicitud en este momento. Intenta de nuevo. 🛠️' }, 
        { status: 500 }
    );
  }
}