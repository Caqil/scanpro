// app/api/user/api-usage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ApiKeyService } from '@/src/services/api-key-service';

/**
 * GET /api/user/api-usage
 * Get API usage statistics for the current user
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Type guard to ensure session and user.id exist
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '30');

        if (isNaN(days) || days < 1 || days > 365) {
            return NextResponse.json(
                { error: 'Invalid time range. Days must be between 1 and 365.' },
                { status: 400 }
            );
        }

        const usageStats = await ApiKeyService.getApiUsageStats(session.user.id, days);

        return NextResponse.json(usageStats);
    } catch (error) {
        console.error('Error getting API usage statistics:', error);
        return NextResponse.json(
            { error: 'Failed to get API usage statistics' },
            { status: 500 }
        );
    }
}