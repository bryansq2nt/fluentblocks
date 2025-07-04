// app/exercises/milestone/[milestoneId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Reutilizando tus componentes de juego
import DynamicSentenceBuilder from '@/components/game/DynamicSentenceBuilder';
import { EngagingLoadingScreen } from '@/components/game/components/EngagingLoadingScreen';
import { ExerciseTrackingProvider } from '@/context/ExerciseTrackingContext';

interface Question {
  spanish: string;
  englishCorrect: string[];
}

export default function MilestoneExercisePage() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authenticatedFetch } = useAuth();

  const milestoneId = params.milestoneId as string;
  // Obtenemos el roadmapId de los parámetros de la URL
  const roadmapId = searchParams.get('roadmapId'); 

  useEffect(() => {
    if (!milestoneId || !roadmapId) {
        setError("Información de la lección incompleta.");
        setIsLoading(false);
        return;
    };

    const generateExercise = async () => {
      try {
        const response = await authenticatedFetch('/api/exercises/generate-from-milestone', {
          method: 'POST',
          body: JSON.stringify({ milestoneId, roadmapId }),
        });

        if (!response.ok) {
          throw new Error('No se pudo generar el ejercicio. Intenta de nuevo.');
        }

        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Un error desconocido ocurrió.");
      } finally {
        setIsLoading(false);
      }
    };

    generateExercise();
  }, [milestoneId, roadmapId, authenticatedFetch]);

  const handleSessionComplete = () => {
    // Aquí actualizaremos el estado del hito a 'COMPLETED'
    // y redirigiremos de vuelta al roadmap.
    console.log("Sesión completa! Redirigiendo al roadmap...");
    // TODO: Llamar a una API para marcar el hito como completado
    router.push(`/roadmap/${roadmapId}`);
  };

  if (isLoading) {
    return <EngagingLoadingScreen category="loading" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-500 text-xl">{error}</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Volver
        </button>
      </div>
    );
  }

  if (!questions) {
    return <div>No se encontraron preguntas para este ejercicio.</div>;
  }

  return (
    <ExerciseTrackingProvider>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <DynamicSentenceBuilder 
          questions={questions} 
          onSessionComplete={handleSessionComplete} 
        />
      </main>
    </ExerciseTrackingProvider>
  );
}