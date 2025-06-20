// lib/openai/consultation.ts
import OpenAI from 'openai';
import { exerciseGeneratorSystemPrompt } from './prompts';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const functionSchema = [
  {
    name: "generateInteractiveExample",
    description: "Genera una lección interactiva para un patrón de inglés.",
    parameters: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: "El nombre del patrón explicado. Ej: 'Uso de `would` para peticiones'."
        },
        examples: {
          type: "array",
          description: "Una lista de 2 a 3 ejemplos claros y distintos.",
          items: {
            type: "object",
            properties: {
              blocks: {
                type: "array",
                description: "La frase en inglés, desglosada en bloques lógicos.",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string", description: "El bloque de texto en inglés." },
                    es: { type: "string", description: "La traducción al español de ESE bloque." },
                    type: { type: "string", description: "Tipo de bloque: 'subject', 'modal', 'verb', 'extra', etc." }
                  },
                  required: ["text", "es", "type"]
                }
              },
              // La traducción completa de la IDEA, no literal.
              spanish_translation: { type: "string", description: "La traducción natural y completa de la oración al español." },
              note: { type: "string", description: "Una nota corta sobre el contexto." }
            },
            // 'spanish' se renombra a 'spanish_translation' para más claridad
            required: ["blocks", "spanish_translation", "note"]
          }
        },
        challenge: {
          type: "string",
          description: "Una pregunta final abierta para invitar a la práctica."
        }
      },
      required: ["pattern", "examples", "challenge"]
    }
  }
];

export async function performConsultation(params: {
  systemPrompt: string;
  userContext: { role: "user" | "assistant" | "system"; content: string }[];
}) {
  const { systemPrompt, userContext } = params;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...userContext
      ],
      functions: functionSchema,
      function_call: { name: "generateInteractiveExample" },
      temperature: 0.6,
      max_tokens: 800 
    });

    const functionCall = response.choices[0].message.function_call;
    if (!functionCall || !functionCall.arguments) {
      throw new Error("La IA no llamó a la función como se esperaba.");
    }
    return JSON.parse(functionCall.arguments);
  } catch (error) {
    console.error('Error en la consulta a OpenAI:', error);
    throw new Error('Falló la consulta al servicio de IA.');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateExerciseFromLesson(lessonData: any) {
    const exerciseFunctionSchema = {
      name: "createInteractiveExercise",
      description: "Crea el contenido para una lección y ejercicio interactivo.",
      parameters: {
        type: "object",
        properties: {
          intro: {
            type: "object",
            properties: {
              icon: { type: "string", description: "Un solo emoji para representar la lección." },
              title: { type: "string", description: "Un título corto y atractivo para la lección." },
              messages: {
                type: "array",
                items: {
                  type: "object",
                  properties: { text: { type: "string" } },
                  required: ["text"]
                }
              }
            },
            required: ["icon", "title", "messages"]
          },
          questions: {
            type: "array",
            description: "Una lista de 5 oraciones de práctica.",
            items: {
              type: "object",
              properties: {
                spanish: { type: "string", description: "La oración en español que el usuario debe construir." },
                englishCorrect: { type: "array", items: { type: "string" }, description: "La oración correcta en inglés, desglosada en un array de palabras/bloques." }
              },
              required: ["spanish", "englishCorrect"]
            }
          }
        },
        required: ["intro", "questions"]
      }
    };
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: exerciseGeneratorSystemPrompt },
          { role: "user", content: `Aquí está la lección que el usuario quiere practicar. Por favor, crea un ejercicio basado en ella: ${JSON.stringify(lessonData)}` }
        ],
        functions: [exerciseFunctionSchema],
        function_call: { name: "createInteractiveExercise" },
      });
  
      const functionCall = response.choices[0].message.function_call;
      if (!functionCall || !functionCall.arguments) {
        throw new Error("La IA no generó el ejercicio.");
      }
      return JSON.parse(functionCall.arguments);
    } catch (error) {
      console.error('Error al generar ejercicio:', error);
      throw new Error('Falló la generación del ejercicio.');
    }
  }