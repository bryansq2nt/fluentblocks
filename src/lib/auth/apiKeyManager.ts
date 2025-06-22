// Gestor de API keys para el frontend
export class ApiKeyManager {
  private static readonly STORAGE_KEY = 'fluentblocks_api_key';
  private static readonly KEY_PREFIX = 'fb_';

  // Generar una nueva API key
  static generateApiKey(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const userId = Math.random().toString(36).substring(2, 10);
    
    return `${this.KEY_PREFIX}${timestamp}_${randomPart}_${userId}`;
  }

  // Guardar API key en localStorage
  static saveApiKey(apiKey: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, apiKey);
    }
  }

  // Obtener API key del localStorage
  static getApiKey(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.STORAGE_KEY);
    }
    return null;
  }

  // Eliminar API key del localStorage
  static removeApiKey(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Verificar si existe una API key
  static hasApiKey(): boolean {
    return ApiKeyManager.getApiKey() !== null;
  }

  // Obtener headers para requests autenticados
  static getAuthHeaders(): Record<string, string> {
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error('No API key found. Please authenticate first.');
    }
    
    return {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };
  }

  // Función helper para hacer requests autenticados
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = ApiKeyManager.getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Si la API key es inválida, limpiar el localStorage
    if (response.status === 401) {
      ApiKeyManager.removeApiKey();
      throw new Error('API key inválida. Por favor, autentícate nuevamente.');
    }

    return response;
  }

  // Inicializar API key si no existe
  static initializeApiKey(): string {
    let apiKey = ApiKeyManager.getApiKey();
    
    if (!apiKey) {
      apiKey = ApiKeyManager.generateApiKey();
      ApiKeyManager.saveApiKey(apiKey);
      console.log('[AUTH] Nueva API key generada automáticamente');
    }
    
    return apiKey;
  }

  // Validar API key con el servidor (opcional, para verificar que funciona)
  static async validateApiKey(apiKey?: string): Promise<boolean> {
    const keyToValidate = apiKey || ApiKeyManager.getApiKey();
    
    if (!keyToValidate) {
      return false;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'x-api-key': keyToValidate,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] }),
      });

      // Si recibimos una respuesta (aunque sea error de rate limit), la key es válida
      return response.status !== 401;
    } catch (error) {
      console.error('Error validando API key:', error);
      return false;
    }
  }

  // Regenerar API key y validarla
  static async regenerateApiKey(): Promise<string> {
    const newApiKey = ApiKeyManager.generateApiKey();
    ApiKeyManager.saveApiKey(newApiKey);
    
    // Validar la nueva key
    const isValid = await ApiKeyManager.validateApiKey(newApiKey);
    if (!isValid) {
      throw new Error('No se pudo validar la nueva API key');
    }
    
    return newApiKey;
  }
} 