// src/lib/api-keys.ts
import crypto from 'crypto';

/**
 * Generate a secure random API key with a prefix
 * Format: prefix_base62string
 */
export function generateApiKey(): { key: string; prefix: string; hashedKey: string } {
    // Create a prefix (first 8 characters will be visible to users)
    const prefix = 'scp_' + generateRandomString(8);

    // Generate a secure random string for the key
    const secretKey = generateRandomString(32);

    // Combine the prefix and key
    const key = `${prefix}_${secretKey}`;

    // Create a hash of the key for storage
    const hashedKey = hashApiKey(key);

    return { key, prefix, hashedKey };
}

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
    // Use crypto.randomBytes to generate a cryptographically secure random string
    // Convert to base62 (alphanumeric) to make it URL-safe
    return crypto
        .randomBytes(Math.ceil(length * 0.75))
        .toString('base64')
        .replace(/[+/]/g, '')  // Remove non-alphanumeric characters
        .slice(0, length);      // Trim to desired length
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(key: string): string {
    return crypto
        .createHash('sha256')
        .update(key)
        .digest('hex');
}

/**
 * Verify an API key against its hashed version
 */
export function verifyApiKey(providedKey: string, hashedKey: string): boolean {
    try {
        console.log(`Verifying API key: ${providedKey.substring(0, 10)}...`);
        console.log(`Stored hash (first 10 chars): ${hashedKey.substring(0, 10)}...`);

        const providedHashed = hashApiKey(providedKey);
        console.log(`Calculated hash (first 10 chars): ${providedHashed.substring(0, 10)}...`);

        // Use a constant-time comparison to prevent timing attacks
        const result = crypto.timingSafeEqual(
            Buffer.from(providedHashed, 'hex'),
            Buffer.from(hashedKey, 'hex')
        );

        console.log(`Hash comparison result: ${result}`);
        return result;
    } catch (error) {
        console.error("Error verifying API key:", error);
        return false;
    }
}
/**
 * Extract the prefix from an API key
 */
export function getKeyPrefix(apiKey: string): string | null {
    const parts = apiKey.split('_');
    if (parts.length >= 2) {
        return parts.slice(0, -1).join('_');
    }
    return null;
}