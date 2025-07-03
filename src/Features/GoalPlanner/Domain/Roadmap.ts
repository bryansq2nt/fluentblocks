
import { randomUUID } from 'crypto'; // Usaremos UUIDs para los IDs
import { Milestone, MilestoneData } from './Milestone';
import { Goal } from './Goal';

// Tipos para el estado de la conversación, más explícitos
export type ConversationState = 
  | 'GREETING_SENT'          // La IA ha saludado y espera la meta inicial.
  | 'GATHERING_DETAILS'      // La IA está haciendo preguntas de seguimiento.
  | 'PROPOSAL_GENERATED'     // La IA ha generado la propuesta y espera confirmación.
  | 'AWAITING_REVISIONS'     // El usuario pidió cambios, la IA espera las instrucciones.
  | 'COMPLETED';             // El usuario confirmó el plan, el proceso ha terminado.

// Usaremos un tipo simple para los datos que vienen de la DB o la IA
export type RoadmapData = {
  id: string;
  userId: string; // ¡Importante! Siempre asociar el roadmap a un usuario
  goal: Goal;
  milestones: MilestoneData[];
  conversationState: ConversationState;
};


// --- La Clase Roadmap (Nuestro Agregado Raíz) ---
export class Roadmap {
  private readonly _id: string;
  private _userId: string;
  private _goal: Goal;
  private _milestones: Milestone[];
  private _conversationState: ConversationState;

  private constructor(data: RoadmapData) {
    this._id = data.id;
    this._userId = data.userId;
    this._goal = data.goal;
    this._milestones = data.milestones.map(m => Milestone.fromData(m));
    this._conversationState = data.conversationState;
  }

  // --- Métodos de Fábrica (Factory Methods) para crear instancias ---

  /**
   * Inicia una nueva conversación para un plan de estudios.
   * Este es el punto de partida.
   */
  public static startConversation(userId: string): Roadmap {
    return new Roadmap({
      id: randomUUID(),
      userId,
      goal: { text: '' }, // La meta está vacía al principio
      milestones: [],
      conversationState: 'GREETING_SENT',
    });
  }

  /**
   * Reconstruye un Roadmap desde datos existentes (ej: desde la base de datos).
   */
  public static fromData(data: RoadmapData): Roadmap {
    return new Roadmap(data);
  }

  // --- Métodos que Encapsulan la Lógica de Negocio ---

  /**
   * El usuario define su meta inicial.
   */
  public defineGoal(goalText: string) {
    if (this._conversationState !== 'GREETING_SENT') {
      throw new Error("Cannot define a goal at this stage of the conversation.");
    }
    this._goal = { text: goalText };
    this._conversationState = 'GATHERING_DETAILS'; // Ahora la IA puede empezar a preguntar más.
  }

  /**
   * La IA genera la propuesta de hitos.
   */
  public generateProposal(milestonesData: Omit<MilestoneData, 'id' | 'status'>[]) {
    if (this._conversationState !== 'GATHERING_DETAILS' && this._conversationState !== 'AWAITING_REVISIONS') {
       throw new Error("Cannot generate a proposal at this stage.");
    }
    
    // Creamos los hitos, todos bloqueados por defecto.
    this._milestones = milestonesData.map(m => Milestone.create(m.title, m.description));
    this._conversationState = 'PROPOSAL_GENERATED';
  }

  /**
   * El usuario confirma la propuesta. ¡El plan de estudios está listo!
   */
  public confirmProposal() {
    if (this._conversationState !== 'PROPOSAL_GENERATED') {
      throw new Error("No proposal to confirm.");
    }
    if (this._milestones.length === 0) {
      throw new Error("Cannot confirm an empty roadmap.");
    }

    // Desbloqueamos el primer hito
    this._milestones[0].unlock();
    
    this._conversationState = 'COMPLETED';

    // Aquí podríamos disparar un evento de dominio, por ejemplo:
    // this.addDomainEvent(new RoadmapConfirmedEvent(this._id, this._userId));
    // Por ahora lo mantenemos simple.
  }
  
  /**
   * El usuario solicita cambios en la propuesta.
   */
  public requestRevisions() {
    if (this._conversationState !== 'PROPOSAL_GENERATED') {
        throw new Error("No proposal to revise.");
    }
    this._conversationState = 'AWAITING_REVISIONS';
  }

  // --- Getters para acceder a los datos de forma segura (inmutabilidad) ---

  public get id(): string { return this._id; }
  public get userId(): string { return this._userId; }
  public get goal(): Goal { return this._goal; }
  public get milestones(): Milestone[] { return this._milestones; }
  public get conversationState(): ConversationState { return this._conversationState; }
  
  // Método para convertir la clase a un objeto plano (para guardar en DB)
  public toData(): RoadmapData {
    return {
      id: this._id,
      userId: this._userId,
      goal: this._goal,
      milestones: this._milestones.map(m => m.toData()),
      conversationState: this._conversationState,
    };
  }
}