// app/community/page.tsx
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Importa el componente Masonry
import Masonry from 'react-masonry-css';

import CommentModal from '@/components/downtime/CommentModal'; 

// --- Tipos y Datos ---
type Comment = {
  rating: number;
  comment: string;
  timestamp: string;
};

const ratingEmojis: { [key: number]: string } = {
  1: '😐', 2: '🙂', 3: '😊', 4: '🤩', 5: '❤️‍🔥',
};

function formatRelativeTime(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace un momento';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} d`;
}

// --- Componente para una Tarjeta de Comentario Individual ---
// Ya no necesita lógica de layout, solo se enfoca en su contenido.
function CommentCard({ comment, index }: { comment: Comment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50"
    >
      <div className="flex justify-between items-start mb-4">
        <MessageSquare className="w-8 h-8 text-blue-400" />
        <span className="text-3xl">{ratingEmojis[comment.rating] || '👍'}</span>
      </div>
      <p className="text-gray-800 text-lg mb-4 leading-relaxed">&quot;{comment.comment}&quot;</p>
      <p className="text-right text-sm text-gray-500 font-medium">
        - Anónimo, {formatRelativeTime(comment.timestamp)}
      </p>
    </motion.div>
  );
}

// --- Componente Principal de la Página de Comunidad ---
function CommunityPageContent() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const effectRan = useRef(false);
  
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/comments');
      if (!response.ok) throw new Error('La respuesta de la red no fue correcta');
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'share' && !effectRan.current) {
      setIsModalOpen(true);
      effectRan.current = true;
    }
  }, [searchParams]);

  const handleCommentSubmitted = () => {
    fetchComments();
  };

  // Define los puntos de quiebre para el layout Masonry
  const breakpointColumnsObj = {
    default: 3,
    1024: 2, // en pantallas de hasta 1024px, usa 2 columnas
    768: 1   // en pantallas de hasta 768px, usa 1 columna
  };

  return (
    <>
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
            El Corazón de Nuestra Comunidad
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Estas son las palabras y reacciones de las personas que, como tú, están construyendo este sueño con nosotros.
          </p>
        </motion.header>

        <div>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-200/50 p-6 rounded-2xl mb-8 animate-pulse h-48"></div>
              ))}
            </div>
          )}

          {!isLoading && comments.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Aún no hay mensajes en nuestro mural.</p>
              <Link href="/" className="mt-4 inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg">
                ¡Sé el primero en dejar tu huella!
              </Link>
            </div>
          )}

          {!isLoading && comments.length > 0 && (
            // Implementación del layout Masonry
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {comments.map((comment, index) => (
                // Se añade un div con margen inferior para el espaciado vertical
                <div key={`${comment.timestamp}-${index}`} className="mb-8">
                  <CommentCard comment={comment} index={index} />
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </div>
    </main>
    <AnimatePresence>
      {isModalOpen && (
        <CommentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCommentSubmitted={handleCommentSubmitted}
        />
      )}
    </AnimatePresence>
    </>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando comunidad...</p>
        </div>
      </div>
    }>
      <CommunityPageContent />
    </Suspense>
  );
}