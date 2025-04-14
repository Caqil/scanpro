// lib/validate-key.ts
import { prisma } from './prisma';
import { getRedisClient } from './redis';

// Define valid operations
export const API_OPERATIONS = [
  'convert',
  'compress',
  'merge',
  'split',
  'watermark',
  'rotate',
  'protect',
  'unlock',
  'ocr',
  'sign',
  'edit',
  'repair',
  'extract',
  'annotate',
  'redact',
  'detect',
  'organize',
  'process',
  'info',
  'pagenumber',
];

// Validate API key and operation
export async function validateApiKey(apiKey: string, operation: string): Promise<{
  valid: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    // Find API key in database
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          include: { subscription: true }
        }
      }
    });

    // Check if key exists
    if (!key) {
      return { valid: false, error: 'Invalid API key' };
    }

    // Check if key is expired
    if (key.expiresAt && key.expiresAt < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    // Check if operation is valid
    if (!API_OPERATIONS.includes(operation) && operation !== '*') {
      return { valid: false, error: `Invalid operation: ${operation}` };
    }

    // Check if key has permission for operation
    if (!key.permissions.includes(operation) && !key.permissions.includes('*')) {
      return {
        valid: false,
        error: `This API key does not have permission to perform the '${operation}' operation`
      };
    }

    // Key is valid
    return {
      valid: true,
      userId: key.userId
    };
  } catch (error) {
    console.error('Error validating API key:', error);
    return { valid: false, error: 'Failed to validate API key' };
  }
}

// Track API usage
export async function trackApiUsage(userId: string, operation: string): Promise<void> {
  try {
    // Get current date (reset to midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update usage stats in database
    await prisma.usageStats.upsert({
      where: {
        userId_operation_date: {
          userId,
          operation,
          date: today
        }
      },
      update: {
        count: { increment: 1 }
      },
      create: {
        userId,
        operation,
        date: today,
        count: 1
      }
    });

    // Also track in Redis for real-time access
    try {
      const redis = getRedisClient();
      const key = `scanpro:usage:${userId}:${operation}:${today.toISOString().split('T')[0]}`;
      
      // Increment usage counter
      await redis.incr(key);
      
      // Set expiration (30 days) if this is a new key
      await redis.expire(key, 60 * 60 * 24 * 30);
    } catch (redisError) {
      // If Redis fails, just log the error - we still have the database record
      console.warn('Failed to track usage in Redis:', redisError);
    }
  } catch (error) {
    console.error('Error tracking API usage:', error);
    // Non-blocking - don't throw error
  }
}

// Get current usage for a user
export async function getCurrentUsage(userId: string): Promise<{
  total: number;
  byOperation: Record<string, number>;
}> {
  try {
    // Calculate first day of current month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    // Get usage from database
    const usageStats = await prisma.usageStats.findMany({
      where: {
        userId,
        date: { gte: firstDayOfMonth }
      },
      select: {
        operation: true,
        count: true
      }
    });

    // Calculate totals
    const byOperation: Record<string, number> = {};
    let total = 0;

    for (const stat of usageStats) {
      byOperation[stat.operation] = stat.count;
      total += stat.count;
    }

    return { total, byOperation };
  } catch (error) {
    console.error('Error getting current usage:', error);
    return { total: 0, byOperation: {} };
  }
}