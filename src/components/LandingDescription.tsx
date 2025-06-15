// components/LandingDescription.tsx
import { motion } from 'framer-motion';

export default function LandingDescription() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Saludo principal con personalidad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-full border border-blue-100 shadow-sm">
          <motion.span
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            className="text-2xl"
          >
            👋
          </motion.span>
          <span className="text-xl font-semibold text-gray-700">
            ¡Hola! Soy{' '}
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bryan
            </span>
          </span>
        </div>
      </motion.div>

      {/* Mensaje principal dividido en fragmentos impactantes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-center space-y-4"
      >
        {/* Primera línea - Creencia */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 font-medium"
        >
          Siempre he creído que aprender un idioma debe ser
        </motion.div>

        {/* Frase impactante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.8, 
            duration: 0.6,
            type: "spring",
            stiffness: 150
          }}
          className="relative"
        >
          <div className="text-2xl md:text-3xl font-bold">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              una aventura emocionante
            </span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                delay: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="text-yellow-500 ml-2"
            >
              ✨
            </motion.span>
          </div>
          
          {/* Línea de contraste */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-500 mt-2 relative"
          >
            <span className="line-through opacity-50">no una obligación</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Propuesta de valor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-orange-100 shadow-lg relative overflow-hidden">
          {/* Efectos de fondo */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <motion.div
              className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-4 right-6 w-2 h-2 bg-pink-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: 1.2
              }}
            />
          </div>

          <div className="relative z-10 space-y-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="text-lg md:text-xl font-semibold text-gray-700"
            >
              Estoy creando un espacio donde
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl font-bold"
            >
              <span className="text-gray-700">descubras el inglés con</span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent cursor-default"
              >
                pasión
              </motion.span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  delay: 3,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
                className="text-red-500"
              >
                ❤️
              </motion.span>
              <span className="text-gray-700">y</span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent cursor-default"
              >
                curiosidad
              </motion.span>
              <motion.span
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2.5,
                  delay: 3.5,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
                className="text-blue-500"
              >
                🧐
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Call to action sutil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium">
          <motion.span
            animate={{ y: [0, 3, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            👇
          </motion.span>
          <span>Únete a esta aventura</span>
          <motion.span
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            🚀
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}