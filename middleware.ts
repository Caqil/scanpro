// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Define API routes that require API key validation
const API_ROUTES = [
  '/api/convert',
  '/api/compress',
  '/api/merge',
  '/api/split',
  '/api/watermark',
  '/api/rotate',
  '/api/pdf/protect',
  '/api/pdf/unlock',
  '/api/ocr',
];

// Routes that should be excluded from API key validation
const EXCLUDED_ROUTES = [
  // Auth related routes
  '/api/auth',
  '/api/webhooks',
  '/api/admin',
  '/login',  // Exclude login route from middleware
  '/register', // Exclude register route from middleware
  '/forgot-password', // Exclude forgot password route
  '/reset-password',  // Exclude reset password route

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

  // Skip middleware for excluded routes
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
    '/dashboard/:path*',
    '/api/:path*',
    // Exclude authentication-related paths
    // Don't include /login or /api/auth/:path* here
  ],
};