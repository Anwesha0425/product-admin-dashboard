import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// proxy.ts is the Next.js 16 replacement for middleware.ts.
// Reads auth_token cookie (set alongside localStorage on login)
// to decide whether to redirect.
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isProductRoute = pathname.startsWith('/products');
  const isLoginRoute = pathname === '/login';

  if (isProductRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/products';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path*', '/login'],
};