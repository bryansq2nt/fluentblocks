// app/api/generate-audio/route.ts

import { NextResponse } from 'next/server';
import { put, head } from '@vercel/blob'; // Importar 'put' y 'head'

// NO necesitas 'node-fetch'. Las API Routes de Next.js tienen 'fetch' globalmente.
// NO necesitas 'fs' ni 'path'. Todo se maneja en la nube.

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'TX3LPaxmHKxFdv7VOQHJ'; 

export async function POST(request: Request) {
  // 1. Verificación más robusta de la API Key
  if (!ELEVENLABS_API_KEY) {
    console.error("Error: La variable de entorno ELEVENLABS_API_KEY no está configurada.");
    return NextResponse.json({ error: "Configuración del servidor incompleta." }, { status: 500 });
  }

  // 2. Obtener el texto de la oración
  let text;
  try {
    const body = await request.json();
    text = body.text;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido." }, { status: 400 });
  }

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: "El texto es requerido y debe ser un string." }, { status: 400 });
  }

  const fileName = text.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.mp3';
  const blobPath = `audios/${fileName}`;

  try {
    // 3. (OPCIONAL PERO RECOMENDADO) Verificar si el archivo ya existe en Vercel Blob
    // Esto evita generar un audio si otro usuario lo pidió un segundo antes.
    const existingBlob = await head(blobPath);
    if (existingBlob) {
      console.log(`Blob ya existe para: ${text}`);
      return NextResponse.json({ success: true, url: existingBlob.url, message: "El archivo ya existía." });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.status !== 404) { // Si el error es diferente de "no encontrado", es un problema real
       console.error("Error al verificar el blob:", error);
    }
    // Si es 404, continuamos con la generación, que es lo esperado.
  }


  try {
    // 4. Llamar a la API de ElevenLabs
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!elevenLabsResponse.ok) {
      const errorBody = await elevenLabsResponse.text();
      console.error(`Error de ElevenLabs: ${elevenLabsResponse.status} ${errorBody}`);
      return NextResponse.json({ error: 'Error al contactar al servicio de voz.' }, { status: 502 });
    }

    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    // 5. Subir el archivo de audio a Vercel Blob
    const blob = await put(blobPath, audioBuffer, {
      access: 'public',
      contentType: 'audio/mpeg',
    });

    return NextResponse.json(blob);

  } catch (error) {
    console.error("Error catastrófico en la generación de audio:", error);
    return NextResponse.json({ error: "Falló la generación de audio." }, { status: 500 });
  }
}