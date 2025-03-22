// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Supported languages
const supportedLanguages = ['en', 'id'];
const defaultLanguage = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if already has language prefix or is an API route
  if (pathname.startsWith('/api/') || /^\/(en|id)/.test(pathname) || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check for preferred language from accept-language header
  const acceptLanguage = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || defaultLanguage;

  // Use browser language if supported, otherwise default to English
  const language = supportedLanguages.includes(acceptLanguage) ? acceptLanguage : defaultLanguage;

  // Redirect to language-specific path
  return NextResponse.redirect(new URL(`/${language}${pathname === '/' ? '' : pathname}`, request.url));
}

// Only run middleware on these paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};