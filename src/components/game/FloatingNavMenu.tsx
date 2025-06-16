// components/game/FloatingNavMenu.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, MessageSquare, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/home', icon: <Home className="w-5 h-5" />, label: 'Home' },
  { href: '/map', icon: <Map className="w-5 h-5" />, label: 'Mapa' },
  { href: '/exercises/befluentai', icon: <MessageSquare className="w-5 h-5" />, label: 'Chat AI' },
];

export default function FloatingNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNav = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const menuVariants = {
    closed: { scale: 0, transition: { when: "afterChildren" } },
    open: { scale: 1, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col items-center gap-3 mb-4"
          >
            {navItems.map(item => (
              <motion.button
                key={item.href}
                variants={itemVariants}
                onClick={() => handleNav(item.href)}
                className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all"
                title={item.label}
              >
                {item.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'menu'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}