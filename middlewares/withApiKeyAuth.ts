// middlewares/withApiKeyAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/purchase-validation';

export async function withApiKeyAuth(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
    // Skip validation for purchase validation and public routes
    if (
        request.nextUrl.pathname.startsWith('/api/validate-purchase') ||
        request.nextUrl.pathname.startsWith('/api/check-purchase')
    ) {
        return handler(request);
    }

    // Get API key from header or query parameter
    const apiKey =
        request.headers.get('x-api-key') ||
        request.nextUrl.searchParams.get('api_key');

    if (!apiKey) {
        return NextResponse.json(
            { success: false, message: 'API key is required' },
            { status: 401 }
        );
    }

    // Validate the API key
    const validatedKey = await validateApiKey(apiKey);

    if (!validatedKey) {
        return NextResponse.json(
            { success: false, message: 'Invalid API key' },
            { status: 401 }
        );
    }

    // API key is valid, proceed to the route handler
    return handler(request);
}