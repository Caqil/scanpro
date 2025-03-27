// lib/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from './prisma';

export async function validateApiKey(req: NextRequest, endpoint: string) {
    // Extract API key from headers
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
        return {
            valid: false,
            error: 'No API key provided'
        };
    }

    // Hash the provided API key
    const hashedApiKey = crypto
        .createHash('sha256')
        .update(apiKey)
        .digest('hex');

    try {
        // Find the API key in the database
        const apiKeyRecord = await prisma.apiKey.findUnique({
            where: { key: hashedApiKey },
            include: {
                user: true,
                user: {
                    include: {
                        apiUsage: true
                    }
                }
            }
        });

        // Check if API key exists and is active
        if (!apiKeyRecord || !apiKeyRecord.isActive) {
            return {
                valid: false,
                error: 'Invalid or inactive API key'
            };
        }

        // Check expiration
        if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
            return {
                valid: false,
                error: 'API key has expired'
            };
        }

        // Optional: Check rate limits
        const rateLimit = await prisma.apiRateLimit.findUnique({
            where: { userId: apiKeyRecord.userId }
        });

        if (rateLimit) {
            // Check daily and monthly limits
            const now = new Date();
            const dailyReset = new Date(rateLimit.lastResetDaily);
            const monthlyReset = new Date(rateLimit.lastResetMonthly);

            // Reset daily limit if needed
            if (now.getDate() !== dailyReset.getDate()) {
                await prisma.apiRateLimit.update({
                    where: { userId: apiKeyRecord.userId },
                    data: {
                        dailyUsed: 0,
                        lastResetDaily: now
                    }
                });
            }

            // Reset monthly limit if needed
            if (now.getMonth() !== monthlyReset.getMonth()) {
                await prisma.apiRateLimit.update({
                    where: { userId: apiKeyRecord.userId },
                    data: {
                        monthlyUsed: 0,
                        lastResetMonthly: now
                    }
                });
            }

            // Check daily limit
            if (rateLimit.dailyUsed >= rateLimit.dailyLimit) {
                return {
                    valid: false,
                    error: 'Daily API call limit exceeded'
                };
            }

            // Check monthly limit
            if (rateLimit.monthlyUsed >= rateLimit.monthlyLimit) {
                return {
                    valid: false,
                    error: 'Monthly API call limit exceeded'
                };
            }

            // Update rate limits
            await prisma.apiRateLimit.update({
                where: { userId: apiKeyRecord.userId },
                data: {
                    dailyUsed: { increment: 1 },
                    monthlyUsed: { increment: 1 }
                }
            });
        }

        // Log API usage
        await prisma.apiUsage.create({
            data: {
                userId: apiKeyRecord.userId,
                apiKeyId: apiKeyRecord.id,
                endpoint,
                status: 'success'
            }
        });

        return {
            valid: true,
            userId: apiKeyRecord.userId
        };
    } catch (error) {
        console.error('API key validation error:', error);
        return {
            valid: false,
            error: 'Internal server error during API key validation'
        };
    }
}

// Wrapper to handle API key validation for all API routes
export async function withApiAuth(
    req: NextRequest,
    handler: (req: NextRequest, userId: string) => Promise<NextResponse>,
    endpoint: string
) {
    // Validate API key
    const validationResult = await validateApiKey(req, endpoint);

    if (!validationResult.valid) {
        return NextResponse.json(
            { error: validationResult.error },
            { status: 401 }
        );
    }

    // Call the actual route handler with user ID
    return handler(req, validationResult.userId!);
}