// app/api/pdf/split/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const SPLIT_DIR = join(process.cwd(), 'public', 'splits');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(SPLIT_DIR)) {
        await mkdir(SPLIT_DIR, { recursive: true });
    }
}

// Parse page ranges from string format
function parsePageRanges(pagesString: string, totalPages: number): number[][] {
    const result: number[][] = [];

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
                const pagesInRange: number[] = [];
                for (let i = start; i <= Math.min(end, totalPages); i++) {
                    if (i > 0) {
                        pagesInRange.push(i);
                    }
                }
                if (pagesInRange.length > 0) {
                    result.push(pagesInRange);
                }
            }
        } else {
            // Single page number
            const pageNum = parseInt(trimmedPart);
            if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
                result.push([pageNum]);
            }
        }
    }

    return result;
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF splitting process...');
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const splitMethodRaw = formData.get('splitMethod') as string || 'range';
        const splitMethod = ['range', 'extract', 'every'].includes(splitMethodRaw) ? splitMethodRaw : 'range';

        // Get specific options based on the split method
        const pageRanges = formData.get('pageRanges') as string || '';
        const everyNPages = parseInt(formData.get('everyNPages') as string || '1');

        if (!file) {
            return NextResponse.json(
                { error: 'No PDF file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json(
                { error: 'Only PDF files can be split' },
                { status: 400 }
            );
        }

        // Create session ID and file paths
        const sessionId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${sessionId}-input.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Load the PDF document
        const pdfBytes = await readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        console.log(`Loaded PDF with ${totalPages} pages`);

        // Determine which pages to extract/how to split based on method
        let pageSets: number[][] = [];

        if (splitMethod === 'range' && pageRanges) {
            // Custom page ranges
            pageSets = parsePageRanges(pageRanges, totalPages);
        } else if (splitMethod === 'extract') {
            // Extract each page as a separate PDF
            pageSets = Array.from({ length: totalPages }, (_, i) => [i + 1]);
        } else if (splitMethod === 'every') {
            // Split every N pages
            const n = Math.max(1, everyNPages || 1);
            for (let i = 1; i <= totalPages; i += n) {
                const end = Math.min(i + n - 1, totalPages);
                const pagesInRange = Array.from({ length: end - i + 1 }, (_, idx) => i + idx);
                pageSets.push(pagesInRange);
            }
        }

        if (pageSets.length === 0) {
            return NextResponse.json(
                { error: 'No valid page ranges specified' },
                { status: 400 }
            );
        }

        console.log(`Splitting PDF into ${pageSets.length} parts`);

        // Create a result array to store info about each split document
        const splitResults = [];

        // Process each set of pages
        for (let i = 0; i < pageSets.length; i++) {
            const pages = pageSets[i];
            const outputFilename = `${sessionId}-split-${i + 1}.pdf`;
            const outputPath = join(SPLIT_DIR, outputFilename);

            // Create a new PDF document
            const newPdfDoc = await PDFDocument.create();

            // Copy the specified pages
            for (const pageNum of pages) {
                // PDF pages are 0-indexed, but we accept 1-indexed input
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
                newPdfDoc.addPage(copiedPage);
            }

            // Save the new PDF
            const newPdfBytes = await newPdfDoc.save();
            await writeFile(outputPath, newPdfBytes);

            // Add result info
            splitResults.push({
                fileUrl: `/splits/${outputFilename}`,
                filename: outputFilename,
                pages: pages,
                pageCount: pages.length
            });
        }

        return NextResponse.json({
            success: true,
            message: `PDF split into ${splitResults.length} files`,
            originalName: file.name,
            totalPages,
            splitParts: splitResults
        });
    } catch (error) {
        console.error('PDF splitting error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF splitting',
                success: false
            },
            { status: 500 }
        );
    }
}