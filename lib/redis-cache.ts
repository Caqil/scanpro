// lib/redis-cache.ts
import { getRedisClient } from './redis';

export class RedisCache {
  private prefix: string;
  
  constructor(prefix = 'scanpro:cache') {
    this.prefix = prefix;
  }
  
  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }
  
  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedisClient();
    const data = await redis.get(this.getKey(key));
    
    if (!data) return null;
    
    try {
      return JSON.parse(data) as T;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Set a value in cache with expiration
   */
  async set<T>(key: string, value: T, expirySeconds = 3600): Promise<void> {
    const redis = getRedisClient();
    await redis.set(
      this.getKey(key),
      JSON.stringify(value),
      'EX',
      expirySeconds
    );
  }
  
  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<void> {
    const redis = getRedisClient();
    await redis.del(this.getKey(key));
  }
  
  /**
   * Get a value from cache or compute it if not found
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    expirySeconds = 3600
  ): Promise<T> {
    const cachedValue = await this.get<T>(key);
    
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    const newValue = await fn();
    await this.set(key, newValue, expirySeconds);
    return newValue;
  }
  
  /**
   * Increment a counter
   */
  async increment(key: string, by = 1, expirySeconds = 86400): Promise<number> {
    const redis = getRedisClient();
    const value = await redis.incrby(this.getKey(key), by);
    
    // Set expiry if this is a new key
    if (value === by) {
      await redis.expire(this.getKey(key), expirySeconds);
    }
    
    return value;
  }
}

// Export a default instance
export const cache = new RedisCache();