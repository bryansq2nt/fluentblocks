// components/chat/ChatHeader.tsx
import { Bot } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800">Agente FluentBlocks</h3>
        <p className="text-sm text-green-600 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
          En línea
        </p>
      </div>
    </div>
  );
}