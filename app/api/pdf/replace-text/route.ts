import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';

const execPromise = promisify(exec);
// Add this interface near the top of your file (after other imports/interfaces)
interface OcrTextElement {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
}

interface OcrPage {
    pageIndex: number;
    extractedText: OcrTextElement[];
}

interface OcrData {
    pages: OcrPage[];
}

// Define directories
const PROCESS_DIR = join(process.cwd(), 'public', 'processed');
const UPLOADS_DIR = join(process.cwd(), 'uploads');
const EDITED_DIR = join(process.cwd(), 'public', 'edited');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [PROCESS_DIR, UPLOADS_DIR, EDITED_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

interface TextReplacement {
    [key: string]: string;
}

// Replace text in PDF using PyMuPDF (via Python script)
async function replaceTextInPdf(sessionId: string, replacements: TextReplacement): Promise<string> {
    const originalPdfPath = join(UPLOADS_DIR, `${sessionId}-input.pdf`);
    if (!existsSync(originalPdfPath)) {
        throw new Error('Original PDF file not found');
    }

    const outputId = uuidv4();
    const outputPath = join(EDITED_DIR, `${outputId}-edited.pdf`);
    const scriptPath = join(process.cwd(), 'scripts', 'pdf_text_replace.py');

    if (!existsSync(scriptPath)) {
        throw new Error(`Python script not found at ${scriptPath}`);
    }

    const replacementArgs = Object.entries(replacements)
        .map(([oldText, newText]) => `"${oldText}|${newText}"`)
        .join(' ');

    const command = `python "${scriptPath}" "${originalPdfPath}" "${outputPath}" ${replacementArgs} --json`;
    console.log(`Executing command: ${command}`);

    try {
        const { stdout, stderr } = await execPromise(command);
        if (stderr) console.error(`Script stderr: ${stderr}`);

        const result = JSON.parse(stdout);
        if (!result.success) {
            throw new Error(result.error || 'Failed to replace text in PDF');
        }

        if (!existsSync(outputPath)) {
            throw new Error('Output file was not created by the script');
        }

        return outputPath;
    } catch (error) {
        console.error('Error replacing text in PDF:', error);
        throw error;
    }
}


// Then update the imageBasedTextReplacement function
async function imageBasedTextReplacement(sessionId: string, replacements: TextReplacement): Promise<string> {
    try {
        // Get page images
        const filePattern = new RegExp(`${sessionId}-page-\\d+\\.png`);
        const processedFiles = await readdir(PROCESS_DIR);
        const pageImages = processedFiles
            .filter(file => filePattern.test(file))
            .sort((a, b) => {
                const pageNumA = parseInt(a.match(/-page-(\d+)\.png$/)?.[1] || '0');
                const pageNumB = parseInt(b.match(/-page-(\d+)\.png$/)?.[1] || '0');
                return pageNumA - pageNumB;
            })
            .map(file => join(PROCESS_DIR, file));

        if (pageImages.length === 0) {
            throw new Error('No processed page images found for this session');
        }

        const pdfDoc = await PDFDocument.create();
        const outputId = uuidv4();
        const outputPath = join(EDITED_DIR, `${outputId}-edited.pdf`);

        // Get OCR data with explicit typing
        const ocrDataResponse = await fetch(`http://localhost:${process.env.PORT || 3000}/api/pdf/ocr?sessionId=${sessionId}`);
        const ocrData: OcrData = await ocrDataResponse.json();

        // Process each page
        for (let i = 0; i < pageImages.length; i++) {
            const imagePath = pageImages[i];
            const imageBytes = await readFile(imagePath);
            const modifiedImagePath = join(TEMP_DIR, `${sessionId}-page-${i}-modified.png`);
            await writeFile(modifiedImagePath, imageBytes);

            // Explicitly type the page and element parameters
            const pageOcrData = ocrData.pages.find((p: OcrPage) => p.pageIndex === i)?.extractedText || [];

            // Apply replacements
            for (const [oldText, newText] of Object.entries(replacements)) {
                const matchingElements = pageOcrData.filter((el: OcrTextElement) => el.text === oldText);

                for (const element of matchingElements) {
                    const x = element.x;
                    const y = element.y;
                    const fontSize = element.fontSize || 12;

                    await execPromise(`convert "${modifiedImagePath}" -fill white -draw "rectangle ${x},${y} ${x + element.width},${y + element.height}" "${modifiedImagePath}"`);
                    await execPromise(`convert "${modifiedImagePath}" -fill black -pointsize ${fontSize} -annotate +${x}+${y} "${newText}" "${modifiedImagePath}"`);
                }
            }

            // Add to PDF
            const modifiedImageBytes = await readFile(modifiedImagePath);
            const image = await pdfDoc.embedPng(modifiedImageBytes);
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

            await unlink(modifiedImagePath).catch(err => console.error(`Error deleting temp file:`, err));
        }

        const pdfBytes = await pdfDoc.save();
        await writeFile(outputPath, pdfBytes);
        return outputPath;
    } catch (error) {
        console.error('Error in image-based text replacement:', error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        if (apiKey) {
            const validation = await validateApiKey(apiKey, 'edit');
            if (!validation.valid) {
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }
            if (validation.userId) trackApiUsage(validation.userId, 'edit');
        }

        const { sessionId, replacements } = await request.json();
        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }
        if (!replacements || Object.keys(replacements).length === 0) {
            return NextResponse.json({ error: 'No text replacements provided' }, { status: 400 });
        }

        let outputPath: string;
        let usedMethod = 'pymupdf';

        try {
            outputPath = await replaceTextInPdf(sessionId, replacements);
        } catch (pymupdfError) {
            console.error('PyMuPDF failed, falling back to image-based method:', pymupdfError);
            outputPath = await imageBasedTextReplacement(sessionId, replacements);
            usedMethod = 'image-based';
        }

        const fileUrl = `/api/file?folder=edited&filename=${outputPath.split('/').pop()}`;
        return NextResponse.json({
            success: true,
            message: 'Text replacements applied successfully',
            fileUrl,
            filename: outputPath.split('/').pop(),
            method: usedMethod
        });
    } catch (error) {
        console.error('PDF text replacement error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                success: false
            },
            { status: 500 }
        );
    }
}