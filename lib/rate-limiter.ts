// lib/rate-limiter.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiters, RATE_LIMITS } from './redis';
import { prisma } from './prisma';

// Define usage limits by tier (operations per month)
const USAGE_LIMITS = {
  free: 100,
  basic: 1000,
  pro: 10000,
  enterprise: 100000,
};

// Interface for user info with subscription
interface UserInfo {
  id: string;
  subscription?: {
    tier: string;
  } | null;
}

/**
 * Apply rate limiting to a request
 * 
 * @param request NextRequest object
 * @param apiKey User's API key
 * @param userInfo User information including subscription tier
 * @returns NextResponse if rate limit exceeded, or null if the request can proceed
 */
export async function applyRateLimit(
    request: NextRequest,
    apiKey: string,
    userInfo: UserInfo
  ): Promise<NextResponse | null> {
    try {
      // Get subscription tier
      const tier = userInfo.subscription?.tier || 'free';
      
      console.log(`Applying rate limits for ${tier} tier - Key: ${apiKey.substring(0, 6)}...`);
      
      try {
        // Get the rate limiters for this tier
        const rateLimiters = getRateLimiters(tier);
        
        // Get rate limit settings for this tier
        const settings = RATE_LIMITS[tier as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;
        
        // First check minutely rate limit (stricter)
        if (rateLimiters.minutely) {
          try {
            // Try to consume a point from the minutely rate limit
            const minutelyResult = await rateLimiters.minutely.consume(apiKey);
            console.log(`Minutely rate limit: ${minutelyResult.remainingPoints} remaining of ${settings.minutely.limit}`);
          } catch (error) {
            // If minutely rate limit exceeded, return 429 response
            console.log(`Minutely rate limit exceeded for key ${apiKey.substring(0, 6)}...`);
            const minutelyLimit = settings.minutely.limit;
            const resetTime = new Date(Date.now() + settings.minutely.window * 1000);
            
            return NextResponse.json(
              {
                error: 'Rate limit exceeded',
                message: `Too many requests. Limited to ${minutelyLimit} requests per minute.`,
                limit: minutelyLimit,
                remaining: 0,
                reset: resetTime.toISOString(),
                timeFrame: 'minute'
              },
              {
                status: 429,
                headers: {
                  'X-RateLimit-Limit': minutelyLimit.toString(),
                  'X-RateLimit-Remaining': '0',
                  'X-RateLimit-Reset': resetTime.toISOString(),
                  'X-RateLimit-TimeFrame': 'minute',
                  'Retry-After': settings.minutely.window.toString()
                },
              }
            );
          }
        }
        
        // Then check hourly rate limit
        if (rateLimiters.hourly) {
          try {
            // Try to consume a point from the hourly rate limit
            const hourlyResult = await rateLimiters.hourly.consume(apiKey);
            console.log(`Hourly rate limit: ${hourlyResult.remainingPoints} remaining of ${settings.hourly.limit}`);
            
            // If successful, return null (request can proceed)
            return null;
          } catch (error) {
            // If hourly rate limit exceeded, return 429 response
            console.log(`Hourly rate limit exceeded for key ${apiKey.substring(0, 6)}...`);
            const hourlyLimit = settings.hourly.limit;
            const resetTime = new Date(Date.now() + settings.hourly.window * 1000);
            
            return NextResponse.json(
              {
                error: 'Rate limit exceeded',
                message: `Too many requests. Limited to ${hourlyLimit} requests per hour.`,
                limit: hourlyLimit,
                remaining: 0,
                reset: resetTime.toISOString(),
                timeFrame: 'hour'
              },
              {
                status: 429,
                headers: {
                  'X-RateLimit-Limit': hourlyLimit.toString(),
                  'X-RateLimit-Remaining': '0',
                  'X-RateLimit-Reset': resetTime.toISOString(),
                  'X-RateLimit-TimeFrame': 'hour',
                  'Retry-After': settings.hourly.window.toString()
                },
              }
            );
          }
        }
      } catch (rateError) {
        // Log the rate limit error but don't block the request
        console.error('Error applying rate limits:', rateError);
        console.log('Continuing request despite rate limiting error');
      }
      
      // If no rate limiters are available or there was an error, allow the request
      return null;
    } catch (error) {
      // If there's an error with rate limiting, log it but don't block the request
      console.error('Rate limiting error:', error);
      return null;
    }
  }

/**
 * Check if a user has exceeded their monthly usage limit
 * 
 * @param userId User ID
 * @param tier Subscription tier
 * @returns NextResponse if usage limit exceeded, or null if the request can proceed
 */
export async function checkUsageLimit(userId: string, tier: string): Promise<NextResponse | null> {
  try {
    // Calculate first day of current month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    // Get total usage for this month
    const monthlyUsage = await prisma.usageStats.aggregate({
      where: {
        userId: userId,
        date: { gte: firstDayOfMonth }
      },
      _sum: {
        count: true
      }
    });

    const totalUsage = monthlyUsage._sum.count || 0;
    const usageLimit = USAGE_LIMITS[tier as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.free;

    // If usage limit exceeded, return error response
    if (totalUsage >= usageLimit) {
      return NextResponse.json(
        {
          error: `Monthly usage limit of ${usageLimit} operations reached for your ${tier} plan`,
          usage: totalUsage,
          limit: usageLimit
        },
        { status: 403 }
      );
    }

    // If not exceeded, return null (request can proceed)
    return null;
  } catch (error) {
    // Log error but don't block the request
    console.error('Usage limit check error:', error);
    return null;
  }
}

// Define a type for the rate limiter result to ensure consistency
interface RateLimitResult {
  remainingPoints: number;
  resetTime?: Date; // Optional to handle cases where resetTime might not exist
}

/**
 * Add rate limit headers to a response
 *
 * @param response NextResponse object
 * @param apiKey User's API key
 * @param tier Subscription tier
 * @returns NextResponse with rate limit headers added
 */
export async function addRateLimitHeaders(
  response: NextResponse,
  apiKey: string,
  tier: string
): Promise<NextResponse> {
  try {
    // Get rate limiters for this tier
    const rateLimiters = getRateLimiters(tier);

    // Get limit settings
    const settings = RATE_LIMITS[tier as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;

    // Add headers for minutely rate limits
    if (rateLimiters.minutely) {
      try {
        // Try to get current minutely consumption without consuming a point
        const minutelyResult = await rateLimiters.minutely.consume(apiKey, 0) as RateLimitResult;

        // Add minutely rate limit headers
        response.headers.set('X-RateLimit-Minutely-Limit', settings.minutely.limit.toString());
        response.headers.set('X-RateLimit-Minutely-Remaining', minutelyResult.remainingPoints.toString());
        response.headers.set(
          'X-RateLimit-Minutely-Reset',
          minutelyResult.resetTime
            ? minutelyResult.resetTime.toISOString()
            : new Date(Date.now() + settings.minutely.window * 1000).toISOString()
        );
      } catch (error) {
        // If minutely rate limited, set appropriate headers
        response.headers.set('X-RateLimit-Minutely-Limit', settings.minutely.limit.toString());
        response.headers.set('X-RateLimit-Minutely-Remaining', '0');
        const resetTime = new Date(Date.now() + settings.minutely.window * 1000);
        response.headers.set('X-RateLimit-Minutely-Reset', resetTime.toISOString());
      }
    }

    // Add headers for hourly rate limits
    if (rateLimiters.hourly) {
      try {
        // Try to get current hourly consumption without consuming a point
        const hourlyResult = await rateLimiters.hourly.consume(apiKey, 0) as RateLimitResult;

        // Add hourly rate limit headers
        response.headers.set('X-RateLimit-Hourly-Limit', settings.hourly.limit.toString());
        response.headers.set('X-RateLimit-Hourly-Remaining', hourlyResult.remainingPoints.toString());
        response.headers.set(
          'X-RateLimit-Hourly-Reset',
          hourlyResult.resetTime
            ? hourlyResult.resetTime.toISOString()
            : new Date(Date.now() + settings.hourly.window * 1000).toISOString()
        );

        // Also set standard rate limit headers (using hourly values as default)
        response.headers.set('X-RateLimit-Limit', settings.hourly.limit.toString());
        response.headers.set('X-RateLimit-Remaining', hourlyResult.remainingPoints.toString());
        response.headers.set(
          'X-RateLimit-Reset',
          hourlyResult.resetTime
            ? hourlyResult.resetTime.toISOString()
            : new Date(Date.now() + settings.hourly.window * 1000).toISOString()
        );
      } catch (error) {
        // If hourly rate limited, set appropriate headers
        response.headers.set('X-RateLimit-Hourly-Limit', settings.hourly.limit.toString());
        response.headers.set('X-RateLimit-Hourly-Remaining', '0');
        const resetTime = new Date(Date.now() + settings.hourly.window * 1000);
        response.headers.set('X-RateLimit-Hourly-Reset', resetTime.toISOString());

        // Also set standard rate limit headers
        response.headers.set('X-RateLimit-Limit', settings.hourly.limit.toString());
        response.headers.set('X-RateLimit-Remaining', '0');
        response.headers.set('X-RateLimit-Reset', resetTime.toISOString());
      }
    }

    return response;
  } catch (error) {
    console.error('Error adding rate limit headers:', error);
    return response; // Return original response if there's an error
  }
}