// lib/redis-health.ts
import { getRedisClient } from './redis';

/**
 * Check if Redis is available and working
 * @returns Object with status and optional error message
 */
export async function checkRedisHealth(): Promise<{ 
  available: boolean; 
  error?: string;
  latency?: number;
}> {
  try {
    const redis = getRedisClient();
    
    // Measure latency
    const start = Date.now();
    
    // Test basic operations (ping, set, get, delete)
    const pingResult = await redis.ping();
    if (pingResult !== 'PONG') {
      return { available: false, error: 'Redis PING response was not PONG' };
    }
    
    // Test set/get
    const testKey = `health:test:${Date.now()}`;
    const testValue = 'redis-health-check';
    
    await redis.set(testKey, testValue);
    const retrievedValue = await redis.get(testKey);
    
    // Clean up test key
    await redis.del(testKey);
    
    // Calculate latency
    const latency = Date.now() - start;
    
    // Verify get result
    if (retrievedValue !== testValue) {
      return { 
        available: false, 
        error: `Redis GET returned wrong value: ${retrievedValue} (expected ${testValue})`,
        latency
      };
    }
    
    return { available: true, latency };
  } catch (error) {
    console.error('Redis health check failed:', error);
    return { 
      available: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}