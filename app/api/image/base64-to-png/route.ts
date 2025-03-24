// app/api/image/base64-to-png/route.ts
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

        // Parse the request JSON body
        const data = await request.json();
        const { base64String } = data;

        if (!base64String) {
            return NextResponse.json(
                { error: 'No Base64 string provided' },
                { status: 400 }
            );
        }

        // Clean the base64 input
        let cleanBase64 = base64String.trim();
        
        // Extract the base64 data, removing the data URI prefix if present
        const base64Data = cleanBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        
        // Validate base64 format
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        if (!base64Regex.test(base64Data)) {
            return NextResponse.json(
                { error: 'Invalid Base64 format' },
                { status: 400 }
            );
        }

        // Create a buffer from the base64 data
        const buffer = Buffer.from(base64Data, 'base64');

        // Create unique file paths and name
        const uniqueId = uuidv4();
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-from-base64.png`);

        // Write the image file
        await writeFile(outputPath, buffer);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-from-base64.png`;

        return NextResponse.json({
            success: true,
            message: 'Base64 converted to PNG successfully',
            fileUrl,
            filename: `${uniqueId}-from-base64.png`,
            originalSize: base64String.length,
            convertedSize: buffer.length
        });
    } catch (error) {
        console.error('Base64 to PNG conversion error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during conversion',
                success: false
            },
            { status: 500 }
        );
    }
}