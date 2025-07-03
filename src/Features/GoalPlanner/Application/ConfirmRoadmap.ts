// src/Features/GoalPlanner/Application/ConfirmRoadmap.ts
import { IRoadmapRepository } from '../Domain/IRoadmapRepository';

export class ConfirmRoadmap {
  constructor(private roadmapRepository: IRoadmapRepository) {}

  async execute(roadmapId: string): Promise<void> {
    const roadmap = await this.roadmapRepository.findById(roadmapId);
    if (!roadmap) {
      throw new Error('Roadmap no encontrado');
    }
    roadmap.confirmProposal();
    await this.roadmapRepository.save(roadmap);
  }
}