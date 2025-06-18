// lib/lottieUtils.ts
// Este archivo contiene código que SOLO debe ejecutarse en el servidor.
import fs from 'fs';
import path from 'path';

/**
 * Lee un directorio de animaciones Lottie y devuelve la ruta pública a un archivo al azar.
 * @param category - El subdirectorio dentro de 'public/animations/lotties/' (ej: 'loading', 'support').
 * @returns Una string con la ruta pública completa (ej: '/animations/lotties/loading/file.json') o null si hay un error.
 */
export const getRandomLottiePath = (category: string): string | null => {
  try {
    const lottiesDirectory = path.join(process.cwd(), 'public', 'animations', 'lotties', category);
    const filenames = fs.readdirSync(lottiesDirectory);
    const jsonFiles = filenames.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * jsonFiles.length);
    const randomFile = jsonFiles[randomIndex];

    return `/animations/lotties/${category}/${randomFile}`;
  } catch (error) {
    console.error(`Error al leer el directorio para la categoría "${category}":`, error);
    return null;
  }
};