// components/LandingTitle.tsx
import { motion } from 'framer-motion';

export default function LandingTitle() {
  return (
    <div className="relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-2"
      >
        {/* Línea 1: "Estoy construyendo" */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 font-medium"
        >
          Estoy construyendo
        </motion.div>

        {/* Línea 2: "UN SUEÑO" - La parte más impactante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            type: "spring",
            stiffness: 200
          }}
          className="relative"
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            UN SUEÑO
          </motion.h1>
          
          {/* Efecto de brillo que se mueve */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut"
            }}
          />
          
          {/* Partículas flotantes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 1.5 + i * 0.2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>

        {/* Línea 3: Descriptor con emojis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-xl md:text-2xl text-gray-700 font-semibold flex items-center justify-center gap-3 flex-wrap"
        >
          <span>Enseñar inglés</span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              delay: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-2xl"
          >
            🚀
          </motion.span>
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold">
            de una forma diferente
          </span>
          <motion.span
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, 0]
            }}
            transition={{
              duration: 1.5,
              delay: 2.5,
              repeat: Infinity,
              repeatDelay: 4
            }}
            className="text-2xl"
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Subtítulo motivacional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-base md:text-lg text-gray-500 italic max-w-2xl mx-auto mt-4"
        >
          Donde cada lección es una aventura y cada palabra te acerca más a tus metas 🎯
        </motion.div>

        {/* Línea decorativa animada */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="w-24 h-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto mt-6"
        />
      </motion.div>
    </div>
  );
}