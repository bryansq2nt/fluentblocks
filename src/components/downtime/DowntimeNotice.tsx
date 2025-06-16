// components/downtime/DowntimeNotice.tsx
'use client';

import Link from 'next/link';
import SubscriptionForm from '@/components/downtime/SubscriptionForm';
import SocialProof from '@/components/downtime/SocialProof';

export default function DowntimeNotice() {
  return (
    <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Actualización en curso
      </h2>
      <p className="text-gray-700 mb-4">
        Estamos trabajando en nuevas funcionalidades y mejoras. 
        Para garantizar la mejor experiencia, no publicaremos cambios adicionales hasta que todo esté completamente probado.
      </p>
      <p className="text-gray-700 mb-6">
        Mientras tanto, puedes <Link href="/home" className="font-semibold text-blue-600 hover:underline">probar la versión actual</Link> y ver por qué FluentBlocks ya está ayudando a miles de personas.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Suscripción para notificar lanzamiento */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Mantente informado
          </h3>
          <SubscriptionForm onSuccess={() => { /* opcional: abrir modal */ }} />
        </div>
        {/* Prueba social */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nuestra comunidad
          </h3>
          <SocialProof />
        </div>
      </div>
    </section>
  );
}
