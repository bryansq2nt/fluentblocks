'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

// Types
interface Level {
  id: number;
  title: string;
  pattern: string;
  icon: string;
  pageId: string;
}

interface NavSection {
  id: string;
  label: string;
  icon: string;
  startLevel: number;
}

// --- NEW CORRECTED & REORDERED DATA ---
const levels: Level[] = [
  { id: 0, title: "Adjective Placement", pattern: "Adjetivo + sustantivo", icon: "🔍", pageId: "exercises/adjective-placement" },
  { id: 1, title: "The '-ing' Form", pattern: "Reglas de ortografía para el gerundio", icon: "⚙️", pageId: "exercises/ing" },
  { id: 4, title: "Present Perfect", pattern: "Sujeto + have/has + participio + extra + tiempo", icon: "🔗", pageId: "exercises/presente-perfecto" },
  { id: 2, title: "Present Continuous", pattern: "Sujeto + am/is/are + verbo-ing + extra", icon: "⚡️" , pageId: "exercises/presente-continuo"},
  { id: 5, title: "Future Simple (Will)", pattern: "Sujeto + will + verbo + objeto + tiempo", icon: "🔮", pageId: "exercises/future-will" },
  { id: 6, title: "Future 'Going to'", pattern: "Sujeto + am/is/are + going to + verbo + extra", icon: "📅", pageId: "exercises/future-going-to" },
  { id: 3, title: "Simple Past", pattern: "Sujeto + verbo en pasado + complemento + tiempo", icon: "🕰️", pageId: "exercises/pasado-simple" },
  { id: 7, title: "Modal 'Can'", pattern: "Sujeto + can + verbo + extra", icon: "💪", pageId: "exercises/modal-can" },
  { id: 8, title: "Modal 'Could'", pattern: "Sujeto + could + verbo + extra", icon: "🤔", pageId: "exercises/modal-could" },
  { id: 9, title: "Modal 'Would'", pattern: "Sujeto + would + verbo + extra", icon: "💭", pageId: "exercises/modal-would" },
  { id: 10, title: "Modal 'Should'", pattern: "Sujeto + should + verbo + extra", icon: "🦉", pageId: "exercises/modal-should" },
];

const navSections: NavSection[] = [
  { id: 'basic', label: 'Basico', icon: '🌱', startLevel: 1 },
  { id: 'intermediate', label: 'Intermedio', icon: '🏔️', startLevel: 3 },
  { id: 'advanced', label: 'Avanzado', icon: '🔥', startLevel: 7 },
];

// Components
const LevelNode = ({ level, index, onSelect }: { level: Level; index: number; onSelect: (level: Level) => void }) => {
  const handleClick = () => {
    onSelect(level);
  };

  const getColorClass = (levelId: number) => {
    if (levelId <= 2) return 'green'; // Fundamentos
    if (levelId <= 6) return 'blue';  // Tiempos y Futuro
    return 'purple'; // Modales
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
        <span className="text-3xl relative z-20 drop-shadow-lg text-white">{level.icon}</span>
        
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 whitespace-nowrap shadow-sm">
          Nivel {level.id}: {level.title}
        </div>
      </motion.div>

      {index < levels.length - 1 && (
        <div className="relative w-1 h-16 mx-auto">
          <div className={`absolute inset-0 border-l-4 border-dashed border-${getColorClass(level.id + 1)}-300 animate-pulse`} />
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
    if (isLocked) return 'from-gray-400 to-gray-500';
    
    switch (section.id) {
      case 'basic': return isActive ? 'from-green-500 to-green-600' : 'from-green-400 to-green-500';
      case 'intermediate': return isActive ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-blue-500';
      case 'advanced': return isActive ? 'from-purple-500 to-purple-600' : 'from-purple-400 to-purple-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <motion.button
      whileHover={!isLocked ? { y: -3 } : {}}
      whileTap={!isLocked ? { y: 0 } : {}}
      onClick={isLocked ? () => {} : onClick}
      className={`relative w-[90px] h-[100px] overflow-hidden rounded-2xl bg-gradient-to-br ${getGradientClasses()} transition-all duration-300 ${isActive ? 'text-white shadow-lg scale-105' : 'text-white/80'} ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {isLocked && (<div className="absolute top-2 right-2 text-white/80"><Lock className="w-4 h-4" /></div>)}
      <div className="relative z-10 flex flex-col items-center gap-1 pt-4">
        <span className="text-3xl">{section.icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider">{section.label}</span>
      </div>
    </motion.button>
  );
};

export default function MapPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basic');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('map-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => setShowScrollHint(false), 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleStartLevel = () => {
    if (selectedLevel) {
      router.push(`/${selectedLevel.pageId}`);
    }
  };

  return (
    <main id="map-container" className="min-h-screen bg-gradient-to-b from-blue-200 via-green-200 to-purple-200">
      {showScrollHint && (
        <motion.div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center text-gray-600">
            <span className="text-sm font-bold">Desliza</span>
            <span className="text-4xl">👇</span>
          </div>
        </motion.div>
      )}

      <header className="fixed top-0 right-0 p-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/home')}
          className="w-[70px] h-[50px] bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="text-xl">🏠</span>
        </motion.button>
      </header>

      <div className="container mx-auto max-w-[400px] px-6 pb-40 pt-24">
        <div className="relative">
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
                animate={{ x: ['-100px', 'calc(100vw + 100px)']}}
                transition={{ duration: 40 - i * 10, delay: i * -15, repeat: Infinity, ease: 'linear'}}
              />
            ))}
          </div>

          <div className="relative flex flex-col-reverse items-center py-8">
            {levels.map((level, index) => (
              <LevelNode 
                key={`level-${level.id}`} 
                level={level} 
                index={index} 
                onSelect={handleLevelSelect}
              />
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[400px] bg-white/95 backdrop-blur-xl rounded-t-[25px] p-6 shadow-lg border-t border-white/50">
        <div className="flex gap-4 items-center justify-center">
          <NavItem
            section={navSections[0]}
            isActive={activeSection === navSections[0].id}
            onClick={() => setActiveSection(navSections[0].id)}
            isLocked={false}
          />
          <NavItem
            section={navSections[1]}
            isActive={activeSection === navSections[1].id}
            onClick={() => setActiveSection(navSections[1].id)}
            isLocked={true} // Asumiendo que se desbloquean con el progreso
          />
          <NavItem
            section={navSections[2]}
            isActive={activeSection === navSections[2].id}
            onClick={() => setActiveSection(navSections[2].id)}
            isLocked={true} // Asumiendo que se desbloquean con el progreso
          />
        </div>
      </nav>

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
                <h3 className="text-xl text-black font-bold mb-2">Nivel {selectedLevel.id}: {selectedLevel.title}</h3>
                <p className="text-gray-600 mb-6 text-sm">{selectedLevel.pattern}</p>
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
                    onClick={handleStartLevel}
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