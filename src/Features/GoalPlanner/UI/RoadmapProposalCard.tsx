// src/Features/GoalPlanner/UI/RoadmapProposalCard.tsx
'use client';

import { Check, Edit, Map, Target } from 'lucide-react';
import { motion } from 'framer-motion';

// Datos que el componente necesita para renderizarse
export type RoadmapProposalData = {
  goal: string;
  milestones: {
    title: string;
    description: string;
  }[];
  accompanyingMessage: string;
};

// Props que el componente recibirá, incluyendo los handlers
type RoadmapProposalCardProps = {
  data: RoadmapProposalData;
  onConfirm: () => void;
  onRevise: () => void;
};

export function RoadmapProposalCard({ data, onConfirm, onRevise }: RoadmapProposalCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white border border-gray-200/80 rounded-2xl p-5 md:p-6 text-gray-800 space-y-5 max-w-md shadow-lg w-full"
    >
      {/* Encabezado */}
      <div className="text-center">
        <Map className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h3 className="font-bold text-xl text-gray-900">¡Tu Plan de Estudios Personalizado!</h3>
        <p className="text-sm text-gray-500 mt-1">{data.accompanyingMessage}</p>
      </div>

      {/* Meta Principal */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Tu Meta Principal:</p>
            <p className="text-blue-800 italic">"{data.goal}"</p>
          </div>
        </div>
      </div>
      
      {/* Lista de Hitos (Milestones) */}
      <div>
        <h4 className="font-semibold text-lg mb-3 text-gray-800">Tus Hitos de Aprendizaje:</h4>
        <ul className="space-y-3">
          {data.milestones.map((milestone, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{milestone.title}</p>
                <p className="text-sm text-gray-600">{milestone.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Botones de Acción */}
      <div className="pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onRevise}
          className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          <span>Pedir cambios</span>
        </button>
        <button
          onClick={onConfirm}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          <span>¡Me encanta, empecemos!</span>
        </button>
      </div>
    </motion.div>
  );
}