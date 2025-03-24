// app/api/image/png-to-base64/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const OUTPUT_DIR = join(process.cwd(), 'public', 'processed-images');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(OUTPUT_DIR)) {
        await mkdir(OUTPUT_DIR, { recursive: true });
    }
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const includePrefix = (formData.get('includePrefix') as string) !== 'false';

        if (!file) {
            return NextResponse.json(
                { error: 'No PNG file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PNG file
        if (file.type !== 'image/png') {
            return NextResponse.json(
                { error: 'Only PNG files are supported for Base64 conversion' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.png`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-base64.txt`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Convert the file to Base64
        const base64Data = buffer.toString('base64');
        
        // Add data URI prefix if requested
        const result = includePrefix 
            ? `data:image/png;base64,${base64Data}`
            : base64Data;

        // Write the base64 result to a file
        await writeFile(outputPath, result);

        // Create response with file info and base64 data
        const fileUrl = `/processed-images/${uniqueId}-base64.txt`;

        return NextResponse.json({
            success: true,
            message: 'PNG converted to Base64 successfully',
            fileUrl,
            filename: `${uniqueId}-base64.txt`,
            fileContent: result,
            originalName: file.name,
            fileSize: {
                original: buffer.length,
                base64: result.length
            }
        });
    } catch (error) {
        console.error('Image conversion error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during conversion',
                success: false
            },
            { status: 500 }
        );
    }
}