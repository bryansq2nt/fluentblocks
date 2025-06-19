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
    {
      type: 'highlight',
      targetElement: '.interactive-card-wrapper',
      title: '¡Lección Lista!',
      content: '¡Tarán! No es solo texto, es una lección interactiva. Explórala y luego dale a "Terminar" para empezar a practicar por tu cuenta.',
      // Este último paso SÍ tiene botón
    }
  ]
};