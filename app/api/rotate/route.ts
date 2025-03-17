import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

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

// Rotate PDF pages using Ghostscript
async function rotatePdfPages(inputPath: string, outputPath: string, rotationInfo: {
    pageNumbers: number[],
    angle: number
}) {
    try {
        // Map angle to Ghostscript's rotation values (0, 90, 180, 270)
        const normalizedAngle = (rotationInfo.angle + 360) % 360; // Ensure positive angle
        if (![0, 90, 180, 270].includes(normalizedAngle)) {
            throw new Error('Ghostscript only supports rotation angles of 0, 90, 180, or 270 degrees');
        }

        // Get total pages by reading the PDF (we'll use a simple heuristic here)
        // Note: Ghostscript doesn't provide an easy way to count pages programmatically,
        // so we'll assume the page numbers provided are valid or rotate all pages.
        const pagesToRotate = rotationInfo.pageNumbers.length > 0
            ? rotationInfo.pageNumbers.map(p => p + 1).join(',') // Convert to 1-based for Ghostscript
            : 'all';

        // Construct Ghostscript command
        const gsCommand = [
            'gs',
            '-sDEVICE=pdfwrite',           // Output as PDF
            `-dAutoRotatePages=/None`,     // Prevent auto-rotation
            `-o "${outputPath}"`,          // Output file
            '-q',                          // Quiet mode
            '-dNOPAUSE',                   // No pause between pages
            '-dBATCH',                     // Batch mode
            `-c "[${pagesToRotate}]{<</Orientation ${normalizedAngle}>> setpagedevice}"`, // Set rotation
            `-f "${inputPath}"`,           // Input file
        ].join(' ');

        // Execute Ghostscript command
        await execPromise(gsCommand);

        // For response, we'll assume success and calculate rotated pages
        const rotatedPagesCount = rotationInfo.pageNumbers.length > 0
            ? rotationInfo.pageNumbers.length
            : await getPageCount(inputPath); // Optional: implement this if needed

        return {
            totalPages: rotatedPagesCount, // You might need a separate method to get this accurately
            rotatedPages: rotatedPagesCount,
            pageNumbers: rotationInfo.pageNumbers.length > 0
                ? rotationInfo.pageNumbers.map(i => i + 1)
                : [] // If 'all', we don't list all pages
        };
    } catch (error) {
        console.error('Ghostscript rotation error:', error);
        throw new Error('Failed to rotate PDF with Ghostscript: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Optional: Helper to get page count (simplified, could use gs or another tool)
async function getPageCount(filePath: string): Promise<number> {
    const { stdout } = await execPromise(`gs -q -dNODISPLAY -c "(${filePath}) (r) file runpdfbegin pdfpagecount = quit"`);
    return parseInt(stdout.trim(), 10);
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF rotation process with Ghostscript...');
        await ensureDirectories();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
        }

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ error: 'Only PDF files can be rotated' }, { status: 400 });
        }

        const angle = parseInt(formData.get('angle') as string || '90');
        if (![-270, -180, -90, 90, 180, 270].includes(angle)) {
            return NextResponse.json(
                { error: 'Invalid rotation angle. Must be 90, 180, 270, -90, -180, or -270 degrees' },
                { status: 400 }
            );
        }

        let pageNumbers: number[] = [];
        const pagesParam = formData.get('pages') as string;
        if (pagesParam) {
            try {
                if (pagesParam.startsWith('[')) {
                    pageNumbers = JSON.parse(pagesParam);
                } else {
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

        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(ROTATE_DIR, `${uniqueId}-rotated.pdf`);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        const rotationResult = await rotatePdfPages(inputPath, outputPath, {
            pageNumbers,
            angle
        });

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