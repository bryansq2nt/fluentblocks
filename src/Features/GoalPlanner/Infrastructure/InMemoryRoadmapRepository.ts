// src/Features/GoalPlanner/Infrastructure/InMemoryRoadmapRepository.ts
import { Roadmap, RoadmapData } from '../Domain/Roadmap';
import { IRoadmapRepository } from '../Domain/IRoadmapRepository';

// Usaremos un Map para simular una base de datos en memoria
const memoryDatabase = new Map<string, RoadmapData>();

export class InMemoryRoadmapRepository implements IRoadmapRepository {
  public async findById(id: string): Promise<Roadmap | null> {
    const data = memoryDatabase.get(id);
    if (!data) return null;
    return Roadmap.fromData(data);
  }

  public async findByUserId(userId: string): Promise<Roadmap | null> {
    for (const data of memoryDatabase.values()) {
        // Lógica simple: devuelve el primer roadmap no completado para el usuario
        if (data.userId === userId && data.conversationState !== 'COMPLETED') {
            return Roadmap.fromData(data);
        }
    }
    return null;
  }

  public async save(roadmap: Roadmap): Promise<void> {
    const data = roadmap.toData();
    console.log(`Guardando roadmap ${data.id} en memoria:`, data);
    memoryDatabase.set(data.id, data);
  }
}