// app/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Importación de componentes
import LandingTitle from '@/components/downtime/LandingTitle';
import LandingDescription from '@/components/downtime/LandingDescription';
import SubscriptionForm from '@/components/downtime/SubscriptionForm';
import SocialProof from '@/components/downtime/SocialProof';
import CommentModal from '@/components/downtime/CommentModal';
import RandomCommentViewer, { RandomCommentViewerHandle } from '@/components/downtime/RandomCommentViewer';

export default function LandingPage() {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  
  const randomViewerRef = useRef<RandomCommentViewerHandle>(null);

  // Secuencia cinematográfica de aparición
  useEffect(() => {
    const sequence = async () => {
      // Esperar un poco antes de empezar
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoaded(true);
      
      // Mostrar título y descripción (ya tienen sus propias animaciones)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSubscription(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSocial(true);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      setShowCommunity(true);
    };
    
    sequence();
  }, []);

  const handleSubscriptionSuccess = () => {
    setTimeout(() => setShowCommentModal(true), 1000);
  };
  
  const handleCommentSubmitted = () => {
    randomViewerRef.current?.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-100 relative overflow-hidden">
      {/* Partículas de fondo animadas */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4 font-sans">
        <div className="max-w-2xl w-full text-center space-y-8">
          
          {/* Título y descripción con animación de entrada dramática */}
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: -100, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  duration: 1.2
                }}
                className="space-y-8"
              >
                <LandingTitle />
                <LandingDescription />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contenedor principal que cae desde arriba */}
          <AnimatePresence>
            {showSubscription && (
              <motion.div
                initial={{ 
                  opacity: 0, 
                  y: -200, 
                  scale: 0.8,
                  rotateX: -45,
                  perspective: 1000
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  rotateX: 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 25,
                  duration: 0.8,
                  delay: 0.2
                }}
                className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg border border-white/50 relative overflow-hidden"
              >
                {/* Efecto de brillo que cruza la caja */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    delay: 1,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative z-10">
                  {/* Formulario de suscripción con efecto de construcción */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <SubscriptionForm onSuccess={handleSubscriptionSuccess} />
                  </motion.div>

                  {/* Social proof que aparece después */}
                  <AnimatePresence>
                    {showSocial && (
                      <motion.div
                        initial={{ 
                          opacity: 0, 
                          y: 50, 
                          scale: 0.9,
                          filter: "blur(10px)"
                        }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          filter: "blur(0px)"
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 20,
                          duration: 0.8
                        }}
                      >
                        <SocialProof />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mural de la comunidad que se materializa */}
                  <AnimatePresence>
                    {showCommunity && (
                      <motion.div
                        initial={{ 
                          opacity: 0, 
                          y: 80,
                          scale: 0.8,
                          filter: "blur(20px)"
                        }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)"
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 25,
                          duration: 1,
                          delay: 0.3
                        }}
                      >
                      

                        {/* El componente de comentarios con entrada especial */}
                        <motion.div
                          initial={{ 
                            opacity: 0,
                            y: 50,
                            rotateY: -15,
                            perspective: 1000
                          }}
                          animate={{ 
                            opacity: 1,
                            y: 0,
                            rotateY: 0
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 20,
                            delay: 1.2,
                            duration: 0.8
                          }}
                        >
                          <RandomCommentViewer ref={randomViewerRef} />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal de comentarios con entrada dramática */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CommentModal
              isOpen={showCommentModal}
              onClose={() => setShowCommentModal(false)}
              onCommentSubmitted={handleCommentSubmitted}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de carga inicial */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-100 flex items-center justify-center z-50"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl"
            >
              ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}