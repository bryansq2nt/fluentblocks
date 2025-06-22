'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiKeyManager } from '@/lib/auth/apiKeyManager';

export interface AuthState {
  isAuthenticated: boolean;
  apiKey: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface RateLimitInfo {
  isBlocked: boolean;
  retryAfter: number;
  message: string;
}

const getInitialApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return ApiKeyManager.getApiKey();
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const initialKey = getInitialApiKey();
    return {
      isAuthenticated: !!initialKey,
      apiKey: initialKey,
      isLoading: !initialKey,
      error: null,
    };
  });

  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    isBlocked: false,
    retryAfter: 0,
    message: '',
  });

  const initializeAuth = useCallback(() => {
    if (!ApiKeyManager.hasApiKey()) {
      const newApiKey = ApiKeyManager.generateApiKey();
      ApiKeyManager.saveApiKey(newApiKey);
      setAuthState({
        isAuthenticated: true,
        apiKey: newApiKey,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const regenerateApiKey = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const newApiKey = await ApiKeyManager.regenerateApiKey();
      setAuthState({
        isAuthenticated: true,
        apiKey: newApiKey,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al regenerar API key',
      }));
    }
  };

  const logout = () => {
    ApiKeyManager.removeApiKey();
    setAuthState({ isAuthenticated: false, apiKey: null, isLoading: false, error: null });
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const clearRateLimit = useCallback(() => {
    setRateLimitInfo({
      isBlocked: false,
      retryAfter: 0,
      message: '',
    });
  }, []);

  const refreshAuth = useCallback(async () => {
    initializeAuth();
  }, [initializeAuth]);

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    try {
      const response = await ApiKeyManager.authenticatedFetch(url, options);

      if (response.status === 429) {
        const retryAfterSeconds = parseInt(response.headers.get('Retry-After') || '60', 10);
        const errorData = await response.json().catch(() => ({ error: 'Límite de peticiones excedido.' }));
        setRateLimitInfo({
          isBlocked: true,
          retryAfter: retryAfterSeconds,
          message: errorData.error,
        });
      } else if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error);
      }
      
      return response;
    } catch (error) {
      console.error(`Error en authenticatedFetch para ${url}:`, error);
      setAuthState(prev => ({ ...prev, error: error instanceof Error ? error.message : String(error) }));
      throw error;
    }
  }, []);

  return {
    ...authState,
    rateLimitInfo,
    regenerateApiKey,
    logout,
    clearError,
    clearRateLimit,
    refreshAuth,
    authenticatedFetch,
  };
} 