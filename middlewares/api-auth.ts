// middleware/api-auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/purchase-validation';

/**
 * Middleware to authenticate API requests with API keys
 * @param req The incoming request
 * @param handler The handler function to run if authentication succeeds
 */
export async function withApiAuth(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    // Get API key from header or query parameter
    const apiKeyHeader = req.headers.get('x-api-key');
    const apiKeyQuery = req.nextUrl.searchParams.get('api_key');
    const apiKey = apiKeyHeader || apiKeyQuery;

    if (!apiKey) {
        return NextResponse.json(
            {
                success: false,
                message: 'API key is required. Provide it in the x-api-key header or api_key query parameter.'
            },
            { status: 401 }
        );
    }

    // Verify the API key
    const isValid = await verifyApiKey(apiKey);

    if (!isValid) {
        return NextResponse.json(
            {
                success: false,
                message: 'Invalid API key. Please provide a valid API key.'
            },
            { status: 401 }
        );
    }

    // If API key is valid, proceed to the handler
    try {
        return await handler(req);
    } catch (error) {
        console.error('Error in API handler:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while processing your request.'
            },
            { status: 500 }
        );
    }
}

/**
 * Middleware to limit API requests by IP
 * Note: This is a simple rate limiter for demonstration.
 * For production, consider using a more robust solution.
 */
const ipRequestCounts = new Map<string, { count: number, resetTime: number }>();

export async function withRateLimit(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>,
    {
        maxRequests = 100,
        windowMs = 60 * 1000 // 1 minute default
    } = {}
): Promise<NextResponse> {
    // Try multiple methods to get the IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    
    const ip = forwardedFor
        ? forwardedFor.split(',')[0].trim()
        : realIp || 'unknown';
    
    const now = Date.now();
    
    const requestData = ipRequestCounts.get(ip) || { count: 0, resetTime: now + windowMs };

    // Reset count if the window has passed
    if (now >= requestData.resetTime) {
        requestData.count = 0;
        requestData.resetTime = now + windowMs;
    }

    // Increment request count
    requestData.count++;
    ipRequestCounts.set(ip, requestData);

    // Check if rate limit is exceeded
    if (requestData.count > maxRequests) {
        return NextResponse.json(
            {
                success: false,
                message: 'Rate limit exceeded. Please try again later.'
            },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(requestData.resetTime / 1000).toString()
                }
            }
        );
    }

    // Add rate limit headers to the response
    const response = await handler(req);
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - requestData.count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(requestData.resetTime / 1000).toString());

    return response;
}