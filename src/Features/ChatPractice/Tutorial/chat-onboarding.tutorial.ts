// tutorials/chat/chat-onboarding.tutorial.ts
import { Tutorial } from '@/tutorials/tutorial.types';

export const chatOnboardingTutorial: Tutorial = {
  id: 'chat-onboarding',
  path: '/chat',
  localStorageKey: 'tutorial_chatOnboardingCompleted',
  steps: [
    {
      type: 'popover',
      title: '¡Bienvenido a FluentBlocks! 👋',
      isSkippable: false,
      content:
        'Aquí aprenderá el inglés que realmente usa en EE.UU. en situaciones diarias. Le mostraré lo básico en menos de un minuto.'
    },
    {
      type: 'popover',
      title: 'Tu centro de control 🎮',
      isSkippable: false,
      targetElement: '#main-header',
      content: 'Aquí tienes el menú principal. Como un interruptor mágico que te lleva a cualquier parte de la plataforma.'
    },
    {
      type: 'popover',
      targetElement: '#chat-input',
      title: '¡Aquí sucede la magia! ✨',
      isSkippable: false,
      content: 'Escribe cualquier duda en español. Por ejemplo: "cómo pedir un café" o "cómo hablar con mi jefe" y obtendrá una explicación clara y un ejercicio interactivo.'
     },
    {
      type: 'action',
      targetElement: '#chat-input',
      title: '¿Te muestro cómo funciona? ',
      content: 'Voy a escribir una pregunta por ti. Solo tienes que presionar "Enviar" y verás cómo transformo tu duda en una lección interactiva.',
      isBlocking: true,
      isSkippable: false,
      action: {
        type: 'PREFILL_INPUT',
        payload: { text: 'cómo puedo decir que estoy aprendiendo inglés?' }
      }
    },
    {
      type: 'action',
      title: 'Construyendo tu lección... 🧱',
      content: 'Estoy armando los bloques de tu lección personalizada. Cada pieza se coloca con cuidado para que aprendas de la manera más efectiva. ¡Un momento!',
      isBlocking: true,
      isSkippable: false,
      action: { type: 'WAIT_FOR_AI_RESPONSE' }
    },
    {
      type: 'highlight',
      title: 'Lección lista 🎉',
      isSkippable: false,
      content:
        'Recibirá una tarjeta interactiva con explicación, audio y práctica.'
    },
    {
      type: 'popover',
      title: 'Explicación breve',
      targetElement: '#interactive-card-lesson-title',
      isSkippable: false,
      content:
        'Esto es lo que aprenderás en esta lección.'
    },
    {
      type: 'popover',
      title: 'Consejos 💡',
      targetElement: '#interactive-card-blocky-tip',
      isSkippable: false,
      content:
        'Aquí encontraras información importante sobre el contenido generado.'
    },
    
    {
      type: 'popover',
      targetElement: '#interactive-blocks',
      title: '¡Mira lo que aprenderás! 👆',
      isSkippable: false,
      content: 'Esto es lo que aprenderás en esta vez.'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section-normal',
      isSkippable: false,
      title: 'Escucha como suena 🎵',
      content: 'Presiona aquí para escuchar cómo suena la frase. ¡Tu oído se entrenará sin que te des cuenta!'
    },
    {
      type: 'popover',
      targetElement: '#audio-player-section-slow',
      isSkippable: false,
      title: '¿Muy rápido? ¡No hay problema! 🐌',
      content: 'Si la velocidad normal te parece rápida, usa este botón para escuchar más lento. Es como poner pausa en una película para entender cada detalle.'
    },
    {
      type: 'popover',
      isSkippable: false,
      title: '¡Ahora es tu turno de construir! 🎯',
      content: 'Haz clic en "Practicar". No tengas miedo a equivocarte - ¡así es como se construye el conocimiento! Cada error es un paso hacia el éxito.',
    }
  ]
};
