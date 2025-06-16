// lib/openai/consultation.ts

import OpenAI from 'openai';

// Inicializa el cliente de OpenAI una sola vez para reutilizarlo
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1) Define la ESTRUCTURA de la función que la IA debe "llamar".
// Esto es, en esencia, nuestro "modelo de respuesta esperada".
const functionSchema = [
  {
    name: "generateGrammarExamples",
    description: "Genera una explicación y ejemplos para un patrón gramatical o una frase en inglés.",
    parameters: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: "Una explicación muy corta y clara del patrón gramatical o el uso de la frase."
        },
        examples: {
          type: "array",
          description: "Una lista de 1 a 3 ejemplos de uso.",
          items: {
            type: "object",
            properties: {
              english: {
                type: "string",
                description: "La frase de ejemplo en inglés."
              },
              spanish: {
                type: "string",
                description: "La traducción o equivalente en español de la frase."
              },
              note: {
                type: "string",
                description: "Una nota breve sobre por qué el ejemplo suena natural o su contexto de uso."
              }
            },
            required: ["english", "spanish", "note"]
          }
        },
        challenge: {
            type: "string",
            description: "Una pregunta final abierta para invitar al usuario a practicar."
        }
      },
      required: ["pattern", "examples", "challenge"]
    }
  }
];

// 2) Define la función que realiza la consulta, recibiendo el prompt y el contexto.
export async function performConsultation(params: {
  systemPrompt: string;
  userContext: { role: "user" | "assistant" | "system"; content: string }[];
}) {
  const { systemPrompt, userContext } = params;

  try {
    // 3) Llama a la API de OpenAI
    const response = await openai.chat.completions.create({
      // Un modelo que soporte bien 'function_call' es crucial.
      // gpt-4-turbo o gpt-4o son ideales. gpt-4o-mini es una opción más económica.
      model: "gpt-4o-mini",
      messages: [
        // El prompt del sistema le da la personalidad
        { role: "system", content: systemPrompt },
        // El historial de la conversación le da el contexto
        ...userContext
      ],
      // Le pasamos la definición de nuestra función
      functions: functionSchema,
      // Forzamos a la IA a que SIEMPRE llame a esta función
      function_call: { name: "generateGrammarExamples" },
      temperature: 0.6,
      max_tokens: 500
    });

    const functionCall = response.choices[0].message.function_call;

    // 4) Verificamos que la IA realmente llamó a la función
    if (!functionCall || !functionCall.arguments) {
      throw new Error("La IA no llamó a la función como se esperaba.");
    }

    // El resultado viene como un string JSON, necesitamos "parsearlo" para convertirlo en un objeto real
    return JSON.parse(functionCall.arguments);

  } catch (error) {
    console.error('Error en la consulta a OpenAI:', error);
    // Lanzamos el error para que el siguiente nivel (la ruta de la API) lo maneje
    throw new Error('Falló la consulta al servicio de IA.');
  }
}