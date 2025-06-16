// app/chat/page.tsx
'use client';

import ChatMockup from "@/components/chat/ChatMockup";

export default function ChatPage() {
    return (
        // --- CAMBIOS CLAVE AQUÍ ---
        // Este `main` ahora se encarga de centrar el chat en pantallas grandes.
        // `min-h-screen` asegura que ocupe toda la altura.
        // `flex items-center justify-center` centra el contenido.
        // El fondo se mueve aquí para que cubra toda la pantalla.
        <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 md:p-4">
            <ChatMockup />
        </main>
    );
}