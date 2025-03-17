import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const WATERMARK_DIR = join(process.cwd(), 'public', 'watermarks');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(WATERMARK_DIR)) {
        await mkdir(WATERMARK_DIR, { recursive: true });
    }
}

// Parse color (hex to rgb)
function parseColor(hexColor: string) {
    // Default color: black with 30% opacity
    let r = 0, g = 0, b = 0;
    
    // Remove the # if present
    if (hexColor.startsWith('#')) {
        hexColor = hexColor.substring(1);
    }
    
    // Parse hex color
    if (hexColor.length === 6) {
        r = parseInt(hexColor.substring(0, 2), 16) / 255;
        g = parseInt(hexColor.substring(2, 4), 16) / 255;
        b = parseInt(hexColor.substring(4, 6), 16) / 255;
    } else if (hexColor.length === 3) {
        r = parseInt(hexColor.charAt(0) + hexColor.charAt(0), 16) / 255;
        g = parseInt(hexColor.charAt(1) + hexColor.charAt(1), 16) / 255;
        b = parseInt(hexColor.charAt(2) + hexColor.charAt(2), 16) / 255;
    }
    
    return { r, g, b };
}

// Add text watermark to PDF
async function addTextWatermark(inputPath: string, outputPath: string, options: {
    text: string;
    opacity: number;
    size: number;
    position: string;
    pages: number[] | null;
    color: string;
    rotation: number;
}) {
    try {
        // Read the PDF file
        const pdfBytes = await readFile(inputPath);
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Get a standard font
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        // Get total pages
        const totalPages = pdfDoc.getPageCount();
        
        // Determine which pages to watermark
        const pagesToWatermark = options.pages && options.pages.length > 0
            ? options.pages.filter(p => p >= 0 && p < totalPages)
            : Array.from({ length: totalPages }, (_, i) => i); // Default to all pages
            
        if (pagesToWatermark.length === 0) {
            throw new Error("No valid pages to watermark");
        }
        
        // Parse color (hex to rgb)
        const color = parseColor(options.color);
        
        // Process each page
        for (const pageIndex of pagesToWatermark) {
            const page = pdfDoc.getPage(pageIndex);
            const { width, height } = page.getSize();
            
            // Calculate font size based on page dimensions
            const fontSize = options.size * (Math.min(width, height) / 100);
            
            // Calculate position
            let x = width / 2;
            let y = height / 2;
            
            // Adjust position based on option
            switch (options.position) {
                case 'top-left':
                    x = width * 0.1;
                    y = height * 0.9;
                    break;
                case 'top-center':
                    x = width / 2;
                    y = height * 0.9;
                    break;
                case 'top-right':
                    x = width * 0.9;
                    y = height * 0.9;
                    break;
                case 'center-left':
                    x = width * 0.1;
                    y = height / 2;
                    break;
                case 'center':
                    x = width / 2;
                    y = height / 2;
                    break;
                case 'center-right':
                    x = width * 0.9;
                    y = height / 2;
                    break;
                case 'bottom-left':
                    x = width * 0.1;
                    y = height * 0.1;
                    break;
                case 'bottom-center':
                    x = width / 2;
                    y = height * 0.1;
                    break;
                case 'bottom-right':
                    x = width * 0.9;
                    y = height * 0.1;
                    break;
                default:
                    // Center by default
                    x = width / 2;
                    y = height / 2;
            }
            
            // Measure text to center it properly
            const textWidth = font.widthOfTextAtSize(options.text, fontSize);
            const textHeight = font.heightAtSize(fontSize);
            
            // Center text horizontally based on position
            if (options.position.includes('center') && !options.position.includes('left') && !options.position.includes('right')) {
                x -= textWidth / 2;
            } else if (options.position.includes('right')) {
                x -= textWidth;
            }
            
            // Center text vertically based on position
            if (options.position.includes('center') && !options.position.includes('top') && !options.position.includes('bottom')) {
                y -= textHeight / 2;
            } else if (options.position.includes('bottom')) {
                y += textHeight;
            } else if (options.position.includes('top')) {
                y -= textHeight / 2;
            }
            
            // Draw text
            page.drawText(options.text, {
                x,
                y,
                size: fontSize,
                font,
                color: rgb(color.r, color.g, color.b),
                opacity: options.opacity,
                rotate: degrees(options.rotation),
            });
        }
        
        // Save the watermarked document
        const watermarkedPdfBytes = await pdfDoc.save();
        
        // Write to file
        await writeFile(outputPath, watermarkedPdfBytes);
        
        return {
            totalPages,
            watermarkedPages: pagesToWatermark.length,
            pageNumbers: pagesToWatermark.map(i => i + 1) // Convert to 1-based for response
        };
    } catch (error) {
        console.error('PDF watermark error:', error);
        throw new Error('Failed to add watermark to PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF watermarking process...');
        await ensureDirectories();
        
        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
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
        
        // Get watermark text and options
        const watermarkText = formData.get('text') as string || 'WATERMARK';
        
        // Parse opacity (0-1)
        let opacity = 0.3; // Default opacity 30%
        const opacityParam = formData.get('opacity') as string;
        if (opacityParam) {
            const opacityValue = parseFloat(opacityParam);
            if (!isNaN(opacityValue) && opacityValue >= 0 && opacityValue <= 1) {
                opacity = opacityValue;
            }
        }
        
        // Parse size (1-100)
        let size = 20; // Default size 20% of page
        const sizeParam = formData.get('size') as string;
        if (sizeParam) {
            const sizeValue = parseFloat(sizeParam);
            if (!isNaN(sizeValue) && sizeValue > 0 && sizeValue <= 100) {
                size = sizeValue;
            }
        }
        
        // Parse position
        let position = 'center'; // Default position
        const positionParam = formData.get('position') as string;
        if (positionParam && [
            'top-left', 'top-center', 'top-right',
            'center-left', 'center', 'center-right',
            'bottom-left', 'bottom-center', 'bottom-right'
        ].includes(positionParam)) {
            position = positionParam;
        }
        
        // Parse color
        let color = '#000000'; // Default color (black)
        const colorParam = formData.get('color') as string;
        if (colorParam && /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(colorParam)) {
            color = colorParam;
        }
        
        // Parse rotation
        let rotation = 45; // Default rotation 45 degrees
        const rotationParam = formData.get('rotation') as string;
        if (rotationParam) {
            const rotationValue = parseFloat(rotationParam);
            if (!isNaN(rotationValue)) {
                rotation = rotationValue;
            }
        }
        
        // Parse pages
        let pages: number[] = [];
        const pagesParam = formData.get('pages') as string;
        if (pagesParam) {
            try {
                // First try to parse as JSON array
                if (pagesParam.startsWith('[')) {
                    pages = JSON.parse(pagesParam);
                } else {
                    // Try to parse as comma-separated list
                    pages = pagesParam.split(',')
                        .map(p => p.trim())
                        .filter(p => /^\d+$/.test(p))
                        .map(p => parseInt(p) - 1); // Convert to 0-based indices
                }
            } catch (e) {
                console.error('Invalid pages parameter:', e);
                pages = []; // Default to all pages
            }
        }
        
        // Create unique ID for this operation
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(WATERMARK_DIR, `${uniqueId}-watermarked.pdf`);
        
        // Write input file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);
        
        // Add watermark
        const watermarkResult = await addTextWatermark(inputPath, outputPath, {
            text: watermarkText,
            opacity,
            size,
            position,
            pages: pages.length > 0 ? pages : null,
            color,
            rotation
        });
        
        // Create relative URL for the watermarked file
        const fileUrl = `/watermarks/${uniqueId}-watermarked.pdf`;
        
        return NextResponse.json({
            success: true,
            message: 'PDF watermarking successful',
            fileUrl,
            filename: `${uniqueId}-watermarked.pdf`,
            text: watermarkText,
            totalPages: watermarkResult.totalPages,
            watermarkedPages: watermarkResult.watermarkedPages,
            pageNumbers: watermarkResult.pageNumbers
        });
    } catch (error) {
        console.error('Watermark error:', error);
        
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during watermarking',
                success: false
            },
            { status: 500 }
        );
    }
}