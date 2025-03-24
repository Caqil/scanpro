// app/api/image/compress-png/route.ts
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

        // Parse options with defaults
        const quality = parseInt(formData.get('quality') as string) || 80;
        const lossless = (formData.get('lossless') as string) === 'true';
        const preserveTransparency = (formData.get('preserveTransparency') as string) !== 'false';

        if (!file) {
            return NextResponse.json(
                { error: 'No PNG file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PNG file
        if (file.type !== 'image/png') {
            return NextResponse.json(
                { error: 'Only PNG files are supported for compression' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.png`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-compressed.png`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Get original file size
        const originalSize = buffer.length;

        // For optimal compression, we need to determine the best approach based on settings
        let compressedImageBuffer;

        if (lossless) {
            // Lossless PNG compression
            compressedImageBuffer = await Sharp(inputPath)
                .png({
                    compressionLevel: Math.floor((100 - quality) / 10) + 1, // Map 10-100 to 9-1 (9 is highest compression)
                    adaptiveFiltering: true,
                    quality: 100 // Not used for PNG but included for consistency
                })
                .toBuffer();
        } else {
            // For lossy compression with transparency preservation, we use different approaches
            if (preserveTransparency) {
                // Lossy with transparency - we need to use PNG format with optimizations
                compressedImageBuffer = await Sharp(inputPath)
                    .png({
                        quality: quality,
                        compressionLevel: 9, // Maximum compression
                        adaptiveFiltering: true,
                        effort: 10, // Maximum effort for compression
                    })
                    .toBuffer();
            } else {
                // Lossy without transparency - convert to WebP and back to PNG for better compression
                compressedImageBuffer = await Sharp(inputPath)
                    .webp({ quality: quality, alphaQuality: 0 })
                    .png()
                    .toBuffer();
            }
        }

        // Save the compressed image
        await writeFile(outputPath, compressedImageBuffer);

        // Calculate size reduction
        const compressedSize = compressedImageBuffer.length;
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-compressed.png`;

        return NextResponse.json({
            success: true,
            message: 'PNG compressed successfully',
            fileUrl,
            filename: `${uniqueId}-compressed.png`,
            originalName: file.name.replace(/\.png$/i, '-compressed.png'),
            originalSize,
            compressedSize,
            compressionRatio: `${compressionRatio}%`
        });
    } catch (error) {
        console.error('Image compression error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image compression',
                success: false
            },
            { status: 500 }
        );
    }
}