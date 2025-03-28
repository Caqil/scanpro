
// app/api/auth/validate-reset-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        // Check if token exists and is valid
        const isValid = resetToken && resetToken.expires > new Date();

        return NextResponse.json({
            valid: !!isValid,
            message: isValid
                ? 'Token is valid'
                : 'Token is invalid or has expired'
        });
    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate token', valid: false },
            { status: 500 }
        );
    }
}