import { UserInteraction, SessionStats } from './exercise-tracking';

export interface StorageProvider {
  saveInteraction(interaction: UserInteraction): Promise<void>;
  saveSessionStats(stats: SessionStats): Promise<void>;
  getInteractions(): Promise<UserInteraction[]>;
  getSessionStats(): Promise<SessionStats[]>;
  clearStorage(): Promise<void>;
}

// Implementación para Local Storage
export class LocalStorageProvider implements StorageProvider {
  private readonly INTERACTIONS_KEY = 'exercise_interactions';
  private readonly SESSION_STATS_KEY = 'exercise_session_stats';

  async saveInteraction(interaction: UserInteraction): Promise<void> {
    const interactions = await this.getInteractions();
    interactions.push(interaction);
    localStorage.setItem(this.INTERACTIONS_KEY, JSON.stringify(interactions));
  }

  async saveSessionStats(stats: SessionStats): Promise<void> {
    const allStats = await this.getSessionStats();
    allStats.push(stats);
    localStorage.setItem(this.SESSION_STATS_KEY, JSON.stringify(allStats));
  }

  async getInteractions(): Promise<UserInteraction[]> {
    const data = localStorage.getItem(this.INTERACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getSessionStats(): Promise<SessionStats[]> {
    const data = localStorage.getItem(this.SESSION_STATS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async clearStorage(): Promise<void> {
    localStorage.removeItem(this.INTERACTIONS_KEY);
    localStorage.removeItem(this.SESSION_STATS_KEY);
  }
}

// Factory para crear el provider adecuado
export class StorageFactory {
  static createProvider(type: 'local' | 'database' = 'local'): StorageProvider {
    switch (type) {
      case 'local':
        return new LocalStorageProvider();
      case 'database':
        // Aquí implementaremos el DatabaseProvider cuando esté listo
        throw new Error('Database storage not implemented yet');
      default:
        throw new Error(`Unknown storage type: ${type}`);
    }
  }
} 