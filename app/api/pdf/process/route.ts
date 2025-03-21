// app/api/pdf/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
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
            // Try to use pdftotext to check for text
            const { stdout } = await execPromise(`pdftotext -f 1 -l 1 "${pdfPath}" - | wc -w`);
            const wordCount = parseInt(stdout.trim());
            hasEmbeddedText = wordCount > 10; // If we have more than 10 words, assume it has text
        } catch (error) {
            console.error("Error checking for embedded text:", error);
            // Default to false, will use OCR if needed
            hasEmbeddedText = false;
        }

        const imageUrls: string[] = [];
        const dimensions: { width: number, height: number, originalWidth: number, originalHeight: number }[] = [];

        // Check if pdftoppm is available (better quality)
        let hasPdftoppm = false;
        try {
            await execPromise('which pdftoppm');
            hasPdftoppm = true;
        } catch (error) {
            console.log("pdftoppm not available, will use ghostscript");
            hasPdftoppm = false;
        }

        // Use pdftoppm if available
        if (hasPdftoppm) {
            // Convert PDF to images using pdftoppm (better quality)
            for (let i = 0; i < pageCount; i++) {
                const pageNum = i + 1;
                const outputPrefix = join(outputDir, `${sessionId}-page`);

                // Create PNG files
                await execPromise(`pdftoppm -png -r 150 -f ${pageNum} -l ${pageNum} "${pdfPath}" "${outputPrefix}"`);

                // pdftoppm names files like page-01.png, page-02.png, etc.
                const paddedPageNum = pageNum.toString().padStart(2, '0');
                const generatedImagePath = `${outputPrefix}-${paddedPageNum}.png`;

                // Rename to a consistent format
                const finalImagePath = join(outputDir, `${sessionId}-page-${i}.png`);

                if (existsSync(generatedImagePath)) {
                    // Move to public directory
                    await writeFile(finalImagePath, await readFile(generatedImagePath));

                    // Get image dimensions
                    const { stdout } = await execPromise(`identify -format "%w %h" "${finalImagePath}"`);
                    const [width, height] = stdout.trim().split(' ').map(Number);

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
                } else {
                    console.error(`Image not generated for page ${pageNum}`);
                }
            }
        } else {
            // Fallback to Ghostscript
            const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';

            for (let i = 0; i < pageCount; i++) {
                const pageNum = i + 1;
                const outputPath = join(outputDir, `${sessionId}-page-${i}.png`);

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

                await execPromise(`${gsCommand} ${gsArgs.join(' ')}`);

                if (existsSync(outputPath)) {
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
                } else {
                    console.error(`Image not generated for page ${pageNum}`);
                }
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
        throw new Error(`Failed to convert PDF to images: ${error instanceof Error ? error.message : String(error)}`);
    }
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
        const sessionDir = join(PROCESS_DIR, sessionId);

        // Ensure session directory exists
        if (!existsSync(sessionDir)) {
            await mkdir(sessionDir, { recursive: true });
        }

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Convert PDF to images
        const { imageUrls, dimensions, pageCount, hasEmbeddedText } = await pdfToImages(
            inputPath,
            PROCESS_DIR,
            sessionId
        );

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