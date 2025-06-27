import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth/middleware';

export function middleware(request: NextRequest) {
  // Solo aplicar autenticación a rutas API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Excluir rutas públicas que no necesitan autenticación
    const publicRoutes = ['/api/subscribe', '/api/support'];
    if (publicRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    
    return authMiddleware(request);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 