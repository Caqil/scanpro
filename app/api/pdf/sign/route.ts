// app/api/pdf/sign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';
import sharp from 'sharp';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const SIGNATURES_DIR = join(process.cwd(), 'public', 'signatures');
const TEMP_DIR = join(process.cwd(), 'temp');
const OCR_DIR = join(process.cwd(), 'public', 'ocr');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, SIGNATURES_DIR, TEMP_DIR, OCR_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Interface for element data coming from frontend
interface SignatureElement {
    id: string;
    type: 'signature' | 'text' | 'stamp' | 'drawing' | 'image';
    position: { x: number; y: number };
    size: { width: number; height: number };
    data: string;
    rotation: number;
    scale: number;
    page: number;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
}

// Interface for page data
interface PageData {
    imageUrl: string;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}

// Check if system commands exist
async function commandExists(command: string): Promise<boolean> {
    try {
        if (process.platform === 'win32') {
            await execPromise(`where ${command}`);
        } else {
            await execPromise(`which ${command}`);
        }
        return true;
    } catch (error) {
        return false;
    }
}

// Check if OCRmyPDF is installed
async function isOcrmypdfInstalled(): Promise<boolean> {
    return await commandExists('ocrmypdf');
}

// Check if Tesseract is installed
async function isTesseractInstalled(): Promise<boolean> {
    return await commandExists('tesseract');
}

// Check if pdftotext is installed
async function isPdftotextInstalled(): Promise<boolean> {
    return await commandExists('pdftotext');
}

