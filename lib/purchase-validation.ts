// lib/purchase-validation.ts
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Define file path for storing API keys
const API_KEYS_FILE = path.join(process.cwd(), 'data', 'api-keys.json');

// Ensure data directory exists
const dataDir = path.dirname(API_KEYS_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Define types for API keys
interface ApiKey {
    key: string;
    email: string;
    purchaseCode: string;
    createdAt: string;
}

// In-memory store for API keys
let apiKeys: Record<string, ApiKey> = {};

// Load existing API keys from file
function loadApiKeys() {
    try {
        if (fs.existsSync(API_KEYS_FILE)) {
            const data = fs.readFileSync(API_KEYS_FILE, 'utf8');
            apiKeys = JSON.parse(data);
            console.log(`Loaded ${Object.keys(apiKeys).length} API keys from file`);
        } else {
            fs.writeFileSync(API_KEYS_FILE, JSON.stringify({}), 'utf8');
            console.log('Created empty API keys file');
        }
    } catch (error) {
        console.error('Error loading API keys:', error);
        apiKeys = {};
    }
}

// Initialize API keys on module load
loadApiKeys();

// Save API keys to file
function saveApiKeys() {
    try {
        fs.writeFileSync(API_KEYS_FILE, JSON.stringify(apiKeys, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving API keys:', error);
    }
}

/**
 * Validate a purchase code with the Envato API
 */
export async function validatePurchaseCode(
    purchaseCode: string,
    email: string
): Promise<{
    valid: boolean;
    message: string;
    buyer?: string;
    purchaseDate?: string;
}> {
    const personalToken = process.env.ENVATO_PERSONAL_TOKEN;
    const itemId = process.env.ENVATO_ITEM_ID;

    // In development without Envato API token, accept any purchase code
    if (process.env.NODE_ENV === 'development' && !personalToken) {
        console.warn('DEVELOPMENT MODE: Accepting purchase code without validation');
        return {
            valid: true,
            message: 'Development mode: Purchase code accepted',
            buyer: email,
            purchaseDate: new Date().toISOString()
        };
    }

    if (!personalToken) {
        console.error('Envato API token not configured');
        return {
            valid: false,
            message: 'API configuration error. Please contact support.'
        };
    }

    try {
        // Call Envato API to verify the purchase code
        const response = await axios.get(`https://api.envato.com/v3/market/buyer/purchase:${purchaseCode}`, {
            headers: {
                'Authorization': `Bearer ${personalToken}`,
                'Content-Type': 'application/json'
            }
        });

        const purchaseData = response.data;

        // Verify this is for the correct item
        if (!purchaseData || (itemId && purchaseData.item.id !== parseInt(itemId))) {
            return {
                valid: false,
                message: 'Invalid purchase code or not for this product'
            };
        }

        return {
            valid: true,
            message: 'Purchase code validated successfully',
            buyer: purchaseData.buyer,
            purchaseDate: purchaseData.sold_at
        };
    } catch (error) {
        console.error('Error validating purchase code:', error);

        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return {
                    valid: false,
                    message: 'Purchase code not found'
                };
            } else if (error.response?.status === 401) {
                return {
                    valid: false,
                    message: 'API authentication error'
                };
            }
        }

        return {
            valid: false,
            message: 'Error validating purchase code. Please try again later.'
        };
    }
}

/**
 * Generate a secure API key
 */
function generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Check if a purchase code has already been validated
 */
export async function isPurchaseCodeValidated(purchaseCode: string): Promise<boolean> {
    return !!apiKeys[purchaseCode];
}

/**
 * Get the API key for a purchase code
 */
export async function getApiKeyForPurchaseCode(purchaseCode: string): Promise<ApiKey | null> {
    const apiKey = apiKeys[purchaseCode];
    return apiKey || null;
}

/**
 * Validate a purchase code and generate an API key
 */
export async function validateAndGenerateApiKey(
    purchaseCode: string,
    email: string
): Promise<{
    success: boolean;
    message: string;
    apiKey?: { key: string; createdAt: Date };
}> {
    try {
        // Check if this purchase code already has an API key
        const existingKey = await getApiKeyForPurchaseCode(purchaseCode);

        if (existingKey) {
            // If email matches, return the existing key
            if (existingKey.email.toLowerCase() === email.toLowerCase()) {
                return {
                    success: true,
                    message: 'API key retrieved successfully',
                    apiKey: {
                        key: existingKey.key,
                        createdAt: new Date(existingKey.createdAt)
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'This purchase code is registered to a different email address'
                };
            }
        }

        // Validate the purchase code
        const validation = await validatePurchaseCode(purchaseCode, email);

        if (!validation.valid) {
            return {
                success: false,
                message: validation.message
            };
        }

        // Generate a new API key
        const apiKey = generateApiKey();
        const createdAt = new Date().toISOString();

        // Store the new API key
        apiKeys[purchaseCode] = {
            key: apiKey,
            email,
            purchaseCode,
            createdAt
        };

        // Save changes to file
        saveApiKeys();

        return {
            success: true,
            message: 'Purchase code validated and API key generated successfully',
            apiKey: {
                key: apiKey,
                createdAt: new Date(createdAt)
            }
        };
    } catch (error) {
        console.error('Error generating API key:', error);
        return {
            success: false,
            message: 'An error occurred while generating your API key'
        };
    }
}

/**
 * Verify if an API key is valid
 */
export async function verifyApiKey(apiKey: string): Promise<boolean> {
    // Check if this API key exists in our records
    return Object.values(apiKeys).some(key => key.key === apiKey);
}

/**
 * Get all API keys (admin function)
 */
export async function getAllApiKeys(): Promise<typeof apiKeys> {
    return { ...apiKeys };
}