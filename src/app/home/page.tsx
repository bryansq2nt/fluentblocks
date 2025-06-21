// Asumo que este archivo está en app/home/page.tsx
'use client';

import { motion } from 'framer-motion';
import { User, HelpCircle, PuzzleIcon, Lock, Sparkles, Download } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

// --- COMPONENTE INTERNO: MenuCard (MODIFICADO PARA SER RESPONSIVE) ---
const MenuCard = ({ 
  icon: Icon, 
  title, 
  subtitle,
  href, 
  color = 'blue',
  isLocked = false
}: { 
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'special';
  isLocked?: boolean;
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    special: 'from-blue-600 to-green-500', 
    locked: 'from-gray-400 to-gray-500'
  };

  const cardContent = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      // --- CAMBIOS CLAVE AQUÍ ---
      className={`
        relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${isLocked ? colorClasses.locked : colorClasses[color]}
        text-white shadow-lg hover:shadow-2xl transition-all duration-300
        overflow-hidden h-full flex 
        flex-row items-center gap-4  // <-- NUEVO: Layout horizontal por defecto (móvil)
        sm:flex-col sm:items-start sm:justify-between // <-- NUEVO: Vuelve a ser vertical en pantallas 'sm' y superiores
        ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
      `}
    >
      {/* Contenedor del ícono */}
      <div className="flex-shrink-0">
        {/* CAMBIO: Ícono más pequeño en móvil */}
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 sm:mb-4" />
      </div>

      {/* Contenedor del texto */}
      <div className="relative z-10 flex-grow">
        {/* CAMBIO: Texto más pequeño en móvil */}
        <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
      
      {isLocked && (
        <div className="bg-white/20 p-2 rounded-full ml-auto flex-shrink-0 sm:ml-0 sm:absolute sm:top-6 sm:right-6">
           {/* CAMBIO: Posicionamiento del candado */}
          <Lock className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );

  if (isLocked) {
    return cardContent;
  }

  return <Link href={href} className="block h-full">{cardContent}</Link>;
};


// --- COMPONENTE PRINCIPAL DE LA PÁGINA (Sin cambios necesarios aquí) ---
export default function HomePage() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  const handleInstall = async () => {
    try {
      await installApp();
    } catch (error) {
      console.error('Error al instalar la app:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      {/* Cabecera */}
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="inline-block text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          FluentBlocks
        </h1>
      </header>

      {/* Título de Bienvenida */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900"
        >
          ¡Hola! ¿Listo para aprender inglés?
        </motion.h2>
      </div>

      {/* Botón de Instalación PWA */}
      {isInstallable && !isInstalled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <button
            onClick={handleInstall}
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Download className="w-6 h-6" />
            Instalar App
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Acceso directo en tu pantalla de inicio
          </p>
        </motion.div>
      )}

      {/* Menú Principal Rediseñado */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          <div className="md:col-span-2">
            <MenuCard
              icon={Sparkles}
              title="FluentBlocks AI"
              subtitle="Habla con tu tutor personal y practica cualquier tema"
              href="/chat"
              color="special"
            />
          </div>
          
          <MenuCard
            icon={PuzzleIcon}
            title="Aprender Patrones"
            subtitle="Domina las estructuras del inglés"
            href="/map"
            color="blue"
          />
          
          <MenuCard
            icon={User}
            title="Comunidad"
            subtitle="Apoyanos a seguir creando algo increible!"
            href="/community"
            color="green"
            isLocked={false}
          />
          
          <div className="md:col-span-2">
            <MenuCard
              icon={HelpCircle}
              title="Ayuda y Más"
              subtitle="FAQ, feedback y créditos"
              href="/help"
              color="orange"
            />
          </div>
        </div>
      </div>
    </main>
  );
}