// app/api/health/redis/route.ts
import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET() {
  try {
    const redis = getRedisClient();
    const pingResult = await redis.ping();
    
    if (pingResult !== 'PONG') {
      throw new Error('Redis ping failed');
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Redis connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Redis health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Redis connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}