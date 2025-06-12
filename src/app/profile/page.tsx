'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

interface UserProgress {
  id: string;
  levelId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttempt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        setProgress(data.progress || []);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchProgress();
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const completedLevels = progress.filter(p => p.completed).length;
  const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
  const averageScore = progress.length > 0 
    ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length) 
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-xl mx-auto p-8">
        <button
          onClick={() => router.push('/home')}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'black' }}>Perfil de Usuario</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex flex-col items-center gap-2 mb-4">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'Avatar'}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-white shadow-md"
                />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {session?.user?.name || 'Usuario'}
              </h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Cuenta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Proveedor de Autenticación</p>
                  <p className="font-medium text-gray-900">
                    {session?.user?.email?.includes('@gmail.com') ? 'Google' : 'Otro'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Estado de la Cuenta</p>
                  <p className="font-medium text-green-600">Activa</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progreso</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-500">Niveles Completados</p>
                  <p className="text-2xl font-bold text-blue-600">{completedLevels}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-green-500">Intentos Totales</p>
                  <p className="text-2xl font-bold text-green-600">{totalAttempts}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-purple-500">Puntuación Promedio</p>
                  <p className="text-2xl font-bold text-purple-600">{averageScore}%</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 