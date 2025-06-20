// tutorials/chat/chat-onboarding.tutorial.ts
import { Tutorial } from '../tutorial.types';

export const chatOnboardingTutorial: Tutorial = {
  id: 'chat-onboarding',
  path: '/chat',
  localStorageKey: 'tutorial_chatOnboardingCompleted',
  steps: [
    {
      type: 'popover',
      targetElement: '#main-header',
      title: '¡Hola! Esto será fácil',
      content: 'Aquí aprenderás inglés real, sin vueltas ni reglas confusas. Solo escribe lo que necesitas y yo lo convierto en una lección.'
    },
    {
      type: 'popover',
      targetElement: '#chat-input',
      title: 'Tu Zona de Comando',
      content: 'Escríbeme cualquier duda. Desde “cómo pedir un café” hasta “cómo hablar con un jefe en inglés”.'
    },
    {
      type: 'action',
      targetElement: '#chat-input',
      title: '¿Te muestro cómo funciona?',
      content: 'Voy a escribir una pregunta por ti. Solo tienes que presionar "Enviar". Así de simple.',
      isBlocking: true,
      action: {
        type: 'PREFILL_INPUT',
        payload: { text: 'cómo puedo decir que me gusta la naturaleza ?' }
      }
    },
    {
      type: 'action',
      title: 'Creando tu lección...',
      content: 'Estoy preparando una mini clase solo para ti. Un segundo...',
      isBlocking: true,
      isSkippable: false,
      action: { type: 'WAIT_FOR_AI_RESPONSE' }
    },
    {
      type: 'highlight',
      targetElement: '.interactive-card-wrapper',
      title: '¡Tu clase está lista!',
      content: 'Esto no es solo texto. Es una lección interactiva que puedes explorar. Te enseño cómo usarla.'
    },
    {
      type: 'popover',
      targetElement: '#interactive-blocks',
      title: 'Bloques que enseñan',
      content: 'Cada color tiene una función. Tócalos o pasa el cursor para ver su significado. Así entiendes de verdad.'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section',
      title: 'Escucha cómo suena',
      content: 'Presiona el botón de audio para escuchar la frase en inglés. Esto entrena tu oído.'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section-slow',
      title: '¿Muy rápido?',
      content: 'Usa este botón para escuchar la frase más lento. Perfecto para entender cada palabra.'
    },
    {
      type: 'popover',
      targetElement: '#practice-button',
      title: 'Ahora tú',
      content: 'Haz clic aquí para practicar lo que viste. Sin miedo a equivocarte. Así es como se aprende.',
    }
  ]
};
