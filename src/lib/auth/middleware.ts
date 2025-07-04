import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Tipos para el sistema de autenticación
export interface AuthUser {
  id: string;
  email?: string;
  role: 'user' | 'admin' | 'premium';
  apiKey?: string;
}

export interface RateLimitConfig {
  windowMs: number; // Ventana de tiempo en ms
  maxRequests: number; // Máximo de requests en esa ventana
}

// Configuración de rate limiting por endpoint
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/chat': { windowMs: 60000, maxRequests: 5 }, // 5 requests por minuto
  '/api/generate-exercise': { windowMs: 60000, maxRequests: 3 }, // 3 requests por minuto
  '/api/generate-audio': { windowMs: 60000, maxRequests: 10 }, // 10 requests por minuto 
  '/api/comments': { windowMs: 60000, maxRequests: 20 }, // 20 requests por minuto
  '/api/goal-planner/message': { windowMs: 60000, maxRequests: 15 }, // Permitimos más interacciones en la conversación
  '/api/exercises/generate-from-milestone': { windowMs: 60000, maxRequests: 3 },
};

// Store para rate limiting. Estructura: Map<userID, Map<windowID, count>>
const userRateLimits = new Map<string, Map<number, number>>();

// Store para API keys válidas (en producción usar base de datos)
const validApiKeys = new Map<string, AuthUser>();

// Función para generar API key
function generateApiKey(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const userId = Math.random().toString(36).substring(2, 10);
  
  return `fb_${timestamp}_${randomPart}_${userId}`;
}

// Función para verificar API key
function verifyApiKey(apiKey: string): AuthUser | null {
  // Verificar si es una key de admin
  if (apiKey === process.env.ADMIN_API_KEY) {
    return {
      id: 'admin',
      role: 'admin',
      apiKey
    };
  }

  // Verificar si la key ya está registrada
  if (validApiKeys.has(apiKey)) {
    return validApiKeys.get(apiKey)!;
  }

  // Si la key tiene el formato correcto pero no está registrada, la registramos automáticamente
  if (apiKey.startsWith('fb_') && apiKey.split('_').length >= 4) {
    const userId = `user-${apiKey.split('_')[3]}`;
    const user: AuthUser = {
      id: userId,
      role: 'user',
      apiKey
    };
    
    // Registrar la nueva key
    validApiKeys.set(apiKey, user);
    console.log(`[AUTH] Nueva API key registrada para usuario: ${userId}`);
    
    return user;
  }

  return null;
}

// Función para verificar rate limiting con auto-limpieza.
function checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const currentWindow = Math.floor(now / config.windowMs);

  // Si es la primera vez que vemos a este usuario, creamos su registro.
  if (!userRateLimits.has(identifier)) {
    userRateLimits.set(identifier, new Map<number, number>());
  }

  const userHistory = userRateLimits.get(identifier)!;

  // **Mecanismo de auto-limpieza**
  // Antes de verificar, eliminamos los registros de ventanas pasadas para este usuario.
  for (const window of userHistory.keys()) {
    if (window < currentWindow) {
      userHistory.delete(window);
    }
  }

  // Obtenemos el contador para la ventana actual.
  const currentCount = userHistory.get(currentWindow) || 0;

  if (currentCount >= config.maxRequests) {
    // Límite excedido.
    console.log(`[RATE_LIMIT] LÍMITE EXCEDIDO para usuario: ${identifier}`);
    return false;
  }

  // Incrementar el contador y permitir la petición.
  userHistory.set(currentWindow, currentCount + 1);
  return true;
}

