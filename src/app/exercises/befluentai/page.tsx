// app/chat/page.tsx
'use client';

import ChatMockup from "@/components/chat/ChatMockup";
import MainHeader from "@/components/game/MainHeader";

export default function ChatPage() {
    return (
   
        <main className="h-screen w-full flex flex-col md:min-h-screen md:flex-row md:items-center md:justify-center md:bg-gray-50 md:p-4">
            <MainHeader />
            <ChatMockup />
        </main>
    );
}