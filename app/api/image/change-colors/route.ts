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
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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

// Helper function to check if colors are within tolerance
function colorsMatch(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number },
    tolerance: number
): boolean {
    return (
        Math.abs(color1.r - color2.r) <= tolerance &&
        Math.abs(color1.g - color2.g) <= tolerance &&
        Math.abs(color1.b - color2.b) <= tolerance
    );
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        // Get and validate colorMappings
        const colorMappingsStr = formData.get('colorMappings');
        if (!colorMappingsStr || typeof colorMappingsStr !== 'string') {
            return NextResponse.json(
                { error: 'colorMappings must be a valid JSON string' },
                { status: 400 }
            );
        }

        // Log raw input for debugging
        console.log('Raw colorMappingsStr:', colorMappingsStr);

        // Parse color mappings from JSON
        let colorMappings: { sourceColor: string; targetColor: string }[] = [];
        if (colorMappingsStr === '[object Object]') {
            console.warn('Received invalid colorMappings: "[object Object]"');
            return NextResponse.json(
                { error: 'Invalid colorMappings format. Please provide a valid JSON string.' },
                { status: 400 }
            );
        }

        try {
            colorMappings = JSON.parse(colorMappingsStr);
            // Validate that colorMappings is an array of objects with required properties
            if (!Array.isArray(colorMappings) || colorMappings.some(
                mapping => !mapping.sourceColor || !mapping.targetColor
            )) {
                throw new Error('colorMappings must be an array of objects with sourceColor and targetColor properties');
            }
        } catch (e) {
            console.error('Failed to parse color mappings:', e);
            // Fallback to default if parsing fails
            colorMappings = [{ sourceColor: '#ff0000', targetColor: '#00ff00' }];
        }

        // Parse tolerance with default
        const toleranceStr = formData.get('tolerance');
        const tolerance = toleranceStr ? parseInt(toleranceStr as string) : 30;
        if (isNaN(tolerance) || tolerance < 0) {
            return NextResponse.json(
                { error: 'tolerance must be a non-negative number' },
                { status: 400 }
            );
        }

        if (!file) {
            return NextResponse.json(
                { error: 'No PNG file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PNG file
        if (file.type !== 'image/png') {
            return NextResponse.json(
                { error: 'Only PNG files are supported for color changing' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.png`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-colored.png`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Process image to change colors
        await Sharp(inputPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                const { width, height, channels } = info;
                const pixelCount = width * height;

                // Process each color mapping
                for (const mapping of colorMappings) {
                    // Parse colors
                    const sourceRgb = hexToRgb(mapping.sourceColor);
                    const targetRgb = hexToRgb(mapping.targetColor);

                    if (!sourceRgb || !targetRgb) {
                        console.warn('Invalid color format:', mapping);
                        continue;
                    }

                    // Process each pixel
                    for (let i = 0; i < pixelCount; i++) {
                        const idx = i * channels;
                        const r = data[idx];
                        const g = data[idx + 1];
                        const b = data[idx + 2];
                        // Alpha is at idx + 3

                        // Check if this pixel's color matches the source color within tolerance
                        if (colorsMatch({ r, g, b }, sourceRgb, tolerance)) {
                            // Replace with target color
                            data[idx] = targetRgb.r;
                            data[idx + 1] = targetRgb.g;
                            data[idx + 2] = targetRgb.b;
                            // Keep original alpha value to preserve transparency
                        }
                    }
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
        const fileUrl = `/processed-images/${uniqueId}-colored.png`;

        return NextResponse.json({
            success: true,
            message: 'Colors changed successfully',
            fileUrl,
            filename: `${uniqueId}-colored.png`,
            originalName: file.name.replace(/\.png$/i, '-colored.png'),
        });
    } catch (error) {
        console.error('Image processing error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image processing',
                success: false,
            },
            { status: 500 }
        );
    }
}