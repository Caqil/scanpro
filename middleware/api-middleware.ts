// middleware/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { prisma } from '@/lib/prisma';

// Set up rate limiting with Upstash Redis
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Define rate limits based on subscription tier
const rateLimits = {
    free: {
        limit: 10,
        window: '1 h', // 10 requests per hour
    },
    basic: {
        limit: 100,
        window: '1 h', // 100 requests per hour
    },
    pro: {
        limit: 1000,
        window: '1 h', // 1000 requests per hour
    },
    enterprise: {
        limit: 5000,
        window: '1 h', // 5000 requests per hour
    },
};

// Optional: Define usage limits by tier (operations per month)
const usageLimits = {
    free: 100,
    basic: 1000,
    pro: 10000,
    enterprise: 100000,
};

export async function apiMiddleware(request: NextRequest) {
    // Get API key from header or query param
    const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key');

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

    // Get subscription tier
    const tier = keyRecord.user.subscription?.tier || 'free';

    // Apply rate limiting based on subscription tier
    const { limit, window } = rateLimits[tier as keyof typeof rateLimits];
    const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, window),
        analytics: true,
    });

    // Use the API key as the identifier for rate limiting
    const { success, remaining, reset } = await ratelimit.limit(apiKey);

    if (!success) {
        return NextResponse.json(
            {
                error: 'Rate limit exceeded',
                limit,
                remaining: 0,
                reset: new Date(reset).toISOString(),
            },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(reset).toISOString(),
                },
            }
        );
    }

    // Extract operation from URL path
    const path = request.nextUrl.pathname;
    const operation = path.split('/').pop() || 'unknown';

    // Update last used timestamp for the API key
    await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsed: new Date() }
    });

    // Track usage statistics
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

    // Check monthly usage limit
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await prisma.usageStats.aggregate({
        where: {
            userId: keyRecord.user.id,
            date: { gte: firstDayOfMonth }
        },
        _sum: {
            count: true
        }
    });

    const totalUsage = monthlyUsage._sum.count || 0;
    const usageLimit = usageLimits[tier as keyof typeof usageLimits];

    if (totalUsage >= usageLimit) {
        return NextResponse.json(
            {
                error: `Monthly usage limit of ${usageLimit} operations exceeded for your ${tier} plan`,
                usage: totalUsage,
                limit: usageLimit
            },
            { status: 403 }
        );
    }

    // Continue with the request
    const response = NextResponse.next();

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

    return response;
}