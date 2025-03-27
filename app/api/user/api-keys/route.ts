// app/api/user/api-keys/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ApiKeyService } from '@/src/services/api-key-service';

/**
 * GET /api/user/api-keys
 * Get all API keys for the current user
 */
export async function GET() {
    try {
        // Get the current user session
        const session = await getServerSession(authOptions);

        // Check if the user is authenticated
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get API keys for the user
        const apiKeys = await ApiKeyService.getApiKeys(session.user.id);

        return NextResponse.json({ apiKeys });
    } catch (error) {
        console.error('Error getting API keys:', error);
        return NextResponse.json(
            { error: 'Failed to get API keys' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/user/api-keys
 * Create a new API key for the current user
 */
export async function POST(req: NextRequest) {
    try {
        // Get the current user session
        const session = await getServerSession(authOptions);

        // Check if the user is authenticated
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse the request body
        const body = await req.json();

        // Validate the request body
        if (!body.name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        // Create a new API key
        const apiKey = await ApiKeyService.createApiKey({
            userId: session.user.id,
            name: body.name,
            permissions: body.permissions || { '*': true },
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        });

        return NextResponse.json({ apiKey }, { status: 201 });
    } catch (error) {
        console.error('Error creating API key:', error);
        return NextResponse.json(
            { error: 'Failed to create API key' },
            { status: 500 }
        );
    }
}