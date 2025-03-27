// lib/cleanup-service.ts
import { unlink, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Directories to clean up
const DIRECTORIES = [
    join(process.cwd(), 'uploads'),
    join(process.cwd(), 'public', 'conversions'),
    join(process.cwd(), 'public', 'compressions'),
    join(process.cwd(), 'public', 'merges'),
    join(process.cwd(), 'public', 'splits'),
    join(process.cwd(), 'public', 'rotations'),
    join(process.cwd(), 'public', 'watermarks'),
    join(process.cwd(), 'public', 'protected'),
    join(process.cwd(), 'public', 'unlocked'),
    join(process.cwd(), 'public', 'edited'),
    join(process.cwd(), 'public', 'zips'),
    join(process.cwd(), 'temp'),
];

export async function cleanupFiles(maxAgeMinutes: number = 60) {
    try {
        const now = Date.now();
        const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds

        let totalCleaned = 0;
        const results: Record<string, number> = {};

        // Process each directory
        for (const dir of DIRECTORIES) {
            if (!existsSync(dir)) {
                continue;
            }

            try {
                const files = await readdir(dir);
                let dirCleaned = 0;

                for (const file of files) {
                    const filePath = join(dir, file);

                    try {
                        const fileStat = await stat(filePath);

                        // Skip directories
                        if (fileStat.isDirectory()) {
                            continue;
                        }

                        // Check if file is older than maxAge
                        const fileAge = now - fileStat.mtimeMs;

                        if (fileAge > maxAge) {
                            await unlink(filePath);
                            dirCleaned++;
                            totalCleaned++;
                        }
                    } catch (fileError) {
                        console.warn(`Error processing file ${filePath}:`, fileError);
                    }
                }

                results[dir] = dirCleaned;
            } catch (dirError) {
                console.error(`Error reading directory ${dir}:`, dirError);
            }
        }

        return {
            success: true,
            totalCleaned,
            results
        };
    } catch (error) {
        console.error('Cleanup error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}