// app/api/health/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRedisHealth } from '@/lib/redis-health';
import os from 'os';

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    let dbStatus = 'healthy';
    let dbError: string | null = null;
    
    try {
      // Simple query to test database connection
      await prisma.$queryRaw`SELECT 1 as result`;
    } catch (error) {
      dbStatus = 'error';
      dbError = error instanceof Error ? error.message : 'Unknown database error';
    }
    
    // Check Redis health
    const redisHealth = await checkRedisHealth();
    
    // System information
    const status = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      nodejs: process.version,
      os: {
        platform: process.platform,
        release: os.release(),
        type: os.type(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        loadAverage: os.loadavg(),
      },
      database: {
        status: dbStatus,
        error: dbError,
      },
      redis: {
        available: redisHealth.available,
        latency: redisHealth.latency,
        error: redisHealth.error,
      },
      status: dbStatus === 'healthy' && redisHealth.available ? 'healthy' : 'degraded',
    };

    return new Response(
      JSON.stringify(status),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Health check error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}