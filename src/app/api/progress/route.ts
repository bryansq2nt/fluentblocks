import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { userProgressApi } from '@/lib/airtable';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { levelId, completed, score, attempts } = body;

    // Buscar si ya existe un registro para este nivel
    const existingProgress = await userProgressApi.getUserProgress(session.user.email);
    const levelProgress = existingProgress.find(p => p.levelId === levelId);

    if (levelProgress) {
      // Actualizar progreso existente
      const updatedProgress = await userProgressApi.updateLevelProgress(levelProgress.id, {
        completed,
        score,
        attempts
      });
      return NextResponse.json(updatedProgress);
    } else {
      // Crear nuevo progreso
      const newProgress = await userProgressApi.saveLevelProgress({
        userId: session.user.email,
        levelId,
        completed,
        score,
        attempts,
        lastAttempt: new Date().toISOString()
      });
      return NextResponse.json(newProgress);
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Error al guardar el progreso' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session?.user?.email) {
      console.log('No autorizado');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const progress = await userProgressApi.getUserProgress(session.user.email);
    console.log('Fetched progress:', progress);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Error al obtener el progreso' }, { status: 500 });
  }
} 