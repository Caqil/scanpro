// app/api/pdf/process/route.ts - Fixed version
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';
import path from 'path';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const PROCESS_DIR = join(process.cwd(), 'public', 'processed');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, PROCESS_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Check if command exists
async function commandExists(command: string): Promise<boolean> {
    try {
        if (process.platform === 'win32') {
            // For Windows, check using where command
            await execPromise(`where ${command}`);
        } else {
            // For Unix-like systems (Linux, macOS), use which
            await execPromise(`which ${command}`);
        }
        return true;
    } catch (error) {
        return false;
    }
}

// Convert PDF pages to images
async function pdfToImages(pdfPath: string, outputDir: string, sessionId: string): Promise<{
    imageUrls: string[],
    dimensions: { width: number, height: number, originalWidth: number, originalHeight: number }[],
    pageCount: number,
    hasEmbeddedText: boolean
}> {
    try {
        // Get PDF info
        const pdfBytes = await readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pageCount = pdfDoc.getPageCount();

        // Check if PDF has embedded text (approximate check)
        let hasEmbeddedText = false;
        try {
            // If pdftotext is available, use it to check for text
            const hasPdfToText = await commandExists('pdftotext');
            if (hasPdfToText) {
                const { stdout } = await execPromise(`pdftotext -f 1 -l 1 "${pdfPath}" - | wc -w`);
                const wordCount = parseInt(stdout.trim());
                hasEmbeddedText = wordCount > 10; // If we have more than 10 words, assume it has text
            }
        } catch (error) {
            console.error("Error checking for embedded text:", error);
            // Default to false, will use OCR if needed
            hasEmbeddedText = false;
        }

        const imageUrls: string[] = [];
        const dimensions: { width: number, height: number, originalWidth: number, originalHeight: number }[] = [];

        // Check for conversion tools
        const hasPdftoppm = await commandExists('pdftoppm');
        const hasGhostscript = await commandExists('gs') || await commandExists('gswin64c');
        const hasImageMagick = await commandExists('convert');

        console.log(`Available tools: pdftoppm=${hasPdftoppm}, ghostscript=${hasGhostscript}, imagemagick=${hasImageMagick}`);

        // If no conversion tools are available, create fallback images
        if (!hasPdftoppm && !hasGhostscript && !hasImageMagick) {
            console.log("No PDF to image conversion tools available, using fallback method");
            return await createFallbackImages(pdfDoc, outputDir, sessionId);
        }

        // Use pdftoppm if available (best quality)
        if (hasPdftoppm) {
            console.log("Using pdftoppm for PDF to image conversion");
            for (let i = 0; i < pageCount; i++) {
                const pageNum = i + 1;
                const outputPrefix = join(TEMP_DIR, `${sessionId}-page`);

                // Create PNG files
                const pdftoppmCmd = `pdftoppm -png -r 150 -f ${pageNum} -l ${pageNum} "${pdfPath}" "${outputPrefix}"`;
                console.log(`Executing: ${pdftoppmCmd}`);
                
                try {
                    await execPromise(pdftoppmCmd);
                } catch (error) {
                    console.error(`Error executing pdftoppm: ${error}`);
                    throw error;
                }

                // pdftoppm names files like prefix-01.png, prefix-02.png, etc.
                // Find the generated file - it might be padded with zeros
                const possibleFilenames = [
                    `${outputPrefix}-${pageNum}.png`,                // page-1.png
                    `${outputPrefix}-${String(pageNum).padStart(2, '0')}.png`, // page-01.png
                    `${outputPrefix}-${String(pageNum).padStart(3, '0')}.png`  // page-001.png
                ];

                let generatedImagePath = '';
                for (const filename of possibleFilenames) {
                    if (existsSync(filename)) {
                        generatedImagePath = filename;
                        break;
                    }
                }

                if (!generatedImagePath) {
                    console.error(`Could not find generated image for page ${pageNum}`);
                    throw new Error(`Image not generated for page ${pageNum}`);
                }

                // Rename to a consistent format and move to public dir
                const finalImagePath = join(PROCESS_DIR, `${sessionId}-page-${i}.png`);
                await copyFile(generatedImagePath, finalImagePath);
                
                try {
                    // Get image dimensions using ImageMagick if available
                    let width = 0, height = 0;
                    
                    if (hasImageMagick) {
                        const { stdout } = await execPromise(`identify -format "%w %h" "${finalImagePath}"`);
                        [width, height] = stdout.trim().split(' ').map(Number);
                    } else {
                        // Fallback dimensions - estimate based on PDF page and DPI
                        const page = pdfDoc.getPage(i);
                        const { width: pdfWidth, height: pdfHeight } = page.getSize();
                        width = Math.round(pdfWidth * 1.5);  // Assuming 150 DPI, convert from points (72 per inch)
                        height = Math.round(pdfHeight * 1.5);
                    }

                    // Original PDF page dimensions (in points)
                    const page = pdfDoc.getPage(i);
                    const { width: originalWidth, height: originalHeight } = page.getSize();

                    imageUrls.push(`/processed/${sessionId}-page-${i}.png`);
                    dimensions.push({
                        width,
                        height,
                        originalWidth,
                        originalHeight
                    });
                } catch (dimError) {
                    console.error(`Error getting dimensions: ${dimError}`);
                    throw dimError;
                }
            }
        }
        // Fallback to Ghostscript
        else if (hasGhostscript) {
            console.log("Using Ghostscript for PDF to image conversion");
            const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';

            for (let i = 0; i < pageCount; i++) {
                const pageNum = i + 1;
                const outputPath = join(PROCESS_DIR, `${sessionId}-page-${i}.png`);

                // Use Ghostscript to convert PDF to PNG
                const gsArgs = [
                    '-dQUIET',
                    '-dBATCH',
                    '-dNOPAUSE',
                    '-sDEVICE=png16m',
                    '-r150', // 150 DPI resolution
                    `-dFirstPage=${pageNum}`,
                    `-dLastPage=${pageNum}`,
                    `-sOutputFile=${outputPath}`,
                    pdfPath
                ];

                const gsCmd = `${gsCommand} ${gsArgs.join(' ')}`;
                console.log(`Executing: ${gsCmd}`);
                await execPromise(gsCmd);

                if (!existsSync(outputPath)) {
                    console.error(`Image not generated for page ${pageNum}`);
                    throw new Error(`Image not generated for page ${pageNum}`);
                }

                // Get image dimensions
                let width = 0, height = 0;
                
                if (hasImageMagick) {
                    const { stdout } = await execPromise(`identify -format "%w %h" "${outputPath}"`);
                    [width, height] = stdout.trim().split(' ').map(Number);
                } else {
                    // Fallback dimensions - estimate based on PDF page and DPI
                    const page = pdfDoc.getPage(i);
                    const { width: pdfWidth, height: pdfHeight } = page.getSize();
                    width = Math.round(pdfWidth * 1.5);  // Assuming 150 DPI
                    height = Math.round(pdfHeight * 1.5);
                }

                // Original PDF page dimensions (in points)
                const page = pdfDoc.getPage(i);
                const { width: originalWidth, height: originalHeight } = page.getSize();

                imageUrls.push(`/processed/${path.basename(outputPath)}`);
                dimensions.push({
                    width,
                    height,
                    originalWidth,
                    originalHeight
                });
            }
        }
        // Fallback to ImageMagick if available
        else if (hasImageMagick) {
            console.log("Using ImageMagick for PDF to image conversion");
            for (let i = 0; i < pageCount; i++) {
                const pageNum = i + 1;
                const outputPath = join(PROCESS_DIR, `${sessionId}-page-${i}.png`);

                // Use ImageMagick to convert PDF to PNG
                const convertCmd = `convert -density 150 "${pdfPath}"[${i}] "${outputPath}"`;
                console.log(`Executing: ${convertCmd}`);
                await execPromise(convertCmd);

                if (!existsSync(outputPath)) {
                    console.error(`Image not generated for page ${pageNum}`);
                    throw new Error(`Image not generated for page ${pageNum}`);
                }

                // Get image dimensions
                const { stdout } = await execPromise(`identify -format "%w %h" "${outputPath}"`);
                const [width, height] = stdout.trim().split(' ').map(Number);

                // Original PDF page dimensions (in points)
                const page = pdfDoc.getPage(i);
                const { width: originalWidth, height: originalHeight } = page.getSize();

                imageUrls.push(`/processed/${path.basename(outputPath)}`);
                dimensions.push({
                    width,
                    height,
                    originalWidth,
                    originalHeight
                });
            }
        }

        return {
            imageUrls,
            dimensions,
            pageCount,
            hasEmbeddedText
        };
    } catch (error) {
        console.error("Error converting PDF to images:", error);
        throw error;
    }
}

