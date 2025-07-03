// components/chat/AgentAvatar.tsx
import { Bot } from 'lucide-react';

export function AgentAvatar() {
  return (
    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center self-start flex-shrink-0">
      <Bot className="w-5 h-5 text-gray-500" />
    </div>
  );
}