import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializa el cliente de OpenAI. La clave se toma automáticamente de las variables de entorno.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Este es un endpoint POST genérico para generar contenido JSON desde OpenAI.
 * Acepta un cuerpo de solicitud con:
 * - systemPrompt: Las instrucciones detalladas para la IA.
 * - userExample: Un ejemplo del formato JSON deseado.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { systemPrompt, userExample, temperature = 0.7 } = body;

    // Validación de la entrada
    if (!systemPrompt || !userExample) {
      return NextResponse.json(
        { error: '`systemPrompt` and `userExample` are required in the request body.' },
        { status: 400 }
      );
    }

    // Llamada a la API de OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125', // Modelo rápido y optimizado para JSON
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userExample }, // Proveer un ejemplo es clave para un buen resultado
      ],
      temperature: temperature,
      response_format: { type: 'json_object' }, // Garantiza que la respuesta sea un JSON válido
    });

    const jsonContent = response.choices[0].message.content;

    if (!jsonContent) {
      throw new Error('No content received from OpenAI');
    }

    // El contenido ya es un string JSON, lo parseamos para enviarlo como un objeto JSON real.
    const parsedData = JSON.parse(jsonContent);

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Error in generate-json API:', error);
    
    // Devolvemos un error genérico para no exponer detalles internos
    return NextResponse.json(
      { error: 'Failed to generate content from OpenAI.' },
      { status: 500 }
    );
  }
}