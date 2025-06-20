// lib/openai/consultation.ts
import OpenAI from 'openai';
import { exerciseGeneratorSystemPrompt } from './prompts';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const singleLessonSchema = {
  name: "generateSingleExampleLesson", // Coincide con el nombre en tu prompt
  description: "Genera una mini-lección de inglés basada en un solo ejemplo práctico.",
  parameters: {
    type: "object",
    properties: {
      // 1. EL PATRÓN (pattern)
      pattern: {
        type: "string",
        description: "El título de la lección, de 6-10 palabras, posiblemente con HTML."
      },
      // 2. EL EJEMPLO (example)
      example: {
        type: "object",
        description: "El único ejemplo de la lección, desglosado.",
        properties: {
          // 3. EL DESGLOSE (blocks)
          blocks: {
            type: "array",
            description: "La oración en inglés, dividida en 2-4 bloques lógicos.",
            items: {
              type: "object",
              properties: {
                text: { type: "string", description: "El bloque de texto en inglés." },
                es: { type: "string", description: "La traducción al español de este bloque específico." },
                type: { 
                  type: "string", 
                  description: "Tipo de bloque: subject, verb, modal, expression, preposition, object, context." 
                }
              },
              required: ["text", "es", "type"]
            }
          },
          // 4. TRADUCCIÓN COMPLETA (spanish_translation)
          spanish_translation: { 
            type: "string", 
            description: "La traducción natural de la idea completa al español." 
          },
        },
        required: ["blocks", "spanish_translation"]
      },
      // NOTA y CHALLENGE, que aunque no los pedimos explícitamente en el último prompt,
      // son parte de la estructura de datos que nuestro componente espera. Los añadiremos al prompt.
      note: { 
        type: "string", 
        description: "Una nota o 'tip' muy corto y útil (máx 15 palabras)." 
      },
      challenge: {
        type: "string",
        description: "Una pregunta o reto final para que el usuario practique."
      }
    },
    // Todos los campos que nuestro componente necesita son requeridos.
    required: ["pattern", "example", "note", "challenge"]
  }
};

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
      functions: [singleLessonSchema],
      function_call: { name: "generateSingleExampleLesson" },
      temperature: 0.6,
      max_tokens: 600 
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