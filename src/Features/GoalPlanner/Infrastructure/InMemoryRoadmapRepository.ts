// src/Features/GoalPlanner/Infrastructure/InMemoryRoadmapRepository.ts (Versión Final y Persistente)
import { Roadmap, RoadmapData } from '../Domain/Roadmap';
import { IRoadmapRepository } from '../Domain/IRoadmapRepository';

// --- PATRÓN SINGLETON PARA PERSISTIR EN DESARROLLO ---

// Declaramos una interfaz para nuestro objeto global personalizado
declare global {
  // eslint-disable-next-line no-var
  var memoryDatabase: Map<string, RoadmapData> | undefined;
}

// Si la base de datos no existe en el objeto global, la creamos.
// Si ya existe (porque el servidor solo se recargó), la reutilizamos.
const memoryDatabase = global.memoryDatabase || (global.memoryDatabase = new Map<string, RoadmapData>());

// ---------------------------------------------------------


export class InMemoryRoadmapRepository implements IRoadmapRepository {
  public async findById(id: string): Promise<Roadmap | null> {
    const data = memoryDatabase.get(id);
    if (!data) return null;
    console.log(`[InMemoryRepo] Encontrado roadmap ${id}:`, data); // Log para depurar
    return Roadmap.fromData(data);
  }

  public async findByUserId(userId: string): Promise<Roadmap | null> {
    for (const data of memoryDatabase.values()) {
        if (data.userId === userId && data.conversationState !== 'COMPLETED') {
            console.log(`[InMemoryRepo] Encontrado roadmap activo para usuario ${userId}:`, data); // Log para depurar
            return Roadmap.fromData(data);
        }
    }
    return null;
  }

  public async save(roadmap: Roadmap): Promise<void> {
    const data = roadmap.toData();
    console.log(`[InMemoryRepo] Guardando roadmap ${data.id}:`, data); // Log para depurar
    memoryDatabase.set(data.id, data);
  }
}