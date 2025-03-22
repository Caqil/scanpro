// Create this file at: ~/scanpro/dist/scripts/cleanup-job.js

const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');

// Configure all application directories that need cleanup
const DIRECTORIES = {
    // Upload directories
    UPLOAD_DIR: path.join(process.cwd(), 'uploads'),
    TEMP_DIR: path.join(process.cwd(), 'temp'),

    // Public output directories
    CONVERSIONS_DIR: path.join(process.cwd(), 'public', 'conversions'),
    MERGES_DIR: path.join(process.cwd(), 'public', 'merges'),
    SPLITS_DIR: path.join(process.cwd(), 'public', 'splits'),
    COMPRESSIONS_DIR: path.join(process.cwd(), 'public', 'compressions'),
    ROTATIONS_DIR: path.join(process.cwd(), 'public', 'rotations'),
    WATERMARKS_DIR: path.join(process.cwd(), 'public', 'watermarks'),
    PROTECTED_DIR: path.join(process.cwd(), 'public', 'protected'),
    UNLOCKED_DIR: path.join(process.cwd(), 'public', 'unlocked'),
    SIGNATURES_DIR: path.join(process.cwd(), 'public', 'signatures'),
    OCR_DIR: path.join(process.cwd(), 'public', 'ocr'),
    EDITED_DIR: path.join(process.cwd(), 'public', 'edited'),
    PROCESSED_DIR: path.join(process.cwd(), 'public', 'processed')
};

/**
 * Clean up files in a specific directory
 */
async function cleanupDirectory(
    directory,
    cutoffTime,
    removeEmptyDirectories = false
) {
    try {
        // Get all files in directory
        const entries = await fs.readdir(directory, { withFileTypes: true });
        let filesDeleted = 0;
        let bytesFreed = 0;

        // Track subdirectories for potential removal if they become empty
        const subdirectories = [];

        // Process each file
        for (const entry of entries) {
            const entryPath = path.join(directory, entry.name);

            try {
                if (entry.isDirectory() && removeEmptyDirectories) {
                    // Recursively clean up subdirectory
                    subdirectories.push(entryPath);
                    const subResult = await cleanupDirectory(entryPath, cutoffTime, true);
                    filesDeleted += subResult.filesDeleted;
                    bytesFreed += subResult.bytesFreed;
                } else if (entry.isFile()) {
                    // Get file stats
                    const fileStats = await fs.stat(entryPath);

                    // Check if file is older than cutoff
                    if (fileStats.mtimeMs < cutoffTime) {
                        // Delete file
                        await fs.unlink(entryPath);
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
                    const remaining = await fs.readdir(subdir);
                    if (remaining.length === 0) {
                        await fs.rmdir(subdir);
                    }
                } catch (error) {
                    console.error(`Error removing directory ${subdir}:`, error);
                }
            }
        }

        return { filesDeleted, bytesFreed };
    } catch (error) {
        console.error(`Error cleaning up directory ${directory}:`, error);
        return { filesDeleted: 0, bytesFreed: 0 };
    }
}

/**
 * Format bytes into a human-readable string
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Clean up files older than the specified time across all application directories
 */
async function cleanupFiles(
    maxAgeMinutes = 1440, // Default: 24 hours for regular files
    tempMaxAgeMinutes = 60 // Default: 1 hour for temporary files
) {
    try {
        const now = Date.now();
        const regularCutoff = now - (maxAgeMinutes * 60 * 1000);
        const tempCutoff = now - (tempMaxAgeMinutes * 60 * 1000);

        // Initialize stats tracking with dynamic keys
        const stats = {
            totalBytes: 0
        };

        // Categorize directories by cutoff time
        const tempDirectories = [DIRECTORIES.TEMP_DIR, DIRECTORIES.UPLOAD_DIR];
        const regularDirectories = Object.values(DIRECTORIES).filter(dir => !tempDirectories.includes(dir));

        console.log(`Starting cleanup with cutoffs: temp=${tempMaxAgeMinutes}min, regular=${maxAgeMinutes}min`);

        // Clean temporary directories with shorter threshold
        for (const dir of tempDirectories) {
            if (existsSync(dir)) {
                const dirName = Object.keys(DIRECTORIES).find(key => DIRECTORIES[key] === dir) || 'unknown';
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
                const dirName = Object.keys(DIRECTORIES).find(key => DIRECTORIES[key] === dir) || 'unknown';
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

// The main function that will be run by PM2
async function runCleanup() {
    console.log('Starting scheduled cleanup job...');

    try {
        const result = await cleanupFiles(1440, 60); // 24h for regular files, 1h for temp files

        if (result.success) {
            console.log(`Cleanup completed successfully. Freed ${formatBytes(result.stats.totalBytes)}`);
            console.log('Cleanup details:', result.stats);
        } else {
            console.error('Cleanup failed:', result.error);
        }
    } catch (error) {
        console.error('Unhandled error during cleanup:', error);
    }

    // Exit process when done (PM2 will restart it according to schedule)
    process.exit(0);
}

// Run the cleanup
runCleanup();