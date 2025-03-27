// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiMiddleware } from './middleware/api-middleware';

// Define API routes that should go through API middleware
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an API route
  if (API_ROUTES.some(route => pathname.startsWith(route))) {
    // Skip middleware for internal/admin routes
    if (pathname.includes('/admin/')) {
      return NextResponse.next();
    }

    // Skip middleware for webhook routes
    if (pathname.includes('/webhooks/')) {
      return NextResponse.next();
    }

    // Apply API middleware
    return apiMiddleware(request);
  }

  // Continue for non-API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};