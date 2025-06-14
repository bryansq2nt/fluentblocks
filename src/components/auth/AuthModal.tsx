'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'oauth' | 'signup' | 'login';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [mode, setMode] = useState<AuthMode>('oauth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const switchMode = (newMode: AuthMode) => {
    setErrorMsg(null);
    setEmail('');
    setPassword('');
    setLoading(false);
    setMode(newMode);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const callback = `${window.location.origin}/home`;
      await signIn('google', { callbackUrl: callback });
    } catch (error) {
      console.error('Error during Google login:', error);
      setErrorMsg('No se pudo iniciar sesión con Google.');
      setLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
  
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      setErrorMsg(data.message);
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    if (signInRes?.ok) {
      router.push('/home');
      onClose();
    } else {
      setErrorMsg('Cuenta creada. Por favor, inicia sesión.');
      setLoading(false);
      switchMode('login');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg('Email o contraseña incorrectos. Por favor, inténtalo de nuevo.');
      setLoading(false);
    } else if (res?.ok) {
      router.push('/home');
      onClose();
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const callback = `${window.location.origin}/home`;
      await signIn('facebook', { callbackUrl: callback });
    } catch (error) {
      console.error('Error during Facebook login:', error);
      setErrorMsg('No se pudo iniciar sesión con Facebook.');
      setLoading(false);
    }
  };

  const modalTitle = {
    oauth: 'Únete a FluentBlocks',
    signup: 'Crea tu cuenta',
    login: 'Iniciar Sesión',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="bg-white rounded-2xl p-6 pt-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalTitle[mode]}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors rounded-full p-1">
                <X size={24} />
              </button>
            </div>

            {mode === 'oauth' && (
              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !acceptedTerms}
                >
                  <Image src="/google.svg" alt="Google" width={24} height={24} />
                  <span className="font-medium text-gray-800">
                    Continuar con Google
                  </span>
                </button>
                <button
                  onClick={handleFacebookLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !acceptedTerms}
                >
                  <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
                  <span className="font-medium text-gray-800">
                    Continuar con Facebook
                  </span>
                </button>
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    o usa tu correo electrónico
                  </p>
                  <div className='flex justify-center gap-4 mt-2'>
                    <button onClick={() => switchMode('login')} className="text-sm font-semibold text-blue-600 hover:underline">
                      Iniciar sesión
                    </button>
                    <span className='text-gray-300'>|</span>
                    <button onClick={() => switchMode('signup')} className="text-sm font-semibold text-blue-600 hover:underline">
                      Regístrate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                {errorMsg && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{errorMsg}</p>}
                {/* CAMBIO: Añadida clase `placeholder-gray-400` */}
                <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900" />
                {/* CAMBIO: Añadida clase `placeholder-gray-400` */}
                <input type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900" />
                <button type="submit" disabled={loading || !acceptedTerms} className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
                <div className="text-center pt-1">
                  <button type="button" onClick={() => switchMode('login')} className="text-sm text-gray-600 hover:underline">
                    ¿Ya tienes cuenta? Inicia sesión
                  </button>
                </div>
              </form>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                {errorMsg && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{errorMsg}</p>}
                {/* CAMBIO: Añadida clase `placeholder-gray-400` */}
                <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900" />
                {/* CAMBIO: Añadida clase `placeholder-gray-400` */}
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900" />
                <button type="submit" disabled={loading || !acceptedTerms} className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                <div className="text-center pt-1">
                  <button type="button" onClick={() => switchMode('signup')} className="text-sm text-gray-600 hover:underline">
                    ¿No tienes cuenta? Regístrate
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 flex items-start gap-3">
              <input type="checkbox" id="accept-terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="w-4 h-4 mt-1 border-gray-400 rounded text-blue-600 focus:ring-blue-500" />
              <label htmlFor="accept-terms" className="text-xs text-gray-600 select-none">
                He leído y acepto los <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Términos y Condiciones</a> y la <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Política de Privacidad</a>.
              </label>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}