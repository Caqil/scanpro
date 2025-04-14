// middleware/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyRateLimit, checkUsageLimit, addRateLimitHeaders } from '@/lib/rate-limiter';

// Web UI bypass check - this function identifies browser-based requests
function isWebUIRequest(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const acceptHeader = request.headers.get('accept') || '';
    const sourceHeader = request.headers.get('x-source') || '';

    // If the request has the x-source: web-ui header, it's from our web UI
    if (sourceHeader === 'web-ui') {
        return true;
    }

    // Browser user agent patterns
    const browserPatterns = [
        'Mozilla/',
        'Chrome/',
        'Safari/',
        'Firefox/',
        'Edge/',
        'Opera/'
    ];

    // Check for browser user agent
    const isBrowser = browserPatterns.some(pattern => userAgent.includes(pattern));

    // Check if accepts HTML
    const acceptsHtml = acceptHeader.includes('text/html');

    // Check if referred from our own website
    const ownSiteReferer = referer.includes(process.env.NEXT_PUBLIC_APP_URL || '');

    // Consider it a web UI request if:
    // 1. It comes from a browser
    // 2. It accepts HTML or is referred from our own site
    return isBrowser && (acceptsHtml || ownSiteReferer);
}
export async function apiMiddleware(request: NextRequest) {
    // Always allow web UI requests to bypass API key check
    if (isWebUIRequest(request)) {
        console.log('Detected web UI request - bypassing API key check');
        return NextResponse.next();
    }

    // Get API key from header or query param
    const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key');
    
    const path = request.nextUrl.pathname;
    console.log(`API request for ${path} with key: ${apiKey ? apiKey.substring(0, 6) + '...' : 'none'}`);

    if (!apiKey) {
        return NextResponse.json(
            { error: 'API key is required' },
            { status: 401 }
        );
    }

    // Look up the API key in the database
    const keyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: {
            user: {
                include: { subscription: true }
            }
        }
    });

    if (!keyRecord) {
        return NextResponse.json(
            { error: 'Invalid API key' },
            { status: 401 }
        );
    }

    // Check if key is expired
    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
        return NextResponse.json(
            { error: 'API key has expired' },
            { status: 401 }
        );
    }

    // Extract operation from URL path
    const operation = path.split('/').pop() || 'unknown';
    console.log(`Operation: ${operation}`);

    // Check if the API key has permission for the requested operation
    if (!keyRecord.permissions.includes(operation) && !keyRecord.permissions.includes('*')) {
        return NextResponse.json(
            { error: `This API key does not have permission to perform the '${operation}' operation` },
            { status: 403 }
        );
    }

    // Get subscription tier
    const tier = keyRecord.user.subscription?.tier || 'free';
    console.log(`User tier: ${tier}`);

    try {
        // Apply rate limiting based on subscription tier
        const rateLimitResponse = await applyRateLimit(request, apiKey, keyRecord.user);
        if (rateLimitResponse) {
            console.log(`Rate limit applied for ${apiKey.substring(0, 6)}..., returning 429 response`);
            return rateLimitResponse; // Return 429 response if rate limited
        }
    } catch (rateError) {
        // If rate limiting fails, log error but continue
        console.error('Error applying rate limits:', rateError);
    }

    try {
        // Check monthly usage limit BEFORE incrementing
        const usageLimitResponse = await checkUsageLimit(keyRecord.user.id, tier);
        if (usageLimitResponse) {
            return usageLimitResponse; // Return 403 response if usage limit exceeded
        }
    } catch (usageError) {
        // If usage check fails, log error but continue
        console.error('Error checking usage limits:', usageError);
    }

    // Update last used timestamp for the API key
    try {
        await prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: { lastUsed: new Date() }
        });
    } catch (updateError) {
        console.error('Error updating API key last used timestamp:', updateError);
    }

    // Track usage statistics (AFTER confirming within limits)
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.usageStats.upsert({
            where: {
                userId_operation_date: {
                    userId: keyRecord.user.id,
                    operation,
                    date: today
                }
            },
            update: {
                count: { increment: 1 }
            },
            create: {
                userId: keyRecord.user.id,
                operation,
                count: 1,
                date: today
            }
        });
    } catch (trackError) {
        console.error('Error tracking API usage in database:', trackError);
    }

    // Continue with the request
    const response = NextResponse.next();

    // Add rate limit headers
    try {
        return await addRateLimitHeaders(response, apiKey, tier);
    } catch (headerError) {
        console.error('Error adding rate limit headers:', headerError);
        return response; // Return original response if adding headers fails
    }
}