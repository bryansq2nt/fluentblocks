import Airtable from 'airtable';

// Configuración de Airtable
export const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID || '');

// Tabla de progreso de usuarios
export const userProgressTable = base('UserProgress');

// Interfaces
export interface UserProgress {
  id?: string;
  userId: string;
  levelId: string;
  completed: boolean;
  score: number;
  lastAttempt: string;
  attempts: number;
}

// Funciones para interactuar con Airtable
export const userProgressApi = {
  // Obtener progreso de un usuario
  async getUserProgress(userId: string) {
    try {
      const records = await userProgressTable
        .select({
          filterByFormula: `{userId} = '${userId}'`,
        })
        .all();
      
      return records.map(record => ({
        id: record.id,
        ...((record.fields as unknown) as UserProgress)
      }));
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  },

  // Guardar progreso de un nivel
  async saveLevelProgress(data: UserProgress) {
    try {
      const record = await userProgressTable.create({
        userId: data.userId,
        levelId: data.levelId,
        completed: data.completed,
        score: data.score,
        lastAttempt: new Date().toISOString(),
        attempts: data.attempts
      });
      
      return record;
    } catch (error) {
      console.error('Error saving level progress:', error);
      throw error;
    }
  },

  // Actualizar progreso de un nivel
  async updateLevelProgress(recordId: string, data: Partial<UserProgress>) {
    try {
      const record = await userProgressTable.update(recordId, {
        ...data,
        lastAttempt: new Date().toISOString()
      });
      
      return record;
    } catch (error) {
      console.error('Error updating level progress:', error);
      throw error;
    }
  }
}; 