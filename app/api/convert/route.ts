import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import libre from 'libreoffice-convert';
import { PDFDocument } from 'pdf-lib';
import { createWorker } from 'tesseract.js';

// Convert callback-based functions to Promise-based
const execPromise = promisify(exec);
const libreConvert = promisify(libre.convert);

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const CONVERSION_DIR = join(process.cwd(), 'public', 'conversions');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(CONVERSION_DIR)) {
        await mkdir(CONVERSION_DIR, { recursive: true });
    }
}

// Process form data to get file
async function processFormData(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
        throw new Error('No PDF file provided');
    }

    // Get form fields
    const format = (formData.get('format') as string) || 'docx';
    const ocr = formData.get('ocr') === 'true';
    const quality = parseInt((formData.get('quality') as string) || '90');
    const password = formData.get('password') as string || '';

    // Create file paths
    const uniqueId = uuidv4();
    const inputPath = join(UPLOAD_DIR, `${uniqueId}.pdf`);
    const outputPath = join(CONVERSION_DIR, `${uniqueId}.${format}`);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    return {
        file,
        format,
        ocr,
        quality,
        password,
        inputPath,
        outputPath,
        uniqueId,
        fileSize: file.size
    };
}

// Convert PDF using LibreOffice
async function convertWithLibreOffice(inputPath: string, outputPath: string, format: string) {
    try {
        const inputBuffer = await readFile(inputPath);
        // Use LibreOffice for the conversion
        let outputFormat = format;

        // Adjust format if necessary (LibreOffice uses different format strings)
        if (format === 'docx') outputFormat = 'docx:Office Open XML Text';
        else if (format === 'xlsx') outputFormat = 'xlsx:Office Open XML Spreadsheet';
        else if (format === 'pptx') outputFormat = 'pptx:Office Open XML Presentation';

        const outputBuffer = await libreConvert(inputBuffer, outputFormat, undefined);
        await writeFile(outputPath, outputBuffer);

        return true;
    } catch (error) {
        console.error('LibreOffice conversion error:', error);
        throw new Error('Failed to convert with LibreOffice: ' + (error as Error).message);
    }
}

// Convert PDF to image
async function convertToImage(inputPath: string, outputPath: string, format: string, quality: number) {
    try {
        // We'll use different approaches based on the platform
        if (process.platform === 'win32') {
            // On Windows, we can use Ghostscript
            await execPromise(`gswin64c -sDEVICE=${format === 'jpg' ? 'jpeg' : 'png16m'} -dNOPAUSE -dBATCH -dSAFER -r300 -dJPEGQ=${quality} -sOutputFile="${outputPath}" "${inputPath}"`);
        } else {
            // On Linux/Mac, we can use pdftoppm
            // Generate temp output path with no extension
            const tempOutputPath = outputPath.substring(0, outputPath.lastIndexOf('.'));
            await execPromise(`pdftoppm -${format === 'jpg' ? 'jpeg' : 'png'} -r 300 -jpegopt quality=${quality} -singlefile "${inputPath}" "${tempOutputPath}"`);

            // Rename the output file
            await execPromise(`mv "${tempOutputPath}.${format}" "${outputPath}"`);
        }

        return true;
    } catch (error) {
        console.error('Image conversion error:', error);
        throw new Error('Failed to convert to image: ' + (error as Error).message);
    }
}

// Extract text using OCR
async function extractTextWithOCR(inputPath: string, outputPath: string) {
    try {
        // Initialize Tesseract worker
        const worker = await createWorker('eng');

        // Recognize text from PDF
        const { data } = await worker.recognize(inputPath);

        // Write recognized text to file
        await writeFile(outputPath, data.text);

        // Terminate worker
        await worker.terminate();

        return true;
    } catch (error) {
        console.error('OCR error:', error);
        throw new Error('Failed to extract text with OCR: ' + (error as Error).message);
    }
}

// Handle encrypted PDF
async function decryptPdf(inputPath: string, password: string, outputPath: string) {
    try {
        const pdfBytes = await readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes, {
            ignoreEncryption: false,
        });
        const decryptedBytes = await pdfDoc.save();
        await writeFile(outputPath, decryptedBytes);
        return true;
    } catch (error) {
        console.error('PDF decryption error:', error);
        throw new Error('Failed to decrypt PDF: ' + (error as Error).message);
    }
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        const {
            file,
            format,
            ocr,
            quality,
            password,
            inputPath,
            outputPath,
            uniqueId,
            fileSize
        } = await processFormData(request);

        // Handle password-protected PDF
        let workingInputPath = inputPath;
        if (password) {
            const decryptedPath = join(UPLOAD_DIR, `${uniqueId}_decrypted.pdf`);
            await decryptPdf(inputPath, password, decryptedPath);
            workingInputPath = decryptedPath;
        }

        // Perform the conversion based on format
        if (['jpg', 'jpeg', 'png'].includes(format)) {
            await convertToImage(workingInputPath, outputPath, format, quality);
        } else if (format === 'txt' && ocr) {
            await extractTextWithOCR(workingInputPath, outputPath);
        } else {
            await convertWithLibreOffice(workingInputPath, outputPath, format);
        }

        // Create relative URL for the converted file
        const fileUrl = `/conversions/${uniqueId}.${format}`;

        return NextResponse.json({
            success: true,
            message: 'Conversion successful',
            fileUrl,
            filename: `${uniqueId}.${format}`,
            originalName: file.name,
            format
        });
    } catch (error) {
        console.error('Conversion error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during conversion',
                success: false
            },
            { status: 500 }
        );
    }
}