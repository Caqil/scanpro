import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import libre from 'libreoffice-convert';
import { PDFDocument } from 'pdf-lib';
import { createWorker } from 'tesseract.js';
import { copyFile, rmdir, unlink, readdir } from 'fs/promises';
import path from 'path';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';

// Convert callback-based functions to Promise-based
const execPromise = promisify(exec);
const libreConvert = promisify(libre.convert);

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const CONVERSION_DIR = join(process.cwd(), 'public', 'conversions');

// Define supported input and output formats
const SUPPORTED_INPUT_FORMATS = [
    'pdf', 'docx', 'xlsx', 'pptx', 'rtf', 'txt', 'html', 'jpg', 'jpeg', 'png'
];

const SUPPORTED_OUTPUT_FORMATS = [
    'pdf', 'docx', 'xls', 'xlsx', 'pptx', 'rtf', 'txt', 'html', 'jpg', 'jpeg', 'png'
];

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(CONVERSION_DIR)) {
        await mkdir(CONVERSION_DIR, { recursive: true });
    }
}

function getFormatFromFilename(filename: string): string | null {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension && SUPPORTED_INPUT_FORMATS.includes(extension)) {
        return extension;
    }
    return null;
}
async function processFormData(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file provided');
    }

    // Get input format either from file extension or specified format
    let inputFormat = getFormatFromFilename(file.name);
    if (!inputFormat) {
        inputFormat = formData.get('inputFormat') as string;
        if (!inputFormat || !SUPPORTED_INPUT_FORMATS.includes(inputFormat)) {
            throw new Error('Invalid or unsupported input format');
        }
    }

    // Get output format
    const outputFormat = formData.get('outputFormat') as string;
    if (!outputFormat || !SUPPORTED_OUTPUT_FORMATS.includes(outputFormat)) {
        throw new Error('Invalid or unsupported output format');
    }

    // Get additional options
    const ocr = formData.get('ocr') === 'true';
    const quality = parseInt((formData.get('quality') as string) || '90');
    const password = formData.get('password') as string || '';

    // Create unique names for files
    const uniqueId = uuidv4();
    const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.${inputFormat}`);
    const outputPath = join(CONVERSION_DIR, `${uniqueId}-output.${outputFormat}`);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    return {
        file,
        inputFormat,
        outputFormat,
        ocr,
        quality,
        password,
        inputPath,
        outputPath,
        uniqueId,
        fileSize: file.size
    };
}

// Handle password-protected PDF
async function decryptPdf(inputPath: string, password: string, outputPath: string) {
    try {
        const pdfBytes = await readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes, {
            ignoreEncryption: false
        });
        const decryptedBytes = await pdfDoc.save();
        await writeFile(outputPath, decryptedBytes);
        return true;
    } catch (error) {
        console.error('PDF decryption error:', error);
        throw new Error('Failed to decrypt PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Extract text from PDF
async function extractTextFromPdf(inputPath: string, outputPath: string) {
    try {
        console.log(`Extracting text from PDF: ${inputPath}`);

        // Try pdftotext if available
        try {
            await execPromise(`pdftotext "${inputPath}" "${outputPath}"`);
            console.log(`Successfully extracted text using pdftotext to ${outputPath}`);
            return true;
        } catch (pdftoTextError) {
            console.error('pdftotext extraction failed:', pdftoTextError);

            // Fallback to using PDFDocument
            const pdfBytes = await readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pageCount = pdfDoc.getPageCount();

            let extractedText = `Extracted from PDF (${pageCount} pages)\n\n`;
            extractedText += "PDF text content was extracted with limited formatting.\n";
            extractedText += "For better results, try using the OCR option or convert to DOCX format.\n\n";

            await writeFile(outputPath, extractedText);
            console.log(`Created basic text extraction to ${outputPath}`);
            return true;
        }
    } catch (error) {
        console.error('PDF text extraction error:', error);
        throw new Error('Failed to extract text from PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// OCR text extraction
async function extractTextWithOCR(inputPath: string, outputPath: string) {
    try {
        const worker = createWorker();
        const { data } = await worker.recognize(inputPath);
        await writeFile(outputPath, data.text);
        await worker.terminate();
        console.log(`Successfully extracted text with OCR to ${outputPath}`);
        return true;
    } catch (error) {
        console.error('OCR error:', error);
        throw new Error('Failed to extract text with OCR: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Convert to image using appropriate tools
async function convertToImage(inputPath: string, outputPath: string, format: string, quality: number) {
    try {
        // Check if input is already an image
        const inputExt = path.extname(inputPath).toLowerCase().substring(1);
        if (['jpg', 'jpeg', 'png'].includes(inputExt)) {
            // If input is already an image, we can use ImageMagick or similar
            try {
                // Using ImageMagick convert
                await execPromise(`convert "${inputPath}" -quality ${quality} "${outputPath}"`);
                return true;
            } catch (imgError) {
                console.error('ImageMagick conversion failed:', imgError);
                // Just copy the file as fallback for image-to-image conversion
                await copyFile(inputPath, outputPath);
                return true;
            }
        }

        // If input is PDF, use PDF specific tools
        if (inputExt === 'pdf') {
            if (process.platform === 'win32') {
                // On Windows, use Ghostscript
                await execPromise(`gswin64c -sDEVICE=${format === 'jpg' || format === 'jpeg' ? 'jpeg' : 'png16m'} -dNOPAUSE -dBATCH -dSAFER -r300 -dJPEGQ=${quality} -sOutputFile="${outputPath}" "${inputPath}"`);
            } else {
                // On Linux/Mac, try pdftoppm first
                try {
                    const tempOutputPath = outputPath.substring(0, outputPath.lastIndexOf('.'));
                    await execPromise(`pdftoppm -${format === 'jpg' || format === 'jpeg' ? 'jpeg' : 'png'} -r 300 -jpegopt quality=${quality} -singlefile "${inputPath}" "${tempOutputPath}"`);

                    // Check if the file exists with the expected name
                    const expectedOutputFile = `${tempOutputPath}.${format}`;
                    if (existsSync(expectedOutputFile)) {
                        await copyFile(expectedOutputFile, outputPath);
                        return true;
                    }
                } catch (error) {
                    console.error('pdftoppm conversion failed:', error);
                }

                // Fallback to Ghostscript
                await execPromise(`gs -sDEVICE=${format === 'jpg' || format === 'jpeg' ? 'jpeg' : 'png16m'} -dNOPAUSE -dBATCH -dSAFER -r300 -dJPEGQ=${quality} -sOutputFile="${outputPath}" "${inputPath}"`);
            }
            return true;
        }

        const tempPdfPath = outputPath.replace(/\.[^.]+$/, '.pdf');
        await convertWithLibreOffice(inputPath, tempPdfPath, 'pdf');

        // Now convert the PDF to image
        await convertToImage(tempPdfPath, outputPath, format, quality);

        // Clean up temporary PDF
        await unlink(tempPdfPath);

        return true;
    } catch (error) {
        console.error('Image conversion error:', error);
        throw new Error('Failed to convert to image: ' + (error instanceof Error ? error.message : String(error)));
    }
}
// Enhanced LibreOffice conversion function with improved PDF and Office format handling
async function convertWithLibreOffice(inputPath: string, outputPath: string, format: string) {
    try {
        console.log(`Converting ${inputPath} to ${format} format...`);

        // Create a temporary directory with a timestamp to avoid conflicts
        const timestamp = Date.now();
        const tempDir = join(process.cwd(), 'temp-conversions', `${timestamp}`);
        await mkdir(tempDir, { recursive: true });

        // Copy the input file to the temp directory with a simple name
        const inputExt = path.extname(inputPath).toLowerCase();
        const tempInputPath = join(tempDir, `input${inputExt}`);
        await copyFile(inputPath, tempInputPath);

        // Special handling for PDF to Office formats (DOCX, XLSX, PPTX)
        if (inputPath.toLowerCase().endsWith('.pdf') &&
            ['docx', 'xlsx', 'pptx'].includes(format)) {
            console.log(`Using specific approach for PDF to ${format.toUpperCase()} conversion...`);

            // Try specific PDF to Office format conversion approach
            try {
                // For PDF to DOCX, use specific filter
                if (format === 'docx') {
                    const pdfToDocxCommand = `libreoffice --headless --infilter="writer_pdf_import" --convert-to docx:"MS Word 2007 XML" --outdir "${tempDir}" "${tempInputPath}"`;
                    console.log(`Executing PDF to DOCX command: ${pdfToDocxCommand}`);

                    const { stdout, stderr } = await execPromise(pdfToDocxCommand);
                    console.log('PDF to DOCX conversion stdout:', stdout);
                    if (stderr) console.error('PDF to DOCX conversion stderr:', stderr);
                }
                // For PDF to PPTX
                else if (format === 'pptx') {
                    const pdfToPptxCommand = `libreoffice --headless --infilter="impress_pdf_import" --convert-to pptx:"Impress MS PowerPoint 2007 XML" --outdir "${tempDir}" "${tempInputPath}"`;
                    console.log(`Executing PDF to PPTX command: ${pdfToPptxCommand}`);

                    const { stdout, stderr } = await execPromise(pdfToPptxCommand);
                    console.log('PDF to PPTX conversion stdout:', stdout);
                    if (stderr) console.error('PDF to PPTX conversion stderr:', stderr);
                }
                // For PDF to XLSX
                else if (format === 'xlsx') {
                    const pdfToXlsxCommand = `libreoffice --headless --infilter="calc_pdf_import" --convert-to xlsx:"Calc MS Excel 2007 XML" --outdir "${tempDir}" "${tempInputPath}"`;
                    console.log(`Executing PDF to XLSX command: ${pdfToXlsxCommand}`);

                    const { stdout, stderr } = await execPromise(pdfToXlsxCommand);
                    console.log('PDF to XLSX conversion stdout:', stdout);
                    if (stderr) console.error('PDF to XLSX conversion stderr:', stderr);
                }

                // Wait for file operations to complete
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Look for the converted file
                const files = await readdir(tempDir);
                console.log(`Files in temp directory after conversion: ${files.join(', ')}`);

                const convertedFile = files.find(file =>
                    file !== 'input.pdf' &&
                    file.endsWith(`.${format}`)
                );

                if (convertedFile) {
                    const convertedPath = join(tempDir, convertedFile);
                    await copyFile(convertedPath, outputPath);
                    console.log(`Successfully converted PDF to ${format.toUpperCase()} at ${outputPath}`);

                    // Clean up
                    for (const file of files) {
                        try {
                            await unlink(join(tempDir, file));
                        } catch (err) {
                            console.error(`Error deleting temp file ${file}:`, err);
                        }
                    }
                    try {
                        await rmdir(tempDir);
                    } catch (err) {
                        console.error(`Error removing temp directory:`, err);
                    }

                    return true;
                }
            } catch (pdfConversionError) {
                console.error(`PDF to ${format.toUpperCase()} specific conversion failed:`, pdfConversionError);
            }

            // Try an alternative approach for PDF conversion
            try {
                // Use soffice command as an alternative
                const altCommand = `soffice --headless --convert-to ${format} --outdir "${tempDir}" "${tempInputPath}"`;
                console.log(`Trying alternative PDF conversion command: ${altCommand}`);

                const { stdout, stderr } = await execPromise(altCommand);
                console.log('Alternative command stdout:', stdout);
                if (stderr) console.error('Alternative command stderr:', stderr);

                // Wait for file operations to complete
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Look for the converted file
                const files = await readdir(tempDir);
                const convertedFile = files.find(file =>
                    file !== 'input.pdf' &&
                    file.endsWith(`.${format}`)
                );

                if (convertedFile) {
                    const convertedPath = join(tempDir, convertedFile);
                    await copyFile(convertedPath, outputPath);
                    console.log(`Successfully converted PDF to ${format.toUpperCase()} using alternative command at ${outputPath}`);

                    // Clean up
                    for (const file of files) {
                        try {
                            await unlink(join(tempDir, file));
                        } catch (err) {
                            console.error(`Error deleting temp file ${file}:`, err);
                        }
                    }
                    try {
                        await rmdir(tempDir);
                    } catch (err) {
                        console.error(`Error removing temp directory:`, err);
                    }

                    return true;
                }
            } catch (altError) {
                console.error(`Alternative PDF to ${format.toUpperCase()} conversion failed:`, altError);
            }
        }

        // Special handling for DOCX/DOC to PPTX
        if ((inputPath.toLowerCase().endsWith('.docx') ||
            inputPath.toLowerCase().endsWith('.doc')) &&
            format === 'pptx') {
            console.log('Using specific approach for DOCX/DOC to PPTX conversion...');

            try {
                // DOCX to PPTX with specific filter
                const docxToPptxCommand = `libreoffice --headless --convert-to pptx:"Impress MS PowerPoint 2007 XML" --outdir "${tempDir}" "${tempInputPath}"`;
                console.log(`Executing DOCX to PPTX command: ${docxToPptxCommand}`);

                const { stdout, stderr } = await execPromise(docxToPptxCommand);
                console.log('DOCX to PPTX conversion stdout:', stdout);
                if (stderr) console.error('DOCX to PPTX conversion stderr:', stderr);

                // Wait for file operations to complete
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Look for the converted file
                const files = await readdir(tempDir);
                console.log(`Files in temp directory after DOCX to PPTX conversion: ${files.join(', ')}`);

                const pptxFile = files.find(file => file.endsWith('.pptx'));
                if (pptxFile) {
                    const pptxPath = join(tempDir, pptxFile);
                    await copyFile(pptxPath, outputPath);
                    console.log(`Successfully converted DOCX to PPTX at ${outputPath}`);

                    // Clean up
                    for (const file of files) {
                        try {
                            await unlink(join(tempDir, file));
                        } catch (err) {
                            console.error(`Error deleting temp file ${file}:`, err);
                        }
                    }
                    try {
                        await rmdir(tempDir);
                    } catch (err) {
                        console.error(`Error removing temp directory:`, err);
                    }

                    return true;
                }
            } catch (docxToPptxError) {
                console.error('DOCX to PPTX specific conversion failed:', docxToPptxError);
            }

            // Try two-step conversion via PDF
            try {
                console.log('Attempting two-step DOCX to PPTX conversion via PDF...');

                const toPdfCommand = `libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${tempInputPath}"`;

                console.log(`Step 1: Converting DOCX to PDF: ${toPdfCommand}`);
                await execPromise(toPdfCommand);

                // Wait for PDF conversion to complete
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Verify PDF was created
                if (existsSync(join(tempDir, 'input.pdf'))) {
                    const tempPdfPath = join(tempDir, 'input.pdf');

                    // Then convert PDF to PPTX
                    const pdfToPptxCommand = `libreoffice --headless --infilter="impress_pdf_import" --convert-to pptx:"Impress MS PowerPoint 2007 XML" --outdir "${tempDir}" "${tempPdfPath}"`;
                    console.log(`Step 2: Converting PDF to PPTX: ${pdfToPptxCommand}`);
                    await execPromise(pdfToPptxCommand);

                    // Wait for PPTX conversion to complete
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Look for the final PPTX file
                    const files = await readdir(tempDir);
                    console.log(`Files after two-step conversion: ${files.join(', ')}`);

                    const pptxFile = files.find(file => file.endsWith('.pptx'));
                    if (pptxFile) {
                        const pptxPath = join(tempDir, pptxFile);
                        await copyFile(pptxPath, outputPath);
                        console.log(`Successfully created PPTX using two-step conversion at ${outputPath}`);

                        // Clean up
                        for (const file of files) {
                            try {
                                await unlink(join(tempDir, file));
                            } catch (err) {
                                console.error(`Error deleting temp file ${file}:`, err);
                            }
                        }
                        try {
                            await rmdir(tempDir);
                        } catch (err) {
                            console.error(`Error removing temp directory:`, err);
                        }

                        return true;
                    }
                } else {
                    console.log('Intermediate PDF file was not created');
                }
            } catch (twoStepError) {
                console.error('Two-step conversion failed:', twoStepError);
            }
        }

        try {
            console.log('Trying direct libreoffice-convert library conversion...');
            const inputBuffer = await readFile(inputPath);
            const outputBuffer = await libreConvert(inputBuffer, format, undefined);

            if (outputBuffer instanceof Buffer) {
                await writeFile(outputPath, outputBuffer);
            } else {
                throw new Error("Unexpected output type from libreConvert");
            }

            console.log(`Successfully converted with libreoffice-convert library to ${outputPath}`);

            // Clean up temp directory if it still exists
            if (existsSync(tempDir)) {
                const tempFiles = await readdir(tempDir);
                for (const file of tempFiles) {
                    try {
                        await unlink(join(tempDir, file));
                    } catch (err) {
                        console.error(`Error deleting temp file ${file}:`, err);
                    }
                }
                try {
                    await rmdir(tempDir);
                } catch (err) {
                    console.error(`Error removing temp directory:`, err);
                }
            }

            return true;
        } catch (libError) {
            console.log('Direct library conversion failed, trying CLI approach:', libError);
        }

        // Try conversion with basic LibreOffice command
        try {
            const libreOfficeCommand = `libreoffice --headless --convert-to ${format} --outdir "${tempDir}" "${tempInputPath}"`;
            console.log(`Executing standard conversion command: ${libreOfficeCommand}`);

            const { stdout, stderr } = await execPromise(libreOfficeCommand);
            console.log('LibreOffice stdout:', stdout);
            if (stderr) console.error('LibreOffice stderr:', stderr);

            // Wait for file operations to complete
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Look for the converted file
            const tempFiles = await readdir(tempDir);
            console.log(`Files in temp directory: ${tempFiles.join(', ')}`);

            const convertedFile = tempFiles.find(file =>
                file !== path.basename(tempInputPath) &&
                (file.endsWith(`.${format}`) || file.includes(`.${format}`))
            );

            if (convertedFile) {
                const convertedFilePath = join(tempDir, convertedFile);
                await copyFile(convertedFilePath, outputPath);
                console.log(`Successfully converted with standard LibreOffice command to ${outputPath}`);

                // Clean up
                for (const file of tempFiles) {
                    try {
                        await unlink(join(tempDir, file));
                    } catch (err) {
                        console.error(`Error deleting temp file ${file}:`, err);
                    }
                }
                try {
                    await rmdir(tempDir);
                } catch (err) {
                    console.error(`Error removing temp directory:`, err);
                }

                return true;
            }
        } catch (error) {
            console.log('Standard conversion command failed, trying alternative command...', error);
        }

        // Try with soffice command
        try {
            const sofficeCommand = `soffice --headless --convert-to ${format} --outdir "${tempDir}" "${tempInputPath}"`;
            console.log(`Executing alternative conversion command: ${sofficeCommand}`);

            const { stdout, stderr } = await execPromise(sofficeCommand);
            console.log('Alternative command stdout:', stdout);
            if (stderr) console.error('Alternative command stderr:', stderr);

            // Wait for file operations to complete
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Look for the converted file
            const tempFiles = await readdir(tempDir);
            const convertedFile = tempFiles.find(file =>
                file !== path.basename(tempInputPath) &&
                (file.endsWith(`.${format}`) || file.includes(`.${format}`))
            );

            if (convertedFile) {
                const convertedFilePath = join(tempDir, convertedFile);
                await copyFile(convertedFilePath, outputPath);
                console.log(`Successfully converted with alternative command to ${outputPath}`);

                // Clean up
                for (const file of tempFiles) {
                    try {
                        await unlink(join(tempDir, file));
                    } catch (err) {
                        console.error(`Error deleting temp file ${file}:`, err);
                    }
                }
                try {
                    await rmdir(tempDir);
                } catch (err) {
                    console.error(`Error removing temp directory:`, err);
                }

                return true;
            }
        } catch (error) {
            console.log('Alternative command failed:', error);
        }

        // Clean up temp directory if all approaches failed
        try {
            if (existsSync(tempDir)) {
                const tempFiles = await readdir(tempDir);
                for (const file of tempFiles) {
                    try {
                        await unlink(join(tempDir, file));
                    } catch (err) {
                        console.error(`Error deleting temp file ${file}:`, err);
                    }
                }
                try {
                    await rmdir(tempDir);
                } catch (err) {
                    console.error(`Error removing temp directory:`, err);
                }
            }
        } catch (cleanupError) {
            console.error('Error cleaning up temp directory:', cleanupError);
        }

        throw new Error(`Failed to convert ${path.basename(inputPath)} to ${format.toUpperCase()}`);
    } catch (error) {
        console.error('LibreOffice conversion error:', error);
        throw new Error('Failed to convert with LibreOffice: ' + (error instanceof Error ? error.message : String(error)));
    }
}
export async function POST(request: NextRequest) {
    try {
        console.log('Starting conversion process...');
        // Get API key either from header or query parameter
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        // If this is a programmatic API call (not from web UI), validate the API key
        if (apiKey) {
            console.log('Validating API key for compression operation');
            const validation = await validateApiKey(apiKey, 'convert');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'convert');
            }
        }
        await ensureDirectories();

        const {
            file,
            inputFormat,
            outputFormat,
            ocr,
            quality,
            password,
            inputPath,
            outputPath,
            uniqueId,
            fileSize
        } = await processFormData(request);

        console.log(`Processing file: ${file.name}, from ${inputFormat} to ${outputFormat}, size: ${fileSize} bytes`);

        // Handle password-protected PDF
        let workingInputPath = inputPath;
        if (inputFormat === 'pdf' && password) {
            const decryptedPath = join(UPLOAD_DIR, `${uniqueId}-decrypted.pdf`);
            await decryptPdf(inputPath, password, decryptedPath);
            workingInputPath = decryptedPath;
        }

        // Perform the conversion based on input and output formats
        if (['jpg', 'jpeg', 'png'].includes(outputFormat)) {
            // Convert to image
            await convertToImage(workingInputPath, outputPath, outputFormat, quality);
        } else if (outputFormat === 'txt' && inputFormat === 'pdf') {
            // Special case for PDF to TXT
            try {
                await extractTextFromPdf(workingInputPath, outputPath);
            } catch (error) {
                console.error('Direct text extraction failed:', error);
                if (ocr) {
                    console.log('Falling back to OCR for text extraction');
                    await extractTextWithOCR(workingInputPath, outputPath);
                } else {
                    throw new Error('Text extraction failed and OCR was not requested');
                }
            }
        } else {
            // For all other conversions, use LibreOffice
            await convertWithLibreOffice(workingInputPath, outputPath, outputFormat);
        }

        // Verify the output file exists
        if (!existsSync(outputPath)) {
            throw new Error(`Output file was not created at ${outputPath}`);
        }

        // Create relative URL for the converted file
        const fileUrl = `/api/file?folder=conversions&filename=${uniqueId}-output.${outputFormat}`;

        return NextResponse.json({
            success: true,
            message: 'Conversion successful',
            fileUrl,
            filename: `${uniqueId}-output.${outputFormat}`,
            originalName: file.name,
            inputFormat,
            outputFormat
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