// src/Features/GoalPlanner/Domain/IRoadmapRepository.ts
import { Roadmap } from './Roadmap';

export interface IRoadmapRepository {
  findById(id: string): Promise<Roadmap | null>;
  findByUserId(userId: string): Promise<Roadmap | null>; // Podríamos tener múltiples, pero empecemos con uno activo.
  save(roadmap: Roadmap): Promise<void>;
}