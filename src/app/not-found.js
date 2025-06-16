// app/not-found.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
// Importamos iconos relevantes y con más personalidad
import { Compass, MessageSquare, Users, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-2xl text-center bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/50"
      >
        {/* Icono Principal */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-500">
          <Compass className="h-10 w-10 text-white" />
        </div>

        {/* Mensaje Principal */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          ¡Oops! Parece que te perdiste.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          No te preocupes, ¡hasta los mejores exploradores se desvían!
          &quot;FluentBlocks AI&quot; está aquí para guiarte de vuelta al camino
          del inglés.
        </p>

        {/* Sugerencias de Navegación */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Tarjeta para el Tutor AI */}
          <Link
            href="/exercises/befluentai"
            className="group rounded-xl p-4 transition-all duration-200 hover:bg-blue-50 hover:shadow-lg border border-transparent hover:border-blue-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Habla con la IA</h2>
                <p className="text-sm text-gray-500">
                  Resuelve cualquier duda al instante.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta para la Comunidad */}
          <Link
            href="/community"
            className="group rounded-xl p-4 transition-all duration-200 hover:bg-green-50 hover:shadow-lg border border-transparent hover:border-green-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">
                  Mural de la Comunidad
                </h2>
                <p className="text-sm text-gray-500">
                  Mira lo que otros están aprendiendo.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Botón para Volver a Home */}
        <div className="mt-8">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Volver a mi Home</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
