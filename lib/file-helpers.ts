// lib/file-helpers.ts
import { stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { RedisCache } from './redis-cache';

const fileCache = new RedisCache('scanpro:files');

/**
 * Get file metadata with caching
 */
export async function getFileMetadata(folder: string, filename: string) {
  const cacheKey = `metadata:${folder}:${filename}`;
  
  return fileCache.getOrSet(
    cacheKey,
    async () => {
      const filePath = join(process.cwd(), 'public', folder, filename);
      
      if (!existsSync(filePath)) {
        throw new Error('File not found');
      }
      
      const stats = await stat(filePath);
      
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: filePath,
        exists: true
      };
    },
    3600 // Cache for 1 hour
  );
}

/**
 * Check if a file exists with caching
 */
export async function checkFileExists(folder: string, filename: string): Promise<boolean> {
  const cacheKey = `exists:${folder}:${filename}`;
  
  return fileCache.getOrSet(
    cacheKey,
    async () => {
      const filePath = join(process.cwd(), 'public', folder, filename);
      return existsSync(filePath);
    },
    3600 // Cache for 1 hour
  );
}