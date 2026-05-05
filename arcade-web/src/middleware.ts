import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Fix Next.js proxy port issue on Railway (prevents redirecting to :8080)
  request.nextUrl.port = '';

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

