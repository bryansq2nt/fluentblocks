'use client';

import { motion } from 'framer-motion';
import { ArrowLeft,User, HelpCircle, Trophy, PuzzleIcon, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

// Menu card component
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
  color?: 'blue' | 'green' | 'orange' | 'purple';
  isLocked?: boolean;
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    locked: 'from-gray-400 to-gray-500'
  };

  const cardContent = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      className={`
        relative p-8 rounded-2xl bg-gradient-to-br ${isLocked ? colorClasses.locked : colorClasses[color]}
        text-white shadow-lg hover:shadow-xl transition-all duration-200
        overflow-hidden
        ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
      `}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <Icon className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-white/80">{subtitle}</p>
          </div>
          {isLocked && (
            <div className="bg-white/20 p-2 rounded-full">
              <Lock className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>
      
      {/* LEGO block decorative elements */}
      <div className="absolute bottom-0 right-0 opacity-20">
        {[...Array(3)].map((_, i) => (
          <div
            key={`lego-block-${i}`}
            className="w-8 h-4 bg-white rounded-sm mb-2"
            style={{ transform: `rotate(${i * 15}deg)` }}
          />
        ))}
      </div>
    </motion.div>
  );

  if (isLocked) {
    return cardContent;
  }

  return <Link href={href}>{cardContent}</Link>;
};

export default function MenuPage({ user }: { user: { name?: string } }) {
  const router = useRouter();
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            FluentBlocks
          </h1>

          <div></div>
          
          {/* <Link href="/settings" className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <Settings className="w-6 h-6 text-gray-600" />
          </Link> */}
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
        >
          ¡Hola {user.name}! ¿Listo para construir oraciones?
        </motion.h2>

 <br></br>
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm inline-block"
        >
          <p className="text-xl font-medium text-gray-900">0/12 patrones completados</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-blue-600 font-medium mt-4"
        >
          ¡Vas muy bien!
        </motion.p> */}
      </div>

      {/* Main Menu Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <MenuCard
            icon={PuzzleIcon}
            title="Aprender Patrones"
            subtitle="Domina las estructuras del inglés"
            href="/map"
            color="blue"
          />
          
          <MenuCard
            icon={User}
            title="Mi Perfil"
            subtitle="Progreso y estadísticas"
            href="/profile"
            color="green"
            isLocked={false}
          />
          
          <MenuCard
            icon={Trophy}
            title="Ranking"
            subtitle="Compite con otros estudiantes"
            href="/ranking"
            color="purple"
            isLocked={true}
          />
          
          <MenuCard
            icon={HelpCircle}
            title="Ayuda y Más"
            subtitle="FAQ, feedback, créditos"
            href="/help"
            color="orange"
          />
        </div>
      </div>
    </main>
  );
} 