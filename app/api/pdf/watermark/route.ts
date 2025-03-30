// app/api/pdf/watermark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import sharp from 'sharp';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const WATERMARKED_DIR = join(process.cwd(), 'public', 'watermarked');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, WATERMARKED_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Parse page ranges from string format (e.g., "1,3,5-10")
function parsePageRanges(pagesString: string, totalPages: number): number[] {
    const pages: number[] = [];

    // Split by commas
    const parts = pagesString.split(',');

    for (const part of parts) {
        const trimmedPart = part.trim();
        if (!trimmedPart) continue;

        // Check if it's a range (contains '-')
        if (trimmedPart.includes('-')) {
            const [startStr, endStr] = trimmedPart.split('-');
            const start = parseInt(startStr.trim());
            const end = parseInt(endStr.trim());

            if (!isNaN(start) && !isNaN(end) && start <= end) {
                // Add all pages in range (ensure within document bounds)
                for (let i = start; i <= Math.min(end, totalPages); i++) {
                    if (!pages.includes(i) && i > 0) {
                        pages.push(i);
                    }
                }
            }
        } else {
            // Single page number
            const pageNum = parseInt(trimmedPart);
            if (!isNaN(pageNum) && !pages.includes(pageNum) && pageNum > 0 && pageNum <= totalPages) {
                pages.push(pageNum);
            }
        }
    }

    return pages.sort((a, b) => a - b);
}

// Determine which pages to watermark based on settings
function getPagesToWatermark(
    totalPages: number, 
    pageOption: string, 
    customPages: string
): number[] {
    switch (pageOption) {
        case 'all':
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        case 'even':
            return Array.from({ length: Math.floor(totalPages / 2) }, (_, i) => (i + 1) * 2);
        case 'odd':
            return Array.from({ length: Math.ceil(totalPages / 2) }, (_, i) => i * 2 + 1).filter(p => p <= totalPages);
        case 'custom':
            return parsePageRanges(customPages, totalPages);
        default:
            return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
}

// Convert hex color to RGB array
function hexToRgb(hex: string): [number, number, number] {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    return [r, g, b];
}

// Add text watermark to PDF
async function addTextWatermark(
    pdfDoc: PDFDocument,
    pages: number[],
    options: {
        text: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        opacity: number;
        rotation: number;
        position: string;
    }
): Promise<void> {
    try {
        // Map font family to pdf-lib's StandardFonts
        let fontType: typeof StandardFonts[keyof typeof StandardFonts];
        switch (options.fontFamily) {
            case 'Times New Roman':
                fontType = StandardFonts.TimesRoman;
                break;
            case 'Courier':
                fontType = StandardFonts.Courier;
                break;
            case 'Helvetica':
                fontType = StandardFonts.Helvetica;
                break;
            default:
                fontType = StandardFonts.Helvetica;
        }

        // Load font
        const font = await pdfDoc.embedFont(fontType);
        
        // Convert color from hex to rgb
        const [r, g, b] = hexToRgb(options.color);
        
        // Apply watermark to selected pages
        for (const pageNum of pages) {
            // Pages are 0-indexed in pdf-lib
            const pageIndex = pageNum - 1;
            
            if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
                continue;
            }
            
            const page = pdfDoc.getPage(pageIndex);
            const { width, height } = page.getSize();
            
            // Set text size and get dimensions
            const textSize = options.fontSize;
            const textWidth = font.widthOfTextAtSize(options.text, textSize);
            const textHeight = font.heightAtSize(textSize);
            
            // Determine positions based on the chosen position option
            let positions: { x: number, y: number }[] = [];
            
            if (options.position === 'center') {
                // Single watermark in the center
                positions.push({
                    x: (width - textWidth) / 2,
                    y: (height - textHeight) / 2
                });
            } else if (options.position === 'tile') {
                // Tile watermarks across the page
                const spacingX = Math.max(textWidth * 2, width / 3);
                const spacingY = Math.max(textHeight * 2, height / 3);
                
                for (let x = spacingX / 2; x < width; x += spacingX) {
                    for (let y = spacingY / 2; y < height; y += spacingY) {
                        positions.push({ x, y });
                    }
                }
            } else {
                // Custom positioning (centered by default)
                positions.push({
                    x: (width - textWidth) / 2,
                    y: (height - textHeight) / 2
                });
            }
            
            // Draw watermarks at each position
            for (const pos of positions) {
                page.drawText(options.text, {
                    x: pos.x,
                    y: pos.y,
                    size: textSize,
                    font,
                    color: rgb(r, g, b),
                    opacity: options.opacity / 100,
                    rotate: degrees(options.rotation)
                });
            }
        }
    } catch (error) {
        console.error('Error adding text watermark:', error);
        throw error;
    }
}

