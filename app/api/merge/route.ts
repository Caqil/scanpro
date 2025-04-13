// app/api/merge/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';

const execAsync = promisify(exec);
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MERGE_DIR = join(process.cwd(), 'public', 'merges');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(MERGE_DIR)) {
        await mkdir(MERGE_DIR, { recursive: true });
    }
}

// Merge PDFs using qpdf
async function mergePdfsWithQpdf(inputPaths: string[], outputPath: string) {
    try {
        console.log('Merging PDFs with qpdf...');

        // Validate input paths
        if (inputPaths.length === 0) {
            throw new Error('No input PDFs provided');
        }

        // Escape input paths to handle spaces or special characters
        const escapedPaths = inputPaths.map(path => `"${path}"`).join(' ');

        // Construct qpdf command
        const command = `qpdf --empty --pages ${escapedPaths} -- "${outputPath}"`;

        // Execute qpdf command
        await execAsync(command);

        return true;
    } catch (error) {
        console.error('qpdf merge error:', error);
        throw new Error('Failed to merge PDFs: ' + (error instanceof Error ? error.message : String(error)));
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF merge process...');
        // Get API key either from header or query parameter
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        // If this is a programmatic API call (not from web UI), validate the API key
        if (apiKey) {
            console.log('Validating API key for merge operation');
            const validation = await validateApiKey(apiKey, 'merge');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'merge');
            }
        }
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();

        // Get all files from the formData
        const files = formData.getAll('files');

        console.log(`Received ${files.length} files for merging`);

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No PDF files provided' },
                { status: 400 }
            );
        }

        if (files.length < 2) {
            return NextResponse.json(
                { error: 'At least two PDF files are required for merging' },
                { status: 400 }
            );
        }

        // Get order information if provided
        let fileOrder: number[] = [];
        const orderParam = formData.get('order');

        if (orderParam) {
            try {
                fileOrder = JSON.parse(orderParam as string) as number[];
                // Validate the order array
                if (!Array.isArray(fileOrder) ||
                    fileOrder.length !== files.length ||
                    !fileOrder.every(i => typeof i === 'number' && i >= 0 && i < files.length)) {
                    fileOrder = []; // Use default order if invalid
                }
            } catch (e) {
                console.error('Invalid order parameter:', e);
                fileOrder = []; // Use default order
            }
        }

        // If no valid order provided, use sequential order
        if (fileOrder.length === 0) {
            fileOrder = Array.from({ length: files.length }, (_, i) => i);
        }

        // Create unique ID for this merge operation
        const uniqueId = uuidv4();
        const inputPaths: string[] = [];

        // Write each file to disk
        for (let i = 0; i < files.length; i++) {
            const file = files[i] as File;

            if (!file || !file.name) {
                console.error(`File at index ${i} is invalid or missing name property`);
                continue;
            }

            // Verify it's a PDF
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                return NextResponse.json(
                    { error: `File "${file.name}" is not a PDF` },
                    { status: 400 }
                );
            }

            const inputPath = join(UPLOAD_DIR, `${uniqueId}-input-${i}.pdf`);
            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(inputPath, buffer);
            inputPaths.push(inputPath);
            console.log(`Saved file "${file.name}" to ${inputPath}`);
        }

        if (inputPaths.length < 2) {
            return NextResponse.json(
                { error: 'Failed to process all input files' },
                { status: 500 }
            );
        }

        // Create output path
        const outputFileName = `${uniqueId}-merged.pdf`;
        const outputPath = join(MERGE_DIR, outputFileName);

        // Order the input paths according to fileOrder
        const orderedInputPaths = fileOrder.map(i => inputPaths[i]);

        console.log(`Merging ${files.length} PDF files in specified order`);

        // Merge with qpdf
        let mergeSuccess = false;
        try {
            await mergePdfsWithQpdf(orderedInputPaths, outputPath);
            mergeSuccess = true;
        } catch (error) {
            console.error('qpdf merge failed:', error);
            throw new Error('PDF merging failed');
        }

        // Verify the output file exists
        if (!existsSync(outputPath)) {
            throw new Error(`Merged file was not created at ${outputPath}`);
        }

        // Get merged file size
        const mergedBuffer = await readFile(outputPath);
        const mergedSize = mergedBuffer.length;

        // Calculate total size of input files
        let totalInputSize = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i] as File;
            if (file && file.size) {
                totalInputSize += file.size;
            }
        }

        // Create relative URL for the merged file using the file API
        const fileUrl = `/api/file?folder=merges&filename=${outputFileName}`;

        return NextResponse.json({
            success: true,
            message: 'PDF merge successful',
            fileUrl,
            filename: outputFileName,
            mergedSize,
            totalInputSize,
            fileCount: files.length
        });
    } catch (error) {
        console.error('Merge error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during merging',
                success: false
            },
            { status: 500 }
        );
    }
}