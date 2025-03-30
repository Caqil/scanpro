import { NextRequest, NextResponse } from 'next/server';
import { cleanupStaleSubscriptions } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
    try {
        // Get API key from header or query param
        const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('api_key');

        // Verify API key (use a specific job API key for security)
        const jobApiKey = process.env.JOBS_API_KEY;
        if (!apiKey || apiKey !== jobApiKey) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Process subscription period ends
        const result = await cleanupStaleSubscriptions();

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${result.cleanedCount} stale subscription(s)`,
            cleanedCount: result.cleanedCount
        });
    } catch (error) {
        console.error('Subscription cleanup job error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                success: false
            },
            { status: 500 }
        );
    }
}