import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';

// Configure directories and retention periods
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const CONVERSION_DIR = join(process.cwd(), 'public', 'conversions');

// Clean up files older than the specified time
export async function cleanupFiles(maxAgeMinutes: number = 60) {
    try {
        const now = Date.now();
        const cutoff = now - (maxAgeMinutes * 60 * 1000);

        // Clean up upload directory
        await cleanupDirectory(UPLOAD_DIR, cutoff);

        // Clean up conversion directory
        await cleanupDirectory(CONVERSION_DIR, cutoff);

        return {
            success: true,
            message: `Cleanup completed. Removed files older than ${maxAgeMinutes} minutes.`
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
async function cleanupDirectory(directory: string, cutoffTime: number) {
    try {
        // Get all files in directory
        const files = await readdir(directory);
        let deletedCount = 0;

        // Process each file
        for (const file of files) {
            const filePath = join(directory, file);

            try {
                // Get file stats
                const fileStats = await stat(filePath);

                // Check if file is older than cutoff
                if (fileStats.isFile() && fileStats.mtimeMs < cutoffTime) {
                    // Delete file
                    await unlink(filePath);
                    deletedCount++;
                }
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
                // Continue with other files even if there's an error
            }
        }

        console.log(`Deleted ${deletedCount} files from ${directory}`);
        return deletedCount;
    } catch (error) {
        console.error(`Error cleaning up directory ${directory}:`, error);
        throw error;
    }
}