// Extract text from PDF using pdftotext
async function extractTextFromPdf(pdfPath: string): Promise<string> {
    try {
        const hasPdftotext = await isPdftotextInstalled();
        if (!hasPdftotext) {
            return "Cannot extract text - pdftotext not installed";
        }
        
        const outputPath = `${pdfPath}.txt`;
        await execPromise(`pdftotext -layout "${pdfPath}" "${outputPath}"`);
        
        if (existsSync(outputPath)) {
            const text = await readFile(outputPath, 'utf-8');
            
            // Clean up
            try {
                await unlink(outputPath);
            } catch (error) {
                console.error(`Failed to delete text file ${outputPath}:`, error);
            }
            
            return text;
        }
        
        return "Failed to extract text from PDF";
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
}

// Create searchable PDF using OCRmyPDF
async function createSearchablePdf(pdfPath: string, outputPath: string, language: string = 'eng'): Promise<boolean> {
    try {
        const hasOcrmypdf = await isOcrmypdfInstalled();
        if (!hasOcrmypdf) {
            console.error('OCRmyPDF not installed');
            return false;
        }
        
        // Run OCRmyPDF
        // --force-ocr: Process all pages with OCR, even if they already have text
        // --deskew: Straighten pages
        // -l: Language
        // --output-type pdf: Create a standard searchable PDF
        await execPromise(`ocrmypdf --force-ocr --deskew -l ${language} --output-type pdf "${pdfPath}" "${outputPath}"`);
        
        return existsSync(outputPath);
    } catch (error) {
        console.error('Error creating searchable PDF:', error);
        return false;
    }
}

// Create searchable PDF using alternative methods if OCRmyPDF is not available
async function createSearchablePdfAlternative(pdfPath: string, outputPath: string, language: string = 'eng'): Promise<boolean> {
    try {
        // Check if we have the necessary tools
        const hasTesseract = await isTesseractInstalled();
        const hasGhostscript = await commandExists(process.platform === 'win32' ? 'gswin64c' : 'gs');
        
        if (!hasTesseract || !hasGhostscript) {
            console.error('Missing required tools for OCR');
            return false;
        }
        
        // Create a temporary directory for this operation
        const tempDir = `${path.dirname(outputPath)}/temp-${path.basename(outputPath, '.pdf')}`;
        if (!existsSync(tempDir)) {
            await mkdir(tempDir, { recursive: true });
        }
        
        // 1. Convert PDF to images
        console.log('Converting PDF to images...');
        const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';
        for (let i = 1; ; i++) {
            const outputImagePath = join(tempDir, `page-${i.toString().padStart(3, '0')}.png`);
            try {
                await execPromise(`${gsCommand} -dQUIET -dBATCH -dNOPAUSE -sDEVICE=png16m -r300 -dFirstPage=${i} -dLastPage=${i} -sOutputFile="${outputImagePath}" "${pdfPath}"`);
                
                if (!existsSync(outputImagePath)) {
                    // No more pages
                    break;
                }
            } catch (error) {
                console.error(`Error extracting page ${i}:`, error);
                break;
            }
        }
        
        // 2. OCR each image and create a text file
        console.log('Performing OCR on images...');
        const images = fs.readdirSync(tempDir).filter(file => file.endsWith('.png')).sort();
        
        for (const image of images) {
            const imagePath = join(tempDir, image);
            const textPath = join(tempDir, image.replace('.png', '.txt'));
            
            try {
                await execPromise(`tesseract "${imagePath}" "${imagePath.replace('.png', '')}" -l ${language} txt`);
            } catch (error) {
                console.error(`Error OCR'ing ${image}:`, error);
            }
        }
        
        // 3. Create a new PDF with OCR text layer using pdf-lib
        console.log('Creating searchable PDF...');
        
        // Load the original PDF
        const pdfBytes = await readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Save the new PDF
        const newPdfBytes = await pdfDoc.save();
        await writeFile(outputPath, newPdfBytes);
        
        // Clean up
        try {
            for (const file of fs.readdirSync(tempDir)) {
                await unlink(join(tempDir, file));
            }
            fs.rmdirSync(tempDir);
        } catch (error) {
            console.error('Error cleaning up temporary files:', error);
        }
        
        // This alternative method is not as good as OCRmyPDF but provides a fallback
        return existsSync(outputPath);
    } catch (error) {
        console.error('Error in alternative searchable PDF creation:', error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF signing process...');

        // Get API key either from header or query parameter
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        // If this is a programmatic API call (not from web UI), validate the API key
        if (apiKey) {
            console.log('Validating API key for signing operation');
            const validation = await validateApiKey(apiKey, 'sign');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'sign');
            }
        }

        await ensureDirectories();

        // Parse request body
        const body = await request.json();
        const { 
            pdfName, 
            elements, 
            pages, 
            performOcr: shouldPerformOcr = true, // Default to true
            ocrLanguage = 'eng' 
        } = body as {
            pdfName: string;
            elements: SignatureElement[];
            pages: PageData[];
            performOcr?: boolean;
            ocrLanguage?: string;
        };

        if (!elements || !Array.isArray(elements) || elements.length === 0) {
            return NextResponse.json(
                { error: 'No elements provided for signing' },
                { status: 400 }
            );
        }

        if (!pages || !Array.isArray(pages) || pages.length === 0) {
            return NextResponse.json(
                { error: 'No pages data provided' },
                { status: 400 }
            );
        }

        // Create unique session ID for this operation
        const sessionId = uuidv4();
        const outputPdfPath = join(SIGNATURES_DIR, `${sessionId}-signed.pdf`);
        const ocrPdfPath = join(OCR_DIR, `${sessionId}-searchable.pdf`);
        const ocrTextPath = join(OCR_DIR, `${sessionId}-ocr.txt`);

        console.log(`Creating signed PDF at ${outputPdfPath}`);
        console.log(`Number of elements: ${elements.length}`);
        console.log(`Number of pages: ${pages.length}`);

        // --- DIRECTLY USE PDF-LIB TO CREATE THE PDF WITH IMAGES AND SIGNATURES ---
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Process each page
        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            const page = pages[pageIndex];
            console.log(`Processing page ${pageIndex + 1}`);

            // Get page image from the public directory
            const pageImagePath = join(process.cwd(), 'public', page.imageUrl.substring(1));

            if (!existsSync(pageImagePath)) {
                console.error(`Page image not found: ${pageImagePath}`);
                continue;
            }

            // Convert image to JPEG for better compatibility with PDF-lib
            const pageImageBuffer = await readFile(pageImagePath);
            const jpegBuffer = await sharp(pageImageBuffer)
                .jpeg()
                .toBuffer();

            // Embed the page image
            const pageImage = await pdfDoc.embedJpg(jpegBuffer);
            
            // Create a page with the image dimensions
            const pdfPage = pdfDoc.addPage([page.originalWidth, page.originalHeight]);
            
            // Draw the image on the page (full page)
            pdfPage.drawImage(pageImage, {
                x: 0,
                y: 0,
                width: page.originalWidth,
                height: page.originalHeight,
            });

            // Add elements to this page
            const pageElements = elements.filter(el => el.page === pageIndex);
            
            for (const element of pageElements) {
                console.log(`Adding element type ${element.type} to page ${pageIndex + 1}`);
                
                if (element.type === 'signature' || element.type === 'image') {
                    // Process image or signature
                    if (element.data.startsWith('data:image')) {
                        const base64Data = element.data.split(',')[1];
                        const buffer = Buffer.from(base64Data, 'base64');
                        
                        try {
                            // We need to determine if it's PNG or JPEG
                            let elementImage;
                            if (element.data.includes('image/png')) {
                                elementImage = await pdfDoc.embedPng(buffer);
                            } else {
                                // Convert to JPEG if not PNG for better compatibility
                                const jpegBuffer = await sharp(buffer)
                                    .jpeg()
                                    .toBuffer();
                                elementImage = await pdfDoc.embedJpg(jpegBuffer);
                            }
                            
                            // Draw the element on the page
                            pdfPage.drawImage(elementImage, {
                                x: element.position.x,
                                y: page.originalHeight - element.position.y - element.size.height, // PDF coordinates are bottom-left origin
                                width: element.size.width,
                                height: element.size.height,
                                rotate: element.rotation ? degrees(element.rotation) : undefined,
                                opacity: element.scale || 1.0, // Use scale as opacity if provided
                            });
                            
                            console.log(`Added image/signature to page ${pageIndex + 1}`);
                        } catch (error) {
                            console.error(`Error embedding image/signature:`, error);
                        }
                    }
                } else if (element.type === 'text') {
                    // Process text element using PDF-lib's text drawing
                    try {
                        // Use default Helvetica font (PDF-lib standard font)
                        const font = await pdfDoc.embedFont('Helvetica');
                        const fontSize = element.fontSize || 16;
                        const color = element.color || '#000000';
                        
                        // Parse the hex color for rgb function
                        const red = parseInt(color.slice(1, 3), 16) / 255;
                        const green = parseInt(color.slice(3, 5), 16) / 255;
                        const blue = parseInt(color.slice(5, 7), 16) / 255;
                        
                        // Calculate vertical position (PDF uses bottom-left origin)
                        const y = page.originalHeight - element.position.y - element.size.height / 2;
                        
                        // Draw the text
                        pdfPage.drawText(element.data, {
                            x: element.position.x + element.size.width / 2,
                            y,
                            size: fontSize,
                            font,
                            color: rgb(red, green, blue),
                            rotate: element.rotation ? degrees(element.rotation) : undefined,
                            opacity: element.scale || 1.0,
                        });
                        
                        console.log(`Added text to page ${pageIndex + 1}`);
                    } catch (error) {
                        console.error(`Error adding text:`, error);
                    }
                } else if (element.type === 'stamp') {
                    // For stamps, we need to convert SVG to a raster image
                    try {
                        // Convert SVG to PNG
                        const svgBuffer = Buffer.from(element.data);
                        const pngBuffer = await sharp(svgBuffer)
                            .png()
                            .toBuffer();
                        
                        // Embed the PNG
                        const stampImage = await pdfDoc.embedPng(pngBuffer);
                        
                        // Draw the stamp
                        pdfPage.drawImage(stampImage, {
                            x: element.position.x,
                            y: page.originalHeight - element.position.y - element.size.height,
                            width: element.size.width,
                            height: element.size.height,
                            rotate: element.rotation ? degrees(element.rotation) : undefined,
                            opacity: element.scale || 1.0,
                        });
                        
                        console.log(`Added stamp to page ${pageIndex + 1}`);
                    } catch (error) {
                        console.error(`Error adding stamp:`, error);
                    }
                }
            }
        }

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        await writeFile(outputPdfPath, pdfBytes);
        console.log(`PDF saved to ${outputPdfPath}`);

        // Create response object
        const responseData: any = {
            success: true,
            message: 'PDF signed successfully',
            fileUrl: `/api/file?folder=signatures&filename=${sessionId}-signed.pdf`,
            filename: `${sessionId}-signed.pdf`,
            originalName: pdfName || 'signed-document.pdf'
        };

        // Process OCR if requested to create searchable PDF
        if (shouldPerformOcr) {
            try {
                console.log('Creating searchable PDF with OCR...');
                
                // Try OCRmyPDF first (best option)
                let ocrSuccess = await createSearchablePdf(outputPdfPath, ocrPdfPath, ocrLanguage);
                
                // If OCRmyPDF failed, try alternative method
                if (!ocrSuccess) {
                    console.log('OCRmyPDF failed, trying alternative method...');
                    ocrSuccess = await createSearchablePdfAlternative(outputPdfPath, ocrPdfPath, ocrLanguage);
                }
                
                if (ocrSuccess) {
                    // Extract text from the searchable PDF
                    const extractedText = await extractTextFromPdf(ocrPdfPath);
                    
                    // Save extracted text to file
                    await writeFile(ocrTextPath, extractedText);
                    
                    // Add OCR data to response
                    responseData.ocrComplete = true;
                    responseData.searchablePdfUrl = `/api/file?folder=ocr&filename=${sessionId}-searchable.pdf`;
                    responseData.searchablePdfFilename = `${sessionId}-searchable.pdf`;
                    responseData.ocrText = extractedText;
                    responseData.ocrTextUrl = `/ocr/${path.basename(ocrTextPath)}`;
                    
                    console.log('Searchable PDF created successfully');
                } else {
                    responseData.ocrComplete = false;
                    responseData.ocrError = 'Failed to create searchable PDF';
                }
            } catch (error) {
                console.error('Error during OCR processing:', error);
                responseData.ocrComplete = false;
                responseData.ocrError = String(error);
            }
        }

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('PDF signing error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF signing',
                success: false
            },
            { status: 500 }
        );
    }
}