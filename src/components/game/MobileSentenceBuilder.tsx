// src/components/game/MobileSentenceBuilder.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown, Lock, PenSquare } from 'lucide-react';

// --- INTERFACES GENÉRICAS ---
export interface StepOption {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

export interface StepConfig {
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  options: StepOption[];
  onSelect: (option: StepOption) => void;
  selectedValue: string | null;
  colorClasses: { 
    bg: string; 
    selectedBg: string; 
    border: string; 
    accent: string; 
  };
  isCompleted: boolean;
  isDisabled: boolean;
}

interface MobileBuilderProps {
  steps: StepConfig[];
  partialSentence: string;
  fullSentenceEs: string | null;
  isComplete: boolean;
}

interface AccordionStepProps extends StepConfig {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

// --- Componente Interno del Acordeón (sin cambios mayores) ---
const AccordionStep: React.FC<AccordionStepProps> = ({
  stepNumber, title, icon, options, onSelect, selectedValue, colorClasses,
  activeStep, setActiveStep, isCompleted, isDisabled
}) => {
  const isOpen = activeStep === stepNumber;
  const handleSelect = (option: StepOption) => {
    onSelect(option);
    if (stepNumber < 5) { // Aumentado para soportar más pasos
      setActiveStep(stepNumber + 1);
    }
  };

  const statusIcon = isDisabled ? <Lock className="w-5 h-5 text-gray-400" />
    : isCompleted ? <CheckCircle className={`w-6 h-6 ${colorClasses.accent}`} />
    : <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="w-6 h-6 text-gray-500" /></motion.div>;

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? `shadow-lg ${colorClasses.border}` : 'shadow-sm border-gray-200'}`}>
      <button type="button" onClick={() => !isDisabled && setActiveStep(isOpen ? 0 : stepNumber)} className="w-full p-4 flex items-center justify-between" disabled={isDisabled}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses.bg}`}>{icon}</div>
          <div>
            <h3 className={`text-lg font-bold text-left ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>{title}</h3>
            {isCompleted && <p className={`text-sm font-medium ${colorClasses.accent}`}>{selectedValue}</p>}
          </div>
        </div>
        {statusIcon}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50">
              {options.map((option) => (
                <motion.button key={option.key} onClick={() => handleSelect(option)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`w-full p-3 rounded-lg font-semibold border-2 transition-colors ${selectedValue === option.label ? `${colorClasses.selectedBg} ${colorClasses.border} text-white` : 'bg-white border-gray-200 text-gray-700'}`}
                >{option.label}</motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Componente Principal Genérico ---
export const MobileSentenceBuilder: React.FC<MobileBuilderProps> = ({
  steps, partialSentence, fullSentenceEs, isComplete
}) => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="w-full">
      {/* Preview Box */}
      <motion.div className="sticky top-[68px] z-40 bg-white/80 backdrop-blur-lg rounded-b-2xl shadow-lg border-x border-b border-gray-200 p-4 mb-6"
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <PenSquare className="w-5 h-5 text-blue-500" />Tu Oración
          </h3>
          <div className="flex items-center gap-1.5">
            {steps.map(step => (
              <div key={step.stepNumber} className={`w-3 h-3 rounded-full transition-colors ${step.isCompleted ? step.colorClasses.selectedBg.replace('bg-','bg-') : 'bg-gray-300'}`}></div>
            ))}
          </div>
        </div>
        <div className="min-h-[60px] flex flex-col justify-center">
          {partialSentence ? (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-xl font-bold text-gray-900 text-center">{partialSentence}</p>
                {isComplete && fullSentenceEs && <p className="text-sm text-gray-600 text-center italic mt-1">({fullSentenceEs})</p>}
              </motion.div>
            </AnimatePresence>
          ) : <p className="text-gray-400 text-center">Completa los pasos...</p>}
        </div>
      </motion.div>

      {/* Acordeón de Pasos */}
      <div className="space-y-4">
        {steps.map((step) => (
          <AccordionStep key={step.stepNumber} {...step} activeStep={activeStep} setActiveStep={setActiveStep} />
        ))}
      </div>
    </div>
  );
};