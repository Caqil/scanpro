// app/api/user/api-keys/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
    try {
        // Verify user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user's API keys
        const apiKeys = await prisma.apiKey.findMany({
            where: { userId: session.user.id },
            select: {
                id: true,
                name: true,
                key: true,
                createdAt: true,
                expiresAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(apiKeys);
    } catch (error) {
        console.error('API key fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve API keys' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Verify user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { name } = body;

        // Generate a secure API key
        const rawApiKey = crypto.randomBytes(32).toString('hex');
        const hashedApiKey = crypto
            .createHash('sha256')
            .update(rawApiKey)
            .digest('hex');

        // Create API key in database
        const apiKey = await prisma.apiKey.create({
            data: {
                name: name || `API Key ${new Date().toLocaleDateString()}`,
                key: hashedApiKey,
                userId: session.user.id,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                expiresAt: true
            }
        });

        return NextResponse.json({
            ...apiKey,
            key: rawApiKey // Only return raw key once
        });
    } catch (error) {
        console.error('API key creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create API key' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Verify user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { apiKeyId } = body;

        // Delete API key
        await prisma.apiKey.deleteMany({
            where: {
                id: apiKeyId,
                userId: session.user.id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API key deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to delete API key' },
            { status: 500 }
        );
    }
}