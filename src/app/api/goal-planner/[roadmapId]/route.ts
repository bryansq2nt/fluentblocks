// app/api/goal-planner/[roadmapId]/route.ts
import { NextResponse } from 'next/server';
import { GetRoadmap } from '@/Features/GoalPlanner/Application/GetRoadmap';
import { InMemoryRoadmapRepository } from '@/Features/GoalPlanner/Infrastructure/InMemoryRoadmapRepository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roadmapId: string }> }
) {
  try {
    const { roadmapId } = await params;
    if (!roadmapId) {
      return NextResponse.json({ error: 'Falta roadmapId' }, { status: 400 });
    }

    const useCase = new GetRoadmap(new InMemoryRoadmapRepository());
    const roadmapData = await useCase.execute(roadmapId);

    if (!roadmapData) {
      return NextResponse.json({ error: 'Roadmap no encontrado' }, { status: 404 });
    }

    return NextResponse.json(roadmapData);
  } catch (error) {
    console.error('Error al obtener el roadmap:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}