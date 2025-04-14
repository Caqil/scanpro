#!/usr/bin/env node

// scripts/test-rate-limit.js
// A script to test rate limiting by sending multiple requests

const https = require('https');
const http = require('http');

// Get command line arguments
const apiKey = process.argv[2];
const requestCount = parseInt(process.argv[3] || '10');
const delay = parseInt(process.argv[4] || '100'); // ms between requests

if (!apiKey) {
  console.error('Usage: node test-rate-limit.js <api_key> [request_count] [delay_ms]');
  process.exit(1);
}

console.log(`Starting rate limit test with API key: ${apiKey.substring(0, 8)}...`);
console.log(`Will send ${requestCount} requests with ${delay}ms delay between requests`);

// Counter for completed requests
let completed = 0;
let successful = 0;
let rateLimited = 0;
let errors = 0;

// Store the time when we start
const startTime = Date.now();

// Function to make a request
function makeRequest(index) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test/rate-limit',
    method: 'GET',
    headers: {
      'x-api-key': apiKey
    }
  };

  // Create the proper request object
  const reqLib = options.port === 443 ? https : http;
  
  const req = reqLib.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      completed++;
      
      // Parse headers for rate limit info
      const minutelyLimit = res.headers['x-ratelimit-minutely-limit'];
      const minutelyRemaining = res.headers['x-ratelimit-minutely-remaining'];
      const hourlyLimit = res.headers['x-ratelimit-hourly-limit'];
      const hourlyRemaining = res.headers['x-ratelimit-hourly-remaining'];
      
      // Track results by status code
      if (res.statusCode === 200) {
        successful++;
        console.log(`✅ Request ${index}: Success (${res.statusCode}) - Minutely: ${minutelyRemaining}/${minutelyLimit}, Hourly: ${hourlyRemaining}/${hourlyLimit}`);
      } else if (res.statusCode === 429) {
        rateLimited++;
        try {
          const response = JSON.parse(data);
          console.log(`🛑 Request ${index}: Rate limited (${res.statusCode}) - ${response.message || 'Too many requests'}`);
        } catch (e) {
          console.log(`🛑 Request ${index}: Rate limited (${res.statusCode})`);
        }
      } else {
        errors++;
        console.log(`❌ Request ${index}: Error (${res.statusCode}) - ${data}`);
      }
      
      // When all requests are done, print summary
      if (completed === requestCount) {
        const elapsedMs = Date.now() - startTime;
        console.log('\n--- Test Results ---');
        console.log(`Total requests: ${requestCount}`);
        console.log(`Successful: ${successful}`);
        console.log(`Rate limited: ${rateLimited}`);
        console.log(`Errors: ${errors}`);
        console.log(`Total time: ${(elapsedMs / 1000).toFixed(2)} seconds`);
        console.log(`Average rate: ${(requestCount / (elapsedMs / 1000)).toFixed(2)} requests/second`);
      }
    });
  });
  
  req.on('error', (error) => {
    completed++;
    errors++;
    console.error(`❌ Request ${index}: Error - ${error.message}`);
    
    // When all requests are done, print summary
    if (completed === requestCount) {
      const elapsedMs = Date.now() - startTime;
      console.log('\n--- Test Results ---');
      console.log(`Total requests: ${requestCount}`);
      console.log(`Successful: ${successful}`);
      console.log(`Rate limited: ${rateLimited}`);
      console.log(`Errors: ${errors}`);
      console.log(`Total time: ${(elapsedMs / 1000).toFixed(2)} seconds`);
    }
  });
  
  req.end();
}

// Send requests with delay between them
for (let i = 0; i < requestCount; i++) {
  setTimeout(() => {
    makeRequest(i + 1);
  }, i * delay);
}