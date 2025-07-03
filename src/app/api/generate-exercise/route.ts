// app/api/generate-exercise/route.ts

import { NextResponse } from 'next/server';
import { generateExerciseFromLesson } from '@/Features/ChatPractice/Lib/OpenAI/consultation';
import { getUserFromRequest } from '@/lib/auth/middleware';

const cleanPunctuation = (words: string[]): string[] => {
    if (words.length === 0) return [];
    
    // 1. Une la oración
    let sentence = words.join(' ');
    
    // 2. Elimina los puntos al final de la oración
    if (sentence.endsWith('.')) {
      sentence = sentence.slice(0, -1);
    }
    
    // 3. Vuelve a dividir en palabras
    return sentence.split(' ');
  };

export async function POST(request: Request) {
  try {
    // Obtener información del usuario autenticado
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const { lessonData } = await request.json();
    if (!lessonData) {
      return NextResponse.json({ error: 'No se proporcionaron datos de la lección' }, { status: 400 });
    }

    // Log del uso para monitoreo
    console.log(`[EXERCISE] Usuario ${user.id} (${user.role}) generando ejercicio`);

    const exerciseJson = await generateExerciseFromLesson(lessonData);
    const cleanedExercise = {
        ...exerciseJson,
        questions: exerciseJson.questions.map((q: { spanish: string, englishCorrect: string[] }) => ({
          ...q,
          // Aplicamos la función de limpieza a cada array de respuestas correctas
          englishCorrect: cleanPunctuation(q.englishCorrect),
        })),
      };

    // Log de respuesta exitosa
    console.log(`[EXERCISE] Usuario ${user.id} completó generación exitosamente`);
    
    return NextResponse.json(cleanedExercise);

  } catch (error) {
    console.error('Error en /api/generate-exercise:', error);
    return NextResponse.json({ error: 'No se pudo generar el ejercicio.' }, { status: 500 });
  }
}