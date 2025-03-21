// app/api/pdf/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import sharp from 'sharp';

type FontName =
    | "Courier"
    | "CourierBold"
    | "CourierOblique"
    | "CourierBoldOblique"
    | "Helvetica"
    | "HelveticaBold"
    | "HelveticaOblique"
    | "HelveticaBoldOblique"
    | "TimesRoman"
    | "TimesRomanBold"
    | "TimesRomanItalic"
    | "TimesRomanBoldItalic"
    | "Symbol"
    | "ZapfDingbats";

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const EDITED_DIR = join(process.cwd(), 'public', 'edited');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, EDITED_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Convert base64 to image file
async function saveBase64AsImage(base64String: string, outputPath: string): Promise<void> {
    // Remove data:image/png;base64, prefix if it exists
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(outputPath, buffer);
}

// Apply drawings to PDF
async function applyDrawingsToPdf(
    pdfPath: string,
    outputPath: string,
    pages: any[]
): Promise<boolean> {
    try {
        // Read the PDF file
        const pdfBytes = await readFile(pdfPath);

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Process each page
        for (let i = 0; i < pages.length; i++) {
            const pageData = pages[i];
            const pdfPage = pdfDoc.getPage(i);
            const { width, height } = pdfPage.getSize();

            // Scale factor to convert from image coordinates to PDF coordinates
            const scaleX = width / pageData.width;
            const scaleY = height / pageData.height;

            // Process drawings for this page
            if (pageData.drawings && Array.isArray(pageData.drawings)) {
                for (const drawing of pageData.drawings) {
                    if (drawing.type === 'text' && drawing.text && drawing.x !== undefined && drawing.y !== undefined) {
                        // Add text
                        let fontName: keyof typeof StandardFonts = 'Helvetica'; // Use string literal instead of enum

                        // Map font family to standard PDF fonts
                        if (drawing.fontFamily) {
                            if (drawing.fontFamily.includes('Times')) {
                                fontName = 'TimesRoman'; // Use string literal
                            } else if (drawing.fontFamily.includes('Courier')) {
                                fontName = 'Courier'; // Use string literal
                            }
                        }

                        const font = await pdfDoc.embedFont(StandardFonts[fontName]);
                        const textSize = drawing.fontSize || 16;

                        // Convert color from hex to RGB
                        let r = 0, g = 0, b = 0;
                        if (drawing.color && drawing.color.startsWith('#')) {
                            const hex = drawing.color.slice(1);
                            r = parseInt(hex.substring(0, 2), 16) / 255;
                            g = parseInt(hex.substring(2, 4), 16) / 255;
                            b = parseInt(hex.substring(4, 6), 16) / 255;
                        }

                        pdfPage.drawText(drawing.text, {
                            x: drawing.x * scaleX,
                            y: height - (drawing.y * scaleY), // Invert Y coordinate for PDF
                            size: textSize * Math.min(scaleX, scaleY),
                            font,
                            color: rgb(r, g, b),
                            opacity: drawing.opacity || 1,
                        });
                    }
                    else if (drawing.type === 'image' && drawing.imageData && drawing.x !== undefined && drawing.y !== undefined) {
                        // Add image (e.g., signature)
                        try {
                            // Save image data to temp file
                            const imageId = uuidv4();
                            const imagePath = join(TEMP_DIR, `${imageId}.png`);
                            await saveBase64AsImage(drawing.imageData, imagePath);

                            // Embed image in PDF
                            const imageBytes = await readFile(imagePath);
                            const image = await pdfDoc.embedPng(imageBytes);

                            // Calculate dimensions
                            const imageWidth = (drawing.width || 200) * scaleX;
                            const imageHeight = (drawing.height || 100) * scaleY;

                            // Draw image
                            pdfPage.drawImage(image, {
                                x: drawing.x * scaleX,
                                y: height - (drawing.y * scaleY) - imageHeight, // Adjust Y for PDF coordinates
                                width: imageWidth,
                                height: imageHeight,
                                opacity: drawing.opacity || 1,
                            });
                        } catch (imageError) {
                            console.error('Error embedding image:', imageError);
                        }
                    }
                    else if ((drawing.type === 'freehand' || drawing.type === 'highlight') &&
                        drawing.points &&
                        drawing.points.length > 1) {
                        try {
                            // Scale points to PDF coordinates
                            const scaledPoints = drawing.points.map((point: { x: number; y: number }) => ({
                                x: point.x * scaleX,
                                y: height - (point.y * scaleY)
                            }));

                            // Create SVG path from scaled points with explicit types
                            const pathData = scaledPoints.reduce((
                                path: string,
                                point: { x: number; y: number },
                                index: number
                            ) => {
                                return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
                            }, '');


                            // Adjust stroke width based on scale
                            const adjustedStrokeWidth = (drawing.lineWidth || 2) * Math.min(scaleX, scaleY);

                            // Determine stroke color with fallback
                            const strokeColor = drawing.color?.startsWith('#') ? drawing.color : '#000000';

                            // Handle highlight-specific styling
                            const isHighlight = drawing.type === 'highlight';
                            const fill = isHighlight ? strokeColor : 'none';
                            const opacity = isHighlight ? (drawing.opacity || 0.3) : (drawing.opacity || 1);

                            // Create SVG content
                            const svgContent = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="${pathData}" 
                    stroke="${strokeColor}"
                    stroke-width="${adjustedStrokeWidth}"
                    fill="${fill}"
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    opacity="${opacity}"
                />
            </svg>
        `.trim();

                            // Generate unique ID and file paths
                            const svgId = uuidv4();
                            const svgPath = join(TEMP_DIR, `${svgId}.svg`);
                            const pngPath = join(TEMP_DIR, `${svgId}.png`);

                            // Write SVG and convert to PNG
                            await writeFile(svgPath, svgContent);
                            await sharp(svgPath)
                                .png({ quality: 100, compressionLevel: 0 })
                                .toFile(pngPath);

                            // Embed PNG in PDF
                            const imageBytes = await readFile(pngPath);
                            const image = await pdfDoc.embedPng(imageBytes);

                            pdfPage.drawImage(image, {
                                x: 0,
                                y: 0,
                                width: width,
                                height: height,
                                opacity: 1
                            });

                            // Clean up temporary files
                            await Promise.all([
                                unlink(svgPath).catch(() => { }),
                                unlink(pngPath).catch(() => { })
                            ]);

                        } catch (svgError) {
                            console.error('Error processing freehand/highlight drawing:', svgError);
                        }
                    }
                    else if ((drawing.type === 'line' || drawing.type === 'rectangle' || drawing.type === 'circle') &&
                        drawing.x !== undefined && drawing.y !== undefined) {
                        // For simple shapes, we'll also convert to SVG then PNG
                        try {
                            // Create SVG based on shape type
                            let svgShape = '';
                            if (drawing.type === 'line') {
                                svgShape = `<line x1="${drawing.x}" y1="${drawing.y}" 
                                                x2="${drawing.x + (drawing.width || 0)}" 
                                                y2="${drawing.y + (drawing.height || 0)}" 
                                                stroke="${drawing.color || '#000000'}" 
                                                stroke-width="${drawing.lineWidth || 2}" 
                                                opacity="${drawing.opacity || 1}" />`;
                            } else if (drawing.type === 'rectangle') {
                                const x = drawing.width && drawing.width < 0 ? drawing.x + drawing.width : drawing.x;
                                const y = drawing.height && drawing.height < 0 ? drawing.y + drawing.height : drawing.y;
                                svgShape = `<rect x="${x}" y="${y}" 
                                                width="${Math.abs(drawing.width || 0)}" 
                                                height="${Math.abs(drawing.height || 0)}" 
                                                stroke="${drawing.color || '#000000'}" 
                                                stroke-width="${drawing.lineWidth || 2}" 
                                                fill="none" 
                                                opacity="${drawing.opacity || 1}" />`;
                            } else if (drawing.type === 'circle') {
                                const radius = Math.sqrt(
                                    Math.pow(drawing.width || 0, 2) +
                                    Math.pow(drawing.height || 0, 2)
                                ) / 2;

                                svgShape = `<circle cx="${drawing.x + (drawing.width || 0) / 2}" 
                                                cy="${drawing.y + (drawing.height || 0) / 2}" 
                                                r="${radius}" 
                                                stroke="${drawing.color || '#000000'}" 
                                                stroke-width="${drawing.lineWidth || 2}" 
                                                fill="none" 
                                                opacity="${drawing.opacity || 1}" />`;
                            }

                            // Create complete SVG with the shape
                            const svgWidth = pageData.width;
                            const svgHeight = pageData.height;

                            const svgContent = `
                                <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
                                    ${svgShape}
                                </svg>
                            `;

                            // Save SVG to temp file
                            const svgId = uuidv4();
                            const svgPath = join(TEMP_DIR, `${svgId}.svg`);
                            await writeFile(svgPath, svgContent);

                            // Convert SVG to PNG with transparent background
                            const pngPath = join(TEMP_DIR, `${svgId}.png`);
                            await sharp(svgPath)
                                .resize({ width: svgWidth, height: svgHeight, fit: 'contain' })
                                .toFormat('png')
                                .toFile(pngPath);

                            // Embed PNG in PDF
                            const imageBytes = await readFile(pngPath);
                            const image = await pdfDoc.embedPng(imageBytes);

                            // Draw image on page
                            pdfPage.drawImage(image, {
                                x: 0,
                                y: 0,
                                width: width,
                                height: height,
                            });
                        } catch (shapeError) {
                            console.error('Error processing shape as SVG:', shapeError);
                        }
                    }
                }
            }

            // Process extracted text edits for this page
            if (pageData.extractedText && Array.isArray(pageData.extractedText)) {
                for (const textItem of pageData.extractedText) {
                    if (textItem.text && textItem.x !== undefined && textItem.y !== undefined) {
                        let fontName: keyof typeof StandardFonts = 'Helvetica';

                        if (textItem.fontFamily) {
                            if (textItem.fontFamily.includes('Times')) {
                                fontName = 'TimesRoman';
                            } else if (textItem.fontFamily.includes('Courier')) {
                                fontName = 'Courier';
                            }
                        }

                        const font = await pdfDoc.embedFont(StandardFonts[fontName]);
                        const textSize = textItem.fontSize || 12;

                        // For extracted text, we may need to "erase" the original text
                        // by drawing a white rectangle behind it first
                        pdfPage.drawRectangle({
                            x: textItem.x * scaleX,
                            y: height - (textItem.y * scaleY) - (textItem.height || 20) * scaleY,
                            width: (textItem.width || 100) * scaleX,
                            height: (textItem.height || 20) * scaleY,
                            color: rgb(1, 1, 1), // White
                        });

                        // Draw the new text
                        pdfPage.drawText(textItem.text, {
                            x: textItem.x * scaleX,
                            y: height - (textItem.y * scaleY), // Invert Y coordinate for PDF
                            size: textSize * Math.min(scaleX, scaleY),
                            font,
                            color: rgb(0, 0, 0), // Default to black for extracted text
                        });
                    }
                }
            }
        }

        // Save the modified PDF
        const modifiedPdfBytes = await pdfDoc.save();

        // Write to output file
        await writeFile(outputPath, modifiedPdfBytes);

        return true;
    } catch (error) {
        console.error('Error applying drawings to PDF:', error);
        throw new Error(`Failed to apply drawings to PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
}
async function applyTextReplacementsToPdf(
    pdfPath: string,
    outputPath: string,
    pages: any[]
): Promise<boolean> {
    try {
        // Read the PDF file
        const pdfBytes = await readFile(pdfPath);

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Process each page
        for (let i = 0; i < pages.length; i++) {
            const pageData = pages[i];
            const pdfPage = pdfDoc.getPage(i);
            const { width, height } = pdfPage.getSize();

            // Scale factor to convert from image coordinates to PDF coordinates
            const scaleX = width / pageData.width;
            const scaleY = height / pageData.height;

            // Process extracted text replacements for this page
            if (pageData.extractedText && Array.isArray(pageData.extractedText)) {
                for (const textItem of pageData.extractedText) {
                    if (textItem.text && textItem.x !== undefined && textItem.y !== undefined) {
                        // For more accurate text replacement, we need to:
                        // 1. Erase the original text by covering it with a white rectangle
                        // 2. Add the new text at exactly the same position

                        // Determine text bounds with proper scaling
                        const x = textItem.x * scaleX;
                        const y = height - (textItem.y * scaleY); // Invert Y for PDF coordinates
                        const textWidth = (textItem.width || 100) * scaleX;
                        const textHeight = (textItem.height || 20) * scaleY;

                        // 1. Draw a white rectangle to cover original text
                        pdfPage.drawRectangle({
                            x,
                            y: y - textHeight, // Adjust for text height
                            width: textWidth,
                            height: textHeight,
                            color: rgb(1, 1, 1), // White
                            opacity: 1,
                        });

                        // 2. Draw the new text
                        // Select appropriate font
                        let fontName: keyof typeof StandardFonts = 'Helvetica';
                        if (textItem.fontFamily) {
                            if (textItem.fontFamily.includes('Times')) {
                                fontName = 'TimesRoman';
                            } else if (textItem.fontFamily.includes('Courier')) {
                                fontName = 'Courier';
                            }
                        }

                        const font = await pdfDoc.embedFont(StandardFonts[fontName]);
                        const fontSize = (textItem.fontSize || 12) * Math.min(scaleX, scaleY);

                        // Parse text color (default to black if not specified)
                        let r = 0, g = 0, b = 0;
                        if (textItem.color && textItem.color.startsWith('#')) {
                            const hex = textItem.color.slice(1);
                            r = parseInt(hex.substring(0, 2), 16) / 255;
                            g = parseInt(hex.substring(2, 4), 16) / 255;
                            b = parseInt(hex.substring(4, 6), 16) / 255;
                        }

                        // Draw the replacement text
                        pdfPage.drawText(textItem.text, {
                            x,
                            y, // Keep original Y position
                            size: fontSize,
                            font,
                            color: rgb(r, g, b),
                            opacity: textItem.opacity || 1,
                        });
                    }
                }
            }

            // Continue with processing other drawing elements...
            // (drawings, shapes, images, etc. as in the original function)
        }

        // Save the modified PDF
        const modifiedPdfBytes = await pdfDoc.save();

        // Write to output file
        await writeFile(outputPath, modifiedPdfBytes);

        return true;
    } catch (error) {
        console.error('Error applying text replacements to PDF:', error);
        throw new Error(`Failed to apply text replacements to PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
}
export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF editing process...');
        await ensureDirectories();

        // Parse JSON body
        const body = await request.json();
        const { pdfName, pages } = body;

        if (!pages || !Array.isArray(pages) || pages.length === 0) {
            return NextResponse.json(
                { error: 'No page data provided' },
                { status: 400 }
            );
        }

        // Create unique ID for this edit operation
        const uniqueId = uuidv4();
        const tempPdfPath = join(UPLOAD_DIR, `${uniqueId}-temp.pdf`);
        const outputPath = join(EDITED_DIR, `${uniqueId}-edited.pdf`);

        // First, create a base PDF from the page images
        const pdfDoc = await PDFDocument.create();

        // Add pages based on the images
        for (let i = 0; i < pages.length; i++) {
            const pageData = pages[i];

            // Get the image URL and download to local file
            const imageUrl = pageData.imageUrl;
            const imagePath = join(TEMP_DIR, `${uniqueId}-page-${i}.png`);

            try {
                // Download image from URL - handle both absolute and relative URLs
                const imageUrlToFetch = imageUrl.startsWith('http')
                    ? imageUrl
                    : `http://localhost:3000${imageUrl}`;

                const response = await fetch(imageUrlToFetch);

                if (!response.ok) {
                    throw new Error(`Failed to download image: ${response.statusText}`);
                }

                const imageBuffer = Buffer.from(await response.arrayBuffer());
                await writeFile(imagePath, imageBuffer);

                // Add page to PDF with proper dimensions
                const image = await pdfDoc.embedPng(imageBuffer);
                const { width, height } = image;

                const page = pdfDoc.addPage([width, height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                });
            } catch (imageError) {
                console.error(`Error handling image at page ${i}:`, imageError);
                // Create a fallback page if image processing fails
                const page = pdfDoc.addPage([612, 792]); // Standard letter size
                page.drawText(`Page ${i + 1} (Image processing failed)`, {
                    x: 50,
                    y: 700,
                    size: 20,
                });
            }
        }

        // Save the temporary base PDF
        const pdfBytes = await pdfDoc.save();
        await writeFile(tempPdfPath, pdfBytes);

        // Now apply all drawings and text replacements to the PDF
        // Use the enhanced function for better text replacement
        await applyTextReplacementsToPdf(tempPdfPath, outputPath, pages);

        // Create relative URL for the edited file
        const fileUrl = `/edited/${uniqueId}-edited.pdf`;

        return NextResponse.json({
            success: true,
            message: 'PDF edited successfully',
            fileUrl,
            filename: `${uniqueId}-edited.pdf`,
        });
    } catch (error) {
        console.error('PDF editing error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF editing',
                success: false
            },
            { status: 500 }
        );
    }
}