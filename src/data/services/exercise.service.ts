// Este servicio proporciona funciones para manejar los datos de los ejercicios.

import { ExerciseQuestion } from '../exercises/adjective-placement'; // Usamos la interfaz de uno de ellos

/**
 * Mezcla un array en su lugar usando el algoritmo Fisher-Yates.
 * @param array El array a mezclar.
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Obtiene un número específico de preguntas aleatorias de un banco de preguntas.
 * 
 * @param questionBank El array completo de preguntas para una lección.
 * @param count El número de preguntas aleatorias que se desea obtener.
 * @param usedIds Array de IDs de preguntas ya utilizadas.
 * @returns Un array con el número solicitado de preguntas aleatorias.
 */
export function adjectivePlacementExamples(
  questionBank: ExerciseQuestion[], 
  count: number, 
  usedIds: number[] = []
): ExerciseQuestion[] {
  // 1. Filtramos el banco para obtener solo las preguntas que NO han sido usadas.
  const availableQuestions = questionBank.filter(q => !usedIds.includes(q.id));

  // Si no quedan preguntas disponibles, podemos devolver un array vacío o manejarlo como se prefiera.
  if (availableQuestions.length === 0) {
    return [];
  }

  // 2. Mezclamos solo las preguntas disponibles.
  const shuffled = shuffleArray(availableQuestions);

  // 3. Devolvemos la cantidad solicitada (o menos si no hay suficientes).
  const numToReturn = Math.min(count, shuffled.length);
  return shuffled.slice(0, numToReturn);
}