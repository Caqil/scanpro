// app/api/image/add-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import Sharp from 'sharp';
import { createCanvas, registerFont } from 'canvas';

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

// Convert hex color to RGBA
function hexToRgba(hex: string, opacity = 100): { r: number; g: number; b: number; alpha: number } {
    let r = 0, g = 0, b = 0;

    // Remove the # if it exists
    hex = hex.replace('#', '');

    // Process the hex string
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }

    // Calculate alpha from opacity percentage
    const alpha = opacity / 100;

    return { r, g, b, alpha };
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        // Extract text parameters
        const text = formData.get('text') as string || 'Sample Text';
        const fontSize = parseInt(formData.get('fontSize') as string) || 32;
        const fontFamily = formData.get('fontFamily') as string || 'Arial';
        const textColor = formData.get('textColor') as string || '#000000';
        const positionX = parseInt(formData.get('positionX') as string) || 50; // percentage
        const positionY = parseInt(formData.get('positionY') as string) || 50; // percentage
        const alignment = formData.get('alignment') as string || 'center';
        const opacity = parseInt(formData.get('opacity') as string) || 100;
        const rotation = parseInt(formData.get('rotation') as string) || 0;

        // Background options
        const bgColor = formData.get('bgColor') as string || '';
        const bgOpacity = parseInt(formData.get('bgOpacity') as string) || 0;
        const padding = parseInt(formData.get('padding') as string) || 10;

        // Border options
        const borderWidth = parseInt(formData.get('borderWidth') as string) || 0;
        const borderColor = formData.get('borderColor') as string || '#000000';

        // Shadow options
        const shadowEnabled = formData.get('shadowEnabled') === 'true';
        const shadowColor = formData.get('shadowColor') as string || '#000000';
        const shadowBlur = parseInt(formData.get('shadowBlur') as string) || 5;
        const shadowOffsetX = parseInt(formData.get('shadowOffsetX') as string) || 2;
        const shadowOffsetY = parseInt(formData.get('shadowOffsetY') as string) || 2;

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
        const fileExtension = file.type.split('/')[1] || 'png';
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.${fileExtension}`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-text.${fileExtension}`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Get image metadata
        const metadata = await Sharp(inputPath).metadata();
        const imgWidth = metadata.width || 800;
        const imgHeight = metadata.height || 600;

        // Calculate text position
        const xPos = (positionX / 100) * imgWidth;
        const yPos = (positionY / 100) * imgHeight;

        // Create a canvas to draw the text
        const canvas = createCanvas(imgWidth, imgHeight);
        const ctx = canvas.getContext('2d');

        // Setup font
        ctx.font = `${fontSize}px ${fontFamily}`;

        // Set text color and opacity
        const textRgba = hexToRgba(textColor, opacity);
        ctx.fillStyle = `rgba(${textRgba.r}, ${textRgba.g}, ${textRgba.b}, ${textRgba.alpha})`;

        // Setup text alignment
        ctx.textAlign = alignment as CanvasTextAlign;
        ctx.textBaseline = 'middle';

        // Calculate text width for background and border
        const textWidth = ctx.measureText(text).width;
        const textHeight = fontSize;

        // Save the canvas state before rotation
        ctx.save();

        // Translate and rotate
        ctx.translate(xPos, yPos);
        if (rotation !== 0) {
            ctx.rotate((rotation * Math.PI) / 180);
        }

        // Draw background if enabled
        if (bgColor && bgOpacity > 0) {
            const bgRgba = hexToRgba(bgColor, bgOpacity);
            ctx.fillStyle = `rgba(${bgRgba.r}, ${bgRgba.g}, ${bgRgba.b}, ${bgRgba.alpha})`;

            // Adjust based on alignment
            let rectX = 0;
            if (alignment === 'center') rectX = -textWidth / 2;
            else if (alignment === 'right') rectX = -textWidth;

            ctx.fillRect(
                rectX - padding,
                -textHeight / 2 - padding,
                textWidth + padding * 2,
                textHeight + padding * 2
            );
        }

        // Draw border if enabled
        if (borderWidth > 0) {
            const borderRgba = hexToRgba(borderColor, opacity);
            ctx.strokeStyle = `rgba(${borderRgba.r}, ${borderRgba.g}, ${borderRgba.b}, ${borderRgba.alpha})`;
            ctx.lineWidth = borderWidth;

            // Adjust based on alignment
            let rectX = 0;
            if (alignment === 'center') rectX = -textWidth / 2;
            else if (alignment === 'right') rectX = -textWidth;

            ctx.strokeRect(
                rectX - padding,
                -textHeight / 2 - padding,
                textWidth + padding * 2,
                textHeight + padding * 2
            );
        }

        // Draw text shadow if enabled
        if (shadowEnabled) {
            const shadowRgba = hexToRgba(shadowColor, opacity);
            ctx.shadowColor = `rgba(${shadowRgba.r}, ${shadowRgba.g}, ${shadowRgba.b}, ${shadowRgba.alpha})`;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
        }

        // Draw the text
        ctx.fillStyle = `rgba(${textRgba.r}, ${textRgba.g}, ${textRgba.b}, ${textRgba.alpha})`;
        ctx.fillText(text, 0, 0);

        // Restore canvas state
        ctx.restore();

        // Convert canvas to buffer
        const textOverlayBuffer = canvas.toBuffer();

        // Composite the text onto the image
        await Sharp(inputPath)
            .composite([
                {
                    input: textOverlayBuffer,
                    blend: 'over'
                }
            ])
            .toFile(outputPath);

        // Create response with file info
        const fileName = `${uniqueId}-text.${fileExtension}`;
        const fileUrl = `/processed-images/${fileName}`;

        return NextResponse.json({
            success: true,
            message: 'Text added to image successfully',
            fileUrl,
            filename: fileName,
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