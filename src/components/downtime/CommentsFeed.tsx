// components/CommentsFeed.tsx
'use client';

// Importaciones necesarias de React
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

// Definimos el tipo de dato para un comentario individual
type Comment = {
  rating: number;
  comment: string;
  timestamp: string;
};

// Un pequeño mapa para mostrar un emoji según el rating
const ratingEmojis: { [key: number]: string } = {
  1: '😞',
  2: '😟',
  3: '😐',
  4: '🙂',
  5: '😄',
};

// Función para formatear la fecha de forma amigable (sin cambios)
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace un momento';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `hace ${diffInDays} d`;
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

// Definimos el "handle" o la "manija" que expondremos al componente padre.
// Solo contendrá la función para refrescar.
export type CommentsFeedHandle = {
  refreshComments: () => void;
};

// Usamos forwardRef para que el componente pueda aceptar una `ref` desde page.tsx
const CommentsFeed = forwardRef<CommentsFeedHandle>((props, ref) => {
  // --- ESTADO Y LÓGICA INTERNA DEL COMPONENTE ---
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // La función para cargar los comentarios ahora vive aquí dentro
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/comments'); // Llama a nuestra propia API
      if (!response.ok) throw new Error("La respuesta de la red no fue correcta");
      
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      setComments([]); // En caso de error, muestra una lista vacía
    } finally {
      setIsLoading(false);
    }
  };

  // Carga los comentarios iniciales cuando el componente se monta por primera vez
  useEffect(() => {
    fetchComments();
  }, []);
  
  // Hook especial para exponer funciones al componente padre a través de la ref
  useImperativeHandle(ref, () => ({
    // Cuando el padre llame a `ref.current.refreshComments()`, se ejecutará esta función
    refreshComments() {
      fetchComments();
    }
  }));

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 text-left">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">El Mural de Apoyo de la Comunidad</h3>
      
      <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {isLoading && (
          // Estado de Carga: Muestra esqueletos para una mejor UX
          [...Array(3)].map((_, i) => (
            <li key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </li>
          ))
        )}

        {!isLoading && comments.length === 0 && (
          // Estado Vacío
          <p className="text-gray-500 text-center py-4">Aún no hay mensajes. ¡Sé el primero en dejar tu huella!</p>
        )}

        {!isLoading && comments.length > 0 && (
          // Estado con Datos
          comments.map((c, index) => (
            <motion.li
              key={`${c.timestamp}-${index}`} // Usamos una clave más robusta
              className="bg-white/80 p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <p className="text-gray-800">&quot;{c.comment}&quot;</p>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-500">{formatRelativeTime(c.timestamp)}</span>
                <span title={`Rating: ${c.rating} de 5`} className="text-xl">
                  {ratingEmojis[c.rating] || '👍'}
                </span>
              </div>
            </motion.li>
          ))
        )}
      </ul>
    </div>
  );
});

// Asignamos un `displayName` para facilitar la depuración en las herramientas de desarrollo de React
CommentsFeed.displayName = 'CommentsFeed';

export default CommentsFeed;