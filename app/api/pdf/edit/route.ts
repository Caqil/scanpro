// app/api/pdf/edit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, degrees } from 'pdf-lib';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const EDITED_DIR = join(process.cwd(), 'public', 'edited');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(EDITED_DIR)) {
        await mkdir(EDITED_DIR, { recursive: true });
    }
}

// Parse object data from the request
interface EditorObject {
    type: string;
    page: number;
    x: number;
    y: number;
    [key: string]: any; // For additional properties specific to object types
}

// Process PDF editing using pdf-lib
async function editPdf(
    inputPath: string,
    outputPath: string,
    edits: EditorObject[]
) {
    try {
        // Read the PDF
        const pdfBytes = await readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Process each edit
        for (const edit of edits) {
            const pageIndex = edit.page - 1; // Convert 1-based to 0-based index

            // Make sure the page exists
            if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
                console.warn(`Page ${edit.page} doesn't exist in the PDF. Skipping edit.`);
                continue;
            }

            const page = pdfDoc.getPage(pageIndex);
            const { width, height } = page.getSize();

            // Process based on edit type
            switch (edit.type) {
                case 'text':
                    await addTextToPage(pdfDoc, page, edit);
                    break;
                case 'shape':
                    addShapeToPage(page, edit, height);
                    break;
                case 'draw':
                    addDrawingToPage(page, edit, height);
                    break;
                case 'highlight':
                    addHighlightToPage(page, edit, height);
                    break;
                case 'stamp':
                    await addStampToPage(pdfDoc, page, edit, height);
                    break;
                default:
                    console.warn(`Unknown edit type: ${edit.type}`);
            }
        }

        // Save the edited PDF
        const editedPdfBytes = await pdfDoc.save();
        await writeFile(outputPath, editedPdfBytes);

        return true;
    } catch (error) {
        console.error('PDF editing error:', error);
        throw new Error('Failed to edit PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Add text to PDF page
async function addTextToPage(pdfDoc: PDFDocument, page: PDFPage, edit: EditorObject) {
    // Get font for text
    let font: PDFFont;

    // Choose font based on fontFamily
    switch (edit.fontFamily?.toLowerCase() || 'helvetica') {
        case 'times new roman':
        case 'times':
            font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            break;
        case 'courier':
        case 'courier new':
            font = await pdfDoc.embedFont(StandardFonts.Courier);
            break;
        default:
            font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }

    // Convert color from hex to rgb components
    const colorHex = edit.color || '#000000';
    const r = parseInt(colorHex.substring(1, 3), 16) / 255;
    const g = parseInt(colorHex.substring(3, 5), 16) / 255;
    const b = parseInt(colorHex.substring(5, 7), 16) / 255;

    // Add text to page
    page.drawText(edit.text || '', {
        x: edit.x,
        y: page.getHeight() - edit.y - (edit.fontSize || 16), // Adjust for PDF coordinate system
        size: edit.fontSize || 16,
        font,
        color: rgb(r, g, b),
        opacity: edit.opacity || 1,
        rotate: edit.rotation ? degrees(edit.rotation) : undefined,
    });
}


function addShapeToPage(page: PDFPage, edit: EditorObject, pageHeight: number) {
    // Convert colors from hex to rgb components
    const fillColorHex = edit.fillColor || '#ffffff';
    const strokeColorHex = edit.strokeColor || '#000000';

    const fillR = parseInt(fillColorHex.substring(1, 3), 16) / 255;
    const fillG = parseInt(fillColorHex.substring(3, 5), 16) / 255;
    const fillB = parseInt(fillColorHex.substring(5, 7), 16) / 255;

    const strokeR = parseInt(strokeColorHex.substring(1, 3), 16) / 255;
    const strokeG = parseInt(strokeColorHex.substring(3, 5), 16) / 255;
    const strokeB = parseInt(strokeColorHex.substring(5, 7), 16) / 255;

    // Adjust y-coordinate for PDF coordinate system (origin at bottom-left)
    const y = pageHeight - edit.y;

    // Draw shape based on shapeType
    switch (edit.shapeType) {
        case 'rectangle':
            page.drawRectangle({
                x: edit.x,
                y: y - (edit.height || 100),
                width: edit.width || 100,
                height: edit.height || 100,
                borderWidth: edit.strokeWidth || 1,
                borderColor: rgb(strokeR, strokeG, strokeB),
                color: rgb(fillR, fillG, fillB),
                opacity: edit.opacity || 1,
                rotate: edit.rotation ? degrees(edit.rotation) : undefined,
            });
            break;
        case 'circle':
            const size = Math.min(edit.width || 100, edit.height || 100);
            page.drawEllipse({
                x: edit.x + size / 2,
                y: y - size / 2,
                xScale: size / 2,
                yScale: size / 2,
                borderWidth: edit.strokeWidth || 1,
                borderColor: rgb(strokeR, strokeG, strokeB),
                color: rgb(fillR, fillG, fillB),
                opacity: edit.opacity || 1,
                rotate: edit.rotation ? degrees(edit.rotation) : undefined,
            });
            break;
        case 'line':
            page.drawLine({
                start: { x: edit.x, y: y },
                end: { x: edit.x + (edit.width || 100), y: y - (edit.height || 0) },
                thickness: edit.strokeWidth || 1,
                color: rgb(strokeR, strokeG, strokeB),
                opacity: edit.opacity || 1,
            });
            break;
        case 'arrow':
            // Draw arrow line
            const startX = edit.x;
            const startY = y;
            const endX = edit.x + (edit.width || 100);
            const endY = y - (edit.height || 0);

            // Draw main line
            page.drawLine({
                start: { x: startX, y: startY },
                end: { x: endX, y: endY },
                thickness: edit.strokeWidth || 1,
                color: rgb(strokeR, strokeG, strokeB),
                opacity: edit.opacity || 1,
            });

            // Calculate arrowhead
            const arrowLength = 10;
            const arrowWidth = 6;
            const angle = Math.atan2(endY - startY, endX - startX);

            // Construct SVG path for arrowhead
            const arrowPath = `
                M ${endX} ${endY}
                L ${endX - arrowLength * Math.cos(angle - Math.PI / 6)} ${endY - arrowLength * Math.sin(angle - Math.PI / 6)}
                L ${endX - arrowLength * Math.cos(angle + Math.PI / 6)} ${endY - arrowLength * Math.sin(angle + Math.PI / 6)}
                Z
            `;

            // Draw arrowhead
            page.drawSvgPath(arrowPath, {
                x: 0, // Offset handled in path coordinates
                y: 0,
                color: rgb(strokeR, strokeG, strokeB),
                opacity: edit.opacity || 1,
            });
            break;
    }
}

// Add drawing (free-form path) to PDF page
function addDrawingToPage(page: PDFPage, edit: EditorObject, pageHeight: number) {
    if (!edit.points || !Array.isArray(edit.points) || edit.points.length < 2) {
        console.warn('Invalid or missing points for drawing');
        return;
    }

    // Convert color from hex to rgb components
    const colorHex = edit.color || '#000000';
    const r = parseInt(colorHex.substring(1, 3), 16) / 255;
    const g = parseInt(colorHex.substring(3, 5), 16) / 255;
    const b = parseInt(colorHex.substring(5, 7), 16) / 255;

    // Start the path
    const points = edit.points;
    const firstPoint = points[0];

    // Create SVG path
    let svgPath = `M ${firstPoint.x} ${pageHeight - firstPoint.y}`;

    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        svgPath += ` L ${point.x} ${pageHeight - point.y}`;
    }

    // Draw the path
    page.drawSvgPath(svgPath, {
        color: rgb(r, g, b),
        opacity: edit.opacity || 1,
        borderColor: rgb(r, g, b),
        borderWidth: edit.strokeWidth || 2,
    });
}

// Add highlight to PDF page
function addHighlightToPage(page: PDFPage, edit: EditorObject, pageHeight: number) {
    // Convert color from hex to rgb components
    const colorHex = edit.color || '#ffff00'; // Default to yellow for highlights
    const r = parseInt(colorHex.substring(1, 3), 16) / 255;
    const g = parseInt(colorHex.substring(3, 5), 16) / 255;
    const b = parseInt(colorHex.substring(5, 7), 16) / 255;

    // Draw a semi-transparent rectangle as highlight
    page.drawRectangle({
        x: edit.x,
        y: pageHeight - edit.y - (edit.height || 20),
        width: edit.width || 100,
        height: edit.height || 20,
        color: rgb(r, g, b),
        opacity: edit.opacity || 0.3, // Lower opacity for highlights
        borderWidth: 0, // No border for highlights
    });
}

// Add stamp to PDF page
async function addStampToPage(pdfDoc: PDFDocument, page: PDFPage, edit: EditorObject, pageHeight: number) {
    // Convert color from hex to rgb components
    const colorHex = edit.color || '#ff0000'; // Default to red for stamps
    const r = parseInt(colorHex.substring(1, 3), 16) / 255;
    const g = parseInt(colorHex.substring(3, 5), 16) / 255;
    const b = parseInt(colorHex.substring(5, 7), 16) / 255;

    // Get font for stamp text
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Default stamp types
    const stampText = edit.stampText || getStampText(edit.stampType);
    const fontSize = edit.fontSize || 24;

    // Draw stamp background (rounded rectangle)
    const textWidth = font.widthOfTextAtSize(stampText, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    const padding = 10;

    // Draw rounded rectangle with border
    page.drawRectangle({
        x: edit.x,
        y: pageHeight - edit.y - textHeight - padding * 2,
        width: textWidth + padding * 2,
        height: textHeight + padding * 2,
        color: rgb(1, 1, 1), // White background
        opacity: 0.8,
        borderColor: rgb(r, g, b),
        borderWidth: 2,
        borderOpacity: 1,
        rotate: edit.rotation ? degrees(edit.rotation) : undefined,
    });

    // Draw stamp text
    page.drawText(stampText, {
        x: edit.x + padding,
        y: pageHeight - edit.y - textHeight - padding,
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity: 1,
        rotate: edit.rotation ? degrees(edit.rotation) : undefined,
    });
}

// Helper function to get stamp text based on type
function getStampText(stampType: string): string {
    switch (stampType) {
        case 'approved':
            return 'APPROVED';
        case 'rejected':
            return 'REJECTED';
        case 'draft':
            return 'DRAFT';
        case 'final':
            return 'FINAL';
        case 'confidential':
            return 'CONFIDENTIAL';
        case 'void':
            return 'VOID';
        default:
            return stampType || 'STAMP';
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF editing process...');
        await ensureDirectories();

        // Get form data
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
                { error: 'Only PDF files can be edited' },
                { status: 400 }
            );
        }

        // Get edits from form data
        const editsJson = formData.get('edits') as string;
        if (!editsJson) {
            return NextResponse.json(
                { error: 'No edit data provided' },
                { status: 400 }
            );
        }

        let edits: EditorObject[];
        try {
            edits = JSON.parse(editsJson);

            if (!Array.isArray(edits)) {
                throw new Error('Edits must be an array');
            }
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid edit data format' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(EDITED_DIR, `${uniqueId}-edited.pdf`);

        // Write the input file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Process the edits
        await editPdf(inputPath, outputPath, edits);

        // Create response
        const fileUrl = `/edited/${uniqueId}-edited.pdf`;

        return NextResponse.json({
            success: true,
            message: 'PDF edited successfully',
            fileUrl,
            filename: `${uniqueId}-edited.pdf`,
        });
    } catch (error) {
        console.error('PDF editing error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF editing',
                success: false
            },
            { status: 500 }
        );
    }
}