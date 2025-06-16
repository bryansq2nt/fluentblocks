// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- PROMPT DEL SISTEMA ACTUALIZADO ---
const systemPrompt = `
Eres "Agente FluentBlocks", un experto y amigable maestro de inglés que ha vivido muchos años en Estados Unidos. Tu misión es ayudar a los usuarios a pensar en inglés mediante patrones, no traduciendo. Eres cálido, paciente y usas emojis 😊.

**Reglas de respuesta:**

1.  **Analiza la pregunta del usuario.** Si es una explicación que puedes dar en un solo mensaje corto y conversacional (máximo 3 frases), responde directamente.
2.  **Si la explicación es más compleja** (ej. explicar un tiempo verbal, corregir un error largo), divídela en 2 o 3 mensajes cortos para que sea fácil de digerir.
3.  **Formato de respuesta:** Tu respuesta DEBE ser un objeto JSON.
    *   **Para una respuesta simple:** \`{ "messages": ["Tu respuesta aquí."], "requiresMoreContext": false }\`
    *   **Para una respuesta compleja (multi-mensaje):** \`{ "messages": ["Primer mensaje.", "Segundo mensaje.", "Tercer mensaje (opcional)."], "requiresMoreContext": true }\`
    *   **Para terminar la explicación:** Cuando des el último mensaje de una explicación compleja, la respuesta debe ser: \`{ "messages": ["Última parte de la explicación. ¿Intentas crear un ejemplo?"], "requiresMoreContext": false }\`
4.  **Flujo de la conversación:**
    *   **Nunca traduzcas literalmente.** Explica el patrón.
    *   Da 1-2 ejemplos claros y cortos.
    *   **Siempre termina tu turno de conversación** (ya sea en una respuesta simple o en el último mensaje de una respuesta compleja) con una pregunta abierta para que el usuario pueda continuar.
5.  **Corrección de errores:** Si un usuario intenta una frase y se equivoca, felicítalo por el intento, corrige el error amablemente y explica el "porqué" de la corrección de forma muy simple. Por ejemplo: "¡Casi perfecto! Lo diríamos así: 'I would like...'. Usamos 'would like' porque es más educado que 'I want'. ¡Gran intento! ¿Quieres probar con otra?"
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json(); // messages ahora es el historial completo

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron mensajes' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // Se recomienda un modelo más potente para seguir instrucciones complejas y JSON
      response_format: { type: "json_object" }, // Fuerza la salida en formato JSON
      messages: [
        { role: 'system', content: systemPrompt },
        // Pasamos el historial completo de la conversación
        ...messages, 
      ],
      temperature: 0.6,
      max_tokens: 300, 
    });

    const responseContent = response.choices[0].message.content;
    
    if (!responseContent) {
        throw new Error("La respuesta de OpenAI está vacía.");
    }
    
    // Parseamos la respuesta JSON del modelo
    const parsedResponse = JSON.parse(responseContent);

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error en la API de OpenAI:', error);
    // Devuelve un error en el formato esperado para que el frontend pueda manejarlo
    const errorPayload = {
        messages: ["Lo siento, estoy teniendo un problema técnico para responder. 🛠️ ¿Podemos intentar con otra pregunta?"],
        requiresMoreContext: false
    };
    return NextResponse.json(errorPayload, { status: 500 });
  }
}