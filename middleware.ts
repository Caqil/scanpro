// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Check if a route requires API key authentication
function requiresApiAuth(pathname: string): boolean {
  const protectedRoutes = [
    '/api/convert',
    '/api/compress',
    '/api/merge',
    '/api/pdf/protect',
    '/api/pdf/unlock',
    '/api/watermark',
    '/api/rotate',
    '/api/ocr'
  ];

  // Exclude admin routes and file download routes from strict API key check
  const exemptRoutes = [
    '/api/convert/admin/cleanup',
    '/api/file',
    '/api/validate-purchase'
  ];

  // Check if the route is protected but not exempt
  return protectedRoutes.some(route => pathname.startsWith(route)) &&
    !exemptRoutes.some(route => pathname.startsWith(route));
}

// Parse comma-separated or array of admin API keys
function parseAdminApiKeys(keys: string | undefined): string[] {
  if (!keys) return [];

  // Split by comma and trim
  return keys.split(',')
    .map(key => key.trim())
    .filter(key => key);
}

// Get all valid API keys from environment variables
function getValidApiKeys(): string[] {
  const keys: string[] = [
    // Get keys from environment variables
    ...(parseAdminApiKeys(process.env.ADMIN_API_KEYS) || []),
    ...(parseAdminApiKeys(process.env.ADMIN_API_KEY) || [])
  ];

  // Remove duplicates
  return [...new Set(keys)];
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is a web request (from browser)
  const isWebRequest = request.headers.get('user-agent')?.includes('Mozilla') ||
    request.headers.get('accept')?.includes('text/html');

  // Only check routes that require authentication
  if (requiresApiAuth(pathname)) {
    // Get the API key from headers or query parameter
    const apiKey =
      request.headers.get('x-api-key') ||
      request.nextUrl.searchParams.get('api_key');

    // If it's a web request and no API key, generate a temporary key
    if (isWebRequest && !apiKey) {
      // Try to get a default key from environment
      const defaultKey = process.env.DEFAULT_WEB_API_KEY ||
        getValidApiKeys()[0] ||
        'default_web_key';

      // Modify the request headers to include the default key
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-api-key', defaultKey);

      // Clone the request with the new headers
      const modifiedRequest = new NextRequest(request.url, {
        headers: requestHeaders
      });

      return NextResponse.next({ request: modifiedRequest });
    }

    // For non-web requests, check API key strictly
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({
          error: 'No API key provided',
          success: false
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get valid API keys
    const validKeys = getValidApiKeys();

    // Check if the provided key is valid
    if (!validKeys.includes(apiKey)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid API key',
          success: false
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // If no issues, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*'
}