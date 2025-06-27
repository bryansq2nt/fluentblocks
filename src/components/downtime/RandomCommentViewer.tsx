// components/RandomCommentViewer.tsx
'use client';

// Importa los hooks necesarios
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Importa los 3 componentes de visualización
import FloatingComments from './FloatingComments';

type Comment = { rating: number; comment: string; timestamp: string };


// Define el "handle" que expondremos al padre
export type RandomCommentViewerHandle = {
  refresh: () => void;
};

// Envuelve el componente en forwardRef
const RandomCommentViewer = forwardRef<RandomCommentViewerHandle>((props, ref) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authenticatedFetch } = useAuth();

  const RandomViewer = useMemo(() => {
    return FloatingComments;
  }, []);

  // La función de carga ahora puede ser llamada desde fuera
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedFetch('/api/comments');
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchComments();
  }, []);

  // Expone la función `refresh` al componente padre
  useImperativeHandle(ref, () => ({
    refresh() {
      fetchComments();
    }
  }));


  if (isLoading) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-200 text-left">
        <div className="h-20 flex justify-center items-center">
            <p className="text-gray-500 animate-pulse">Cargando historias de la comunidad...</p>
        </div>
      </div>
    );
  }

  // No hay cambios en el JSX de renderizado
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 text-left">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">El Mural de Apoyo de la Comunidad</h3>
      <RandomViewer comments={comments} />
    </div>
  );
});

// Asigna un displayName para facilitar la depuración
RandomCommentViewer.displayName = 'RandomCommentViewer';

export default RandomCommentViewer;