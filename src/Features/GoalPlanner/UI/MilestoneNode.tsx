// src/Features/GoalPlanner/UI/MilestoneNode.tsx (Versión Mejorada)
'use client';
import Link from 'next/link';
import { Lock, PlayCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { MilestoneData } from '../Domain/Milestone';
import { motion } from 'framer-motion';

// Configuración visual más detallada para cada estado
const statusConfig = {
  LOCKED: {
    icon: Lock,
    styles: {
      container: "bg-gray-700/50 border-gray-600/50 cursor-not-allowed",
      iconContainer: "bg-gray-600/80 text-gray-400",
      title: "text-gray-400",
      description: "text-gray-500",
      action: "hidden", // Ocultamos la flecha
    },
    isClickable: false,
  },
  UNLOCKED: {
    icon: PlayCircle,
    styles: {
      container: "bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-500 shadow-lg shadow-blue-900/20 cursor-pointer",
      iconContainer: "bg-blue-500 text-white",
      title: "text-white font-bold",
      description: "text-blue-200",
      action: "text-blue-300",
    },
    isClickable: true,
  },
  COMPLETED: {
    icon: CheckCircle,
    styles: {
      container: "bg-gray-800/80 border-green-500/50 opacity-60", // Un poco atenuado
      iconContainer: "bg-green-500 text-white",
      title: "text-gray-300 line-through", // Tachado para indicar completado
      description: "text-gray-400",
      action: "hidden",
    },
    isClickable: false,
  },
};

export function MilestoneNode({ milestone, roadmapId }: { milestone: MilestoneData, roadmapId: string }) {
  const config = statusConfig[milestone.status as keyof typeof statusConfig];
  const Icon = config.icon;

  const content = (
    <motion.div
      whileHover={config.isClickable ? { scale: 1.03, boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.3)" } : {}}
      className={`flex items-center w-full p-5 rounded-2xl border ${config.styles.container} transition-all duration-300`}
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-5 ${config.styles.iconContainer}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-grow">
        <h4 className={`text-lg ${config.styles.title}`}>{milestone.title}</h4>
        <p className={`text-sm ${config.styles.description}`}>{milestone.description}</p>
      </div>
      <ArrowRight className={`w-6 h-6 ml-4 flex-shrink-0 ${config.styles.action}`} />
    </motion.div>
  );

  if (config.isClickable) {
    return <Link href={`/exercises/milestone/${milestone.id}?roadmapId=${roadmapId}`}>{content}</Link>;
  }

  return <div>{content}</div>;
}