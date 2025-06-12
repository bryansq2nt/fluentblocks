// app/api/assess-pronunciation/route.ts

import { NextResponse } from 'next/server';
import {
  SpeechConfig,
  AudioConfig,
  PushAudioInputStream,
  SpeechRecognizer,
  PronunciationAssessmentConfig,
  PronunciationAssessmentGradingSystem,
  PronunciationAssessmentGranularity,
  ResultReason
} from 'microsoft-cognitiveservices-speech-sdk';

const { SPEECH_KEY, SPEECH_REGION } = process.env;

let speechConfig: SpeechConfig | null = null;
if (SPEECH_KEY && SPEECH_REGION) {
  speechConfig = SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
  speechConfig.speechRecognitionLanguage = 'en-US';
} else {
  console.error("Azure Speech no configurado (SPEECH_KEY/SPEECH_REGION faltantes).");
}

/**
 * Evalúa la pronunciación de `audioBuffer` frente a `targetSentence`.
 */
async function evaluatePronunciation(audioBuffer: ArrayBuffer, targetSentence: string) {
  const pushStream = PushAudioInputStream.create();
  pushStream.write(new Uint8Array(audioBuffer));
  pushStream.close();

  const audioConfig = AudioConfig.fromStreamInput(pushStream);
  const recognizer = new SpeechRecognizer(speechConfig!, audioConfig);

  const assessmentConfig = new PronunciationAssessmentConfig(
    targetSentence,
    PronunciationAssessmentGradingSystem.HundredMark,
    PronunciationAssessmentGranularity.Word, // o .Phoneme si prefieres
    true
  );
  assessmentConfig.applyTo(recognizer);

  return new Promise<any>((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      result => {
        recognizer.close();
        if (result.reason === ResultReason.RecognizedSpeech) {
          const pa = (result as any).pronunciationAssessmentResult;
          resolve({
            accuracyScore: pa.accuracyScore,
            fluencyScore: pa.fluencyScore,
            completenessScore: pa.completenessScore,
            pronunciationScore: pa.pronunciationScore,
            words: pa.words.map((w: any) => ({
              word: w.word,
              errorType: w.errorType,
              accuracyScore: w.accuracyScore,
              offset: w.offset
            }))
          });
        } else {
          reject(new Error(result.errorDetails || 'Error de reconocimiento'));
        }
      },
      err => {
        recognizer.close();
        reject(err);
      }
    );
  });
}

export async function POST(request: Request) {
  if (!speechConfig) {
    return NextResponse.json({ error: "Azure Speech no configurado." }, { status: 500 });
  }

  let targetSentence: string;
  let audioBuffer: ArrayBuffer;

  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    // JSON con base64
    const { sentence, audioBase64 } = await request.json();
    if (!sentence || !audioBase64) {
      return NextResponse.json({ error: "Faltan 'sentence' o 'audioBase64'." }, { status: 400 });
    }
    targetSentence = sentence;
    audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0)).buffer;
  } else {
    // FormData tradicional
    const form = await request.formData();
    const audioBlob = form.get('audio');
    const sent = form.get('sentence');
    if (!(audioBlob instanceof Blob) || typeof sent !== 'string') {
      return NextResponse.json({ error: "Datos inválidos en el FormData." }, { status: 400 });
    }
    targetSentence = sent;
    audioBuffer = await audioBlob.arrayBuffer();
  }

  try {
    const result = await evaluatePronunciation(audioBuffer, targetSentence);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error en evaluación de pronunciación:", err);
    return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
  }
}
