// app/api/image/crop/route.ts
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

        // Get crop parameters
        const cropMode = formData.get('cropMode') as string || 'custom';
        const aspectRatio = formData.get('aspectRatio') as string || '1:1';
        const width = parseInt(formData.get('width') as string) || 800;
        const height = parseInt(formData.get('height') as string) || 600;
        const freeRotation = parseInt(formData.get('freeRotation') as string) || 0;

        // Extract region from interactive crop (in a real implementation, 
        // you'd need to pass the crop coordinates from a frontend cropper)
        // For this example, we'll use some default values
        const cropLeft = parseInt(formData.get('left') as string) || 0;
        const cropTop = parseInt(formData.get('top') as string) || 0;
        const cropWidth = parseInt(formData.get('cropWidth') as string) || width;
        const cropHeight = parseInt(formData.get('cropHeight') as string) || height;

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
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-cropped.${file.type.split('/')[1]}`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Create a Sharp instance
        let sharpInstance = Sharp(inputPath);

        // Get image metadata to determine actual dimensions
        const metadata = await sharpInstance.metadata();
        const imgWidth = metadata.width || 1000;
        const imgHeight = metadata.height || 1000;

        // Apply rotation if needed
        if (freeRotation !== 0) {
            sharpInstance = sharpInstance.rotate(freeRotation);
        }

        // Handle different crop modes
        if (cropMode === 'custom') {
            // Use the provided crop coordinates
            sharpInstance = sharpInstance.extract({
                left: cropLeft,
                top: cropTop,
                width: Math.min(cropWidth, imgWidth - cropLeft),
                height: Math.min(cropHeight, imgHeight - cropTop)
            });
        }
        else if (cropMode === 'fixed-size') {
            // For fixed size, we'd need to first extract a region, then resize
            // In a real implementation, we'd get the region from frontend
            // Just demonstrating the API here
            const region = {
                left: Math.floor(imgWidth / 4),
                top: Math.floor(imgHeight / 4),
                width: Math.floor(imgWidth / 2),
                height: Math.floor(imgHeight / 2)
            };

            sharpInstance = sharpInstance
                .extract(region)
                .resize(width, height, { fit: 'fill' });
        }
        else if (cropMode === 'fixed-ratio') {
            // For aspect ratio, calculate dimensions
            if (aspectRatio !== 'custom') {
                const [x, y] = aspectRatio.split(':').map(Number);
                if (x && y) {
                    // Calculate largest possible crop with this ratio
                    let cropW, cropH;

                    if (imgWidth / imgHeight > x / y) {
                        // Image is wider than target ratio
                        cropH = imgHeight;
                        cropW = cropH * (x / y);
                    } else {
                        // Image is taller than target ratio
                        cropW = imgWidth;
                        cropH = cropW * (y / x);
                    }

                    const left = Math.floor((imgWidth - cropW) / 2);
                    const top = Math.floor((imgHeight - cropH) / 2);

                    sharpInstance = sharpInstance.extract({
                        left,
                        top,
                        width: Math.floor(cropW),
                        height: Math.floor(cropH)
                    });
                }
            }
        }
        else if (cropMode === 'circle') {
            // For circle/oval crop, create a circular mask
            // First, make the image square or appropriate aspect ratio
            const size = Math.min(imgWidth, imgHeight);
            const left = Math.floor((imgWidth - size) / 2);
            const top = Math.floor((imgHeight - size) / 2);

            // Create a circular mask
            const circleBuffer = await Sharp({
                create: {
                    width: size,
                    height: size,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                }
            })
                .composite([{
                    input: Buffer.from(
                        `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
                    ),
                    blend: 'over'
                }])
                .png()
                .toBuffer();

            // Extract square area and apply mask
            sharpInstance = sharpInstance
                .extract({ left, top, width: size, height: size })
                .composite([{
                    input: circleBuffer,
                    blend: 'dest-in'
                }]);
        }

        // Output the processed image
        await sharpInstance.toFile(outputPath);

        // Get the file extension from the original file
        const fileExtension = file.name.split('.').pop() || 'png';

        // Create response with file info
        const filename = `${uniqueId}-cropped.${fileExtension}`;
        const fileUrl = `/processed-images/${filename}`;

        return NextResponse.json({
            success: true,
            message: 'Image cropped successfully',
            fileUrl,
            filename,
            originalName: file.name.replace(/\.[^/.]+$/, `-cropped.${fileExtension}`)
        });
    } catch (error) {
        console.error('Image cropping error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image cropping',
                success: false
            },
            { status: 500 }
        );
    }
}