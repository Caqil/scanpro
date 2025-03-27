// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config'
import { apiAuthMiddleware } from './src/middleware/api-auth';
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl

  // Check if the pathname already includes a language
  // If it starts with one of our supported languages followed by a slash or
  // is exactly one of our supported languages, we don't need to redirect
  const pathnameHasLanguage = SUPPORTED_LANGUAGES.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  if (pathnameHasLanguage) return NextResponse.next()

  // No language in the pathname - let's detect the user's preferred language
  const defaultLanguage = 'en'

  // Get the preferred language from the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')

  // Parse language preferences from the Accept-Language header
  // Example: "en-US,en;q=0.9,es;q=0.8,fr;q=0.7"
  let detectedLang = defaultLanguage

  if (acceptLanguage) {
    // Extract language codes and their quality values
    const languages = acceptLanguage
      .split(',')
      .map(part => {
        const [code, quality] = part.trim().split(';q=')
        return {
          code: code.split('-')[0], // Get the primary language part
          quality: quality ? parseFloat(quality) : 1.0
        }
      })
      .sort((a, b) => b.quality - a.quality) // Sort by quality descending

    // Find the first supported language
    const matchedLang = languages.find(lang =>
      SUPPORTED_LANGUAGES.includes(lang.code)
    )

    if (matchedLang) {
      detectedLang = matchedLang.code
    }
  }

  // Get the cookie with previously user-selected language
  const languageCookie = request.cookies.get('preferred-language')

  // Use cookie language if available, otherwise use detected language
  const finalLang = languageCookie?.value || detectedLang

  // Clone the URL and set the pathname to include the language
  const newUrl = request.nextUrl.clone()

  // Handle root path (/) special case
  if (pathname === '/') {
    newUrl.pathname = `/${finalLang}`
  } else {
    // For other paths, add the language prefix
    newUrl.pathname = `/${finalLang}${pathname}`
  }

  if (isApiRoute(request)) {
    return apiAuthMiddleware(request);
  }
  return NextResponse.redirect(newUrl)
}
function isApiRoute(request: NextRequest): boolean {
  const path = request.nextUrl.pathname;
  return path.startsWith('/api/');
}

// Only run middleware on specific routes that don't have file extensions
// This ensures we don't attempt to redirect for static assets
export const config = {
  matcher: [
    '/api/:path*'
  ],
}