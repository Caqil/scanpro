// app/api/pdf/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Define directories
const PROCESS_DIR = join(process.cwd(), 'public', 'processed');
const OCR_DIR = join(process.cwd(), 'temp', 'ocr');

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

// Process an image with Tesseract OCR
async function processWithTesseract(imagePath: string, language: string = 'eng'): Promise<any[]> {
    try {
        // First, check if tesseract is available
        const tesseractAvailable = await isTesseractInstalled();
        if (!tesseractAvailable) {
            console.log('Tesseract not available, returning mock OCR data');
            return createMockOcrData();
        }

        // Create output file path for Tesseract
        const outputBase = join(OCR_DIR, `output-${Date.now()}`);

        // Run Tesseract with hOCR output (HTML with position data)
        const tesseractCommand = `tesseract "${imagePath}" "${outputBase}" -l ${language} hocr`;
        await execPromise(tesseractCommand);

        // Read the hOCR output file
        const hocrPath = `${outputBase}.hocr`;
        if (!existsSync(hocrPath)) {
            throw new Error(`OCR output file not found: ${hocrPath}`);
        }

        const hocrContent = await readFile(hocrPath, 'utf-8');

        // Parse hOCR to extract text with positions
        return parseHocr(hocrContent);
    } catch (error) {
        console.error('OCR processing error:', error);
        return createMockOcrData();
    }
}

// Parse hOCR output to extract text with positions
function parseHocr(hocrContent: string): any[] {
    const extractedText: any[] = [];

    // Simple regex-based parsing for demonstration
    // In a real implementation, use a proper HTML parser
    const wordPattern = /<span class=['"]ocrx?_word['"] id=['"]word_\d+['"] title=['"]bbox (\d+) (\d+) (\d+) (\d+);[^']*['"]>([^<]+)<\/span>/g;

    let match;
    let id = 0;

    while ((match = wordPattern.exec(hocrContent)) !== null) {
        const [, x1, y1, x2, y2, text] = match;

        // Calculate dimensions
        const x = parseInt(x1);
        const y = parseInt(y1);
        const width = parseInt(x2) - x;
        const height = parseInt(y2) - y;

        // Calculate approximate font size based on height
        // This is very approximate and would need refinement in a real system
        const fontSize = Math.round(height * 0.8);

        extractedText.push({
            text,
            x,
            y,
            width,
            height,
            fontSize,
            fontFamily: "Arial", // Default font family
            id: `text-${id++}`
        });
    }

    return extractedText;
}

// Create mock OCR data for demonstration when Tesseract is not available
function createMockOcrData(): any[] {
    return [
        {
            text: "Sample Extracted Text",
            x: 100,
            y: 100,
            width: 200,
            height: 24,
            fontSize: 18,
            fontFamily: "Arial",
            id: "text-mock-1"
        },
        {
            text: "This is demonstration text for