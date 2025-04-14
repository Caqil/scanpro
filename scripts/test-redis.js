#!/usr/bin/env node

// scripts/test-redis.js
// A simple script to test Redis connectivity

const Redis = require('ioredis');
require('dotenv').config();

// Get Redis URL from environment or use default
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

console.log(`Attempting to connect to Redis at: ${REDIS_URL}`);

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis successfully!');
  
  // Test basic operations
  testRedisOperations()
    .then(() => {
      console.log('✅ All Redis operations completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Redis operations test failed:', err);
      process.exit(1);
    });
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
  process.exit(1);
});

// Test basic Redis operations
async function testRedisOperations() {
  console.log('Running basic Redis operations test...');
  
  // Test 1: PING
  const pingResult = await redis.ping();
  console.log(`PING: ${pingResult === 'PONG' ? '✅' : '❌'} (${pingResult})`);
  
  // Test 2: SET/GET
  const testKey = `test:${Date.now()}`;
  const testValue = 'Hello Redis!';
  
  await redis.set(testKey, testValue);
  const getValue = await redis.get(testKey);
  console.log(`SET/GET: ${getValue === testValue ? '✅' : '❌'} (${getValue})`);
  
  // Test 3: INCR
  const counterKey = `counter:${Date.now()}`;
  const incrResult = await redis.incr(counterKey);
  console.log(`INCR: ${incrResult === 1 ? '✅' : '❌'} (${incrResult})`);
  
  // Test 4: EXPIRE/TTL
  await redis.expire(testKey, 10);
  const ttl = await redis.ttl(testKey);
  console.log(`EXPIRE/TTL: ${ttl > 0 && ttl <= 10 ? '✅' : '❌'} (${ttl})`);
  
  // Test 5: DEL
  await redis.del(testKey);
  const afterDel = await redis.get(testKey);
  console.log(`DEL: ${afterDel === null ? '✅' : '❌'} (${afterDel})`);
  
  // Cleanup
  await redis.del(counterKey);
}