// app/api/image/make-transparent/route.ts
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
        const colorToRemove = formData.get('color') as string || '#ffffff'; // Default to white

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Verify it's an image
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are supported' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.png`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-transparent.png`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Process the image with sharp
        let r = 255, g = 255, b = 255;

        // Parse color if provided in hex format
        if (colorToRemove.startsWith('#')) {
            r = parseInt(colorToRemove.slice(1, 3), 16);
            g = parseInt(colorToRemove.slice(3, 5), 16);
            b = parseInt(colorToRemove.slice(5, 7), 16);
        }

        await Sharp(inputPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                const pixelCount = info.width * info.height;
                const channels = info.channels;
                const tolerance = 30; // Color matching tolerance

                for (let i = 0; i < pixelCount; i++) {
                    const pos = i * channels;
                    const red = data[pos];
                    const green = data[pos + 1];
                    const blue = data[pos + 2];

                    // Check if pixel color is within tolerance of the target color
                    if (
                        Math.abs(red - r) < tolerance &&
                        Math.abs(green - g) < tolerance &&
                        Math.abs(blue - b) < tolerance
                    ) {
                        data[pos + 3] = 0; // Set alpha to 0 (transparent)
                    }
                }

                return Sharp(data, {
                    raw: {
                        width: info.width,
                        height: info.height,
                        channels: info.channels
                    }
                }).png().toFile(outputPath);
            });

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-transparent.png`;

        return NextResponse.json({
            success: true,
            message: 'Image processed successfully',
            fileUrl,
            filename: `${uniqueId}-transparent.png`,
            originalName: file.name
        });
    } catch (error) {
        console.error('Image processing error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image processing',
                success: false
            },
            { status: 500 }
        );
    }
}