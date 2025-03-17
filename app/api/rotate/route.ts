import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const ROTATE_DIR = join(process.cwd(), 'public', 'rotations');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(ROTATE_DIR)) {
        await mkdir(ROTATE_DIR, { recursive: true });
    }
}

// Rotate PDF pages
async function rotatePdfPages(inputPath: string, outputPath: string, rotationInfo: {
    pageNumbers: number[],
    angle: number
}) {
    try {
        // Read the PDF file
        const pdfBytes = await readFile(inputPath);

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Get total pages
        const totalPages = pdfDoc.getPageCount();

        // Determine which pages to rotate
        const pagesToRotate = rotationInfo.pageNumbers.length > 0
            ? rotationInfo.pageNumbers.filter(p => p >= 0 && p < totalPages)
            : Array.from({ length: totalPages }, (_, i) => i); // Default to all pages

        if (pagesToRotate.length === 0) {
            throw new Error("No valid pages to rotate");
        }

        // Process each page
        for (const pageIndex of pagesToRotate) {
            const page = pdfDoc.getPage(pageIndex);
            const currentRotation = page.getRotation().angle;

            // Calculate new rotation (add the specified angle to current rotation)
            const newRotation = (currentRotation + rotationInfo.angle) % 360;

            // Apply rotation
            page.setRotation({ angle: newRotation });
        }

        // Save the rotated document
        const rotatedPdfBytes = await pdfDoc.save();

        // Write to file
        await writeFile(outputPath, rotatedPdfBytes);

        return {
            totalPages,
            rotatedPages: pagesToRotate.length,
            pageNumbers: pagesToRotate.map(i => i + 1) // Convert to 1-based for response
        };
    } catch (error) {
        console.error('PDF rotation error:', error);
        throw new Error('Failed to rotate PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF rotation process...');
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
                { error: 'Only PDF files can be rotated' },
                { status: 400 }
            );
        }

        // Get rotation angle
        const angle = parseInt(formData.get('angle') as string || '90');

        // Validate angle (must be a multiple of 90)
        if (![-270, -180, -90, 90, 180, 270].includes(angle)) {
            return NextResponse.json(
                { error: 'Invalid rotation angle. Must be 90, 180, 270, -90, -180, or -270 degrees' },
                { status: 400 }
            );
        }

        // Get page numbers to rotate
        let pageNumbers: number[] = [];
        const pagesParam = formData.get('pages') as string;

        if (pagesParam) {
            try {
                // First try to parse as JSON array
                if (pagesParam.startsWith('[')) {
                    pageNumbers = JSON.parse(pagesParam);
                } else {
                    // Try to parse as comma-separated list
                    pageNumbers = pagesParam.split(',')
                        .map(p => p.trim())
                        .filter(p => /^\d+$/.test(p))
                        .map(p => parseInt(p) - 1); // Convert to 0-based indices
                }
            } catch (e) {
                console.error('Invalid pages parameter:', e);
                pageNumbers = []; // Default to all pages
            }
        }

        // Create unique ID for this operation
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(ROTATE_DIR, `${uniqueId}-rotated.pdf`);

        // Write input file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Rotate PDF
        const rotationResult = await rotatePdfPages(inputPath, outputPath, {
            pageNumbers,
            angle
        });

        // Create relative URL for the rotated file
        const fileUrl = `/rotations/${uniqueId}-rotated.pdf`;

        return NextResponse.json({
            success: true,
            message: 'PDF rotation successful',
            angle,
            fileUrl,
            filename: `${uniqueId}-rotated.pdf`,
            totalPages: rotationResult.totalPages,
            rotatedPages: rotationResult.rotatedPages,
            pageNumbers: rotationResult.pageNumbers
        });
    } catch (error) {
        console.error('Rotation error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during rotation',
                success: false
            },
            { status: 500 }
        );
    }
}