// Middleware principal de autenticación
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  
  // Obtener API key del header
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Si no hay API key, rechazar
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key requerida. Usa el header x-api-key o Authorization: Bearer <key>' },
      { status: 401 }
    );
  }
  
  // Verificar API key
  const user = verifyApiKey(apiKey);
  if (!user) {
    return NextResponse.json(
      { error: 'API key inválida' },
      { status: 401 }
    );
  }

  // Verificación de origen para prevenir uso desde herramientas externas
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const origin = request.headers.get('origin') || '';
  const appVersion = request.headers.get('x-app-version') || '';
  const requestSource = request.headers.get('x-request-source') || '';

  // Verificar headers personalizados de nuestra aplicación
  const hasValidAppHeaders = appVersion === 'fluentblocks-v1.0' && requestSource === 'web-app';

  // Lista de patrones que indican que la petición viene de nuestra aplicación
  const isFromOurApp = 
    hasValidAppHeaders || // Headers personalizados válidos
    userAgent.includes('Mozilla') || // Navegadores web
    userAgent.includes('Chrome') ||
    userAgent.includes('Safari') ||
    userAgent.includes('Firefox') ||
    userAgent.includes('Edge') ||
    referer.includes('localhost') || // Desarrollo local
    referer.includes('fluentblocks') || // Tu dominio
    origin.includes('localhost') ||
    origin.includes('fluentblocks');

  // Lista de patrones que indican herramientas externas
  const isExternalTool = 
    userAgent.includes('Postman') ||
    userAgent.includes('curl') ||
    userAgent.includes('Insomnia') ||
    userAgent.includes('Thunder Client') ||
    userAgent.includes('REST Client') ||
    userAgent.includes('HTTPie') ||
    userAgent.includes('wget') ||
    userAgent.includes('axios') ||
    userAgent.includes('fetch');

  // Si es una herramienta externa, rechazar
  if (isExternalTool) {
    console.log(`[SECURITY] Acceso bloqueado desde herramienta externa: ${userAgent}`);
    return NextResponse.json(
      { error: 'Acceso no autorizado desde herramientas externas' },
      { status: 403 }
    );
  }

  // Si no viene de nuestra aplicación y no es una herramienta conocida, verificar más estrictamente
  if (!isFromOurApp) {
    console.log(`[SECURITY] Acceso sospechoso detectado - User-Agent: ${userAgent}, Referer: ${referer}, Origin: ${origin}, App-Version: ${appVersion}, Source: ${requestSource}`);
    return NextResponse.json(
      { error: 'Acceso no autorizado' },
      { status: 403 }
    );
  }
  
  // Log de acceso exitoso para monitoreo
  console.log(`[SECURITY] Acceso autorizado - Usuario: ${user.id}, Path: ${pathname}, Headers válidos: ${hasValidAppHeaders}`);
  
  // Verificar rate limiting
  const rateLimitConfig = RATE_LIMITS[pathname];
  if (rateLimitConfig) {
    const identifier = user.role === 'admin' ? 'admin' : user.id;
    
    const isAllowed = checkRateLimit(identifier, rateLimitConfig);
    
    if (!isAllowed) {
      const now = Date.now();
      const windowEnd = (Math.floor(now / rateLimitConfig.windowMs) + 1) * rateLimitConfig.windowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((windowEnd - now) / 1000));

      console.log(`[RATE_LIMIT] Rate limit excedido para ${pathname}, retryAfter: ${retryAfterSeconds}s`);

      return NextResponse.json(
        { 
          error: 'Rate limit excedido',
          retryAfter: retryAfterSeconds
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfterSeconds.toString()
          }
        }
      );
    }
  }
  
  // Agregar información del usuario al request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);
  requestHeaders.set('x-user-role', user.role);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Función helper para obtener información del usuario desde el request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getUserFromRequest(request: Request): Promise<AuthUser | null> {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role') as 'user' | 'admin' | 'premium';
  
  if (!userId || !userRole) {
    return null;
  }
  
  return {
    id: userId,
    role: userRole
  };
}

// Función para verificar si el usuario tiene permisos
export function hasPermission(user: AuthUser, requiredRole: 'user' | 'admin' | 'premium'): boolean {
  const roleHierarchy = { user: 1, premium: 2, admin: 3 };
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// Función para generar una nueva API key (útil para el frontend)
export function createNewApiKey(): { apiKey: string; user: AuthUser } {
  const apiKey = generateApiKey();
  const userId = `user-${apiKey.split('_')[3]}`;
  const user: AuthUser = {
    id: userId,
    role: 'user',
    apiKey
  };
  
  validApiKeys.set(apiKey, user);
  console.log(`[AUTH] Nueva API key creada para usuario: ${userId}`);
  
  return { apiKey, user };
} 