// components/SubscriptionForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  onSuccess: () => void; // Callback para notificar el éxito
};

export default function SubscriptionForm({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
      onSuccess(); // Llama al callback
    } catch (error) {
      console.error("Error al suscribirse:", error);
      alert("Hubo un error al enviar tu correo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold text-green-600">¡Gracias por unirte!</h2>
        <p className="text-gray-700 mt-2">Eres de los primeros en esta historia.</p>
      </motion.div>
    );
  }

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Sé el primero en saberlo</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu correo electrónico"
        required
        className="w-full px-4 py-3 bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 transition-all text-gray-700"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {isSubmitting ? 'Enviando...' : 'Únete a la aventura'}
      </button>
    </motion.form>
  );
}