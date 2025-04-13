// app/api/pdf/split/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';

// Promisify exec for async/await
const execAsync = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const SPLIT_DIR = join(process.cwd(), 'public', 'splits');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(SPLIT_DIR)) {
        await mkdir(SPLIT_DIR, { recursive: true });
    }
}

// Parse page ranges from string format
function parsePageRanges(pagesString: string, totalPages: number): number[][] {
    const result: number[][] = [];

    // Split by commas
    const parts = pagesString.split(',');

    for (const part of parts) {
        const trimmedPart = part.trim();
        if (!trimmedPart) continue;

        // Check if it's a range (contains '-')
        if (trimmedPart.includes('-')) {
            const [startStr, endStr] = trimmedPart.split('-');
            const start = parseInt(startStr.trim());
            const end = parseInt(endStr.trim());

            if (!isNaN(start) && !isNaN(end) && start <= end) {
                // Add all pages in range (ensure within document bounds)
                const pagesInRange: number[] = [];
                for (let i = start; i <= Math.min(end, totalPages); i++) {
                    if (i > 0) {
                        pagesInRange.push(i);
                    }
                }
                if (pagesInRange.length > 0) {
                    result.push(pagesInRange);
                }
            }
        } else {
            // Single page number
            const pageNum = parseInt(trimmedPart);
            if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
                result.push([pageNum]);
            }
        }
    }

    return result;
}

// Get total pages using qpdf
async function getTotalPages(inputPath: string): Promise<number> {
    try {
        const { stdout } = await execAsync(`qpdf --show-npages "${inputPath}"`);
        return parseInt(stdout.trim(), 10);
    } catch (error) {
        throw new Error(`Failed to get page count: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Process PDF splitting with better handling for large files
async function splitPdfInBatches(
    inputPath: string, 
    pageSets: number[][], 
    sessionId: string,
    maxBatchSize: number = 10 // Process at most 10 splits at a time
): Promise<Array<{
    fileUrl: string;
    filename: string;
    pages: number[];
    pageCount: number;
}>> {
    const results = [];
    
    // Process in batches to avoid memory issues
    for (let batchStart = 0; batchStart < pageSets.length; batchStart += maxBatchSize) {
        const batchEnd = Math.min(batchStart + maxBatchSize, pageSets.length);
        console.log(`Processing batch ${batchStart} to ${batchEnd-1} of ${pageSets.length} splits`);
        
        // Process each batch sequentially
        const batchPromises = [];
        
        for (let i = batchStart; i < batchEnd; i++) {
            const pages = pageSets[i];
            const outputFileName = `${sessionId}-split-${i + 1}.pdf`;
            const outputPath = join(SPLIT_DIR, outputFileName);

            // Convert page numbers to qpdf range format
            const pageRange = pages.length === 1
                ? `${pages[0]}`
                : `${pages[0]}-${pages[pages.length - 1]}`;

            // Construct qpdf command
            const command = `qpdf "${inputPath}" --pages . ${pageRange} -- "${outputPath}"`;

            // Execute qpdf command and store the promise
            const processPromise = execAsync(command)
                .then(() => ({
                    fileUrl: `/api/file?folder=splits&filename=${outputFileName}`,
                    filename: outputFileName,
                    pages: pages,
                    pageCount: pages.length
                }))
                .catch(error => {
                    console.error(`Error processing split ${i + 1}:`, error);
                    throw error;
                });
            
            batchPromises.push(processPromise);
        }
        
        // Wait for all operations in this batch to complete
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches to ensure OS resources are released
        if (batchEnd < pageSets.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    return results;
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF splitting process...');
        // Get API key either from header or query parameter
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        // If this is a programmatic API call (not from web UI), validate the API key
        if (apiKey) {
            console.log('Validating API key for split operation');
            const validation = await validateApiKey(apiKey, 'split');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return new Response(
                    JSON.stringify({ error: validation.error || 'Invalid API key' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'split');
            }
        }
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const splitMethodRaw = formData.get('splitMethod') as string || 'range';
        const splitMethod = ['range', 'extract', 'every'].includes(splitMethodRaw) ? splitMethodRaw : 'range';

        // Get specific options based on the split method
        const pageRanges = formData.get('pageRanges') as string || '';
        const everyNPages = parseInt(formData.get('everyNPages') as string || '1');

        if (!file) {
            return new Response(
                JSON.stringify({ error: 'No PDF file provided' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return new Response(
                JSON.stringify({ error: 'Only PDF files can be split' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create session ID and file paths
        const sessionId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${sessionId}-input.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Get total pages using qpdf
        const totalPages = await getTotalPages(inputPath);

        console.log(`Loaded PDF with ${totalPages} pages`);

        // Determine which pages to extract/how to split based on method
        let pageSets: number[][] = [];

        if (splitMethod === 'range' && pageRanges) {
            // Custom page ranges
            pageSets = parsePageRanges(pageRanges, totalPages);
        } else if (splitMethod === 'extract') {
            // Extract each page as a separate PDF
            pageSets = Array.from({ length: totalPages }, (_, i) => [i + 1]);
        } else if (splitMethod === 'every') {
            // Split every N pages
            const n = Math.max(1, everyNPages || 1);
            for (let i = 1; i <= totalPages; i += n) {
                const end = Math.min(i + n - 1, totalPages);
                const pagesInRange = Array.from({ length: end - i + 1 }, (_, idx) => i + idx);
                pageSets.push(pagesInRange);
            }
        }

        if (pageSets.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No valid page ranges specified' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(`Splitting PDF into ${pageSets.length} parts`);

        // Process splits in batches to prevent memory issues
        const splitResults = await splitPdfInBatches(inputPath, pageSets, sessionId);

        // Create a streamable response
        const responseBody = JSON.stringify({
            success: true,
            message: `PDF split into ${splitResults.length} files`,
            originalName: file.name,
            totalPages,
            splitParts: splitResults
        });

        return new Response(responseBody, { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });
    } catch (error) {
        console.error('PDF splitting error:', error);

        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF splitting',
                success: false
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}