// app/api/generate-audio/route.ts

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'; // 1. Importamos 'put' de Vercel Blob
import fetch from 'node-fetch';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'TX3LPaxmHKxFdv7VOQHJ'; 

export async function POST(request: Request) {
  // Verificación de la API Key (sin cambios)
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "API key de ElevenLabs no configurada" }, { status: 500 });
  }

  // Obtener el texto de la oración (sin cambios)
  const { text } = await request.json();
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: "El texto es requerido" }, { status: 400 });
  }

  // Crear un nombre de archivo seguro (sin cambios)
  const fileName = text.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.mp3';
  
  // ¡No necesitamos verificar si el archivo existe localmente, Vercel Blob se encarga!

  try {
    // Llamar a la API de ElevenLabs (sin cambios)
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
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

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error de la API de ElevenLabs: ${response.statusText} - ${errorBody}`);
    }

    const audioBuffer = await response.arrayBuffer();

    // --- 👇 CAMBIO PRINCIPAL: DE GUARDAR LOCAL A SUBIR A VERCEL BLOB 👇 ---
    // 4. Subir el archivo de audio a Vercel Blob
    const blob = await put(
      `audios/${fileName}`, // La ruta dentro del Blob store
      audioBuffer,        // El contenido del archivo
      {
        access: 'public',       // Hacer el archivo públicamente accesible
        contentType: 'audio/mpeg', // Especificar el tipo de contenido
      }
    );
    // --- FIN DEL CAMBIO ---

    console.log(`Audio subido a Vercel Blob: ${blob.url}`);
    // Devolvemos el objeto blob completo, que incluye la URL pública
    return NextResponse.json(blob);

  } catch (error) {
    console.error("Error en la generación de audio:", error);
    return NextResponse.json({ error: "Falló la generación de audio." }, { status: 500 });
  }
}