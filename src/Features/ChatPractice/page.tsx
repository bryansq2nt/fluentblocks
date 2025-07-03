// app/chat/page.tsx
'use client';

import ChatMockup from "./components/ChatMockup";
import { ChatTutorialButton } from "./components/ChatTutorialButton";
import MainHeader from "@/shared/Components/MainHeader";

export default function ChatPage() {
    return (
   
        <main className="h-dvh w-full flex flex-col md:min-h-screen md:flex-row md:items-center md:justify-center md:bg-gray-50 md:p-4 pt-16 md:pt-0">
 <MainHeader headerActions={<ChatTutorialButton />} />            <ChatMockup />
        </main>
    );
}