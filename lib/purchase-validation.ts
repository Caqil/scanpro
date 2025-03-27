// lib/purchase-validation.ts
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { existsSync } from 'fs';

// Define the path for storing validated purchase codes
const DATA_DIR = path.join(process.cwd(), 'data');
const PURCHASE_CODES_FILE = path.join(DATA_DIR, 'purchase-codes.json');
const API_KEYS_FILE = path.join(DATA_DIR, 'apikeys.json');

// Define types
export interface PurchaseCode {
  code: string;
  email: string;
  validated: boolean;
  validatedAt?: string;
  apiKeyId?: string;
}

export interface ApiKey {
  id: string;
  key: string;
  purchaseCode: string;
  email: string;
  createdAt: string;
  lastUsed?: string;
}

// Ensure the data directory exists
async function ensureDirectory() {
  if (!existsSync(DATA_DIR)) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  
  if (!existsSync(PURCHASE_CODES_FILE)) {
    await fs.writeFile(PURCHASE_CODES_FILE, JSON.stringify([]));
  }
  
  if (!existsSync(API_KEYS_FILE)) {
    await fs.writeFile(API_KEYS_FILE, JSON.stringify([]));
  }
}

// Load purchase codes
async function loadPurchaseCodes(): Promise<PurchaseCode[]> {
  await ensureDirectory();
  
  try {
    const data = await fs.readFile(PURCHASE_CODES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading purchase codes:', error);
    return [];
  }
}

// Save purchase codes
async function savePurchaseCodes(codes: PurchaseCode[]): Promise<void> {
  await ensureDirectory();
  
  try {
    await fs.writeFile(PURCHASE_CODES_FILE, JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error('Error saving purchase codes:', error);
    throw new Error('Failed to save purchase codes');
  }
}

// Load API keys
async function loadApiKeys(): Promise<ApiKey[]> {
  await ensureDirectory();
  
  try {
    const data = await fs.readFile(API_KEYS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading API keys:', error);
    return [];
  }
}

// Save API keys
async function saveApiKeys(apiKeys: ApiKey[]): Promise<void> {
  await ensureDirectory();
  
  try {
    await fs.writeFile(API_KEYS_FILE, JSON.stringify(apiKeys, null, 2));
  } catch (error) {
    console.error('Error saving API keys:', error);
    throw new Error('Failed to save API keys');
  }
}

// Format validation for purchase code (basic check)
function isValidFormat(code: string): boolean {
  // Purchase codes typically have a specific format, but this is just a basic check
  // Envato purchase codes are usually in format: 8 chars - 4 chars - 4 chars - 4 chars - 12 chars
  const pattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return pattern.test(code);
}

// Check if purchase code is already registered
export async function isPurchaseCodeRegistered(code: string): Promise<boolean> {
  const purchaseCodes = await loadPurchaseCodes();
  return purchaseCodes.some(p => p.code === code);
}

// Check if purchase code has already been validated
export async function isPurchaseCodeValidated(code: string): Promise<boolean> {
  const purchaseCodes = await loadPurchaseCodes();
  const purchaseCode = purchaseCodes.find(p => p.code === code);
  return purchaseCode ? purchaseCode.validated : false;
}

// Generate a new API key
export function generateApiKey(): string {
  // Generate a cryptographically secure random string
  return `sk_${crypto.randomBytes(24).toString('hex')}`;
}

// Validate purchase code against Envato API (in a real implementation)
// Here we simulate a validation with format check only
export async function validatePurchaseCode(code: string, email: string): Promise<{
  valid: boolean;
  message: string;
}> {
  // Format validation
  if (!isValidFormat(code)) {
    return {
      valid: false,
      message: 'Invalid purchase code format',
    };
  }
  
  // In a real implementation, you would validate against Envato API here
  // For demo purposes, we'll accept any code with valid format
  
  // Check if code is already registered
  const isRegistered = await isPurchaseCodeRegistered(code);
  if (isRegistered) {
    const isValidated = await isPurchaseCodeValidated(code);
    if (isValidated) {
      return {
        valid: false,
        message: 'This purchase code has already been used',
      };
    } else {
      // Code is registered but not validated yet, update email
      const purchaseCodes = await loadPurchaseCodes();
      const index = purchaseCodes.findIndex(p => p.code === code);
      if (index !== -1) {
        purchaseCodes[index].email = email;
        await savePurchaseCodes(purchaseCodes);
      }
    }
  } else {
    // Store the purchase code
    const purchaseCodes = await loadPurchaseCodes();
    purchaseCodes.push({
      code,
      email,
      validated: false,
    });
    await savePurchaseCodes(purchaseCodes);
  }
  
  // For demo, we'll simulate a "successful" validation
  return {
    valid: true,
    message: 'Purchase code validated successfully',
  };
}

// Mark a purchase code as validated and generate an API key
export async function validateAndGenerateApiKey(code: string, email: string): Promise<{
  success: boolean;
  apiKey?: ApiKey;
  message: string;
}> {
  try {
    // First, validate the purchase code
    const validation = await validatePurchaseCode(code, email);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
      };
    }
    
    // Check if code is already associated with an API key
    const apiKeys = await loadApiKeys();
    const existingApiKey = apiKeys.find(key => key.purchaseCode === code);
    
    if (existingApiKey) {
      return {
        success: false,
        message: 'An API key has already been generated for this purchase code',
      };
    }
    
    // Mark purchase code as validated
    const purchaseCodes = await loadPurchaseCodes();
    const purchaseCodeIndex = purchaseCodes.findIndex(p => p.code === code);
    
    if (purchaseCodeIndex === -1) {
      return {
        success: false,
        message: 'Purchase code not found',
      };
    }
    
    // Create a new API key
    const newApiKey: ApiKey = {
      id: crypto.randomUUID(),
      key: generateApiKey(),
      purchaseCode: code,
      email,
      createdAt: new Date().toISOString(),
    };
    
    // Update purchase code with API key ID
    purchaseCodes[purchaseCodeIndex].validated = true;
    purchaseCodes[purchaseCodeIndex].validatedAt = new Date().toISOString();
    purchaseCodes[purchaseCodeIndex].apiKeyId = newApiKey.id;
    
    // Save both
    apiKeys.push(newApiKey);
    await saveApiKeys(apiKeys);
    await savePurchaseCodes(purchaseCodes);
    
    return {
      success: true,
      apiKey: newApiKey,
      message: 'API key generated successfully',
    };
  } catch (error) {
    console.error('Error generating API key:', error);
    return {
      success: false,
      message: 'An error occurred while generating the API key',
    };
  }
}

// Validate an API key
export async function validateApiKey(key: string): Promise<ApiKey | null> {
  const apiKeys = await loadApiKeys();
  const apiKey = apiKeys.find(apiKey => apiKey.key === key);
  
  if (!apiKey) {
    return null;
  }
  
  // Update last used timestamp
  apiKey.lastUsed = new Date().toISOString();
  await saveApiKeys(apiKeys);
  
  return apiKey;
}

// Get API key for purchase code
export async function getApiKeyForPurchaseCode(code: string): Promise<ApiKey | null> {
  const apiKeys = await loadApiKeys();
  return apiKeys.find(key => key.purchaseCode === code) || null;
}

// List API keys associated with an email
export async function getApiKeysByEmail(email: string): Promise<ApiKey[]> {
  const apiKeys = await loadApiKeys();
  return apiKeys.filter(key => key.email.toLowerCase() === email.toLowerCase());
}