// app/api/pdf/sign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const SIGNED_DIR = join(process.cwd(), 'public', 'signed');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(SIGNED_DIR)) {
        await mkdir(SIGNED_DIR, { recursive: true });
    }
}
async function addSignatureToPdf(
    inputPath: string,
    outputPath: string,
    options: {
        signatureImage?: string,
        signatureText?: string,
        signatureFont?: string,
        signatureX: number,
        signatureY: number,
        signaturePage: number,
        signatureType: 'draw' | 'type'
    }
) {
    try {
        // Read the PDF file
        const pdfBytes = await readFile(inputPath);

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Get the specified page (defaulting to first page if page is out of bounds)
        const pageIndex = options.signaturePage > 0 && options.signaturePage <= pdfDoc.getPageCount()
            ? options.signaturePage - 1
            : 0;

        const page = pdfDoc.getPage(pageIndex);
        const { width, height } = page.getSize();

        // Make sure signature coordinates are within page bounds
        const x = Math.max(0, Math.min(options.signatureX, width - 100));

        // PDF coordinates have (0,0) at bottom-left, but our UI has (0,0) at top-left
        // So we need to flip the Y coordinate
        const y = height - Math.max(0, Math.min(options.signatureY, height - 50));

        console.log(`Adding signature at coordinates: (${x}, ${y}) on page ${pageIndex + 1}`);
        console.log(`Page dimensions: ${width} x ${height}`);

        // Handle different signature types
        if (options.signatureType === 'draw' && options.signatureImage) {
            // For drawn signature, add the signature image
            // First, remove the data:image/png;base64, prefix if it exists
            const signatureImageData = options.signatureImage.replace(/^data:image\/\w+;base64,/, '');
            const signatureBuffer = Buffer.from(signatureImageData, 'base64');

            try {
                // Embed the image in the PDF
                const signatureImage = await pdfDoc.embedPng(signatureBuffer);

                // Determine a reasonable size for the signature image
                const signatureWidth = Math.min(200, width / 4);
                const signatureHeight = signatureWidth * (signatureImage.height / signatureImage.width);

                // Draw the signature image on the page
                page.drawImage(signatureImage, {
                    x,
                    y: y - signatureHeight, // Adjust y to account for image height
                    width: signatureWidth,
                    height: signatureHeight,
                    opacity: 1.0, // Full opacity
                });

                console.log(`Drew signature image with dimensions: ${signatureWidth} x ${signatureHeight}`);
            } catch (imageError) {
                console.error('Error processing signature image:', imageError);
                throw new Error('Failed to process the signature image. Please try a different signature.');
            }
        }
        else if (options.signatureType === 'type' && options.signatureText) {
            // For typed signature, add the text
            // Determine which standard font to use based on the signatureFont option
            let fontName: typeof StandardFonts[keyof typeof StandardFonts] = StandardFonts.Helvetica;

            if (options.signatureFont) {
                if (options.signatureFont.includes('Times')) {
                    fontName = StandardFonts.TimesRoman;
                } else if (options.signatureFont.includes('Courier')) {
                    fontName = StandardFonts.Courier;
                }
                // Add more font mappings as needed
            }

            try {
                const font = await pdfDoc.embedFont(fontName);

                // Determine a reasonable font size
                const fontSize = 24;

                // Draw the text on the page
                page.drawText(options.signatureText, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                    opacity: 1,
                });

                console.log(`Drew signature text: "${options.signatureText}" with font ${fontName} at size ${fontSize}`);
            } catch (textError) {
                console.error('Error processing signature text:', textError);
                throw new Error('Failed to process the signature text. Please try a different text or font.');
            }
        } else {
            throw new Error('Invalid signature data provided. Please create a signature first.');
        }

        // Save the modified PDF
        const signedPdfBytes = await pdfDoc.save();

        // Write to output file
        await writeFile(outputPath, signedPdfBytes);

        return {
            success: true,
            pageCount: pdfDoc.getPageCount(),
            signedPage: pageIndex + 1
        };
    } catch (error) {
        console.error('PDF signature error:', error);
        throw new Error('Failed to add signature to PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF signing process...');
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
                { error: 'Only PDF files can be signed' },
                { status: 400 }
            );
        }

        // Get signature options
        const signatureType = formData.get('signatureType') as 'draw' | 'type' || 'draw';
        const signatureImage = formData.get('signatureImage') as string || undefined;
        const signatureText = formData.get('signatureText') as string || undefined;
        const signatureFont = formData.get('signatureFont') as string || undefined;

        // Get signature position
        const signatureX = parseFloat(formData.get('signatureX') as string || '100');
        const signatureY = parseFloat(formData.get('signatureY') as string || '100');
        const signaturePage = parseInt(formData.get('signaturePage') as string || '1');

        // Validate signature based on type
        if (signatureType === 'draw' && !signatureImage) {
            return NextResponse.json(
                { error: 'Signature image is required for drawn signatures' },
                { status: 400 }
            );
        }

        if (signatureType === 'type' && !signatureText) {
            return NextResponse.json(
                { error: 'Signature text is required for typed signatures' },
                { status: 400 }
            );
        }

        // Create unique names for files
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(SIGNED_DIR, `${uniqueId}-signed.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Add signature to PDF
        const result = await addSignatureToPdf(inputPath, outputPath, {
            signatureType,
            signatureImage,
            signatureText,
            signatureFont,
            signatureX,
            signatureY,
            signaturePage,
        });

        // Create relative URL for the signed file
        const fileUrl = `/signed/${uniqueId}-signed.pdf`;

        return NextResponse.json({
            success: true,
            message: 'PDF signed successfully',
            fileUrl,
            filename: `${uniqueId}-signed.pdf`,
            originalName: file.name,
            pageCount: result.pageCount,
            signedPage: result.signedPage
        });
    } catch (error) {
        console.error('Signing error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF signing',
                success: false
            },
            { status: 500 }
        );
    }
}