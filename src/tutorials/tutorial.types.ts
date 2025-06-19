// /tutorials/tutorial.types.ts

export interface TutorialStep {
    type: 'popover' | 'highlight' | 'action';
    targetElement?: string; // Opcional para acciones que no apuntan a nada
    title: string;
    content: string;
    isBlocking?: boolean; 
    
    isSkippable?: boolean;
    action?: {
      type: 'PREFILL_INPUT' | 'WAIT_FOR_AI_RESPONSE';
      payload?: any;
    };
  }
  
  export interface Tutorial {
    id: string;
    path: string;
    localStorageKey: string;
    steps: TutorialStep[];
  }