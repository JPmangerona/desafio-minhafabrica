import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // Proteção de rotas admin
  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se já estiver logado e tentar acessar login, vai para o dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware deve rodar
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