// Create fallback images when no conversion tools are available
async function createFallbackImages(
    pdfDoc: PDFDocument,
    outputDir: string,
    sessionId: string
): Promise<{
    imageUrls: string[],
    dimensions: { width: number, height: number, originalWidth: number, originalHeight: number }[],
    pageCount: number,
    hasEmbeddedText: boolean
}> {
    const imageUrls: string[] = [];
    const dimensions: { width: number, height: number, originalWidth: number, originalHeight: number }[] = [];
    const pageCount = pdfDoc.getPageCount();

    // Create a simple placeholder image for each page
    for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const { width: originalWidth, height: originalHeight } = page.getSize();
        
        // Create a scaled version for display
        const width = originalWidth * 2;  // Simple scaling factor
        const height = originalHeight * 2;
        
        // Create a simple SVG placeholder
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle">
                Page ${i + 1} (Placeholder)
            </text>
        </svg>`;
        
        const outputPath = join(outputDir, `${sessionId}-page-${i}.svg`);
        await writeFile(outputPath, svgContent);
        
        imageUrls.push(`/processed/${sessionId}-page-${i}.svg`);
        dimensions.push({
            width,
            height,
            originalWidth,
            originalHeight
        });
    }
    
    return {
        imageUrls,
        dimensions,
        pageCount,
        hasEmbeddedText: false
    };
}

// Extract text from PDF that has embedded text
async function extractTextFromPdf(pdfPath: string): Promise<any[]> {
    try {
        // Use pdftotext to extract text with bounding boxes
        // We're going to use a custom approach here that would need to be implemented.
        // In a real implementation, you might use pdf.js or another tool to extract text with coordinates

        // For this demo, we'll just return a simplified structure 
        const extractedText: any[] = [];

        return extractedText;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        return [];
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF processing...');
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
                { error: 'Only PDF files can be processed' },
                { status: 400 }
            );
        }

        // Create session ID
        const sessionId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${sessionId}-input.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);
        console.log(`Saved uploaded PDF to ${inputPath}`);

        // Convert PDF to images
        const { imageUrls, dimensions, pageCount, hasEmbeddedText } = await pdfToImages(
            inputPath,
            PROCESS_DIR,
            sessionId
        );
        
        console.log(`Converted ${pageCount} pages to images, hasEmbeddedText: ${hasEmbeddedText}`);

        // Extract text if PDF has embedded text
        const extractedText = hasEmbeddedText ? await extractTextFromPdf(inputPath) : [];

        // Format response data
        const pages = imageUrls.map((imageUrl, index) => ({
            imageUrl,
            width: dimensions[index].width,
            height: dimensions[index].height,
            originalWidth: dimensions[index].originalWidth,
            originalHeight: dimensions[index].originalHeight,
            extractedText: extractedText[index] || []
        }));

        return NextResponse.json({
            success: true,
            message: 'PDF processed successfully',
            sessionId,
            pageCount,
            needsOcr: !hasEmbeddedText,
            pages
        });
    } catch (error) {
        console.error('PDF processing error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF processing',
                success: false
            },
            { status: 500 }
        );
    }
}