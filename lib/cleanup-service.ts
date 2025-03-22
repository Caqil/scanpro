import { readdir, stat, unlink, rmdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configure all application directories that need cleanup
const DIRECTORIES = {
    // Upload directories
    UPLOAD_DIR: join(process.cwd(), 'uploads'),
    TEMP_DIR: join(process.cwd(), 'temp'),

    // Public output directories
    CONVERSIONS_DIR: join(process.cwd(), 'public', 'conversions'),
    MERGES_DIR: join(process.cwd(), 'public', 'merges'),
    SPLITS_DIR: join(process.cwd(), 'public', 'splits'),
    COMPRESSIONS_DIR: join(process.cwd(), 'public', 'compressions'),
    ROTATIONS_DIR: join(process.cwd(), 'public', 'rotations'),
    WATERMARKS_DIR: join(process.cwd(), 'public', 'watermarks'),
    PROTECTED_DIR: join(process.cwd(), 'public', 'protected'),
    UNLOCKED_DIR: join(process.cwd(), 'public', 'unlocked'),
    SIGNATURES_DIR: join(process.cwd(), 'public', 'signatures'),
    OCR_DIR: join(process.cwd(), 'public', 'ocr'),
    EDITED_DIR: join(process.cwd(), 'public', 'edited'),
    PROCESSED_DIR: join(process.cwd(), 'public', 'processed')
};

interface CleanupResult {
    success: boolean;
    message?: string;
    error?: string;
    stats?: {
        [key: string]: number;
        totalBytes: number;
    };
}

interface DirectoryCleanupResult {
    filesDeleted: number;
    bytesFreed: number;
}

/**
 * Clean up files older than the specified time across all application directories
 * @param maxAgeMinutes Time in minutes after which files should be deleted
 * @param tempMaxAgeMinutes Shorter time in minutes for temporary files
 * @returns Cleanup results with statistics
 */
export async function cleanupFiles(
    maxAgeMinutes: number = 1440, // Default: 24 hours for regular files
    tempMaxAgeMinutes: number = 60 // Default: 1 hour for temporary files
): Promise<CleanupResult> {
    try {
        const now = Date.now();
        const regularCutoff = now - (maxAgeMinutes * 60 * 1000);
        const tempCutoff = now - (tempMaxAgeMinutes * 60 * 1000);

        // Initialize stats tracking with dynamic keys
        const stats: { [key: string]: number; totalBytes: number } = {
            totalBytes: 0
        };

        // Categorize directories by cutoff time
        const tempDirectories = [DIRECTORIES.TEMP_DIR, DIRECTORIES.UPLOAD_DIR];
        const regularDirectories = Object.values(DIRECTORIES).filter(dir => !tempDirectories.includes(dir));

        // Clean temporary directories with shorter threshold
        for (const dir of tempDirectories) {
            if (existsSync(dir)) {
                const dirName = Object.keys(DIRECTORIES).find(key => DIRECTORIES[key as keyof typeof DIRECTORIES] === dir) || 'unknown';
                const statKey = `${dirName.toLowerCase().replace('_dir', '')}Deleted`;

                const result = await cleanupDirectory(dir, tempCutoff, true);
                stats[statKey] = result.filesDeleted;
                stats.totalBytes += result.bytesFreed;

                console.log(`Cleaned ${dir} (${result.filesDeleted} files, ${formatBytes(result.bytesFreed)})`);
            }
        }

        // Clean regular directories with standard threshold
        for (const dir of regularDirectories) {
            if (existsSync(dir)) {
                const dirName = Object.keys(DIRECTORIES).find(key => DIRECTORIES[key as keyof typeof DIRECTORIES] === dir) || 'unknown';
                const statKey = `${dirName.toLowerCase().replace('_dir', '')}Deleted`;

                const result = await cleanupDirectory(dir, regularCutoff, false);
                stats[statKey] = result.filesDeleted;
                stats.totalBytes += result.bytesFreed;

                console.log(`Cleaned ${dir} (${result.filesDeleted} files, ${formatBytes(result.bytesFreed)})`);
            }
        }

        return {
            success: true,
            message: `Cleanup completed. Removed regular files older than ${maxAgeMinutes} minutes and temporary files older than ${tempMaxAgeMinutes} minutes.`,
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

/**
 * Clean up files in a specific directory
 * @param directory The directory path to clean
 * @param cutoffTime Timestamp before which files should be deleted
 * @param removeEmptyDirectories Whether to remove empty subdirectories
 * @returns Statistics about deleted files
 */
async function cleanupDirectory(
    directory: string,
    cutoffTime: number,
    removeEmptyDirectories: boolean = false
): Promise<DirectoryCleanupResult> {
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

        return { filesDeleted, bytesFreed };
    } catch (error) {
        console.error(`Error cleaning up directory ${directory}:`, error);
        throw error;
    }
}

/**
 * Format bytes into a human-readable string
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Run the cleanup job on a schedule
 * @param intervalMinutes How often to run the cleanup (in minutes)
 * @param maxAgeMinutes How old files should be before cleanup
 * @param tempMaxAgeMinutes How old temporary files should be before cleanup
 */
export function scheduleCleanup(
    intervalMinutes: number = 60,
    maxAgeMinutes: number = 1440,
    tempMaxAgeMinutes: number = 60
): NodeJS.Timeout {
    console.log(`Scheduling cleanup to run every ${intervalMinutes} minutes`);

    // Run immediately on startup
    cleanupFiles(maxAgeMinutes, tempMaxAgeMinutes).then(result => {
        console.log('Initial cleanup complete:',
            result.success ?
                `Deleted files totaling ${formatBytes(result.stats?.totalBytes || 0)}` :
                `Failed: ${result.error}`
        );
    });

    // Schedule regular cleanup
    return setInterval(async () => {
        try {
            const result = await cleanupFiles(maxAgeMinutes, tempMaxAgeMinutes);
            console.log('Scheduled cleanup complete:',
                result.success ?
                    `Deleted files totaling ${formatBytes(result.stats?.totalBytes || 0)}` :
                    `Failed: ${result.error}`
            );
        } catch (error) {
            console.error('Error in scheduled cleanup:', error);
        }
    }, intervalMinutes * 60 * 1000);
}