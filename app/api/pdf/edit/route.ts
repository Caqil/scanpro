// app/api/pdf/edit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { exec } from 'child_process';
import { promisify } from 'util';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const EDITED_DIR = join(process.cwd(), 'public', 'edited');
const TEMP_DIR = join(process.cwd(), 'temp', 'ocr');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, EDITED_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Check if Tesseract is installed
async function isTesseractInstalled(): Promise<boolean> {
    try {
        await execPromise('tesseract --version');
        return true;
    } catch (error) {
        console.error('Error checking for Tesseract:', error);
        return false;
    }
}

interface EditOperation {
    type: 'replace' | 'add' | 'remove';
    pageIndex: number;
    text?: string;
    replacementText?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
}

// Process the PDF with OCR to identify text layers
async function processPdfWithOcr(filePath: string, language: string = 'eng'): Promise<any[]> {
    try {
        const tesseractAvailable = await isTesseractInstalled();
        if (!tesseractAvailable) {
            console.log('Tesseract not available, providing limited text editing capabilities');
            return [];
        }

        // Extract text with OCR for each page
        const pdfDoc = await PDFDocument.load(await readFile(filePath));
        const pageCount = pdfDoc.getPageCount();
        const results = [];

        for (let i = 0; i < pageCount; i++) {
            console.log(`Processing OCR for page ${i + 1}`);
            
            // Create a temporary PDF with just this page
            const singlePagePdf = await PDFDocument.create();
            const [page] = await singlePagePdf.copyPages(pdfDoc, [i]);
            singlePagePdf.addPage(page);
            const pageBytes = await singlePagePdf.save();
            
            const pagePdfPath = join(TEMP_DIR, `page-${i}.pdf`);
            await writeFile(pagePdfPath, pageBytes);
            
            // Convert the page to image for OCR
            const outputImageBase = join(TEMP_DIR, `page-${i}`);
            await execPromise(`pdftoppm -png -r 300 "${pagePdfPath}" "${outputImageBase}"`);
            
            // Find the generated image (pdftoppm naming pattern)
            const imageFiles = await execPromise(`ls ${outputImageBase}*.png`);
            const imagePath = imageFiles.stdout.trim();
            
            if (!imagePath) {
                console.error(`No image generated for page ${i}`);
                continue;
            }
            
            // Run Tesseract with hOCR output to get text positions
            const hocrOutputBase = join(TEMP_DIR, `page-${i}-hocr`);
            await execPromise(`tesseract "${imagePath}" "${hocrOutputBase}" -l ${language} hocr`);
            
            // Read the hOCR output file
            const hocrFilePath = `${hocrOutputBase}.hocr`;
            if (!existsSync(hocrFilePath)) {
                console.error(`OCR output file not found: ${hocrFilePath}`);
                continue;
            }
            
            const hocrContent = await readFile(hocrFilePath, 'utf-8');
            
            // Parse hOCR to extract text with positions
            const pageTextData = parseHocr(hocrContent, i);
            results.push(...pageTextData);
        }
        
        return results;
    } catch (error) {
        console.error('OCR processing error:', error);
        return [];
    }
}

// Parse hOCR output to extract text with positions
function parseHocr(hocrContent: string, pageIndex: number): any[] {
    const extractedText: any[] = [];
    
    // Parse word elements from hOCR
    const wordPattern = /<span class=['"]ocrx?_word['"] id=['"]word_\d+['"] title=['"]bbox (\d+) (\d+) (\d+) (\d+)[^']*['"]>([^<]+)<\/span>/g;
    
    let match;
    let id = 0;
    
    while ((match = wordPattern.exec(hocrContent)) !== null) {
        const [, x1, y1, x2, y2, text] = match;
        
        // Calculate dimensions
        const x = parseInt(x1);
        const y = parseInt(y1);
        const width = parseInt(x2) - x;
        const height = parseInt(y2) - y;
        
        // Approximate font size based on height
        const fontSize = Math.round(height * 0.8);
        
        extractedText.push({
            text,
            x,
            y,
            width,
            height,
            fontSize,
            fontFamily: "Arial", // Default font family
            pageIndex,
            id: `text-${pageIndex}-${id++}`
        });
    }
    
    return extractedText;
}

