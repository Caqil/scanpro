// app/api/image/change-tone/route.ts
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

// Helper function to parse hex color to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse different formats
    let r, g, b;
    if (hex.length === 3) {
        // #RGB format
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        // #RRGGBB format
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        return null; // Invalid format
    }

    return { r, g, b };
}

// Check if a color is grayscale (R = G = B approximately)
function isGrayscale(r: number, g: number, b: number, tolerance: number = 5): boolean {
    return (
        Math.abs(r - g) <= tolerance &&
        Math.abs(g - b) <= tolerance &&
        Math.abs(r - b) <= tolerance
    );
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        // Parse options
        const toneColor = formData.get('toneColor') as string || '#0066ff';
        const intensity = parseInt(formData.get('intensity') as string) || 50;
        const preserveGrays = (formData.get('preserveGrays') as string) !== 'false';
        const preset = formData.get('preset') as string || 'custom';

        if (!file) {
            return NextResponse.json(
                { error: 'No PNG file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PNG file
        if (file.type !== 'image/png') {
            return NextResponse.json(
                { error: 'Only PNG files are supported for color tone adjustment' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.png`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-toned.png`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Parse the tone color
        const toneRgb = hexToRgb(toneColor);
        if (!toneRgb) {
            return NextResponse.json(
                { error: 'Invalid color format for tone color' },
                { status: 400 }
            );
        }

        // Calculate the blend factor (intensity as a decimal)
        const blendFactor = intensity / 100;

        // Process image to apply color tone
        await Sharp(inputPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                const { width, height, channels } = info;
                const pixelCount = width * height;

                // Process each pixel
                for (let i = 0; i < pixelCount; i++) {
                    const idx = i * channels;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const alpha = data[idx + 3];

                    // Skip transparent pixels
                    if (alpha === 0) continue;

                    // If preserving grayscale and this is a grayscale pixel, skip it
                    if (preserveGrays && isGrayscale(r, g, b)) continue;

                    // Blend the original color with the tone color based on intensity
                    data[idx] = Math.round(r * (1 - blendFactor) + toneRgb.r * blendFactor);
                    data[idx + 1] = Math.round(g * (1 - blendFactor) + toneRgb.g * blendFactor);
                    data[idx + 2] = Math.round(b * (1 - blendFactor) + toneRgb.b * blendFactor);
                    // Alpha channel remains unchanged
                }

                // Create a new image from the modified pixel data
                return Sharp(data, {
                    raw: {
                        width,
                        height,
                        channels,
                    },
                }).png().toFile(outputPath);
            });

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-toned.png`;

        return NextResponse.json({
            success: true,
            message: 'Color tone applied successfully',
            fileUrl,
            filename: `${uniqueId}-toned.png`,
            originalName: file.name.replace(/\.png$/i, '-toned.png'),
            toneUsed: preset === 'custom' ? 'Custom' : preset.charAt(0).toUpperCase() + preset.slice(1),
            intensity: `${intensity}%`
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