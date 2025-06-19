// /tutorials/chat/chat-onboarding.tutorial.ts

import { Tutorial } from '../tutorial.types';

export const chatOnboardingTutorial: Tutorial = {
  id: 'chat-onboarding',
  path: '/chat', // La ruta donde se debe activar este tutorial
  localStorageKey: 'tutorial_chatOnboardingCompleted',
  steps: [
    {
      type: 'popover',
      targetElement: '#chat-header', // Selector CSS del elemento a señalar
      title: '¡Bienvenid@ a tu Zona de Práctica!',
      content: 'Soy FluentBlocks AI, tu compañero para dominar el inglés real. ¡Vamos a ver cómo funciona esto!'
    },
    {
      type: 'popover',
      targetElement: '#chat-input',
      title: 'Tu Cerebro de Mando',
      content: 'Aquí es donde me pides lo que sea. Desde "cómo usar \'gonna\'" hasta "ayuda para mi entrevista de trabajo".'
    },
    {
      type: 'action', // Un tipo de paso especial que no es solo un popover
      title: '¡Tu Primera Misión!',
      content: 'Para que veas la magia, voy a escribir una pregunta por ti. Solo tienes que presionar "Enviar" cuando aparezca.',
      action: { 
        type: 'PREFILL_INPUT', 
        payload: {
          selector: '#chat-input-field', // Selector del input específico
          text: 'cómo se usa "can" y "could" para pedir algo'
        }
      }
    },
    {
      type: 'action',
      title: 'Procesando tu Lección...',
      content: '¡Genial! Ahora estoy creando una lección interactiva solo para ti. Dame un segundo...',
      action: { type: 'WAIT_FOR_AI_RESPONSE' } // Pausa el tutorial hasta que la IA responda
    },
    {
      type: 'highlight', // Resalta un área en vez de un popover
      targetElement: '.interactive-card-wrapper', // Un div que envolverá la tarjeta
      title: '¡Lección Lista!',
      content: '¡Tarán! No es solo texto, es una lebuena. Puedes interactuar con los bloques, escuchar el audio y mucho más. ¡Explórala y luego dale a "Terminar"!'
    }
  ]
};