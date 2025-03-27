// app/api/convert/admin/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cleanupFiles } from '@/lib/cleanup-service';
import { writeFile, mkdir, readFile, access } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

// Path to store admin keys
const ADMIN_KEYS_PATH = join(process.cwd(), 'data', 'admin-keys.json');

// Generate a cryptographically secure random API key
function generateApiKey(): string {
    return randomBytes(32).toString('hex');
}

// Ensure data directory and initial admin keys exist
async function ensureInitialAdminKeys(): Promise<string[]> {
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
    }

    // Check if keys file exists and has content
    try {
        if (existsSync(ADMIN_KEYS_PATH)) {
            const fileContent = await readFile(ADMIN_KEYS_PATH, 'utf-8');
            const existingKeys = JSON.parse(fileContent);
            if (Array.isArray(existingKeys) && existingKeys.length > 0) {
                return existingKeys;
            }
        }
    } catch (error) {
        console.error('Error reading existing admin keys:', error);
    }

    // Generate 3 initial admin keys
    const initialKeys = [
        generateApiKey(),
        generateApiKey(),
        generateApiKey()
    ];

    // Write initial keys to file
    await writeFile(ADMIN_KEYS_PATH, JSON.stringify(initialKeys, null, 2), 'utf-8');

    // Log the generated keys (only during initial setup)
    console.log('🔐 Initial Admin API Keys:');
    initialKeys.forEach((key, index) => {
        console.log(`Admin Key ${index + 1}: ${key}`);
    });

    return initialKeys;
}

// Parse comma-separated or array of admin API keys from environment
function parseAdminApiKeys(keys: string | undefined): string[] {
    if (!keys) return [];

    // Split by comma and trim
    return keys.split(',')
        .map(key => key.trim())
        .filter(key => key);
}

// Read admin keys from file or environment
async function getAdminKeys(): Promise<string[]> {
    // First, ensure initial keys exist
    const fileKeys = await ensureInitialAdminKeys();

    // Get keys from environment variables
    const envKeys = [
        ...(parseAdminApiKeys(process.env.ADMIN_API_KEYS) || []),
        ...(parseAdminApiKeys(process.env.ADMIN_API_KEY) || [])
    ];

    // Combine and remove duplicates
    return [...new Set([...fileKeys, ...envKeys])];
}

// Save admin keys to file
async function saveAdminKeys(keys: string[]) {
    const uniqueKeys = [...new Set(keys)]; // Remove duplicates
    await writeFile(ADMIN_KEYS_PATH, JSON.stringify(uniqueKeys, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
    try {
        // Get admin API keys
        const adminApiKeys = await getAdminKeys();

        // Check API key
        const providedKey = request.headers.get('x-api-key');

        // Check if the provided key is in the list of valid admin keys
        if (!providedKey || !adminApiKeys.includes(providedKey)) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid API key' },
                { status: 401 }
            );
        }

        // Get max age from query string or use default
        const searchParams = request.nextUrl.searchParams;
        const maxAgeMinutes = parseInt(searchParams.get('maxAge') || '60');

        // Run cleanup
        const result = await cleanupFiles(maxAgeMinutes);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Cleanup API error:', error);

        return NextResponse.json(
            { error: 'Failed to run cleanup' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get current admin keys
        const currentKeys = await getAdminKeys();

        // Check existing admin keys
        const providedKey = request.headers.get('x-api-key');
        if (!providedKey || !currentKeys.includes(providedKey)) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid API key' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { action, key } = body;

        // Validate required fields
        if (!action || !['add', 'remove'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be "add" or "remove".' },
                { status: 400 }
            );
        }

        // Add or remove key
        let updatedKeys: string[];
        if (action === 'add') {
            if (!key || typeof key !== 'string' || key.trim() === '') {
                return NextResponse.json(
                    { error: 'Invalid key. Key must be a non-empty string.' },
                    { status: 400 }
                );
            }
            // Add key if not already exists
            updatedKeys = [...new Set([...currentKeys, key.trim()])];
        } else {
            // Prevent removing the last key
            if (currentKeys.length <= 1) {
                return NextResponse.json(
                    { error: 'Cannot remove the last admin key.' },
                    { status: 400 }
                );
            }
            // Remove key
            updatedKeys = currentKeys.filter(k => k !== key);
        }

        // Save updated keys
        await saveAdminKeys(updatedKeys);

        return NextResponse.json({
            success: true,
            message: `Key successfully ${action}ed`,
            totalKeys: updatedKeys.length
        });
    } catch (error) {
        console.error('Admin key management error:', error);

        return NextResponse.json(
            { error: 'Failed to manage admin keys' },
            { status: 500 }
        );
    }
}