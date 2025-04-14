// lib/api-usage-tracker.ts
import Redis from 'ioredis';
import { prisma } from './prisma';
import { getRedisClient } from './redis';
import { RedisCache } from './redis-cache';

// Create a specific cache instance for usage tracking
const usageCache = new RedisCache('scanpro:usage');

/**
 * Track API usage with Redis for performance
 * This creates or updates usage counters in Redis and periodically syncs to database
 */
export async function trackApiUsage(userId: string, operation: string): Promise<boolean> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toISOString().split('T')[0];
    const userOpKey = `${userId}:${operation}:${todayStr}`;
    
    // Increment counter in Redis
    await usageCache.increment(userOpKey, 1, 86400); // Expire in 1 day
    
    // Every 10 operations, sync to database (this reduces database writes significantly)
    const value = await usageCache.increment(`${userId}:sync_counter`, 1, 3600);
    
    if (value % 10 === 0) {
      await syncUsageToDatabase(userId);
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking API usage:', error);
    // Don't fail the main operation if tracking fails
    return false;
  }
}

/**
 * Synchronize Redis usage data to database
 */
async function syncUsageToDatabase(userId: string): Promise<void> {
  const redis = getRedisClient();
  const pattern = `scanpro:usage:${userId}:*`;
  
  // Scan for all usage keys for this user
  const keys = await scanAllKeys(redis, pattern);
  
  // Process each key
  for (const key of keys) {
    // Skip sync counter
    if (key.includes('sync_counter')) continue;
    
    // Parse user, operation and date from key
    const parts = key.replace('scanpro:usage:', '').split(':');
    if (parts.length !== 3) continue;
    
    const [uid, operation, dateStr] = parts;
    const count = parseInt(await redis.get(key) || '0');
    
    if (count > 0) {
      // Convert string date to Date object
      const date = new Date(dateStr);
      
      // Upsert to database
      await prisma.usageStats.upsert({
        where: {
          userId_operation_date: {
            userId: uid,
            operation,
            date
          }
        },
        update: {
          count: { increment: count }
        },
        create: {
          userId: uid,
          operation,
          count,
          date
        }
      });
      
      // Reset Redis counter after sync
      await redis.set(key, '0');
    }
  }
}

/**
 * Helper to scan all Redis keys matching a pattern
 */
async function scanAllKeys(redis: Redis, pattern: string): Promise<string[]> {
  let cursor = '0';
  const keys: string[] = [];
  
  do {
    const [nextCursor, result] = await redis.scan(
      cursor, 
      'MATCH', 
      pattern, 
      'COUNT', 
      '100'
    );
    
    cursor = nextCursor;
    keys.push(...result);
  } while (cursor !== '0');
  
  return keys;
}