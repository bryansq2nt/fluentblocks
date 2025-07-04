// app/roadmap/[roadmapId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RoadmapData } from '@/Features/GoalPlanner/Domain/Roadmap';
import { MilestoneNode } from '@/Features/GoalPlanner/UI/MilestoneNode';
import { useAuth } from '@/hooks/useAuth';
import MainHeader from '@/shared/Components/MainHeader';
import { Target, Flag, LoaderCircle, AlertTriangle, SearchX, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Componentes de Estado ---

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <LoaderCircle className="w-12 h-12 animate-spin text-blue-400 mb-4" />
      <p className="text-xl tracking-wider">Construyendo tu camino al éxito...</p>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center px-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">¡Ups! Algo salió mal</h2>
      <p className="text-red-300 mb-6">{message}</p>
      <Link href="/goal-planner" legacyBehavior>
        <a className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Planificador</span>
        </a>
      </Link>
    </div>
  );
}

function NotFoundScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center px-4">
      <SearchX className="w-16 h-16 text-yellow-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Plan de Estudios no Encontrado</h2>
      <p className="text-gray-400 mb-6">No pudimos encontrar el plan que buscas. Puede que haya sido eliminado o el enlace sea incorrecto.</p>
      <Link href="/goal-planner" legacyBehavior>
        <a className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Crear un nuevo Plan</span>
        </a>
      </Link>
    </div>
  );
}


// --- Variantes de Animación ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


// --- Componente Principal de la Página ---
export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const { roadmapId } = params;
  const { authenticatedFetch } = useAuth();

  useEffect(() => {
    if (!roadmapId) {
        setError("No se proporcionó un ID de roadmap.");
        setLoading(false);
        return;
    }

    const fetchRoadmap = async () => {
      try {
        const response = await authenticatedFetch(`/api/goal-planner/${roadmapId}`);
        if (!response.ok) {
          if(response.status === 404) {
            setRoadmap(null); // Indica que no se encontró
          } else {
            throw new Error('No se pudo cargar el roadmap. Inténtalo de nuevo.');
          }
        } else {
          const data = await response.json();
          setRoadmap(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Un error desconocido ocurrió.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [roadmapId, authenticatedFetch]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!roadmap) {
    return <NotFoundScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MainHeader theme="dark" />
      <main className="w-full max-w-3xl mx-auto py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Target className="w-16 h-16 mx-auto text-blue-400 mb-4" />
          <h1 className="text-4xl font-bold text-white">Tu Meta Principal</h1>
          <p className="text-xl text-blue-300 italic mt-2">"{roadmap.goal.text}"</p>
        </motion.div>

        <motion.div 
          className="relative pl-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute left-[30px] top-8 h-[calc(100%-4rem)] w-1 bg-gray-700 rounded-full -z-10"></div>
          
          {roadmap.milestones.map((milestone, index) => (
            <motion.div key={milestone.id} className="flex items-center gap-8 mb-8" variants={itemVariants}>
              <div className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 z-10 border-4 border-gray-900">
                {index + 1}
              </div>
              <div className="w-full">
              <MilestoneNode milestone={milestone} roadmapId={roadmap.id} />              </div>
            </motion.div>
          ))}
          
          <motion.div className="flex items-center gap-8" variants={itemVariants}>
             <div className="flex-shrink-0 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center z-10 border-4 border-gray-900">
                <Flag className="w-8 h-8 text-white" />
              </div>
              <div className="w-full">
                <p className="text-2xl font-bold text-green-400">¡Meta Alcanzada!</p>
              </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}