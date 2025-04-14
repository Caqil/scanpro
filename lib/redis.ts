// lib/redis.ts
import { Redis } from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

// Configuration for Redis connection
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Singleton pattern for Redis connection
let redisClient: Redis | null = null;
/**
 * Get a Redis client instance
 * @returns Redis client
 */
export function getRedisClient(): Redis {
    if (!redisClient) {
      try {
        console.log('Creating new Redis client connection to:', REDIS_URL);
        
        redisClient = new Redis(REDIS_URL, {
          // Increase retries and enable offline queue for better reliability
          maxRetriesPerRequest: 5,
          enableOfflineQueue: true,
          retryStrategy(times) {
            const delay = Math.min(times * 100, 3000);
            console.log(`Redis connection retry ${times}, delay: ${delay}ms`);
            return delay;
          },
          reconnectOnError(err) {
            console.log('Redis reconnect on error triggered:', err.message);
            const targetError = 'READONLY';
            if (err.message.includes(targetError)) {
              // Only reconnect when the error includes "READONLY"
              return 1;
            }
            return false;
          }
        });
        
        redisClient.on('error', (err) => {
          console.error('Redis connection error:', err.message);
        });
        
        redisClient.on('connect', () => {
          console.log('Successfully connected to Redis');
        });
        
        redisClient.on('reconnecting', () => {
          console.log('Redis client reconnecting...');
        });
        
        redisClient.on('ready', () => {
          console.log('Redis client ready for commands');
        });
      } catch (error) {
        console.error('Failed to create Redis client:', error);
        throw error;
      }
    }
    
    return redisClient;
  }

/**
 * Create a rate limiter instance
 * @param points Maximum number of points (requests)
 * @param duration Duration in seconds
 * @param keyPrefix Prefix for Redis keys
 * @returns RateLimiterRedis instance
 */
export function createRateLimiter(
  points: number, 
  duration: number, 
  keyPrefix: string = 'scanpro:ratelimit'
): RateLimiterRedis {
  try {
    return new RateLimiterRedis({
      storeClient: getRedisClient(),
      keyPrefix,
      points,
      duration,
    });
  } catch (error) {
    console.error('Failed to create rate limiter:', error);
    throw error;
  }
}
// Define rate limits based on subscription tier
// Define rate limits based on subscription tier
export const RATE_LIMITS = {
    free: {
      hourly: {
        limit: 3,           // Reduced for testing to 3 requests per hour
        window: 3600,       // 3600 seconds = 1 hour
      },
      minutely: {
        limit: 2,           // Reduced for testing to 2 requests per minute
        window: 60,         // 60 seconds = 1 minute
      }
    },
    basic: {
      hourly: {
        limit: 1000,
        window: 3600,       // 1000 requests per hour
      },
      minutely: {
        limit: 20,
        window: 60,         // 20 requests per minute
      }
    },
    pro: {
      hourly: {
        limit: 2000,
        window: 3600,       // 2000 requests per hour
      },
      minutely: {
        limit: 50,
        window: 60,         // 50 requests per minute
      }
    },
    enterprise: {
      hourly: {
        limit: 5000,
        window: 3600,       // 5000 requests per hour
      },
      minutely: {
        limit: 100,
        window: 60,         // 100 requests per minute
      }
    },
  };
/**
 * Create rate limiters for a specific subscription tier
 * @param tier Subscription tier ('free', 'basic', 'pro', 'enterprise')
 * @param timeframe Optional timeframe ('hourly' or 'minutely', defaults to both)
 * @returns Object with hourly and/or minutely rate limiters
 */
export function createTierRateLimiters(
    tier: string, 
    timeframe?: 'hourly' | 'minutely'
  ): { 
    hourly?: RateLimiterRedis; 
    minutely?: RateLimiterRedis;
  } {
    // Get rate limit settings for tier, defaulting to free tier
    const settings = RATE_LIMITS[tier as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;
    const result: { hourly?: RateLimiterRedis; minutely?: RateLimiterRedis } = {};
    
    // Create hourly limiter if requested or if no specific timeframe requested
    if (!timeframe || timeframe === 'hourly') {
      result.hourly = createRateLimiter(
        settings.hourly.limit,
        settings.hourly.window,
        `scanpro:${tier}:hourly:ratelimit`
      );
    }
    
    // Create minutely limiter if requested or if no specific timeframe requested
    if (!timeframe || timeframe === 'minutely') {
      result.minutely = createRateLimiter(
        settings.minutely.limit,
        settings.minutely.window,
        `scanpro:${tier}:minutely:ratelimit`
      );
    }
    
    return result;
  }

/**
 * Memory-based fallback when Redis is unavailable
 */
class FallbackRateLimiter {
  private storage: Map<string, { count: number, resetTime: number }>;
  private points: number;
  private duration: number;

  constructor(points: number, duration: number) {
    this.storage = new Map();
    this.points = points;
    this.duration = duration;
  }

  async consume(key: string, points: number = 1): Promise<{ remainingPoints: number, resetTime: Date }> {
    const now = Date.now();
    const record = this.storage.get(key);
    
    // If record doesn't exist or has expired, create new one
    if (!record || record.resetTime < now) {
      const resetTime = now + (this.duration * 1000);
      this.storage.set(key, { count: points, resetTime });
      return { 
        remainingPoints: this.points - points,
        resetTime: new Date(resetTime)
      };
    }
    
    // Check if limit exceeded
    if (record.count + points > this.points) {
      throw new Error('Rate limit exceeded');
    }
    
    // Update count
    record.count += points;
    this.storage.set(key, record);
    
    return {
      remainingPoints: this.points - record.count,
      resetTime: new Date(record.resetTime)
    };
  }
}

/**
 * Get rate limiters (Redis-based or fallback)
 * @param tier Subscription tier
 * @returns Object with hourly and minutely rate limiters
 */
export function getRateLimiters(tier: string) {
  // Get rate limit settings for tier, defaulting to free tier
  const settings = RATE_LIMITS[tier as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;
  
  try {
    // Try to create Redis-based rate limiters
    return createTierRateLimiters(tier);
  } catch (error) {
    console.warn(`Failed to create Redis rate limiters, using fallback for tier ${tier}:`, error);
    
    // Return memory-based fallbacks
    return {
      hourly: new FallbackRateLimiter(settings.hourly.limit, settings.hourly.window),
      minutely: new FallbackRateLimiter(settings.minutely.limit, settings.minutely.window)
    };
  }
}