// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Define API routes that require API key validation
const API_ROUTES = [
  '/api/convert',
  '/api/compress',
  '/api/merge',
  '/api/split',
  '/api/pdf/watermark',
  '/api/rotate',
  '/api/pdf/protect',
  '/api/pdf/unlock',
  '/api/ocr',
];

// Routes that should be excluded from API key validation
const EXCLUDED_ROUTES = [
  // Auth related routes
  '/api/webhooks/paypal',
  '/api/auth',
  '/api/webhooks',
  '/api/admin',
  '/login',  // Exclude login route from middleware
  '/register', // Exclude register route from middleware
  '/api/auth/signin',
  '/api/auth/callback',
  '/api/auth/signin/apple',  // Specifically exclude Apple signin path
  '/api/auth/callback/apple',
  '/forgot-password', // Exclude forgot password route
  '/reset-password',  // Exclude reset password route
  '/en/forgot-password', // Ensure language-specific routes work
  '/en/reset-password',  // Ensure language-specific routes work
  '/id/forgot-password', // Support other languages
  '/id/reset-password',
  '/es/forgot-password',
  '/es/reset-password',
  '/fr/forgot-password',
  '/fr/reset-password',
  '/zh/forgot-password',
  '/zh/reset-password',
  '/ar/forgot-password',
  '/ar/reset-password',
  '/hi/forgot-password',
  '/hi/reset-password',
  '/ru/forgot-password',
  '/ru/reset-password',
  '/pt/forgot-password',
  '/pt/reset-password',
  '/de/forgot-password',
  '/de/reset-password',
  '/ja/forgot-password',
  '/ja/reset-password',
  '/ko/forgot-password',
  '/ko/reset-password',
  '/it/forgot-password',
  '/it/reset-password',
  '/tr/forgot-password',
  '/tr/reset-password',

  // Public file download/status routes
  '/api/convert/status',
  '/api/convert/download',
  '/api/compress/download',
  '/api/file',  // Important! This enables file downloads from the web UI
];

// User agent patterns for browsers (to identify web UI requests)
const BROWSER_USER_AGENT_PATTERNS = [
  'Mozilla/',
  'Chrome/',
  'Safari/',
  'Firefox/',
  'Edge/',
  'Opera/'
];

// Function to check if request is from a browser (web UI)
function isWebUIRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptHeader = request.headers.get('accept') || '';
  const referer = request.headers.get('referer') || '';

  // Check user agent for browser signatures
  const fromBrowser = BROWSER_USER_AGENT_PATTERNS.some(pattern =>
    userAgent.includes(pattern)
  );

  // Check if accepts HTML
  const acceptsHtml = acceptHeader.includes('text/html');

  // Check if referred from our own website
  const ownSiteReferer = referer.includes(process.env.NEXT_PUBLIC_APP_URL || '');

  // Consider it a web UI request if it comes from a browser and accepts HTML or is from our site
  return fromBrowser && (acceptsHtml || ownSiteReferer);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth/callback/apple')) {
    // Create a response object that preserves the request
    const response = NextResponse.next();

    // Get all cookies from the request and ensure they're preserved
    const cookies = request.cookies.getAll();
    cookies.forEach(cookie => {
      // This is critical - we need to preserve all cookies including PKCE cookies
      response.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    });

    console.log('Preserving cookies for Apple callback:', cookies.map(c => c.name));
    return response;
  }
  for (const excludedRoute of EXCLUDED_ROUTES) {
    if (pathname.startsWith(excludedRoute)) {
      return NextResponse.next();
    }
  }

  // Check if this is an API route that needs authentication
  for (const apiRoute of API_ROUTES) {
    if (pathname.startsWith(apiRoute)) {
      // Skip API key validation for requests from the web UI
      if (isWebUIRequest(request)) {
        console.log(`Bypassing API key check for web UI request to ${pathname}`);
        return NextResponse.next();
      }

      // For programmatic API access, check API key
      const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key');

      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key is required' },
          { status: 401 }
        );
      }

      // Simply pass the API key to the endpoint
      // Let the endpoint handle validation directly with the database
      return NextResponse.next();
    }
  }

  // Continue for non-API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/callback/:path*",
    "/dashboard/:path*",
    "/api/:path*",
    // Exclude authentication-related paths
    // Don't include /login or /api/auth/:path* here
  ],
};