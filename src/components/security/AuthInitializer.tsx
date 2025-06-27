'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const { isAuthenticated, isLoading, error, refreshAuth } = useAuth();

  useEffect(() => {
    // Si hay un error, intentar refrescar la autenticación
    if (error && !isLoading) {
      console.log('[AUTH] Error detectado, intentando refrescar autenticación...');
      refreshAuth();
    }
  }, [error, isLoading, refreshAuth]);

  // Mostrar loading mientras se inicializa
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600 mr-3" />
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Configurando tu sesión
          </h2>
          <p className="text-gray-600">
            Generando tu API key de seguridad...
          </p>
        </motion.div>
      </div>
    );
  }

  // Mostrar error si no se puede autenticar
  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center"
        >
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error de Autenticación
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={refreshAuth}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido normal
  return <>{children}</>;
} 