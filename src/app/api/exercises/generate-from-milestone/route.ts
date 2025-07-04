// app/api/exercises/generate-from-milestone/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getUserFromRequest } from '@/lib/auth/middleware';
import { GetRoadmap } from '@/Features/GoalPlanner/Application/GetRoadmap';
import { InMemoryRoadmapRepository } from '@/Features/GoalPlanner/Infrastructure/InMemoryRoadmapRepository';
import { sentenceBuilderExercisePrompt } from '@/Features/GoalPlanner/Infrastructure/prompts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Esquema que OpenAI debe seguir para crear el ejercicio
const exerciseSchema: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function = {
  name: "generateSentenceBuilderExercise",
  description: "Genera una lista de 5 preguntas de construcción de oraciones para un hito de aprendizaje específico.",
  parameters: {
    type: "object",
    properties: {
      questions: {
        type: "array",
        description: "Una lista de exactamente 5 preguntas para el ejercicio.",
        items: {
          type: "object",
          properties: {
            spanish: {
              type: "string",
              description: "La oración en español que el usuario debe construir."
            },
            englishCorrect: {
              type: "array",
              items: { type: "string" },
              description: "La oración correcta en inglés, desglosada en un array de palabras/bloques."
            }
          },
          required: ["spanish", "englishCorrect"]
        }
      }
    },
    required: ["questions"]
  }
};

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { roadmapId, milestoneId } = await request.json();
    if (!roadmapId || !milestoneId) {
      return NextResponse.json({ error: 'Faltan roadmapId o milestoneId' }, { status: 400 });
    }

    // 1. Cargar el roadmap para encontrar el hito
    const getRoadmapCase = new GetRoadmap(new InMemoryRoadmapRepository());
    const roadmap = await getRoadmapCase.execute(roadmapId);
    const milestone = roadmap?.milestones.find(m => m.id === milestoneId);

    if (!milestone) {
      return NextResponse.json({ error: 'Hito no encontrado' }, { status: 404 });
    }
    
    // 2. Construir el prompt para la IA
    const userPrompt = `Por favor, crea un ejercicio de construcción de oraciones para el siguiente hito:\n\nTítulo: "${milestone.title}"\nDescripción: "${milestone.description}"`;

    // 3. Llamar a OpenAI para generar las preguntas
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sentenceBuilderExercisePrompt },
        { role: "user", content: userPrompt }
      ],
      functions: [exerciseSchema],
      function_call: { name: "generateSentenceBuilderExercise" },
    });

    const functionCall = response.choices[0].message.function_call;
    if (!functionCall || !functionCall.arguments) {
      throw new Error("La IA no generó el ejercicio como se esperaba.");
    }
    
    const exerciseData = JSON.parse(functionCall.arguments);
    
    return NextResponse.json(exerciseData);

  } catch (error) {
    console.error("Error generando ejercicio:", error);
    return NextResponse.json({ error: "No se pudo generar el ejercicio." }, { status: 500 });
  }
}