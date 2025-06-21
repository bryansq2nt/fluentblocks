// components/game/MainHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, MessageSquare, Menu, X } from 'lucide-react';
import { useExerciseTracking } from '@/context/ExerciseTrackingContext';

interface MainHeaderProps {
  headerActions?: React.ReactNode; 
}

const navItems = [
  { href: '/home', icon: <Home className="w-5 h-5" />, label: 'Home' },
  { href: '/map', icon: <Map className="w-5 h-5" />, label: 'Mapa' },
  { href: '/chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Chat AI' },
];

export default function MainHeader({ headerActions }: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { trackInteraction } = useExerciseTracking();

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
      <header id="main-header" className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-gray-200/80">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Título */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-mono text-lg">AI</span>
              FluentBlocks

            </Link>
            {headerActions && <div className="p-2 border-b border-gray-100">{headerActions}</div>}

            {/* Navegación de Escritorio */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map(item => (
                <button 
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Botón de Menú Móvil */}
            <div className="md:hidden">
              <button id="main-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
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
            className="fixed top-16 left-0 right-0 z-40 bg-white shadow-lg md:hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map(item => (
                <button 
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-md"
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