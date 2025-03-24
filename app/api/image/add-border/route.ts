import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import Sharp from 'sharp';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const OUTPUT_DIR = join(process.cwd(), 'public', 'processed-images');

async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
    if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });
}

function hexToRgba(hex: string, opacity = 100): { r: number; g: number; b: number; alpha: number } {
    let r = 0, g = 0, b = 0;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }
    const alpha = opacity / 100;
    return { r, g, b, alpha };
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();
        const formData = await request.formData();
        const file = formData.get('file') as File;

        const borderStyle = formData.get('borderStyle') as string || 'solid';
        const borderWidth = parseInt(formData.get('borderWidth') as string) || 20;
        const borderColor = formData.get('borderColor') as string || '#000000';
        const borderRadius = parseInt(formData.get('borderRadius') as string) || 0;
        const useGradient = formData.get('useGradient') === 'true';
        const gradientType = formData.get('gradientType') as string || 'linear';
        const gradientAngle = parseInt(formData.get('gradientAngle') as string) || 45;
        const gradientColor1 = formData.get('gradientColor1') as string || '#ff0000';
        const gradientColor2 = formData.get('gradientColor2') as string || '#0000ff';
        const useFrame = formData.get('useFrame') === 'true';
        const frameWidth = parseInt(formData.get('frameWidth') as string) || 10;
        const frameColor = formData.get('frameColor') as string || '#ffffff';
        const padding = parseInt(formData.get('padding') as string) || 20;

        if (!file) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are supported' }, { status: 400 });
        }

        const uniqueId = uuidv4();
        const fileExtension = file.type.split('/')[1] || 'png';
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.${fileExtension}`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-bordered.${fileExtension}`);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        const metadata = await Sharp(inputPath).metadata();
        const imageWidth = metadata.width || 800;
        const imageHeight = metadata.height || 600;

        const totalPadding = padding * 2;
        const totalBorderWidth = borderWidth * 2;
        const newWidth = imageWidth + totalPadding + totalBorderWidth;
        const newHeight = imageHeight + totalPadding + totalBorderWidth;

        let sharpInstance = Sharp({
            create: { width: newWidth, height: newHeight, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
        });

        const compositeOperations = [];

        if (useGradient) {
            let gradientSvg;
            if (gradientType === 'linear') {
                const x1 = 50 - Math.cos((gradientAngle - 90) * Math.PI / 180) * 50;
                const y1 = 50 - Math.sin((gradientAngle - 90) * Math.PI / 180) * 50;
                const x2 = 50 + Math.cos((gradientAngle - 90) * Math.PI / 180) * 50;
                const y2 = 50 + Math.sin((gradientAngle - 90) * Math.PI / 180) * 50;
                gradientSvg = `
                    <svg width="${newWidth}" height="${newHeight}">
                        <defs>
                            <linearGradient id="grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
                                <stop offset="0%" stop-color="${gradientColor1}" />
                                <stop offset="100%" stop-color="${gradientColor2}" />
                            </linearGradient>
                        </defs>
                        <rect x="0" y="0" width="${newWidth}" height="${newHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#grad)" />
                    </svg>`;
            } else {
                gradientSvg = `
                    <svg width="${newWidth}" height="${newHeight}">
                        <defs>
                            <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stop-color="${gradientColor1}" />
                                <stop offset="100%" stop-color="${gradientColor2}" />
                            </radialGradient>
                        </defs>
                        <rect x="0" y="0" width="${newWidth}" height="${newHeight}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#grad)" />
                    </svg>`;
            }
            compositeOperations.push({ input: Buffer.from(gradientSvg), top: 0, left: 0 });
        } else {
            const bgColor = hexToRgba(borderColor);
            const borderSvg = `
                <svg width="${newWidth}" height="${newHeight}">
                    <rect x="0" y="0" width="${newWidth}" height="${newHeight}" rx="${borderRadius}" ry="${borderRadius}" 
                        fill="rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.alpha})" />
                </svg>`;
            compositeOperations.push({ input: Buffer.from(borderSvg), top: 0, left: 0 });
        }

        compositeOperations.push({ input: inputPath, top: borderWidth + padding, left: borderWidth + padding });

        if (useFrame && frameWidth > 0) {
            const frameColorRgba = hexToRgba(frameColor);
            const frameLeft = borderWidth;
            const frameTop = borderWidth;
            const frameWidth2 = imageWidth + (padding * 2);
            const frameHeightInner = imageHeight + (padding * 2);
            const frameSvg = `
                <svg width="${newWidth}" height="${newHeight}">
                    <rect 
                        x="${frameLeft}" 
                        y="${frameTop}" 
                        width="${frameWidth2}" 
                        height="${frameHeightInner}" 
                        stroke="rgba(${frameColorRgba.r}, ${frameColorRgba.g}, ${frameColorRgba.b}, ${frameColorRgba.alpha})"
                        stroke-width="${frameWidth}"
                        fill="none"
                    />
                </svg>`;
            compositeOperations.push({ input: Buffer.from(frameSvg), top: 0, left: 0 });
        }

        sharpInstance = sharpInstance.composite(compositeOperations);

        await sharpInstance.toFormat(fileExtension as any).toFile(outputPath);

        const fileName = `${uniqueId}-bordered.${fileExtension}`;
        const fileUrl = `/processed-images/${fileName}`;

        return NextResponse.json({
            success: true,
            message: 'Border added to image successfully',
            fileUrl,
            filename: fileName,
            originalName: file.name.replace(/\.\w+$/, `-bordered.${fileExtension}`)
        });
    } catch (error) {
        console.error('Image processing error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred', success: false },
            { status: 500 }
        );
    }
}