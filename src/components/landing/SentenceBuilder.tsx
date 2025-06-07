import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import LegoBlock from './LegoBlock';

const patterns = [
  {
    subject: { en: 'I', es: 'Yo' },
    verb: { en: 'am', es: 'estoy' },
    action: { en: 'studying', es: 'estudiando' }
  },
  {
    subject: { en: 'He', es: 'Él' },
    verb: { en: 'is', es: 'está' },
    action: { en: 'studying', es: 'estudiando' }
  },
  {
    subject: { en: 'She', es: 'Ella' },
    verb: { en: 'is', es: 'está' },
    action: { en: 'studying', es: 'estudiando' }
  },
  {
    subject: { en: 'They', es: 'Ellos' },
    verb: { en: 'are', es: 'están' },
    action: { en: 'studying', es: 'estudiando' }
  }
];

const actions = [
  { en: 'studying', es: 'estudiando' },
  { en: 'eating', es: 'comiendo' },
  { en: 'running', es: 'corriendo' },
  { en: 'sleeping', es: 'durmiendo' }
];

export default function SentenceBuilder() {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [currentAction, setCurrentAction] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubjectClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentPattern((prev) => (prev + 1) % patterns.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleActionClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentAction((prev) => (prev + 1) % actions.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentPatternData = patterns[currentPattern];
  const currentActionData = actions[currentAction];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
      >
        <AnimatePresence mode="wait">
          <LegoBlock
            key={`subject-${currentPattern}`}
            word={currentPatternData.subject.en}
            translation={currentPatternData.subject.es}
            color="red"
            delay={0.2}
            isInteractive
            onClick={handleSubjectClick}
          />
        </AnimatePresence>

        <LegoBlock
          word={currentPatternData.verb.en}
          translation={currentPatternData.verb.es}
          color="blue"
          delay={0.4}
        />

        <AnimatePresence mode="wait">
          <LegoBlock
            key={`action-${currentAction}`}
            word={currentActionData.en}
            translation={currentActionData.es}
            color="green"
            delay={0.6}
            isInteractive
            onClick={handleActionClick}
          />
        </AnimatePresence>
      </motion.div>

      {/* Pattern explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-gray-600"
      >
        <p className="text-lg font-medium mb-2">
          ¡Mira! Solo cambia el sujeto, la estructura es igual
        </p>
        <p className="text-sm">
          [Sujeto] + [am/is/are] + [verbo+ing]
        </p>
      </motion.div>
    </div>
  );
} 