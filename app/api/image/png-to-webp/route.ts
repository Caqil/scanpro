// app/api/image/png-to-webp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import Sharp from 'sharp';

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
        const qualityStr = formData.get('quality') as string || '80';
        const quality = parseInt(qualityStr, 10);

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PNG image
        if (file.type !== 'image/png') {
            return NextResponse.json(
                { error: 'Only PNG files are supported for this conversion' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.png`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-converted.webp`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Convert PNG to WebP with sharp
        await Sharp(inputPath)
            .webp({
                quality: Math.min(Math.max(quality, 10), 100), // Ensure quality is between 10-100
                lossless: quality >= 95, // Use lossless for very high quality settings
                alphaQuality: 100, // Preserve alpha channel quality
            })
            .toFile(outputPath);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-converted.webp`;

        return NextResponse.json({
            success: true,
            message: 'PNG converted to WebP successfully',
            fileUrl,
            filename: `${uniqueId}-converted.webp`,
            originalName: file.name.replace(/\.png$/i, '.webp')
        });
    } catch (error) {
        console.error('Image conversion error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image conversion',
                success: false
            },
            { status: 500 }
        );
    }
}