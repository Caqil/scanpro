import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import JSZip from 'jszip';

const execPromise = promisify(exec);

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

// Split PDF into individual pages using pdf-lib
async function splitPdfByPages(inputPath: string, outputDir: string, pages?: number[]) {
    try {
        // Read the PDF file
        const pdfBytes = await readFile(inputPath);
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Get total pages
        const totalPages = pdfDoc.getPageCount();

        // Determine which pages to extract
        const pagesToExtract = pages && pages.length > 0
            ? pages.filter(p => p >= 0 && p < totalPages)
            : Array.from({ length: totalPages }, (_, i) => i);

        if (pagesToExtract.length === 0) {
            throw new Error("No valid pages to extract");
        }

        // Results to return
        const results = [];

        // Process each page
        for (const pageIndex of pagesToExtract) {
            // Create a new document for the page
            const newPdf = await PDFDocument.create();

            // Copy the page
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);

            // Add the page to the new document
            newPdf.addPage(copiedPage);

            // Save the new document
            const newPdfBytes = await newPdf.save();

            // Generate output filename
            const outputPath = join(outputDir, `page-${pageIndex + 1}.pdf`);

            // Write to file
            await writeFile(outputPath, newPdfBytes);

            // Add to results
            results.push({
                pageNumber: pageIndex + 1,
                path: outputPath,
                filename: `page-${pageIndex + 1}.pdf`
            });
        }

        return results;
    } catch (error) {
        console.error('PDF split error:', error);
        throw new Error('Failed to split PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Split PDF by page ranges using pdf-lib
async function splitPdfByRanges(inputPath: string, outputDir: string, ranges: { start: number; end: number; }[]) {
    try {
        // Read the PDF file
        const pdfBytes = await readFile(inputPath);
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Get total pages
        const totalPages = pdfDoc.getPageCount();

        // Validate ranges
        const validRanges = ranges.map(range => ({
            start: Math.max(0, Math.min(range.start - 1, totalPages - 1)),
            end: Math.max(0, Math.min(range.end - 1, totalPages - 1))
        })).filter(range => range.start <= range.end);

        if (validRanges.length === 0) {
            throw new Error("No valid page ranges specified");
        }

        // Results to return
        const results = [];

        // Process each range
        for (let i = 0; i < validRanges.length; i++) {
            const range = validRanges[i];

            // Create a new document for the range
            const newPdf = await PDFDocument.create();

            // Calculate page indices to copy
            const pageIndices = Array.from(
                { length: range.end - range.start + 1 },
                (_, i) => range.start + i
            );

            // Copy the pages
            const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);

            // Add pages to the new document
            copiedPages.forEach(page => {
                newPdf.addPage(page);
            });

            // Save the new document
            const newPdfBytes = await newPdf.save();

            // Generate output filename
            const outputPath = join(outputDir, `pages-${range.start + 1}-to-${range.end + 1}.pdf`);

            // Write to file
            await writeFile(outputPath, newPdfBytes);

            // Add to results
            results.push({
                range: {
                    start: range.start + 1,
                    end: range.end + 1
                },
                path: outputPath,
                filename: `pages-${range.start + 1}-to-${range.end + 1}.pdf`
            });
        }

        return results;
    } catch (error) {
        console.error('PDF range split error:', error);
        throw new Error('Failed to split PDF by ranges: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Create ZIP file from multiple PDFs
async function createZipFromPdfs(files: { path: string; filename: string }[], outputPath: string) {
    try {
        const zip = new JSZip();

        // Add each file to the ZIP
        for (const file of files) {
            const content = await readFile(file.path);
            zip.file(file.filename, content);
        }

        // Generate ZIP file
        const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

        // Write ZIP file
        await writeFile(outputPath, zipContent);

        return {
            path: outputPath,
            filename: outputPath.split('/').pop() || 'split-pdfs.zip'
        };
    } catch (error) {
        console.error('ZIP creation error:', error);
        throw new Error('Failed to create ZIP file: ' + (error instanceof Error ? error.message : String(error)));
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF split process...');
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
                { error: 'Only PDF files can be split' },
                { status: 400 }
            );
        }

        // Get split method
        const splitMethod = formData.get('method') as string || 'all';

        // Create unique ID for this operation
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);

        // Create directory for split results
        const outputDir = join(SPLIT_DIR, uniqueId);
        await mkdir(outputDir, { recursive: true });

        // Write input file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        let results;
        let zipResult;

        // Split based on method
        if (splitMethod === 'all') {
            // Split all pages into individual PDFs
            results = await splitPdfByPages(inputPath, outputDir);

            // Create ZIP with all pages
            const zipPath = join(SPLIT_DIR, `${uniqueId}-all-pages.zip`);
            zipResult = await createZipFromPdfs(results, zipPath);
        }
        else if (splitMethod === 'pages') {
            // Get specific pages to extract
            const pagesParam = formData.get('pages') as string;
            let pages: number[] = [];

            try {
                pages = pagesParam.split(',')
                    .map(p => p.trim())
                    .filter(p => /^\d+$/.test(p))
                    .map(p => parseInt(p) - 1); // Convert to 0-based indices
            } catch (e) {
                console.error('Invalid pages parameter:', e);
                return NextResponse.json(
                    { error: 'Invalid pages parameter. Use format "1,3,5" or "1-5,8,10-12"' },
                    { status: 400 }
                );
            }

            // Split specific pages
            results = await splitPdfByPages(inputPath, outputDir, pages);

            // Create ZIP with selected pages
            const zipPath = join(SPLIT_DIR, `${uniqueId}-selected-pages.zip`);
            zipResult = await createZipFromPdfs(results, zipPath);
        }
        else if (splitMethod === 'ranges') {
            // Get page ranges
            const rangesParam = formData.get('ranges') as string;
            let ranges: { start: number; end: number }[] = [];

            try {
                ranges = rangesParam.split(',')
                    .map(r => r.trim())
                    .filter(r => /^\d+-\d+$/.test(r))
                    .map(r => {
                        const [start, end] = r.split('-').map(p => parseInt(p));
                        return { start, end };
                    });
            } catch (e) {
                console.error('Invalid ranges parameter:', e);
                return NextResponse.json(
                    { error: 'Invalid ranges parameter. Use format "1-3,5-8"' },
                    { status: 400 }
                );
            }

            // Split by ranges
            results = await splitPdfByRanges(inputPath, outputDir, ranges);

            // Create ZIP with range PDFs
            const zipPath = join(SPLIT_DIR, `${uniqueId}-page-ranges.zip`);
            zipResult = await createZipFromPdfs(results, zipPath);
        }
        else {
            return NextResponse.json(
                { error: 'Invalid split method. Use "all", "pages", or "ranges"' },
                { status: 400 }
            );
        }

        // Create relative URL for the ZIP file
        const zipUrl = `/splits/${zipResult.filename}`;

        return NextResponse.json({
            success: true,
            message: 'PDF split successful',
            method: splitMethod,
            totalSplits: results.length,
            fileUrl: zipUrl,
            filename: zipResult.filename,
            splits: results.map(r => ({
                filename: r.filename,
                pageNumber: r.pageNumber,
                range: r.range
            }))
        });
    } catch (error) {
        console.error('Split error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during splitting',
                success: false
            },
            { status: 500 }
        );
    }
}