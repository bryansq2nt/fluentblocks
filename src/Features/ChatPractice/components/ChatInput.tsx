// components/chat/ChatInput.tsx
'use client';

import { Send } from 'lucide-react';

type ChatInputProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (text: string) => void;
  isAgentTyping: boolean;
};

export function ChatInput({ 
  inputValue,
  setInputValue, 
  onSendMessage, 
  isAgentTyping 
}: ChatInputProps){

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAgentTyping) return;
    onSendMessage(inputValue);
  };

  return (
    <div id="chat-input" className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
        id="chat-input-field"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe una frase en español..."
          className="text-black flex-1 w-full px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          disabled={isAgentTyping}
        />
        <button
          type="submit"
          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex-shrink-0"
          disabled={!inputValue.trim() || isAgentTyping}
          aria-label="Enviar mensaje"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}