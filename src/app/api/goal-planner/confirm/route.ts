// app/api/goal-planner/confirm/route.ts
import { NextResponse } from 'next/server';
import { ConfirmRoadmap } from '@/Features/GoalPlanner/Application/ConfirmRoadmap';
import { InMemoryRoadmapRepository } from '@/Features/GoalPlanner/Infrastructure/InMemoryRoadmapRepository';

export async function POST(request: Request) {
  try {
    const { roadmapId } = await request.json();
    if (!roadmapId) {
      return NextResponse.json({ error: 'Falta roadmapId' }, { status: 400 });
    }

    const useCase = new ConfirmRoadmap(new InMemoryRoadmapRepository());
    await useCase.execute(roadmapId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al confirmar el roadmap:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}