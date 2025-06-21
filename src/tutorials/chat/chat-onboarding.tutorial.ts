// tutorials/chat/chat-onboarding.tutorial.ts
import { Tutorial } from '../tutorial.types';

export const chatOnboardingTutorial: Tutorial = {
  id: 'chat-onboarding',
  path: '/chat',
  localStorageKey: 'tutorial_chatOnboardingCompleted',
  steps: [
    {
      type: 'popover',
      title: '¡Bienvenido a Fluent Blocks!',
      isSkippable: false,
      content: 'Aquí aprenderás inglés real, sin vueltas ni reglas confusas. Solo escribe lo que necesitas y yo lo convierto en una lección.'
    },
    {
      type: 'popover',
      title: 'Explicacion Rapida',
      isSkippable: false,
      targetElement: '#main-menu-button',
      content: 'Este es el menu principal. Aqui puedes regresar a la pagina de inicio o navegar en la plataforma'
    },
    {
      type: 'popover',
      title: 'Explicacion Rapida',
      isSkippable: false,
      targetElement: '#main-menu-button',
      content: 'Este es el menu principal. Aqui puedes regresar a la pagina de inicio o navegar en la plataforma'
    },
    {
      type: 'popover',
      targetElement: '#chat-input',
      title: 'Aqui sucede la magia!',
      isSkippable: false,
      content: 'Escríbeme cualquier duda. Desde “cómo pedir un café” hasta “cómo hablar con un jefe en inglés”.'
    },
    {
      type: 'action',
      targetElement: '#chat-input',
      title: '¿Te muestro cómo funciona?',
      content: 'Voy a escribir una pregunta por ti. Solo tienes que presionar "Enviar". Así de simple.',
      isBlocking: true,
      isSkippable: false,
      action: {
        type: 'PREFILL_INPUT',
        payload: { text: 'cómo puedo decir que estoy aprendiendo ingles?' }
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
      title: '¡Tu clase está lista!',
      isSkippable: false,
      content: 'Esto no es solo texto. Es una lección interactiva que puedes explorar. Te enseño cómo usarla.'
    },
    {
      type: 'popover',
      title: 'Titulo de tu leccion',
      isSkippable: false,
      targetElement: '#interactive-card-lesson-title',
      content: 'Aqui puedes ver el titulo de la leccion y el contenido de la leccion'
    },
    {
      type: 'popover',
      title: 'Explicacion rapida',
      isSkippable: false,
      targetElement: '#interactive-card-blocky-tip',
      content: 'Esta es una explicacion rapida de la leccion'
    },
    {
      type: 'popover',
      targetElement: '#interactive-blocks',
      title: 'Bloques que enseñan',
      isSkippable: false,
      content: 'Cada color tiene una función. Tócalos para ver su significado. Así entiendes de verdad.'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section-normal',
      isSkippable: false,
      title: 'Escucha cómo suena',
      content: 'Presiona el botón de audio para escuchar la frase en inglés. Esto entrena tu oído.'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section-slow',
      isSkippable: false,
      title: '¿Muy rápido?',
      content: 'Usa este botón para escuchar la frase más lento. Perfecto para entender cada palabra.'
    },
    {
      type: 'popover',
      isSkippable: false,
      title: 'Ahora tú',
      content: 'Haz clic en el boton de practicar. Sin miedo a equivocarte. Así es como se aprende.',
    }
  ]
};
