'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

// Types
interface Level {
  id: number;
  pattern: string;
  icon: string;
}

interface NavSection {
  id: string;
  label: string;
  icon: string;
  progress: number;
  startLevel: number;
}

// Data
const levels: Level[] = [
  { id: 1, pattern: "Present Continuous", icon: "⏳" },
  { id: 2, pattern: "Present Perfect", icon: "✅" },
  { id: 3, pattern: "Simple Past", icon: "🕰️" },
  { id: 4, pattern: "Future Simple", icon: "🔮" },
  { id: 5, pattern: "Modal 'Can' (Ability)", icon: "💪" },
  { id: 6, pattern: "'Going to' Future", icon: "🎯" },
  { id: 7, pattern: "Comparatives (-er)", icon: "📏" },
  { id: 8, pattern: "Superlatives (-est)", icon: "🏆" },
  { id: 9, pattern: "Forming Questions", icon: "❓" },
  { id: 10, pattern: "Responding", icon: "💬" },
  { id: 11, pattern: "Verb + ING", icon: "✍️" },
];

const navSections: NavSection[] = [
  { id: 'basic', label: 'Básico', icon: '🌱', progress: 4, startLevel: 1 },
  { id: 'intermediate', label: 'Intermedio', icon: '🏔️', progress: 4, startLevel: 5 },
  { id: 'advanced', label: 'Avanzado', icon: '🔥', progress: 3, startLevel: 9 },
];

// Components
const LevelNode = ({ level, index, onSelect }: { level: Level; index: number; onSelect: (level: Level) => void }) => {
  
  
  const handleClick = () => {
    onSelect(level);
  };

  const getColorClass = (levelId: number) => {
    if (levelId <= 4) return 'green'; // Basic levels
    if (levelId <= 8) return ''; // Default blue for intermediate 
    return 'purple'; // Advanced levels
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={handleClick}
        className={`level-3d ${getColorClass(level.id)} no-border relative w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 mb-16`}
        style={{
          marginLeft: index % 2 === 0 ? '5rem' : '0',
          marginRight: index % 2 !== 0 ? '5rem' : '0',
        }}
      >
        {/* Icon with z-index to appear above overlays */}
        <span className="text-3xl relative z-20 drop-shadow-lg text-white">{level.icon}</span>
        
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 whitespace-nowrap shadow-sm">
          {level.pattern}
        </div>
      </motion.div>

      {/* Connecting path */}
      {index < levels.length - 1 && (
        <div className="relative w-1 h-16 mx-auto">
          <div className="absolute inset-0 border-l-4 border-dashed border-blue-300 animate-pulse" />
        </div>
      )}
    </>
  );
};

const NavItem = ({ 
  section, 
  isActive, 
  onClick, 
  isLocked = false 
}: { 
  section: NavSection; 
  isActive: boolean; 
  onClick: () => void;
  isLocked?: boolean;
}) => {
  const getGradientClasses = () => {
    if (isLocked) {
      return 'from-gray-400 to-gray-500';
    }
    
    switch (section.id) {
      case 'basic':
        return isActive ? 'from-green-500 to-green-600' : 'from-green-400 to-green-500';
      case 'intermediate':
        return isActive ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-blue-500';
      case 'advanced':
        return isActive ? 'from-red-500 to-red-600' : 'from-red-400 to-red-500';
    }
  };

  return (
    <motion.button
      whileHover={!isLocked ? { y: -3 } : {}}
      whileTap={!isLocked ? { y: 0 } : {}}
      onClick={isLocked ? () => {} : onClick}
      className={`
        relative w-[120px] h-[140px] overflow-hidden rounded-2xl
        bg-gradient-to-br ${getGradientClasses()}
        transition-all duration-300
        ${isActive ? 'text-white shadow-lg scale-105' : 'text-gray-600'}
        ${isLocked ? 'cursor-not-allowed opacity-60' : ''}
      `}
    >
      {/* Lock icon overlay */}
      {isLocked && (
        <div className="absolute top-2 right-2 text-white/80">
          <Lock className="w-4 h-4" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2 pt-4">
        <span className="text-3xl">{section.icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">{section.label}</span>
      </div>
    </motion.button>
  );
};

// Main Component
export default function MapPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basic');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      
      // Ocultar el hint después del scroll
      setTimeout(() => setShowScrollHint(false), 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionClick = (section: NavSection) => {
    setActiveSection(section.id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-200 via-green-200 to-purple-200">
      {/* Scroll Hint Arrow */}
      {showScrollHint && (
        <motion.div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        >
          <span className="text-4xl">👆</span>
        </motion.div>
      )}

      {/* Header */}
      <header className="fixed top-0 right-0 p-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/home')}
          className="w-[50px] h-[50px] bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="text-xl">🏠</span>
        </motion.button>
      </header>

      {/* Map Container */}
      <div className="container mx-auto max-w-[400px] px-6 pb-40 pt-24">
        <div className="relative">
          {/* Floating Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`cloud-${i}-${Math.random()}`}
                className="absolute bg-white/60 rounded-full"
                style={{
                  width: i === 1 ? '80px' : '60px',
                  height: i === 1 ? '40px' : '30px',
                  top: `${(i + 1) * 20}%`,
                }}
                animate={{
                  x: ['-100px', 'calc(100vw + 100px)'],
                }}
                transition={{
                  duration: 20,
                  delay: i * -10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

          {/* Level Path */}
          <div className="relative flex flex-col-reverse items-center py-8 space-y-16">
            {levels.map((level, index) => (
              <LevelNode 
                key={`level-${level.id}`} 
                level={level} 
                index={index} 
                onSelect={setSelectedLevel}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[400px] bg-white/95 backdrop-blur-xl rounded-t-[25px] p-6 shadow-lg border-t border-white/50">
        <div className="flex gap-4 items-center justify-center">
          <NavItem
            section={navSections[0]}
            isActive={activeSection === navSections[0].id}
            onClick={() => handleSectionClick(navSections[0])}
            isLocked={false}
          />
          <NavItem
            section={navSections[1]}
            isActive={activeSection === navSections[1].id}
            onClick={() => handleSectionClick(navSections[1])}
            isLocked={true}
          />
          <NavItem
            section={navSections[2]}
            isActive={activeSection === navSections[2].id}
            onClick={() => handleSectionClick(navSections[2])}
            isLocked={true}
          />
        </div>
      </nav>

      {/* Level Selection Modal */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLevel(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedLevel.icon}</div>
                <h3 className="text-xl text-black font-bold mb-2">Nivel {selectedLevel.id}</h3>
                <p className="text-gray-600 mb-6">{selectedLevel.pattern}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLevel(null)}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLevel(null);
                      router.push(`/level${selectedLevel.id}`);
                    }}
                    className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold"
                  >
                    Empezar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}