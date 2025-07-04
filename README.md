# 🧩 FluentBlocks

Una aplicación interactiva para aprender inglés de manera divertida y efectiva, construida con Next.js y tecnologías modernas.

## 🚀 Características

- **Chat AI Inteligente**: Tutor personal de inglés con IA
- **Ejercicios Generados**: Contenido dinámico y personalizado
- **Síntesis de Voz**: Audio generado con ElevenLabs
- **Interfaz Responsive**: Optimizada para móviles y desktop
- **Sistema de Seguridad**: APIs protegidas con autenticación y rate limiting

## 🛡️ Seguridad

Este proyecto incluye un sistema de seguridad robusto:

- **Autenticación por API Key**: Todas las APIs están protegidas
- **Rate Limiting**: Límites de uso por endpoint para prevenir abuso
- **Logging Detallado**: Monitoreo completo de uso
- **Middleware Global**: Protección automática en todas las rutas API

📖 [Ver documentación completa de seguridad](SECURITY.md)

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Animaciones**: Framer Motion, Lottie
- **IA**: OpenAI GPT, ElevenLabs TTS
- **Almacenamiento**: Vercel Blob
- **Deploy**: Vercel

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm, yarn, pnpm o bun

### Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/tu-usuario/fluentblocks.git
cd fluentblocks
```

2. **Instala dependencias**

```bash
npm install
# o
yarn install
```

3. **Configura variables de entorno**

```bash
cp env.example .env.local
```

Edita `.env.local` con tus claves:

```bash
# API Keys para autenticación
API_KEYS=fb_abc123,fb_def456,fb_ghi789
ADMIN_API_KEY=fb_admin_super_secret_key_2024

# Servicios externos
OPENAI_API_KEY=tu_openai_api_key
ELEVENLABS_API_KEY=tu_elevenlabs_api_key
BLOB_READ_WRITE_TOKEN=tu_vercel_blob_token

# Webhooks (opcional)
NEXT_PUBLIC_GET_COMMENTS_WEBHOOK=https://tu-webhook.com/get-comments
NEXT_PUBLIC_ADD_COMMENT_WEBHOOK=https://tu-webhook.com/add-comment
```

4. **Ejecuta el servidor de desarrollo**

```bash
npm run dev
# o
yarn dev
```

5. **Abre [http://localhost:3000](http://localhost:3000)** en tu navegador

## 📁 Estructura del Proyecto

```
fluentblocks/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # Rutas API protegidas
│   │   ├── chat/              # Página de chat AI
│   │   ├── exercises/         # Ejercicios interactivos
│   │   └── ...
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilidades y configuraciones
│   │   └── auth/             # Sistema de autenticación
│   ├── hooks/                # Hooks personalizados
│   └── ...
├── public/                   # Archivos estáticos
│   ├── animations/           # Animaciones Lottie
│   ├── audios/              # Archivos de audio
│   └── ...
└── middleware.ts            # Middleware de seguridad
```

## 🔧 Configuración

### Variables de Entorno

| Variable                | Descripción               | Requerida |
| ----------------------- | ------------------------- | --------- |
| `API_KEYS`              | Lista de API keys válidas | ✅        |
| `ADMIN_API_KEY`         | API key de administrador  | ✅        |
| `OPENAI_API_KEY`        | Clave de OpenAI           | ✅        |
| `ELEVENLABS_API_KEY`    | Clave de ElevenLabs       | ✅        |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob      | ✅        |

### Rate Limiting

Los límites por defecto son:

- **Chat AI**: 10 requests/minuto
- **Ejercicios**: 5 requests/minuto
- **Audio**: 3 requests/minuto
- **Comentarios**: 20 requests/minuto

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Deploy automático en cada push

### Otros Proveedores

Asegúrate de configurar:

- Variables de entorno
- Middleware de Next.js
- HTTPS en producción

## 📚 Documentación

- [Sistema de Seguridad](SECURITY.md) - Guía completa de seguridad
- [API Reference](docs/api.md) - Documentación de APIs
- [Componentes](docs/components.md) - Guía de componentes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas:

1. Revisa la [documentación de seguridad](SECURITY.md)
2. Verifica las variables de entorno
3. Revisa los logs del servidor
4. Abre un issue en GitHub

---

**¡Disfruta aprendiendo inglés con FluentBlocks! 🎉**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
