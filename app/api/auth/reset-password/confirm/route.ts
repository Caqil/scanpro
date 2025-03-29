// app/api/reset-password/confirm/route.ts
// This is a fallback route to handle password reset confirmation
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        console.log('[Fallback] Confirming password reset for token:', token ? token.substring(0, 5) + '...' : 'undefined');

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        // Validate password
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Find the reset token - first try exact match
        let resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        // If not found, try search by token value
        if (!resetToken) {
            console.log('[Fallback] Token not found by unique lookup, trying first match');
            resetToken = await prisma.passwordResetToken.findFirst({
                where: { token }
            });
        }

        // Check if token exists and is valid
        if (!resetToken) {
            console.log('[Fallback] No matching token found in database');
            return NextResponse.json(
                { error: 'Invalid token - no matching token found' },
                { status: 400 }
            );
        }

        if (resetToken.expires < new Date()) {
            console.log('[Fallback] Token expired:', resetToken.expires, 'Current time:', new Date());
            return NextResponse.json(
                { error: 'Token has expired' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        });

        if (!user) {
            console.log('[Fallback] User not found with email:', resetToken.email);
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        console.log('[Fallback] Found user, updating password');

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Delete the used token
        try {
            await prisma.passwordResetToken.delete({
                where: { id: resetToken.id }
            });
            console.log('[Fallback] Reset token deleted successfully');
        } catch (deleteError) {
            console.error('[Fallback] Error deleting token, continuing anyway:', deleteError);
            // Continue the process even if token deletion fails
        }

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('[Fallback] Password update error:', error);
        return NextResponse.json(
            { error: 'An error occurred updating your password: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        );
    }
}