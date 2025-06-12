// src/components/game/PronunciationAssessment.tsx

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2, X } from 'lucide-react';

interface AssessmentResult {
  accuracyScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  words: { word: string; accuracyScore: number; errorType: string; }[];
}

interface PronunciationAssessmentProps {
  targetSentence: string;
  onAssessmentComplete?: (score: number) => void;
}

export const PronunciationAssessment: React.FC<PronunciationAssessmentProps> = ({
  targetSentence,
  onAssessmentComplete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'finished'>('idle');
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      setStatus('recording');
      recorder.start();
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const processAudio = async () => {
    console.log("Entro a processAudio");
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('sentence', targetSentence);
  
    console.log("llego al try");
    try {
      // Creamos un AbortController para poder cancelar la petición
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000 /* 10s de timeout, ajústalo a tu gusto */);
  
      const res = await fetch('/api/assess-pronunciation', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
  
      console.log("creo el res");
      if (!res.ok) throw new Error("La evaluación en el servidor falló.");
  
      const data: AssessmentResult = await res.json();
      console.log("tiene la data", data);
  
      setResult(data);
      setStatus('finished');
      onAssessmentComplete?.(data.pronunciationScore);
      console.log("termino");
    } catch (err: any) {
      // Si fue un abort o cualquier otro error, caerás aquí
      console.error("Error al procesar la evaluación:", err);
      alert(
        err.name === 'AbortError'
          ? "La petición tardó demasiado y se canceló."
          : "Hubo un error al evaluar tu pronunciación."
      );
      setStatus('idle');
    }
  };
  

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || status !== 'recording') return;

    setStatus('processing');
    recorder.onstop = () => {
      processAudio();
    };
    recorder.stop();
  };

  const resetState = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setResult(null);
    }, 300);
  };

  const getScoreColor = (score: number) => {
    if (score > 85) return 'text-green-500';
    if (score > 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="p-2 rounded-full hover:bg-rose-100 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Evaluar pronunciación"
      >
        <Mic className="w-6 h-6 text-rose-500" />
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={resetState}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Pronunciación</h3>
                <button onClick={resetState}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <p className="mb-6">"{targetSentence}"</p>

              {status === 'idle' && (
                <button
                  onClick={handleStartRecording}
                  className="w-full py-4 bg-rose-500 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:bg-rose-600"
                >
                  <Mic /> Grabar
                </button>
              )}
              {status === 'recording' && (
                <button
                  onClick={handleStopRecording}
                  className="w-full py-4 bg-gray-700 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 animate-pulse"
                >
                  <Square className="fill-white" /> Detener
                </button>
              )}
              {status === 'processing' && (
                <div className="text-center py-4 text-gray-500 flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin" /> Evaluando...
                </div>
              )}
              {status === 'finished' && result && (
                <div className="text-center">
                  <h4 className="font-bold text-lg">Resultados</h4>
                  <p className={`text-6xl font-bold my-2 ${getScoreColor(result.pronunciationScore)}`}>
                    {result.pronunciationScore}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">Puntaje de Pronunciación</p>
                  <div className="flex justify-around text-sm">
                    <p>
                      Precisión:{' '}
                      <strong className={getScoreColor(result.accuracyScore)}>
                        {result.accuracyScore}
                      </strong>
                    </p>
                    <p>
                      Fluidez:{' '}
                      <strong className={getScoreColor(result.fluencyScore)}>
                        {result.fluencyScore}
                      </strong>
                    </p>
                  </div>
                </div>
              )}

              {(status === 'finished' || status === 'idle') && (
                <button
                  onClick={resetState}
                  className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700"
                >
                  Siguiente
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};