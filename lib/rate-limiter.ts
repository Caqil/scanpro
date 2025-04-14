// lib/rate-limiter.ts
import { Redis } from 'ioredis';
import { getRedisClient } from './redis';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Timestamp in milliseconds
}

export class RateLimiter {
  private redis: Redis;
  private prefix: string;
  
  constructor(prefix = 'scanpro:ratelimit') {
    this.redis = getRedisClient();
    this.prefix = prefix;
  }
  
  /**
   * Implements a sliding window rate limiting algorithm
   */
  async limit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStartTime = now - windowMs;
    const identifier = `${this.prefix}:${key}`;
    
    try {
      // Clean up old records first (keep requests within the current window)
      await this.redis.zremrangebyscore(identifier, 0, windowStartTime);
      
      // Count current requests in the window
      const currentCount = await this.redis.zcount(identifier, windowStartTime, '+inf');
      
      // Check if limit is reached
      if (currentCount >= limit) {
        // Get reset time (the oldest request + window time)
        const oldestRequest = await this.redis.zrange(identifier, 0, 0, 'WITHSCORES');
        const resetTime = oldestRequest.length > 1 
          ? parseInt(oldestRequest[1]) + windowMs 
          : now + windowMs;
          
        return {
          success: false,
          limit,
          remaining: 0,
          reset: resetTime
        };
      }
      
      // Add current request with timestamp score
      await this.redis.zadd(identifier, now, `${now}:${Math.random().toString(36).substring(2, 15)}`);
      
      // Set expiration on the set
      await this.redis.expire(identifier, windowSeconds * 2);
      
      // Return success with remaining slots
      return {
        success: true,
        limit,
        remaining: limit - currentCount - 1,
        reset: now + windowMs
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      
      // If Redis fails, we should not block the request
      return {
        success: true,
        limit,
        remaining: 1,
        reset: now + windowMs
      };
    }
  }
  
  /**
   * Get current rate limit status without incrementing
   */
  async getStatus(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStartTime = now - windowMs;
    const identifier = `${this.prefix}:${key}`;
    
    try {
      const currentCount = await this.redis.zcount(identifier, windowStartTime, '+inf');
      
      return {
        success: currentCount < limit,
        limit,
        remaining: Math.max(0, limit - currentCount),
        reset: now + windowMs
      };
    } catch (error) {
      console.error('Rate limit status error:', error);
      
      // Fail open
      return {
        success: true,
        limit,
        remaining: 1,
        reset: now + windowMs
      };
    }
  }
}