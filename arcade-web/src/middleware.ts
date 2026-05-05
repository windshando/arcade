import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Fix Next.js proxy port issue on Railway (prevents redirecting to :8080)
  request.nextUrl.port = '';
  
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const cleanHost = host.split(':')[0]; // Remove port
  request.headers.set('x-forwarded-host', cleanHost);
  request.headers.set('host', cleanHost);
  request.headers.set('x-forwarded-port', '443');

  // Check if this is an admin route
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.includes('/admin') && !pathname.includes('/admin/login');

  if (isAdminRoute) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      const loginUrl = new URL(pathname.split('/admin')[0] + '/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh-CN|en)/:path*'],
};

