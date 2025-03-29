import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

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

        // Find the reset token
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: { token }
        });

        // Check if token exists and is valid
        if (!resetToken || resetToken.expires < new Date()) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Delete the used token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id }
        });

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Password update error:', error);
        return NextResponse.json(
            { error: 'An error occurred updating your password' },
            { status: 500 }
        );
    }
}