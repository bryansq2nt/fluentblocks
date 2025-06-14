import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname === '/';
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/home') || 
                          request.nextUrl.pathname.startsWith('/profile') ||
                          request.nextUrl.pathname.startsWith('/api/progress');

  // Si el usuario está autenticado y está en la landing page, redirigir a /home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: ['/', '/home/:path*', '/profile/:path*', '/api/progress/:path*']
};
