'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, XCircle } from 'lucide-react';
import { LessonIntro } from '@/components/game/LessonIntro'; // Asegúrate de que la ruta sea correcta
import { AnimatePresence } from 'framer-motion';
import DynamicSentenceBuilder from '@/components/game/DynamicSentenceBuilder'; // Importa el nuevo constructor
import MainHeader from '@/shared/Components/MainHeader';
import { GeneratedExerciseUserInteractions } from '@/components/game/GeneratedExerciseUserInteractions';
import { EngagingLoadingScreen } from '@/components/game/components/EngagingLoadingScreen';
import { useAuth } from '@/hooks/useAuth'; // Importar hook
import { RateLimitMessage } from '@/components/common/RateLimitMessage'; // Importar el nuevo componente

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
  const { authenticatedFetch, rateLimitInfo } = useAuth(); // Obtener rateLimitInfo
  
  const [exerciseData, setExerciseData] = useState<ExerciseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [introCompleted, setIntroCompleted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const hasGeneratedRef = useRef(false); // Cambiado a useRef para evitar re-renders

  // Efecto que se ejecuta una vez para obtener los datos del ejercicio
  useEffect(() => {
    console.log('[DEBUG] useEffect ejecutándose, searchParams:', searchParams.toString());
    const lessonParam = searchParams.get('lesson');
    console.log('[DEBUG] lessonParam:', lessonParam ? 'existe' : 'no existe');
    
    // Evitar llamadas duplicadas
    if (hasGeneratedRef.current) {
      console.log('[DEBUG] Ya se generó el ejercicio, saltando...');
      return;
    }
    
    if (lessonParam) {
      try {
        // Decodifica y parsea los datos de la lección que vienen en la URL
        const lessonData = JSON.parse(decodeURIComponent(lessonParam));
        console.log('[DEBUG] lessonData parseado correctamente');
        
        const generateExercise = async () => {
          console.log('[DEBUG] Iniciando generateExercise');
          hasGeneratedRef.current = true; // Marcar como generado inmediatamente
          setIsLoading(true);
          setError(null);
          try {
            // Llama a nuestra nueva API para que la IA genere el ejercicio
            const response = await authenticatedFetch('/api/generate-exercise', {
              method: 'POST',
              body: JSON.stringify({ lessonData }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "No se pudo generar el ejercicio desde el servidor.");
            }

            const data = await response.json();
            console.log('[DEBUG] Ejercicio generado exitosamente');
            setExerciseData(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            console.error('[DEBUG] Error en generateExercise:', e);
            setError(e.message);
            hasGeneratedRef.current = false; // Resetear en caso de error para permitir reintento
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
  }, [searchParams, authenticatedFetch]); // Removido hasGenerated de las dependencias

  // Esta función se pasa al componente LessonIntro
  const handleIntroComplete = () => {
    setIntroCompleted(true);
  };

  // Esta función se pasa al componente DynamicSentenceBuilder
  const handleSessionComplete = () => {
    setSessionCompleted(true);
    router.push('/chat');
  };

  // --- Renderizado Condicional de la Página ---

  // Prioridad 1: Mostrar mensaje de Rate Limit si el usuario está bloqueado
  if (rateLimitInfo.isBlocked) {
    return (
      <RateLimitMessage 
        retryAfter={rateLimitInfo.retryAfter}
        message="Has generado muchos ejercicios muy rápido. ¡Dale un respiro a nuestra IA!"
      />
    );
  }

  if (isLoading) {
    return <EngagingLoadingScreen category="loading" />;
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
          <GeneratedExerciseUserInteractions>
            <DynamicSentenceBuilder 
              questions={exerciseData.questions}
              onSessionComplete={handleSessionComplete}
            />
          </GeneratedExerciseUserInteractions>
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