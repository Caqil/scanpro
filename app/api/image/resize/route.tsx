// app/api/image/resize/route.ts
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
        const width = parseInt(formData.get('width') as string) || 800;
        const height = parseInt(formData.get('height') as string) || 600;
        const method = formData.get('method') as string || 'fit';

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Verify it's an image file
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are supported' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'png';
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.${fileExtension}`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-resized.${fileExtension}`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Get image info to return original dimensions
        const imageInfo = await Sharp(inputPath).metadata();
        const originalWidth = imageInfo.width || 0;
        const originalHeight = imageInfo.height || 0;

        // Process the image based on resize method
        let sharpInstance = Sharp(inputPath);
        
        switch(method) {
            case 'fit':
                // Resize to fit within dimensions while maintaining aspect ratio
                sharpInstance = sharpInstance.resize({
                    width,
                    height,
                    fit: 'inside',
                    withoutEnlargement: false
                });
                break;
            
            case 'fill':
                // Stretch/compress to exact dimensions (may distort)
                sharpInstance = sharpInstance.resize({
                    width,
                    height,
                    fit: 'fill'
                });
                break;
            
            case 'cover':
                // Resize and crop to cover dimensions
                sharpInstance = sharpInstance.resize({
                    width,
                    height,
                    fit: 'cover',
                    position: 'center'
                });
                break;
            
            default:
                // Default to 'fit'
                sharpInstance = sharpInstance.resize({
                    width,
                    height,
                    fit: 'inside',
                    withoutEnlargement: false
                });
        }

        // Save the processed image
        await sharpInstance.toFile(outputPath);

        // Get info about the resized image
        const resizedInfo = await Sharp(outputPath).metadata();
        const finalWidth = resizedInfo.width || 0;
        const finalHeight = resizedInfo.height || 0;

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-resized.${fileExtension}`;

        return NextResponse.json({
            success: true,
            message: 'Image resized successfully',
            fileUrl,
            filename: `${uniqueId}-resized.${fileExtension}`,
            originalName: file.name,
            dimensions: {
                original: {
                    width: originalWidth,
                    height: originalHeight
                },
                resized: {
                    width: finalWidth,
                    height: finalHeight
                }
            }
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