# 🔒 Sistema de Seguridad - FluentBlocks

## Resumen

Este documento describe el sistema de seguridad implementado en FluentBlocks para proteger las APIs y prevenir abuso.

## 🛡️ Capas de Seguridad

### 1. Autenticación por API Key Automática

- **Tipo**: API Key generada automáticamente por usuario
- **Formato**: `fb_timestamp_random_userid`
- **Almacenamiento**: localStorage del navegador
- **Generación**: Automática al primer acceso
- **Validación**: Middleware global en todas las rutas `/api/*`

### 2. Rate Limiting

- **Implementación**: In-memory (en producción usar Redis)
- **Configuración por endpoint**:
  - `/api/chat`: 10 requests/minuto
  - `/api/generate-exercise`: 5 requests/minuto
  - `/api/generate-audio`: 3 requests/minuto (más restrictivo por costo)
  - `/api/comments`: 20 requests/minuto

### 3. Logging y Monitoreo

- Logs detallados de cada request con ID de usuario
- Tracking de uso por endpoint
- Alertas para patrones sospechosos

## 🚀 Configuración

### Variables de Entorno Requeridas

```bash
# API key de administrador (OPCIONAL)
ADMIN_API_KEY=fb_admin_super_secret_key_2024

# Otras configuraciones existentes...
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

**¡IMPORTANTE!** Ya no necesitas configurar `API_KEYS` manualmente. El sistema genera API keys automáticamente para cada usuario.

### Estructura de Archivos

```
src/
├── lib/auth/
│   ├── middleware.ts          # Middleware de autenticación
│   └── apiKeyManager.ts       # Gestor de API keys
├── hooks/
│   └── useAuth.ts            # Hook de autenticación
├── components/security/
│   ├── SecurityConfig.tsx    # UI de configuración
│   └── AuthInitializer.tsx   # Inicializador automático
├── middleware.ts             # Middleware global de Next.js
└── app/layout.tsx           # Layout con AuthInitializer
```

## 📋 Uso

### Frontend (React) - Automático

El sistema funciona automáticamente. Los usuarios no necesitan hacer nada:

```typescript
// El AuthInitializer en layout.tsx maneja todo automáticamente
// Los usuarios obtienen su API key automáticamente al acceder

import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, apiKey, authenticatedFetch } = useAuth();

  // La autenticación ya está lista automáticamente
  const handleApiCall = async () => {
    try {
      const response = await authenticatedFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...] })
      });
      // Manejar respuesta
    } catch (error) {
      // Manejar error de autenticación
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleApiCall}>Hacer llamada API</button>
      ) : (
        <p>Configurando autenticación...</p>
      )}
    </div>
  );
}
```

### Backend (API Routes)

```typescript
import { getUserFromRequest } from "@/lib/auth/middleware";

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Tu lógica aquí
  console.log(`Usuario ${user.id} (${user.role}) accedió al endpoint`);
}
```

## 🔧 Configuración Avanzada

### Personalizar Rate Limits

```typescript
// En src/lib/auth/middleware.ts
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/chat": { windowMs: 60000, maxRequests: 15 }, // 15 requests/minuto
  "/api/generate-exercise": { windowMs: 60000, maxRequests: 8 },
  // ... más configuraciones
};
```

### Agregar Nuevos Roles

```typescript
// En src/lib/auth/middleware.ts
export interface AuthUser {
  id: string;
  email?: string;
  role: "user" | "admin" | "premium" | "enterprise"; // Agregar nuevos roles
  apiKey?: string;
}
```

## 🚨 Respuestas de Error

### 401 - No Autenticado

```json
{
  "error": "API key requerida. Usa el header x-api-key o Authorization: Bearer <key>"
}
```

### 401 - API Key Inválida

```json
{
  "error": "API key inválida"
}
```

### 429 - Rate Limit Excedido

```json
{
  "error": "Rate limit excedido",
  "retryAfter": 60
}
```

## 🔍 Monitoreo

### Logs de Ejemplo

```
[AUTH] Nueva API key generada automáticamente
[AUTH] Nueva API key registrada para usuario: user-abc123
[CHAT] Usuario user-abc123 (user) inició conversación
[CHAT] Usuario user-abc123 completó conversación exitosamente
[AUDIO] Usuario user-def456 (premium) generando audio: "Hello world..."
[EXERCISE] Usuario user-ghi789 (user) generando ejercicio
```

### Métricas Recomendadas

- Requests por usuario por día
- Endpoints más utilizados
- Patrones de uso anómalos
- Rate limit hits por usuario

## 🔐 Mejores Prácticas

### Para Desarrolladores

1. **Nunca expongas API keys en el código cliente**
2. **Usa HTTPS en producción**
3. **Implementa rotación de API keys**
4. **Monitorea logs regularmente**

### Para Usuarios

1. **No compartas tu API key públicamente**
2. **Regenera tu key si sospechas compromiso**
3. **Respeta los límites de uso**
4. **Reporta comportamiento sospechoso**

## 🚀 Despliegue

### Vercel

1. Configura las variables de entorno en el dashboard
2. El middleware se aplica automáticamente
3. Monitorea logs en Vercel Analytics

### Otros Proveedores

Asegúrate de configurar:

- Variables de entorno
- Middleware de Next.js
- HTTPS en producción

## 🔄 Migración desde Sistema Sin Seguridad

1. **Backup**: Haz backup de tu código actual
2. **Variables**: Configura las variables de entorno (solo ADMIN_API_KEY si quieres)
3. **Testing**: Prueba en desarrollo
4. **Deploy**: Despliega gradualmente
5. **Monitor**: Supervisa logs y métricas

## 🎯 Flujo de Usuario

1. **Primer acceso**: El usuario ve una pantalla de "Configurando tu sesión"
2. **Generación automática**: Se genera una API key única
3. **Almacenamiento**: La key se guarda en localStorage
4. **Validación**: Se valida con el servidor
5. **Acceso completo**: El usuario puede usar todas las funcionalidades

## 📞 Soporte

Si encuentras problemas con la seguridad:

1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Confirma que el middleware está activo
4. Contacta al equipo de desarrollo

---

**Nota**: Este sistema de seguridad es completamente automático y transparente para los usuarios. No necesitan registrarse ni configurar nada manualmente.
