// app/api/pdf/redact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb } from 'pdf-lib';
import { exec } from 'child_process';
import { promisify } from 'util';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const REDACTED_DIR = join(process.cwd(), 'public', 'redacted');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, REDACTED_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Define redaction rectangle structure
interface RedactionRect {
    id: string;
    pageIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    label?: string;
}

// Main API handler function
export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF redaction process...');

        // Get API key either from header or query parameter for API usage
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        // If this is a programmatic API call (not from web UI), validate the API key
        if (apiKey) {
            console.log('Validating API key for redaction operation');
            const validation = await validateApiKey(apiKey, 'redact');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'redact');
            }
        }

        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const redactionsJson = formData.get('redactions') as string;
        const removeMetadata = formData.get('removeMetadata') === 'true';

        if (!file) {
            return NextResponse.json(
                { error: 'No PDF file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json(
                { error: 'Only PDF files can be redacted' },
                { status: 400 }
            );
        }

        // Parse redaction rectangles
        let redactions: RedactionRect[] = [];
        try {
            redactions = JSON.parse(redactionsJson);
            if (!Array.isArray(redactions) || redactions.length === 0) {
                return NextResponse.json(
                    { error: 'No valid redaction areas provided' },
                    { status: 400 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid redaction data format' },
                { status: 400 }
            );
        }

        // Create unique filenames
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(REDACTED_DIR, `${uniqueId}-redacted.pdf`);

        // Save the uploaded PDF to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);
        console.log(`PDF saved to ${inputPath}`);

        // Load the PDF with pdf-lib
        const pdfBytes = await readFile(inputPath);
        let pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

        // If requested, create a new document without metadata
        if (removeMetadata) {
            // Create a new document to remove all metadata
            const newPdfDoc = await PDFDocument.create();

            // Copy all pages but not the metadata
            const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            pages.forEach(page => newPdfDoc.addPage(page));

            // Use the new document
            pdfDoc = newPdfDoc;
        }

        // Apply redactions
        // Group redactions by page for efficient processing
        const redactionsByPage = redactions.reduce((acc, rect) => {
            if (!acc[rect.pageIndex]) {
                acc[rect.pageIndex] = [];
            }
            acc[rect.pageIndex].push(rect);
            return acc;
        }, {} as Record<number, RedactionRect[]>);

        // Process each page with redactions
        for (const [pageIndexStr, pageRedactions] of Object.entries(redactionsByPage)) {
            const pageIndex = parseInt(pageIndexStr);

            // Get the page
            const page = pdfDoc.getPage(pageIndex);

            // Draw redaction rectangles
            for (const rect of pageRedactions) {
                // Convert color from hex to rgb
                const hexColor = rect.color.replace('#', '');
                const r = parseInt(hexColor.substr(0, 2), 16) / 255;
                const g = parseInt(hexColor.substr(2, 2), 16) / 255;
                const b = parseInt(hexColor.substr(4, 2), 16) / 255;

                // Draw a filled rectangle to redact the content
                page.drawRectangle({
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    color: rgb(r, g, b),
                    opacity: 1,
                });

                // If label is provided, add it to the redaction
                if (rect.label) {
                    const fontSize = Math.min(12, rect.height * 0.7);
                    if (fontSize >= 6) { // Only add text if there's enough space
                        const font = await pdfDoc.embedFont('Helvetica');
                        page.drawText(rect.label, {
                            x: rect.x + 2,
                            y: rect.y + rect.height / 2 - fontSize / 2,
                            size: fontSize,
                            font: font,
                            color: rgb(1, 1, 1), // White text
                            opacity: 0.9,
                        });
                    }
                }
            }
        }

        // Save the redacted PDF
        const redactedPdfBytes = await pdfDoc.save();
        await writeFile(outputPath, redactedPdfBytes);
        console.log(`Redacted PDF saved to ${outputPath}`);

        // Clean up the input file
        try {
            await unlink(inputPath);
            console.log(`Deleted input file: ${inputPath}`);
        } catch (error) {
            console.warn(`Failed to delete input file ${inputPath}:`, error);
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'PDF redacted successfully',
            fileUrl: `/api/file?folder=redacted&filename=${uniqueId}-redacted.pdf`,
            filename: `${uniqueId}-redacted.pdf`,
            originalName: file.name,
            redactionsApplied: redactions.length
        });
    } catch (error) {
        console.error('PDF redaction error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF redaction',
                success: false
            },
            { status: 500 }
        );
    }
}
