// src/Features/GoalPlanner/Domain/Milestone.ts

import { randomUUID } from 'crypto';

export type MilestoneStatus = 'LOCKED' | 'UNLOCKED' | 'COMPLETED';

// Datos planos para persistencia
export type MilestoneData = {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
};

// --- La Clase Milestone (Entidad dentro del Agregado Roadmap) ---
export class Milestone {
  private readonly _id: string;
  private _title: string;
  private _description: string;
  private _status: MilestoneStatus;

  private constructor(data: MilestoneData) {
    this._id = data.id;
    this._title = data.title;
    this._description = data.description;
    this._status = data.status;
  }

  // --- Métodos de Fábrica ---

  /**
   * Crea un nuevo hito, siempre bloqueado por defecto.
   */
  public static create(title: string, description: string): Milestone {
    return new Milestone({
      id: randomUUID(),
      title,
      description,
      status: 'LOCKED',
    });
  }
  
  /**
   * Reconstruye un Hito desde datos existentes.
   */
  public static fromData(data: MilestoneData): Milestone {
      return new Milestone(data);
  }

  // --- Lógica de Negocio ---

  public unlock() {
    if (this._status !== 'LOCKED') {
      console.warn(`Attempted to unlock a milestone that was not locked. Status: ${this._status}`);
      return; // No lanzamos error, pero no hacemos nada.
    }
    this._status = 'UNLOCKED';
  }

  public complete() {
    if (this._status !== 'UNLOCKED') {
      throw new Error("Cannot complete a milestone that is not unlocked.");
    }
    this._status = 'COMPLETED';
  }
  
  // --- Getters ---
  public get id(): string { return this._id; }
  public get title(): string { return this._title; }
  public get description(): string { return this._description; }
  public get status(): string { return this._status; }
  
  // --- Conversión a datos planos ---
  public toData(): MilestoneData {
      return {
          id: this.id,
          title: this.title,
          description: this.description,
          status: this.status as MilestoneStatus,
      }
  }
}