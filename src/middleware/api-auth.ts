// src/middleware/api-auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ApiKeyService } from '../services/api-key-service';

const prisma = new PrismaClient();

// Constants for rate limiting
const MAX_REQUESTS_PER_MINUTE = 60;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute in milliseconds

export async function apiAuthMiddleware(req: NextRequest) {
    // Skip middleware for non-API routes
    if (!req.nextUrl.pathname.startsWith('/api/v1')) {
        return NextResponse.next();
    }

    // Get API key from header
    const apiKey = req.headers.get('x-api-key');

    // If no API key, return 401 Unauthorized
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

    // Validate API key
    const key = await ApiKeyService.validateApiKey(apiKey);
    if (!key) {
        return new NextResponse(
            JSON.stringify({
                error: 'Unauthorized',
                message: 'Invalid or disabled API key.'
            }),
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    // Check rate limits
    const rateLimitExceeded = await checkRateLimit(key.id);
    if (rateLimitExceeded) {
        return new NextResponse(
            JSON.stringify({
                error: 'Too Many Requests',
                message: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_MINUTE} requests per minute.`
            }),
            {
                status: 429,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    // Check permissions for this endpoint
    const canAccess = checkPermissions(key.permissions, req.nextUrl.pathname, req.method);
    if (!canAccess) {
        // Log unauthorized attempt
        await ApiKeyService.logApiUsage(
            key.id,
            key.userId,
            req.nextUrl.pathname,
            req.method || 'GET',
            403,
            req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '',
            req.headers.get('user-agent') || ''
        );

        return new NextResponse(
            JSON.stringify({
                error: 'Forbidden',
                message: 'Your API key does not have permission to access this endpoint.'
            }),
            {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    // Clone the request to add custom headers for downstream handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-api-key-id', key.id);
    requestHeaders.set('x-user-id', key.userId);

    // Create a new request with the updated headers
    const modifiedRequest = new NextRequest(req.url, {
        method: req.method,
        headers: requestHeaders,
        body: req.body,
        cache: req.cache,
        credentials: req.credentials,
        integrity: req.integrity,
        keepalive: req.keepalive,
        mode: req.mode,
        redirect: req.redirect,
        referrer: req.referrer,
        referrerPolicy: req.referrerPolicy,
        signal: req.signal,
    });

    // Continue to the API route
    const response = NextResponse.next({
        request: modifiedRequest,
    });

    // After the request is processed, log the API usage (will need to be handled in the API route)

    return response;
}

/**
 * Check if the API key has permissions for the requested endpoint and method
 */
function checkPermissions(permissions: any, pathname: string, method?: string): boolean {
    // If permissions is not defined or empty, deny access
    if (!permissions) return false;

    // If permissions includes '*', allow all access
    if (permissions['*'] === true) return true;

    // Extract the endpoint from the pathname (e.g., /api/v1/pdf/convert -> pdf/convert)
    const endpoint = pathname.replace(/^\/api\/v1\//, '');

    // Check exact endpoint match
    if (permissions[endpoint]) {
        // If methods are specified, check method
        if (permissions[endpoint] === true) return true;
        if (method && permissions[endpoint][method.toLowerCase()]) return true;
    }

    // Check wildcard endpoints
    const wildcardEndpoints = Object.keys(permissions).filter(p => p.includes('*'));
    for (const wildcardEndpoint of wildcardEndpoints) {
        const pattern = wildcardEndpoint.replace('*', '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(endpoint)) {
            // If methods are specified, check method
            if (permissions[wildcardEndpoint] === true) return true;
            if (method && permissions[wildcardEndpoint][method.toLowerCase()]) return true;
        }
    }

    return false;
}

/**
 * Check and update rate limits for an API key
 * Returns true if the rate limit is exceeded
 */
async function checkRateLimit(apiKeyId: string): Promise<boolean> {
    // Get the current timestamp
    const now = new Date();

    // Find or create a rate limit record for this API key
    let rateLimit = await prisma.apiRateLimit.findUnique({
        where: { apiKeyId },
    });

    // If no rate limit record exists, create one
    if (!rateLimit) {
        rateLimit = await prisma.apiRateLimit.create({
            data: {
                apiKeyId,
                count: 1,
                resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
            },
        });
        return false; // First request, no rate limit exceeded
    }

    // If the rate limit has reset, update it
    if (now > rateLimit.resetAt) {
        await prisma.apiRateLimit.update({
            where: { id: rateLimit.id },
            data: {
                count: 1,
                resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
            },
        });
        return false; // Rate limit has reset, no limit exceeded
    }

    // Check if the rate limit is exceeded
    if (rateLimit.count >= MAX_REQUESTS_PER_MINUTE) {
        return true; // Rate limit exceeded
    }

    // Increment the count
    await prisma.apiRateLimit.update({
        where: { id: rateLimit.id },
        data: { count: { increment: 1 } },
    });

    return false; // Rate limit not exceeded
}