// components/game/MainHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, MessageSquare, Menu, X } from 'lucide-react';
import { useExerciseTracking } from '@/context/ExerciseTrackingContext';

// 1. Definimos los tipos para las props y el tema
interface MainHeaderProps {
  headerActions?: React.ReactNode; 
  theme?: 'light' | 'dark'; // Añadimos la prop 'theme'
}

const navItems = [
  { href: '/home', icon: <Home className="w-5 h-5" />, label: 'Home' },
  { href: '/map', icon: <Map className="w-5 h-5" />, label: 'Mapa' },
  { href: '/chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Chat AI' },
];

// 2. Creamos un objeto para manejar los estilos de cada tema
const themeStyles = {
  light: {
    header: "bg-white/80 backdrop-blur-md border-b border-gray-200/80",
    logoText: "text-gray-800",
    navButton: "text-gray-600 hover:text-blue-600 hover:bg-gray-100",
    mobileMenu: "bg-white",
    mobileNavButton: "text-gray-700 hover:bg-gray-100",
  },
  dark: {
    header: "bg-gray-900/80 backdrop-blur-md border-b border-gray-700/80",
    logoText: "text-gray-200",
    navButton: "text-gray-300 hover:text-white hover:bg-gray-700",
    mobileMenu: "bg-gray-800",
    mobileNavButton: "text-gray-200 hover:bg-gray-700",
  }
};


export default function MainHeader({ headerActions, theme = 'light' }: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { trackInteraction } = useExerciseTracking();

  // 3. Seleccionamos los estilos basados en la prop 'theme'
  const styles = themeStyles[theme];

  const handleNav = (href: string) => {
    trackInteraction({
      type: 'SESSION_CANCELLED',
      timestamp: Date.now(),
      data: {
        goingTo: href
      }
    });
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* 4. Aplicamos las clases de estilo dinámicas */}
      <header id="main-header" className={`fixed top-0 left-0 right-0 z-50 ${styles.header}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Título */}
            <Link href="/" className={`flex items-center gap-2 text-xl font-bold ${styles.logoText}`}>
              <span className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-mono text-lg">AI</span>
              FluentBlocks
            </Link>
            
            {/* Esta sección no estaba en tu código original, la eliminé para ser fiel a tu versión */}
            {/* {headerActions && <div className="p-2 border-b border-gray-100">{headerActions}</div>} */}

            {/* Navegación de Escritorio */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map(item => (
                <button 
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${styles.navButton}`}
                >
                  {item.label}
                </button>
              ))}
              {/* Renderizamos las acciones adicionales aquí si existen */}
              {headerActions && <div className="ml-4">{headerActions}</div>}
            </div>

            {/* Botón de Menú Móvil */}
            <div className="md:hidden flex items-center gap-2">
                {headerActions && <div>{headerActions}</div>}
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 rounded-md ${styles.navButton}`}>
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? 'x' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Menú Desplegable Móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-16 left-0 right-0 z-40 shadow-lg md:hidden ${styles.mobileMenu}`}
          >
            <div className="p-4 space-y-2">
              {navItems.map(item => (
                <button 
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-md ${styles.mobileNavButton}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}