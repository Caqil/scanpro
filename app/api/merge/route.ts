import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';

const execPromise = promisify(exec);

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MERGE_DIR = join(process.cwd(), 'public', 'merges');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(MERGE_DIR)) {
        await mkdir(MERGE_DIR, { recursive: true });
    }
}



// Alternative method using ghostscript if available (better handling of complex PDFs)
async function mergePdfsWithGhostscript(inputPaths: string[], outputPath: string) {
    try {
        // Determine the correct Ghostscript command based on the platform
        const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';

        // Create the command arguments
        const gsArgs = [
            '-dBATCH',
            '-dNOPAUSE',
            '-q',
            '-sDEVICE=pdfwrite',
            '-dPDFSETTINGS=/prepress',
            `-sOutputFile="${outputPath}"`,
            ...inputPaths.map(path => `"${path}"`)
        ];

        // Execute Ghostscript
        const gsCommand_full = `${gsCommand} ${gsArgs.join(' ')}`;
        console.log('Executing Ghostscript command:', gsCommand_full);

        const { stdout, stderr } = await execPromise(gsCommand_full);
        console.log('Ghostscript stdout:', stdout);
        if (stderr) console.error('Ghostscript stderr:', stderr);

        return true;
    } catch (error) {
        console.error('Ghostscript merge error:', error);
        // If Ghostscript fails, we'll fall back to pdf-lib
        console.log('Falling back to pdf-lib for merging...');
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF merge process...');
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No PDF files provided' },
                { status: 400 }
            );
        }

        if (files.length < 2) {
            return NextResponse.json(
                { error: 'At least two PDF files are required for merging' },
                { status: 400 }
            );
        }

        // Get order information if provided
        let fileOrder: number[] = [];
        const orderParam = formData.get('order');

        if (orderParam) {
            try {
                fileOrder = JSON.parse(orderParam as string) as number[];
                // Validate the order array
                if (!Array.isArray(fileOrder) ||
                    fileOrder.length !== files.length ||
                    !fileOrder.every(i => typeof i === 'number' && i >= 0 && i < files.length)) {
                    fileOrder = []; // Use default order if invalid
                }
            } catch (e) {
                console.error('Invalid order parameter:', e);
                fileOrder = []; // Use default order
            }
        }

        // If no valid order provided, use sequential order
        if (fileOrder.length === 0) {
            fileOrder = Array.from({ length: files.length }, (_, i) => i);
        }

        // Create unique ID for this merge operation
        const uniqueId = uuidv4();
        const inputPaths: string[] = [];

        // Write each file to disk
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Verify it's a PDF
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                return NextResponse.json(
                    { error: `File "${file.name}" is not a PDF` },
                    { status: 400 }
                );
            }

            const inputPath = join(UPLOAD_DIR, `${uniqueId}-input-${i}.pdf`);
            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(inputPath, buffer);
            inputPaths.push(inputPath);
        }

        // Create output path
        const outputPath = join(MERGE_DIR, `${uniqueId}-merged.pdf`);

        // Order the input paths according to fileOrder
        const orderedInputPaths = fileOrder.map(i => inputPaths[i]);

        console.log(`Merging ${files.length} PDF files in specified order`);

        await mergePdfsWithGhostscript(orderedInputPaths, outputPath);


        // Verify the output file exists
        if (!existsSync(outputPath)) {
            throw new Error(`Merged file was not created at ${outputPath}`);
        }

        // Get merged file size
        const mergedBuffer = await readFile(outputPath);
        const mergedSize = mergedBuffer.length;

        // Calculate total size of input files
        let totalInputSize = 0;
        for (let i = 0; i < files.length; i++) {
            totalInputSize += files[i].size;
        }

        // Create relative URL for the merged file
        const fileUrl = `/merges/${uniqueId}-merged.pdf`;

        return NextResponse.json({
            success: true,
            message: 'PDF merge successful',
            fileUrl,
            filename: `${uniqueId}-merged.pdf`,
            mergedSize,
            totalInputSize,
            fileCount: files.length
        });
    } catch (error) {
        console.error('Merge error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during merging',
                success: false
            },
            { status: 500 }
        );
    }
}