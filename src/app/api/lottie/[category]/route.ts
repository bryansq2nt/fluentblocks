// app/api/lottie/[category]/route.ts
import { NextResponse } from 'next/server';
import { getRandomLottiePath } from '@/utils/lottie';

// AÑADIDO: Esta línea le dice a Next.js que use el entorno de Node.js para esta ruta.
// Esto nos da acceso a 'fs' y 'path'. ¡Esta es la solución al error!
export const runtime = 'nodejs'; 

// Esta función manejará peticiones como GET /api/lottie/loading
export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  // CORREGIDO: Awaitar params primero, luego acceder a category
  const { category } = await params;

  if (!category) {
    return NextResponse.json({ error: 'Categoría no especificada.' }, { status: 400 });
  }

  const lottiePath = getRandomLottiePath(category);

  if (!lottiePath) {
    return NextResponse.json({ error: 'No se encontraron animaciones para esta categoría.' }, { status: 404 });
  }

  return NextResponse.json({ path: lottiePath });
}