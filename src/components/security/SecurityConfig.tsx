'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, RefreshCw, Copy, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SecurityConfig() {
  const { apiKey, regenerateApiKey, error, clearError } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const copyToClipboard = async () => {
    if (apiKey) {
      try {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }
  };

  const handleRegenerate = () => {
    if (confirm('¿Estás seguro de que quieres regenerar tu API key? Esto invalidará la anterior.')) {
      regenerateApiKey();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configuración de Seguridad</h2>
            <p className="text-gray-600">Gestiona tu API key y configuración de seguridad</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error de autenticación</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* API Key Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tu API Key</h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">API Key (mantén esto seguro)</p>
                <div className="flex items-center gap-2">
                  {showApiKey ? (
                    <code className="text-sm bg-white px-3 py-2 rounded border flex-1 font-mono">
                      {apiKey}
                    </code>
                  ) : (
                    <code className="text-sm bg-white px-3 py-2 rounded border flex-1 font-mono">
                      {apiKey ? '•'.repeat(32) : 'No disponible'}
                    </code>
                  )}
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
              
              <button
                onClick={copyToClipboard}
                disabled={!apiKey}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="Copiar API key"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerar API Key
          </button>
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos de Seguridad</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Nunca compartas tu API key públicamente</li>
            <li>• Si sospechas que tu key fue comprometida, regenérala inmediatamente</li>
            <li>• Tu API key se almacena localmente en tu navegador</li>
            <li>• Cada usuario tiene límites de uso para prevenir abuso</li>
          </ul>
        </div>

        {/* Usage Limits */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">📊 Límites de Uso</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Chat AI</p>
              <p className="text-gray-600">10 requests/minuto</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Ejercicios</p>
              <p className="text-gray-600">5 requests/minuto</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Audio</p>
              <p className="text-gray-600">3 requests/minuto</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 