import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname === '/';

  // Si el usuario está autenticado y está en la landing page, redirigir a /home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Si el usuario no está autenticado y no está en la landing page, permitir acceso
  // (por ahora no protegemos rutas, solo manejamos la redirección de la landing)
  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: ['/', '/home/:path*']
};
