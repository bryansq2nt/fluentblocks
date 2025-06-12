// src/app/test-pronunciation/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { PronunciationAssessment } from '@/components/game/PronunciationAssessment';

export default function TestPronunciationPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const origLog = console.log;
    const origError = console.error;

    console.log = (...args: any[]) => {
      setLogs(prev => [...prev, args.map(a => String(a)).join(' ')]);
      origLog(...args);
    };

    console.error = (...args: any[]) => {
      setLogs(prev => [...prev, '[ERROR] ' + args.map(a => String(a)).join(' ')]);
      origError(...args);
    };

    return () => {
      console.log = origLog;
      console.error = origError;
    };
  }, []);

  const handleComplete = (score: number) => {
    setLogs(prev => [...prev, `✅ Evaluación completada. Puntuación: ${score}`]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug PronunciationAssessment</h1>

      <div className="mb-6">
        <PronunciationAssessment
          targetSentence="This is a test sentence for debugging"
          onAssessmentComplete={handleComplete}
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">📋 Logs</h2>
      <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
        {logs.length === 0 && <p className="text-gray-500">Aquí aparecerán los logs de consola...</p>}
        {logs.map((log, idx) => (
          <div key={idx} className="font-mono text-sm mb-1">{log}</div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        - Graba, detén y espera a que aparezcan los logs en pantalla.
        <br />- También puedes ver la consola del navegador para más detalles.
      </p>
    </div>
  );
}