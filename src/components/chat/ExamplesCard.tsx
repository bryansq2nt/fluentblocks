// components/chat/ExamplesCard.tsx
import { BookOpen, Languages, Sparkles } from 'lucide-react';

// Define la estructura de los datos que recibirá
type ExamplesData = {
  pattern: string;
  examples: {
    english: string;
    spanish: string;
    note: string;
  }[];
  challenge: string;
};

export function ExamplesCard({ data }: { data: ExamplesData }) {
  return (
    <div className="bg-blue-50 border border-blue-200/50 rounded-xl p-4 md:p-5 text-gray-800 space-y-4 max-w-md">
      {/* Sección del Patrón */}
      <div className='flex items-center gap-3'>
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-blue-900">{data.pattern}</h3>
      </div>
      
      {/* Lista de Ejemplos */}
      <ul className="space-y-3">
        {data.examples.map((ex, i) => (
          <li key={i} className="border-l-2 border-blue-300 pl-3">
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-500" /> 
              <code className="bg-blue-100 px-1 rounded">{ex.english}</code>
            </p>
            <p className="text-sm text-gray-600 ml-6">&quot;{ex.spanish}&quot;</p>
            <p className="text-xs text-blue-800/80 mt-1 ml-6 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> 
              <em>{ex.note}</em>
            </p>
          </li>
        ))}
      </ul>
      
      {/* Sección del Reto Final */}
      <div className="flex items-start gap-3 mt-4 pt-3 border-t border-blue-200/50">
        <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold">?</div>
        <p className="text-gray-700 font-medium">{data.challenge}</p>
      </div>
    </div>
  );
}