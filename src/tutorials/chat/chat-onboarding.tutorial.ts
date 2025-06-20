// tutorials/chat/chat-onboarding.tutorial.ts
import { Tutorial } from '../tutorial.types';

export const chatOnboardingTutorial: Tutorial = {
  id: 'chat-onboarding',
  path: '/chat',
  localStorageKey: 'tutorial_chatOnboardingCompleted',
  steps: [
    // Pasos 1 y 2 no cambian
    {
      type: 'popover',
      targetElement: '#chat-header',
      title: '¡Bienvenid@ a tu Zona de Práctica!',
      content: 'Soy FluentBlocks AI, tu compañero para dominar el inglés real. ¡Vamos a ver cómo funciona esto!'
    },
    {
      type: 'popover',
      targetElement: '#chat-input',
      title: 'Tu Cerebro de Mando',
      content: 'Aquí es donde me pides lo que sea. Desde "cómo usar \'gonna\'" hasta "ayuda para mi entrevista de trabajo".'
    },
    // --- CAMBIOS AQUÍ ---
    {
      type: 'action',
      targetElement: '#chat-input', // Apuntamos al input para posicionar el popover
      title: '¡Tu Primera Misión!',
      content: 'Para que veas la magia, voy a escribir una pregunta por ti. Solo tienes que presionar "Enviar" cuando aparezca.',
      isBlocking: true, // <--- Este paso bloquea el botón "Siguiente"
      action: { 
        type: 'PREFILL_INPUT', 
        payload: { text: 'cómo se usa "can" y "could" para pedir algo' }
      }
    },
    {
      type: 'action',
      title: 'Procesando tu Lección...',
      content: '¡Genial! Ahora estoy creando una lección interactiva solo para ti. Dame un segundo...',
      isBlocking: true,
      isSkippable: false,
      action: { type: 'WAIT_FOR_AI_RESPONSE' }
    },
     // --- NUEVOS PASOS AQUÍ ---
     {
      type: 'highlight',
      targetElement: '.interactive-card-wrapper', // Apunta a toda la tarjeta primero
      title: '¡Lección Lista!',
      content: '¡Tarán! Esto no es solo texto, es una lección interactiva. Déjame mostrarte las partes clave.'
    },
    {
      type: 'popover',
      targetElement: '#interactive-blocks', // Apunta a los bloques
      title: 'Bloques Inteligentes',
      content: 'Pasa el cursor (o toca en el móvil) sobre cada bloque de color para ver su traducción y función. ¡Así entiendes el porqué de la oración!'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section', // Apunta a la sección del audio
      title: 'Escucha y Repite',
      content: 'Usa el botón de audio para escuchar la pronunciación correcta. ¡La práctica auditiva es fundamental!'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section-slow', // Apunta a la sección del audio
      title: 'Mas Lento ?',
      content: 'Este otro botón te ayudara a escuchar la oración mas lento, para que puedas entender mejor la pronunciación.'
    },
    {
      type: 'popover',
      targetElement: '#practice-button', // Apunta al botón de práctica
      title: '¡Ahora te Toca a Ti!',
      content: 'Cuando te sientas listo, presiona aquí para hacer ejercicios y poner a prueba lo que aprendiste. ¡Sin miedo!',
      // Este es el último paso, el botón dirá "Terminar"
    }
  ]
};