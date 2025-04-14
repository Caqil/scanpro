// app/api/test/rate-limit/route.ts
import { NextRequest } from 'next/server';
import { validateApiKey, trackApiUsage } from '@/lib/validate-key';

export async function GET(request: NextRequest) {
  try {
    // Get API key from header or query parameter
    const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate the API key (for a test operation)
    const validation = await validateApiKey(apiKey, 'test');

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error || 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If valid, track this usage
    if (validation.userId) {
      await trackApiUsage(validation.userId, 'test');
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Rate limit test successful',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          // The rate limit headers will be added by the middleware
        }
      }
    );
  } catch (error) {
    console.error('Rate limit test error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        success: false
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}