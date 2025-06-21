// Asumo que este archivo está en app/home/page.tsx
'use client';

import { motion } from 'framer-motion';
import { User, HelpCircle, PuzzleIcon, Lock, Sparkles, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

// --- COMPONENTE INTERNO: MenuCard ---
// Se mantiene dentro del mismo archivo para simplicidad, pero podría ser externo.
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
    // Nuevo degradado especial para el botón de IA
    special: 'from-blue-600 to-green-500', 
    locked: 'from-gray-400 to-gray-500'
  };

  const cardContent = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      className={`
        relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${isLocked ? colorClasses.locked : colorClasses[color]}
        text-white shadow-lg hover:shadow-2xl transition-all duration-300
        overflow-hidden h-full flex flex-col justify-between
        ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
      `}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <Icon className="w-10 h-10 mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
            <p className="text-white/80 text-sm sm:text-base">{subtitle}</p>
          </div>
          {isLocked && (
            <div className="bg-white/20 p-2 rounded-full">
              <Lock className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isLocked) {
    return cardContent;
  }

  return <Link href={href} className="block h-full">{cardContent}</Link>;
};


// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function HomePage() {
  const router = useRouter();
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
      <header className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            FluentBlocks
          </h1>

          {/* Espaciador para mantener el título centrado */}
          <div className="w-8 h-8"></div> 
        </div>
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
          
          {/* Tarjeta Principal de IA (ocupa 2 columnas en desktop) */}
          <div className="md:col-span-2">
            <MenuCard
              icon={Sparkles}
              title="FluentBlocks AI"
              subtitle="Habla con tu tutor personal y practica cualquier tema"
              href="/chat"
              color="special"
            />
          </div>
          
          {/* Tarjetas Secundarias */}
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
          
          {/* Tarjeta de Ayuda (ocupa 2 columnas en desktop para equilibrio) */}
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