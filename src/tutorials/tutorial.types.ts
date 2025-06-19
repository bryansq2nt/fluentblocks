// /tutorials/tutorial.types.ts

export interface TutorialStep {
    type: 'popover' | 'highlight' | 'action';
    targetElement?: string; // Opcional para acciones que no apuntan a nada
    title: string;
    content: string;
    action?: {
      type: 'PREFILL_INPUT' | 'WAIT_FOR_AI_RESPONSE' | 'WAIT_FOR_USER_ACTION';
      payload?: any;
    };
  }
  
  export interface Tutorial {
    id: string;
    path: string;
    localStorageKey: string;
    steps: TutorialStep[];
  }