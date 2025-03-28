// lib/validate-key.ts
import { prisma } from '@/lib/prisma';

// In-memory API key cache to reduce database load
interface CachedKeyInfo {
    userId: string;
    permissions: string[];
    tier: string;
    valid: boolean;
    timestamp: number;
    keyId: string;
}

const KEY_CACHE: Record<string, CachedKeyInfo> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Validates an API key directly against the database
 * This function is intended to be called from API endpoints
 */
export async function validateApiKey(apiKey: string, operation?: string): Promise<{
    valid: boolean;
    userId?: string;
    tier?: string;
    keyId?: string;
    error?: string;
}> {
    try {
        // Development shortcut for testing
        if (process.env.NODE_ENV !== 'production' && apiKey === 'test_key') {
            console.log('Using test key in development mode');
            return {
                valid: true,
                userId: 'test-user',
                tier: 'enterprise',
                keyId: 'test-key-id'
            };
        }

        // Check cache first for performance
        if (KEY_CACHE[apiKey] && Date.now() - KEY_CACHE[apiKey].timestamp < CACHE_TTL) {
            const cachedInfo = KEY_CACHE[apiKey];

            if (!cachedInfo.valid) {
                return {
                    valid: false,
                    error: 'Invalid API key'
                };
            }

            // Check operation permission if specified
            if (operation &&
                !cachedInfo.permissions.includes('*') &&
                !cachedInfo.permissions.includes(operation)) {
                return {
                    valid: false,
                    error: `API key doesn't have permission for ${operation}`
                };
            }

            return {
                valid: true,
                userId: cachedInfo.userId,
                tier: cachedInfo.tier,
                keyId: cachedInfo.keyId
            };
        }

        // Query database for API key
        const keyRecord = await prisma.apiKey.findUnique({
            where: { key: apiKey },
            include: {
                user: {
                    include: {
                        subscription: true
                    }
                }
            }
        });

        // Handle invalid key
        if (!keyRecord) {
            // Cache negative result to prevent repeated DB queries for invalid keys
            KEY_CACHE[apiKey] = {
                userId: '',
                permissions: [],
                tier: 'free',
                valid: false,
                timestamp: Date.now(),
                keyId: ''
            };

            return {
                valid: false,
                error: 'Invalid API key'
            };
        }

        // Handle expired key
        if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
            KEY_CACHE[apiKey] = {
                userId: keyRecord.userId,
                permissions: [],
                tier: 'free',
                valid: false,
                timestamp: Date.now(),
                keyId: keyRecord.id
            };

            return {
                valid: false,
                error: 'API key has expired'
            };
        }

        // Check permission for specific operation
        if (operation &&
            !keyRecord.permissions.includes('*') &&
            !keyRecord.permissions.includes(operation)) {
            return {
                valid: false,
                error: `API key doesn't have permission for ${operation}`
            };
        }

        // Update last used timestamp
        try {
            await prisma.apiKey.update({
                where: { id: keyRecord.id },
                data: { lastUsed: new Date() }
            });
        } catch (updateError) {
            // Non-blocking - log but don't fail validation if timestamp update fails
            console.error('Failed to update API key last used timestamp:', updateError);
        }

        // Cache successful validation
        const tier = keyRecord.user.subscription?.tier || 'free';
        KEY_CACHE[apiKey] = {
            userId: keyRecord.userId,
            permissions: keyRecord.permissions,
            tier,
            valid: true,
            timestamp: Date.now(),
            keyId: keyRecord.id
        };

        return {
            valid: true,
            userId: keyRecord.userId,
            tier,
            keyId: keyRecord.id
        };
    } catch (error) {
        console.error('Error validating API key:', error);

        // Emergency fallback in case of database failure
        if (process.env.EMERGENCY_KEY && apiKey === process.env.EMERGENCY_KEY) {
            console.log('Using emergency system key during database failure');
            return {
                valid: true,
                userId: 'system',
                tier: 'enterprise'
            };
        }

        return {
            valid: false,
            error: 'Error validating API key'
        };
    }
}

/**
 * Track API usage statistics
 * This is non-blocking and shouldn't affect API responses
 */
export async function trackApiUsage(userId: string, operation: string): Promise<void> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update usage statistics - fire and forget
        prisma.usageStats.upsert({
            where: {
                userId_operation_date: {
                    userId,
                    operation,
                    date: today
                }
            },
            update: {
                count: { increment: 1 }
            },
            create: {
                userId,
                operation,
                date: today,
                count: 1
            }
        }).catch(error => {
            console.error('Failed to update usage statistics:', error);
        });
    } catch (error) {
        // Non-blocking - log but don't affect API response
        console.error('Error tracking API usage:', error);
    }
}