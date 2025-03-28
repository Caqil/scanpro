// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // For security reasons, we don't reveal if the email exists or not
        // We'll still return success even if the email doesn't exist
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account with that email exists, we have sent password reset instructions'
            });
        }

        // Generate a reset token
        const token = randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // Token valid for 1 hour

        // Store the reset token in the database
        await prisma.passwordResetToken.create({
            data: {
                token,
                expires,
                email: user.email as string
            }
        });

        // Create reset URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${token}`;

        // Send email
        try {
            await sendEmail({
                to: user.email as string,
                subject: 'Reset your ScanPro password',
                text: `Reset your password by clicking this link: ${resetUrl}. The link is valid for 1 hour.`,
                html: `
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password for your ScanPro account.</p>
                    <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
                    <a href="${resetUrl}" style="background-color: #FFEAA0; color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                      Reset Your Password
                    </a>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p>Thanks,<br>The ScanPro Team</p>
                `
            });
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
            // Don't reveal the error to the client for security reasons
        }

        return NextResponse.json({
            success: true,
            message: 'If an account with that email exists, we have sent password reset instructions'
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json(
            { error: 'Failed to process password reset request' },
            { status: 500 }
        );
    }
}

