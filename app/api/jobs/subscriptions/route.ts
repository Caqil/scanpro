// app/api/jobs/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processSubscriptionPeriodEnds } from '@/lib/subscription-jobs';

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
        const result = await processSubscriptionPeriodEnds();

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${result.processed} subscription(s)`,
            processedCount: result.processed
        });
    } catch (error) {
        console.error('Subscription job error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                success: false
            },
            { status: 500 }
        );
    }
}