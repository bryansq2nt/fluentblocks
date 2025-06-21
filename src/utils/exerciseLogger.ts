// src/utils/exerciseLogger.ts
import { UserInteraction, SessionStats } from '../types/exercise-tracking';

export class ExerciseLogger {
    static logInteraction(interaction: UserInteraction) {
      console.log(`[Exercise Tracking] ${interaction.type}`, {
        timestamp: new Date(interaction.timestamp).toISOString(),
        data: interaction.data
      });
    }
  
    static logSessionStats(stats: SessionStats) {
      console.log('[Exercise Session Stats]', {
        duration: `${(stats.totalTime / 1000).toFixed(2)}s`,
        interactionCount: stats.interactions.length,
        correctAnswers: stats.correctAnswers,
        incorrectAnswers: stats.incorrectAnswers,
        hintsUsed: stats.hintsUsed,
        retries: stats.retries,
        startTime: new Date(stats.startTime).toISOString(),
        endTime: new Date(stats.endTime).toISOString()
      });
    }
  }