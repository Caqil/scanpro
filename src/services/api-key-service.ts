// src/services/api-key-service.ts
import { PrismaClient, ApiKey } from '@prisma/client';
import { generateApiKey, hashApiKey, verifyApiKey, getKeyPrefix } from '@/lib/api-keys';

const prisma = new PrismaClient();

export interface CreateApiKeyParams {
    userId: string;
    name: string;
    permissions?: any;
    expiresAt?: Date;
}

export interface ApiKeyResponse {
    id: string;
    name: string;
    prefix: string;
    key?: string; // Only included when a key is first created
    isEnabled: boolean;
    permissions: any;
    lastUsed: Date | null;
    expiresAt: Date | null;
    createdAt: Date;
}

export class ApiKeyService {
    /**
     * Create a new API key for a user
     */
    static async createApiKey({ userId, name, permissions = {}, expiresAt }: CreateApiKeyParams): Promise<ApiKeyResponse> {
        // Generate a secure API key
        const { key, prefix, hashedKey } = generateApiKey();

        // Create the API key in the database
        const apiKey = await prisma.apiKey.create({
            data: {
                name,
                key,
                prefix,
                hashedKey,
                userId,
                permissions,
                expiresAt,
            },
        });

        // Return the API key (including the raw key which we won't store in plaintext)
        return {
            id: apiKey.id,
            name: apiKey.name,
            prefix: apiKey.prefix,
            key, // This is the only time we'll return the full key
            isEnabled: apiKey.isEnabled,
            permissions: apiKey.permissions,
            lastUsed: apiKey.lastUsed,
            expiresAt: apiKey.expiresAt,
            createdAt: apiKey.createdAt,
        };
    }

    /**
     * Get all API keys for a user
     */
    static async getApiKeys(userId: string): Promise<ApiKeyResponse[]> {
        const apiKeys = await prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return apiKeys.map(key => ({
            id: key.id,
            name: key.name,
            prefix: key.prefix,
            isEnabled: key.isEnabled,
            permissions: key.permissions,
            lastUsed: key.lastUsed,
            expiresAt: key.expiresAt,
            createdAt: key.createdAt,
        }));
    }

    /**
     * Disable an API key
     */
    static async disableApiKey(keyId: string, userId: string): Promise<boolean> {
        const result = await prisma.apiKey.updateMany({
            where: {
                id: keyId,
                userId, // Ensure the key belongs to this user
            },
            data: {
                isEnabled: false,
            },
        });

        return result.count > 0;
    }

    /**
     * Delete an API key
     */
    static async deleteApiKey(keyId: string, userId: string): Promise<boolean> {
        const result = await prisma.apiKey.deleteMany({
            where: {
                id: keyId,
                userId, // Ensure the key belongs to this user
            },
        });

        return result.count > 0;
    }

    /**
     * Validate an API key from a request
     */
    // src/services/api-key-service.ts
static async validateApiKey(apiKey: string): Promise<ApiKey | null> {
    console.log(`Attempting to validate API key: ${apiKey.substring(0, 12)}...`);
    
    try {
      // Get the prefix from the key
      const prefix = getKeyPrefix(apiKey);
      console.log(`Extracted prefix: ${prefix}`);
      
      if (!prefix) {
        console.log('Invalid API key format (no prefix)');
        return null;
      }
  
      // Look up the key by prefix
      console.log(`Looking up key with prefix: ${prefix}`);
      const storedKey = await prisma.apiKey.findUnique({
        where: { prefix },
      });
  
      if (!storedKey) {
        console.log(`No API key found with prefix: ${prefix}`);
        return null;
      }
  
      console.log(`Found key: ${storedKey.id}, enabled: ${storedKey.isEnabled}`);
      
      if (!storedKey.isEnabled) {
        console.log(`API key is disabled: ${prefix}`);
        return null;
      }
  
      // Check if key is expired
      if (storedKey.expiresAt && new Date() > storedKey.expiresAt) {
        console.log(`API key expired: ${prefix}, expires: ${storedKey.expiresAt}`);
        await prisma.apiKey.update({
          where: { id: storedKey.id },
          data: { isEnabled: false },
        });
        return null;
      }
  
      // Verify the key
      console.log(`Verifying key hash...`);
      const isValid = verifyApiKey(apiKey, storedKey.hashedKey);
      console.log(`Key verification result: ${isValid}`);
      
      if (!isValid) {
        return null;
      }
  
      // Success!
      console.log(`API key validation successful: ${prefix}`);
      return storedKey;
    } catch (error) {
      console.error("Error validating API key:", error);
      return null;
    }
  }

    /**
     * Log API usage
     */
    static async logApiUsage(
        apiKeyId: string,
        userId: string,
        endpoint: string,
        method: string,
        statusCode: number,
        ipAddress?: string,
        userAgent?: string,
        requestBody?: any
    ): Promise<void> {
        await prisma.apiUsage.create({
            data: {
                userId,
                apiKeyId,
                endpoint,
                method,
                statusCode,
                ipAddress,
                userAgent,
                requestBody,
            },
        });

        // Also update the API key's last used timestamp
        await prisma.apiKey.update({
            where: { id: apiKeyId },
            data: { lastUsed: new Date() },
        });
    }

    /**
     * Get usage statistics for a user
     */
    static async getApiUsageStats(userId: string, days: number = 30): Promise<any> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const usageByDay = await prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM "ApiUsage"
      WHERE "userId" = ${userId}
        AND timestamp >= ${startDate}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;

        const usageByEndpoint = await prisma.$queryRaw`
      SELECT 
        endpoint,
        COUNT(*) as count
      FROM "ApiUsage"
      WHERE "userId" = ${userId}
        AND timestamp >= ${startDate}
      GROUP BY endpoint
      ORDER BY count DESC
    `;

        return {
            totalRequests: await prisma.apiUsage.count({
                where: {
                    userId,
                    timestamp: { gte: startDate },
                },
            }),
            usageByDay,
            usageByEndpoint,
        };
    }
}