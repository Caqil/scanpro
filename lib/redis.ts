// lib/redis.ts
import { Redis } from 'ioredis';

// Define connection options based on environment variables
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  // Optional: use a specific database number
  db: parseInt(process.env.REDIS_DB || '0'),
  // Enable TLS if needed
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
};

// Create a Redis singleton
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(redisOptions);
    
    // Handle connection errors and reconnection
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
    
    redisClient.on('connect', () => {
      console.log('Connected to Redis server');
    });
  }
  
  return redisClient;
}

// Graceful shutdown helper
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed');
  }
}