// Add image watermark to PDF
async function addImageWatermark(
    pdfDoc: PDFDocument,
    pages: number[],
    imageBuffer: Buffer,
    options: {
        scale: number;
        opacity: number;
        rotation: number;
        position: string;
    }
): Promise<void> {
    try {
        // Determine image type and prepare embedding
        const imageType = await determineImageType(imageBuffer);
        let embeddedImage;
        
        if (imageType === 'svg') {
            // Convert SVG to PNG using sharp
            const pngBuffer = await sharp(imageBuffer)
                .png()
                .toBuffer();
            
            embeddedImage = await pdfDoc.embedPng(pngBuffer);
        } else if (imageType === 'png') {
            embeddedImage = await pdfDoc.embedPng(imageBuffer);
        } else {
            // Default to JPEG for all other formats
            embeddedImage = await pdfDoc.embedJpg(imageBuffer);
        }
        
        const { width: imgWidth, height: imgHeight } = embeddedImage;
        
        // Apply watermark to selected pages
        for (const pageNum of pages) {
            // Pages are 0-indexed in pdf-lib
            const pageIndex = pageNum - 1;
            
            if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
                continue;
            }
            
            const page = pdfDoc.getPage(pageIndex);
            const { width, height } = page.getSize();
            
            // Scale image
            const scaleFactor = options.scale / 100;
            const scaledWidth = imgWidth * scaleFactor;
            const scaledHeight = imgHeight * scaleFactor;
            
            // Determine positions based on the chosen position option
            let positions: { x: number, y: number }[] = [];
            
            if (options.position === 'center') {
                // Single watermark in the center
                positions.push({
                    x: (width - scaledWidth) / 2,
                    y: (height - scaledHeight) / 2
                });
            } else if (options.position === 'tile') {
                // Tile watermarks across the page
                const spacingX = Math.max(scaledWidth * 1.5, width / 3);
                const spacingY = Math.max(scaledHeight * 1.5, height / 3);
                
                for (let x = spacingX / 2; x < width; x += spacingX) {
                    for (let y = spacingY / 2; y < height; y += spacingY) {
                        positions.push({ x, y });
                    }
                }
            } else {
                // Custom positioning (centered by default)
                positions.push({
                    x: (width - scaledWidth) / 2,
                    y: (height - scaledHeight) / 2
                });
            }
            
            // Draw watermarks at each position
            for (const pos of positions) {
                page.drawImage(embeddedImage, {
                    x: pos.x,
                    y: pos.y,
                    width: scaledWidth,
                    height: scaledHeight,
                    opacity: options.opacity / 100,
                    rotate: degrees(options.rotation)
                });
            }
        }
    } catch (error) {
        console.error('Error adding image watermark:', error);
        throw error;
    }
}

