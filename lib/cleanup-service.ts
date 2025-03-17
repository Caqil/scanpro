import { readdir, stat, unlink, rmdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configure directories 
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const CONVERSION_DIR = join(process.cwd(), 'public', 'conversions');
const TEMP_DIR = join(process.cwd(), 'temp-conversions');

interface CleanupResult {
    success: boolean;
    message?: string;
    error?: string;
    stats?: {
        uploadsDeleted: number;
        conversionsDeleted: number;
        tempDeleted: number;
        totalBytes: number;
    };
}

// Clean up files older than the specified time
export async function cleanupFiles(maxAgeMinutes: number = 60): Promise<CleanupResult> {
    try {
        const now = Date.now();
        const cutoff = now - (maxAgeMinutes * 60 * 1000);
        let totalBytes = 0;

        // Stats tracking
        const stats = {
            uploadsDeleted: 0,
            conversionsDeleted: 0,
            tempDeleted: 0,
            totalBytes: 0
        };

        // Clean up upload directory
        if (existsSync(UPLOAD_DIR)) {
            const uploadsResult = await cleanupDirectory(UPLOAD_DIR, cutoff);
            stats.uploadsDeleted = uploadsResult.filesDeleted;
            stats.totalBytes += uploadsResult.bytesFreed;
        }

        // Clean up conversion directory
        if (existsSync(CONVERSION_DIR)) {
            const conversionsResult = await cleanupDirectory(CONVERSION_DIR, cutoff);
            stats.conversionsDeleted = conversionsResult.filesDeleted;
            stats.totalBytes += conversionsResult.bytesFreed;
        }

        // Clean up temporary conversion directory - use a shorter threshold for temp files
        // (e.g., 15 minutes for temp files instead of the full maxAgeMinutes)
        if (existsSync(TEMP_DIR)) {
            const tempCutoff = now - (15 * 60 * 1000); // 15 minutes for temp files
            const tempResult = await cleanupDirectory(TEMP_DIR, tempCutoff, true);
            stats.tempDeleted = tempResult.filesDeleted;
            stats.totalBytes += tempResult.bytesFreed;
        }

        return {
            success: true,
            message: `Cleanup completed. Removed files older than ${maxAgeMinutes} minutes.`,
            stats
        };
    } catch (error) {
        console.error('Cleanup error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred during cleanup'
        };
    }
}

// Clean up files in a directory
async function cleanupDirectory(
    directory: string,
    cutoffTime: number,
    removeEmptyDirectories: boolean = false
): Promise<{ filesDeleted: number; bytesFreed: number }> {
    try {
        // Get all files in directory
        const entries = await readdir(directory, { withFileTypes: true });
        let filesDeleted = 0;
        let bytesFreed = 0;

        // Track subdirectories for potential removal if they become empty
        const subdirectories: string[] = [];

        // Process each file
        for (const entry of entries) {
            const entryPath = join(directory, entry.name);

            try {
                if (entry.isDirectory() && removeEmptyDirectories) {
                    // Recursively clean up subdirectory
                    subdirectories.push(entryPath);
                    const subResult = await cleanupDirectory(entryPath, cutoffTime, true);
                    filesDeleted += subResult.filesDeleted;
                    bytesFreed += subResult.bytesFreed;
                } else if (entry.isFile()) {
                    // Get file stats
                    const fileStats = await stat(entryPath);

                    // Check if file is older than cutoff
                    if (fileStats.mtimeMs < cutoffTime) {
                        // Delete file
                        await unlink(entryPath);
                        filesDeleted++;
                        bytesFreed += fileStats.size;
                    }
                }
            } catch (error) {
                console.error(`Error processing ${entry.name}:`, error);
                // Continue with other files even if there's an error
            }
        }

        // Remove empty directories if specified
        if (removeEmptyDirectories) {
            for (const subdir of subdirectories) {
                try {
                    const remaining = await readdir(subdir);
                    if (remaining.length === 0) {
                        await rmdir(subdir);
                    }
                } catch (error) {
                    console.error(`Error removing directory ${subdir}:`, error);
                }
            }
        }

        console.log(`Deleted ${filesDeleted} files (${bytesFreed} bytes) from ${directory}`);
        return { filesDeleted, bytesFreed };
    } catch (error) {
        console.error(`Error cleaning up directory ${directory}:`, error);
        throw error;
    }
}