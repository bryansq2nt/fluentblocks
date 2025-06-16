// app/practice/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, XCircle } from 'lucide-react';
import { LessonIntro } from '@/components/game/LessonIntro'; // Asegúrate de que la ruta sea correcta
import { AnimatePresence } from 'framer-motion';
import DynamicSentenceBuilder from '@/components/game/DynamicSentenceBuilder'; // Importa el nuevo constructor
import MainHeader from '@/components/game/MainHeader';
// --- Tipos de datos que esperamos de la API ---
interface Question {
  spanish: string;
  englishCorrect: string[];
}
interface ExerciseData {
  intro: {
    icon: string;
    title: string;
    messages: { text: string; list?: string[] }[];
  };
  questions: Question[];
}

// --- Componente principal que contiene la lógica ---
function PracticePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [exerciseData, setExerciseData] = useState<ExerciseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [introCompleted, setIntroCompleted] = useState(false);

  // Efecto que se ejecuta una vez para obtener los datos del ejercicio
  useEffect(() => {
    const lessonParam = searchParams.get('lesson');
    if (lessonParam) {
      try {
        // Decodifica y parsea los datos de la lección que vienen en la URL
        const lessonData = JSON.parse(decodeURIComponent(lessonParam));
        
        const generateExercise = async () => {
          setIsLoading(true);
          setError(null);
          try {
            // Llama a nuestra nueva API para que la IA genere el ejercicio
            const response = await fetch('/api/generate-exercise', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lessonData }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "No se pudo generar el ejercicio desde el servidor.");
            }

            const data = await response.json();
            setExerciseData(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            setError(e.message);
          } finally {
            setIsLoading(false);
          }
        };

        generateExercise();

      } catch (e) {
        console.log(e);
        setError("Los datos de la lección son inválidos o están corruptos.");
        setIsLoading(false);
      }
    } else {
      setError("No se encontraron datos de la lección para practicar.");
      setIsLoading(false);
    }
  }, [searchParams]);

  // Esta función se pasa al componente LessonIntro
  const handleIntroComplete = () => {
    setIntroCompleted(true);
  };

  // Esta función se pasa al componente DynamicSentenceBuilder
  const handleSessionComplete = () => {
    // Cuando el ejercicio termina, puedes mostrar un mensaje y redirigir
    alert("¡Felicidades! Has completado la práctica de este patrón.");
    router.push('/exercises/befluentai'); // Vuelve al chat o a la página que prefieras
  };


  // --- Renderizado Condicional de la Página ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg font-semibold">Creando tu lección personalizada...</p>
      </div>
    );
  }

  if (error || !exerciseData) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Oops! Hubo un problema</h2>
            <p>{error || "No se pudo cargar el ejercicio."}</p>
        </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 pt-24">
        <MainHeader />
        <AnimatePresence>
            {!introCompleted && (
                <LessonIntro 
                    icon={<span>{exerciseData.intro.icon}</span>}
                    title={exerciseData.intro.title}
                    messages={exerciseData.intro.messages}
                    onComplete={handleIntroComplete}
                />
            )}
        </AnimatePresence>

        {introCompleted && (
            <DynamicSentenceBuilder 
                questions={exerciseData.questions}
                onSessionComplete={handleSessionComplete}
            />
        )}
    </div>
  );
}

// --- Componente Contenedor con Suspense (Requerido por useSearchParams) ---
export default function PracticePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <p className="text-gray-600 mt-4">Cargando lección...</p>
            </div>
        }>
            <PracticePageContent />
        </Suspense>
    )
}