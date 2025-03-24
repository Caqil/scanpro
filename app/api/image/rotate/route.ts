// app/api/image/rotate/route.ts
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
        const rotationAngle = formData.get('rotationAngle') as string || '90';
        const flipDirection = formData.get('flipDirection') as string || 'none';

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
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.${file.type.split('/')[1]}`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-rotated.${file.type.split('/')[1]}`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Create a Sharp instance
        let sharpInstance = Sharp(inputPath);

        // Apply rotation based on angle
        const angle = parseInt(rotationAngle);
        if (!isNaN(angle)) {
            sharpInstance = sharpInstance.rotate(angle);
        }

        // Apply flipping
        if (flipDirection === 'horizontal') {
            sharpInstance = sharpInstance.flip(false).flop(true);
        } else if (flipDirection === 'vertical') {
            sharpInstance = sharpInstance.flip(true).flop(false);
        } else if (flipDirection === 'both') {
            sharpInstance = sharpInstance.flip(true).flop(true);
        }

        // Process and save the image
        await sharpInstance.toFile(outputPath);

        // Get the file extension from the original file
        const fileExtension = file.name.split('.').pop() || 'png';

        // Create response with file info
        const filename = `${uniqueId}-rotated.${fileExtension}`;
        const fileUrl = `/processed-images/${filename}`;

        return NextResponse.json({
            success: true,
            message: 'Image rotated successfully',
            fileUrl,
            filename,
            originalName: file.name.replace(/\.[^/.]+$/, `-rotated.${fileExtension}`)
        });
    } catch (error) {
        console.error('Image rotation error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image rotation',
                success: false
            },
            { status: 500 }
        );
    }
}