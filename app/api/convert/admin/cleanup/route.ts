// app/api/convert/admin/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cleanupFiles } from '@/lib/cleanup-service';

// Secret API key for protecting this endpoint
const API_KEY = process.env.ADMIN_API_KEY;

export async function GET(request: NextRequest) {
    try {
        // Check API key
        const providedKey = request.headers.get('x-api-key');

        if (API_KEY !== providedKey) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid API key' },
                { status: 401 }
            );
        }

        // Get max age from query string or use default
        const searchParams = request.nextUrl.searchParams;
        const maxAgeMinutes = parseInt(searchParams.get('maxAge') || '60');

        // Run cleanup
        const result = await cleanupFiles(maxAgeMinutes);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Cleanup API error:', error);

        return NextResponse.json(
            { error: 'Failed to run cleanup' },
            { status: 500 }
        );
    }
}