// Apply edit operations to the PDF
async function applyEdits(filePath: string, edits: EditOperation[]): Promise<Buffer> {
    try {
        const pdfBytes = await readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Group edits by page
        const editsByPage: Record<number, EditOperation[]> = {};
        for (const edit of edits) {
            if (!editsByPage[edit.pageIndex]) {
                editsByPage[edit.pageIndex] = [];
            }
            editsByPage[edit.pageIndex].push(edit);
        }
        
        // Process each page
        for (const [pageIndexStr, pageEdits] of Object.entries(editsByPage)) {
            const pageIndex = parseInt(pageIndexStr);
            const page = pdfDoc.getPage(pageIndex);
            
            // Apply each edit
            for (const edit of pageEdits) {
                if (edit.type === 'replace' && edit.text && edit.replacementText) {
                    // For replacement, we'll use a whiteout approach (cover old text with white rectangle, then add new text)
                    if (edit.x !== undefined && edit.y !== undefined && edit.width !== undefined && edit.height !== undefined) {
                        // Create a white rectangle to cover the original text
                        page.drawRectangle({
                            x: edit.x,
                            y: edit.y,
                            width: edit.width,
                            height: edit.height,
                            color: rgb(1, 1, 1), // White
                        });
                        
                        // Add the replacement text
                        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                        const fontSize = edit.fontSize || 12;
                        
                        // Parse color or use default black
                        let textColor = rgb(0, 0, 0); // Default black
                        if (edit.color && edit.color.startsWith('#')) {
                            const hex = edit.color.slice(1);
                            const r = parseInt(hex.substring(0, 2), 16) / 255;
                            const g = parseInt(hex.substring(2, 4), 16) / 255;
                            const b = parseInt(hex.substring(4, 6), 16) / 255;
                            textColor = rgb(r, g, b);
                        }
                        
                        // Add new text
                        page.drawText(edit.replacementText, {
                            x: edit.x,
                            y: edit.y,
                            size: fontSize,
                            font,
                            color: textColor
                        });
                    }
                }
                else if (edit.type === 'add' && edit.text) {
                    // Add new text
                    const font = await pdfDoc.embedFont(
                        edit.fontFamily === 'Times' ? StandardFonts.TimesRoman : 
                        edit.fontFamily === 'Courier' ? StandardFonts.Courier : 
                        StandardFonts.Helvetica
                    );
                    const fontSize = edit.fontSize || 12;
                    
                    // Parse color or use default black
                    let textColor = rgb(0, 0, 0); // Default black
                    if (edit.color && edit.color.startsWith('#')) {
                        const hex = edit.color.slice(1);
                        const r = parseInt(hex.substring(0, 2), 16) / 255;
                        const g = parseInt(hex.substring(2, 4), 16) / 255;
                        const b = parseInt(hex.substring(4, 6), 16) / 255;
                        textColor = rgb(r, g, b);
                    }
                    
                    // Add text at specified position
                    if (edit.x !== undefined && edit.y !== undefined) {
                        page.drawText(edit.text, {
                            x: edit.x,
                            y: edit.y,
                            size: fontSize,
                            font,
                            color: textColor
                        });
                    }
                }
                else if (edit.type === 'remove') {
                    // Similar to replace, but we just cover with white rectangle
                    if (edit.x !== undefined && edit.y !== undefined && edit.width !== undefined && edit.height !== undefined) {
                        page.drawRectangle({
                            x: edit.x,
                            y: edit.y,
                            width: edit.width,
                            height: edit.height,
                            color: rgb(1, 1, 1), // White
                        });
                    }
                }
            }
        }
        
        // Save the edited PDF
        const editedPdfBytes = await pdfDoc.save();
        return Buffer.from(editedPdfBytes);
    } catch (error) {
        console.error('Error applying edits to PDF:', error);
        throw new Error('Failed to apply edits to PDF: ' + error);
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF text editing process...');
        
        // Get API key either from header or query parameter
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        // If this is a programmatic API call (not from web UI), validate the API key
        if (apiKey) {
            console.log('Validating API key for edit operation');
            const validation = await validateApiKey(apiKey, 'edit');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'edit');
            }
        }
        
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const editsJson = formData.get('edits') as string;
        const language = formData.get('language') as string || 'eng';
        const detectText = formData.get('detectText') === 'true';

        if (!file) {
            return NextResponse.json(
                { error: 'No PDF file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json(
                { error: 'Only PDF files can be edited' },
                { status: 400 }
            );
        }

        // Parse edit operations
        let edits: EditOperation[] = [];
        if (editsJson) {
            try {
                edits = JSON.parse(editsJson);
                if (!Array.isArray(edits)) {
                    throw new Error('Edits must be an array');
                }
            } catch (error) {
                return NextResponse.json(
                    { error: 'Invalid edit operations format' },
                    { status: 400 }
                );
            }
        }

        // Create a unique ID for this operation
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(EDITED_DIR, `${uniqueId}-edited.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        let textData: any[] = [];
        if (detectText) {
            // Process with OCR to extract text information
            console.log('Performing OCR text detection...');
            textData = await processPdfWithOcr(inputPath, language);
        }

        // Apply edits to the PDF
        console.log('Applying edits to PDF...');
        const editedPdfBuffer = await applyEdits(inputPath, edits);
        await writeFile(outputPath, editedPdfBuffer);

        // Create response with file and text data info
        const fileUrl = `/edited/${uniqueId}-edited.pdf`;

        return NextResponse.json({
            success: true,
            message: 'PDF edited successfully',
            fileUrl,
            filename: `${uniqueId}-edited.pdf`,
            originalName: file.name,
            textData: detectText ? textData : undefined
        });
    } catch (error) {
        console.error('PDF edit error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF editing',
                success: false
            },
            { status: 500 }
        );
    }
}