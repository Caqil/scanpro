// app/api/keys/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Generate a secure random API key
function generateApiKey() {
    return `sk_${randomBytes(24).toString('hex')}`;
}

// List API keys
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const apiKeys = await prisma.apiKey.findMany({
            where: { userId: session.user.id },
            select: {
                id: true,
                name: true,
                key: true,
                permissions: true,
                lastUsed: true,
                expiresAt: true,
                createdAt: true,
            }
        });

        // Mask API keys for security
        const maskedKeys = apiKeys.map(key => ({
            ...key,
            key: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`
        }));

        return NextResponse.json({ keys: maskedKeys });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        return NextResponse.json(
            { error: 'Failed to fetch API keys' },
            { status: 500 }
        );
    }
}

// Create new API key
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { name, permissions } = await request.json();

        // Check subscription limits on number of keys
        const userWithSub = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true, apiKeys: true }
        });

        const keyLimits = {
            free: 1,
            basic: 3,
            pro: 10,
            enterprise: 50
        };

        const tier = userWithSub?.subscription?.tier || 'free';
        const keyLimit = keyLimits[tier as keyof typeof keyLimits];

        if (userWithSub?.apiKeys.length >= keyLimit) {
            return NextResponse.json(
                { error: `Your ${tier} plan allows a maximum of ${keyLimit} API keys` },
                { status: 403 }
            );
        }

        // Create new API key
        const apiKey = await prisma.apiKey.create({
            data: {
                userId: session.user.id,
                name: name || 'API Key',
                key: generateApiKey(),
                permissions: permissions || ['convert', 'compress', 'merge', 'split'],
            }
        });

        return NextResponse.json({
            success: true,
            key: apiKey
        });
    } catch (error) {
        console.error('Error creating API key:', error);
        return NextResponse.json(
            { error: 'Failed to create API key' },
            { status: 500 }
        );
    }
}