// Determine image type from buffer
async function determineImageType(buffer: Buffer): Promise<'jpeg' | 'png' | 'svg'> {
    // Check the first few bytes to determine file type
    if (buffer.length < 4) {
        return 'jpeg'; // Default to JPEG for very small buffers
    }
    
    // Check PNG signature
    if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4E &&
        buffer[3] === 0x47
    ) {
        return 'png';
    }
    
    // Check for SVG (look for XML declaration or svg tag)
    const headerStr = buffer.slice(0, 100).toString('utf-8').toLowerCase();
    if (
        headerStr.includes('<?xml') &&
        headerStr.includes('<svg') ||
        headerStr.startsWith('<svg')
    ) {
        return 'svg';
    }
    
    // Default to JPEG
    return 'jpeg';
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF watermarking process...');
        
        // Get API key either from header or query parameter for API usage
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        // If this is a programmatic API call (not from web UI), validate the API key
        if (apiKey) {
            console.log('Validating API key for watermarking operation');
            const validation = await validateApiKey(apiKey, 'watermark');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'watermark');
            }
        }
        
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const watermarkType = formData.get('watermarkType') as string || 'text';
        
        // Get common options
        const position = formData.get('position') as string || 'center';
        const pages = formData.get('pages') as string || 'all';
        const customPages = formData.get('customPages') as string || '';
        
        if (!file) {
            return NextResponse.json(
                { error: 'No PDF file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json(
                { error: 'Only PDF files can be watermarked' },
                { status: 400 }
            );
        }

        // Create unique IDs for files
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(WATERMARKED_DIR, `${uniqueId}-watermarked.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Load the PDF document
        const pdfBytes = await readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();
        
        // Determine which pages to watermark
        const pagesToWatermark = getPagesToWatermark(totalPages, pages, customPages);
        
        // If no valid pages were selected, return an error
        if (pagesToWatermark.length === 0) {
            return NextResponse.json(
                { error: 'No valid pages selected for watermarking' },
                { status: 400 }
            );
        }
        
        // Apply watermark based on type
        if (watermarkType === 'text') {
            // Get text watermark options
            const text = formData.get('text') as string || 'WATERMARK';
            const textColor = formData.get('textColor') as string || '#FF0000';
            const fontSize = parseInt(formData.get('fontSize') as string || '48');
            const fontFamily = formData.get('fontFamily') as string || 'Arial';
            const opacity = parseInt(formData.get('opacity') as string || '30');
            const rotation = parseInt(formData.get('rotation') as string || '45');
            
            // Add text watermark
            await addTextWatermark(pdfDoc, pagesToWatermark, {
                text,
                fontSize,
                fontFamily,
                color: textColor,
                opacity,
                rotation,
                position
            });
        } else if (watermarkType === 'image') {
            // Get image watermark
            const watermarkImage = formData.get('watermarkImage') as File;
            
            if (!watermarkImage) {
                return NextResponse.json(
                    { error: 'No watermark image provided' },
                    { status: 400 }
                );
            }
            
            // Get image watermark options
            const scale = parseInt(formData.get('scale') as string || '50');
            const opacity = parseInt(formData.get('opacity') as string || '30');
            const rotation = parseInt(formData.get('rotation') as string || '0');
            
            // Read image file
            const imageBuffer = Buffer.from(await watermarkImage.arrayBuffer());
            
            // Add image watermark
            await addImageWatermark(pdfDoc, pagesToWatermark, imageBuffer, {
                scale,
                opacity,
                rotation,
                position
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid watermark type' },
                { status: 400 }
            );
        }
        
        // Save the watermarked PDF
        const watermarkedPdfBytes = await pdfDoc.save();
        await writeFile(outputPath, watermarkedPdfBytes);
        
        // Create relative URL for download
        const fileUrl = `/watermarked/${uniqueId}-watermarked.pdf`;
        
        return NextResponse.json({
            success: true,
            message: 'PDF watermarked successfully',
            fileUrl,
            filename: `${uniqueId}-watermarked.pdf`,
            originalName: file.name,
            pagesWatermarked: pagesToWatermark.length
        });
    } catch (error) {
        console.error('PDF watermarking error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF watermarking',
                success: false
            },
            { status: 500 }
        );
    }
}