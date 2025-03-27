// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiMiddleware } from './middleware/api-middleware';

// Define API routes that should go through API middleware
// These are the direct programmatic API endpoints
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

  // Public file download/status routes
  '/api/convert/status',
  '/api/convert/download',
  '/api/compress/download',

  // Web UI routes - Add all routes that should bypass API key validation
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Function to check if request is from a browser (web UI)
  const isWebUIRequest = () => {
    // Check user agent for browser signatures
    const fromBrowser = BROWSER_USER_AGENT_PATTERNS.some(pattern =>
      userAgent.includes(pattern)
    );

    // Check if the request has an 'Accept' header that includes HTML
    const acceptsHtml = request.headers.get('accept')?.includes('text/html');

    // Consider it a web UI request if it comes from a browser and accepts HTML
    return fromBrowser && acceptsHtml;
  };

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
      if (isWebUIRequest()) {
        console.log(`Bypassing API key check for web UI request to ${pathname}`);
        return NextResponse.next();
      }

      // Otherwise, apply API middleware for programmatic API access
      return apiMiddleware(request);
    }
  }

  // Continue for non-API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};