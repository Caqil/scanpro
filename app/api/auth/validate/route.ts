// app/api/reset-password/validate/route.ts
// Fallback route for token validation
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle both POST and GET requests for token validation
async function validateToken(token: string | null) {
    try {
        console.log('[Fallback] Validating token:', token);

        if (!token) {
            console.log('[Fallback] Token is missing in request');
            return NextResponse.json(
                { error: 'Token is required', valid: false },
                { status: 400 }
            );
        }

        // First try to find the token by exact match
        let resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        // If not found, try to find by token value (in case token parameter has been stored differently)
        if (!resetToken) {
            resetToken = await prisma.passwordResetToken.findFirst({
                where: { token }
            });
        }

        console.log('[Fallback] Token found in database:', !!resetToken);
        
        // Check if token exists and is valid
        const isValid = resetToken && resetToken.expires > new Date();
        
        if (resetToken) {
            console.log('[Fallback] Token expiration:', resetToken.expires);
            console.log('[Fallback] Current time:', new Date());
            console.log('[Fallback] Is token still valid (not expired):', resetToken.expires > new Date());
        }

        return NextResponse.json({
            valid: !!isValid,
            message: isValid
                ? 'Token is valid'
                : 'Token is invalid or has expired'
        });
    } catch (error) {
        console.error('[Fallback] Token validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate token', valid: false },
            { status: 500 }
        );
    }
}

// POST handler
export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();
        return validateToken(token);
    } catch (error) {
        console.error('[Fallback] POST token validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate token', valid: false },
            { status: 500 }
        );
    }
}

// GET handler
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        return validateToken(token);
    } catch (error) {
        console.error('[Fallback] GET token validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate token', valid: false },
            { status: 500 }
        );
    }
}