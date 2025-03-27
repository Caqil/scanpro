// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only apply to API routes that should be protected
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip auth for these paths
  const publicPaths = [
    '/api/auth',
    '/api/user/register',
    '/api/_internal' // Skip auth for our internal validation route
  ];

  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get API key from header
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) {
    return new NextResponse(
      JSON.stringify({
        error: 'Unauthorized',
        message: 'API key is required. Please include it in the x-api-key header.'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Validate API key by calling our internal API endpoint
    const validationResponse = await fetch(`${request.nextUrl.origin}/api/_internal/validate-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

    const validationResult = await validationResponse.json();

    if (!validationResult.valid) {
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid API key.',
          reason: validationResult.reason
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Set headers with user info for downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-api-key-id', validationResult.keyId);
    requestHeaders.set('x-user-id', validationResult.userId);

    // Continue with the modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch (error) {
    console.error('API authentication error:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'An error occurred during API authentication.',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export const config = {
  matcher: ['/api/:path*'],
};