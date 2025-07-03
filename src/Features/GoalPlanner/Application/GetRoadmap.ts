// src/Features/GoalPlanner/Application/GetRoadmap.ts
import { IRoadmapRepository } from '../Domain/IRoadmapRepository';
import { RoadmapData } from '../Domain/Roadmap';

export class GetRoadmap {
  constructor(private roadmapRepository: IRoadmapRepository) {}

  async execute(roadmapId: string): Promise<RoadmapData | null> {
    const roadmap = await this.roadmapRepository.findById(roadmapId);
    if (!roadmap) return null;
    return roadmap.toData(); // Devolvemos los datos planos para la UI
  }
}