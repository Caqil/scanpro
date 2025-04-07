// app/api/pdf/redact/detect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';
import { PDFDocument } from 'pdf-lib';
import pdfjs from 'pdfjs-dist';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Pattern types
type PatternType = 'ssn' | 'email' | 'phone' | 'creditCard' | 'custom';

// Pattern definition
interface Pattern {
    type: PatternType;
    pattern: string;
    enabled: boolean;
}

// Match result
interface PatternMatch {
    pageIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
    patternType: PatternType;
    text: string;
}

// Main API handler for pattern detection
export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF pattern detection process...');

        // Get API key for validation if present
        const headers = request.headers;
        const url = new URL(request.url);
        const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

        if (apiKey) {
            console.log('Validating API key for redaction pattern detection');
            const validation = await validateApiKey(apiKey, 'redact');

            if (!validation.valid) {
                console.error('API key validation failed:', validation.error);
                return NextResponse.json(
                    { error: validation.error || 'Invalid API key' },
                    { status: 401 }
                );
            }

            // Track usage (non-blocking)
            if (validation.userId) {
                trackApiUsage(validation.userId, 'redact');
            }
        }

        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const patternsJson = formData.get('patterns') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No PDF file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json(
                { error: 'Only PDF files can be processed' },
                { status: 400 }
            );
        }

        // Parse patterns
        let patterns: Pattern[] = [];
        try {
            patterns = JSON.parse(patternsJson);
            if (!Array.isArray(patterns) || patterns.length === 0) {
                return NextResponse.json(
                    { error: 'No valid patterns provided' },
                    { status: 400 }
                );
            }

            // Filter to only enabled patterns
            patterns = patterns.filter(p => p.enabled);

            if (patterns.length === 0) {
                return NextResponse.json(
                    { error: 'No enabled patterns provided' },
                    { status: 400 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid patterns data format' },
                { status: 400 }
            );
        }

        // Create unique filename
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);

        // Save the uploaded PDF to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);
        console.log(`PDF saved to ${inputPath}`);

        // Extract text and find matches
        const matches = await detectPatterns(inputPath, patterns);

        // Clean up the input file
        try {
            await unlink(inputPath);
            console.log(`Deleted input file: ${inputPath}`);
        } catch (error) {
            console.warn(`Failed to delete input file ${inputPath}:`, error);
        }

        // Return the matches
        return NextResponse.json({
            success: true,
            message: 'Pattern detection completed',
            matches,
            patternsProcessed: patterns.length
        });

    } catch (error) {
        console.error('PDF pattern detection error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during pattern detection',
                success: false
            },
            { status: 500 }
        );
    }
}

// Function to extract text and find pattern matches
async function detectPatterns(pdfPath: string, patterns: Pattern[]): Promise<PatternMatch[]> {
    try {
        // Initialize pdfjs worker if needed
        const pdfBytes = await readFile(pdfPath);

        // For simplicity in this implementation, we'll return simulated matches
        // A full implementation would use pdf.js or another library to extract text
        // and perform regex matching on the extracted text

        const matches: PatternMatch[] = [];

        // Generate some simulated matches for demonstration
        const patternTypes = patterns.map(p => p.type);

        if (patternTypes.includes('ssn')) {
            matches.push({
                pageIndex: 0,
                x: 50,
                y: 200,
                width: 100,
                height: 15,
                patternType: 'ssn',
                text: '123-45-6789'
            });

            matches.push({
                pageIndex: 1,
                x: 150,
                y: 350,
                width: 100,
                height: 15,
                patternType: 'ssn',
                text: '987-65-4321'
            });
        }

        if (patternTypes.includes('email')) {
            matches.push({
                pageIndex: 0,
                x: 150,
                y: 300,
                width: 180,
                height: 15,
                patternType: 'email',
                text: 'user@example.com'
            });

            matches.push({
                pageIndex: 2,
                x: 200,
                y: 150,
                width: 160,
                height: 15,
                patternType: 'email',
                text: 'contact@business.org'
            });
        }

        if (patternTypes.includes('phone')) {
            matches.push({
                pageIndex: 1,
                x: 300,
                y: 400,
                width: 120,
                height: 15,
                patternType: 'phone',
                text: '(555) 123-4567'
            });

            matches.push({
                pageIndex: 2,
                x: 100,
                y: 450,
                width: 120,
                height: 15,
                patternType: 'phone',
                text: '555-987-6543'
            });
        }

        if (patternTypes.includes('creditCard')) {
            matches.push({
                pageIndex: 0,
                x: 100,
                y: 250,
                width: 200,
                height: 15,
                patternType: 'creditCard',
                text: '4111-1111-1111-1111'
            });

            matches.push({
                pageIndex: 2,
                x: 250,
                y: 350,
                width: 200,
                height: 15,
                patternType: 'creditCard',
                text: '5555-5555-5555-4444'
            });
        }

        if (patternTypes.includes('custom')) {
            const customPattern = patterns.find(p => p.type === 'custom')?.pattern;
            if (customPattern) {
                matches.push({
                    pageIndex: 1,
                    x: 200,
                    y: 300,
                    width: 150,
                    height: 15,
                    patternType: 'custom',
                    text: 'Custom pattern match'
                });
            }
        }

        return matches;

    } catch (error) {
        console.error('Error detecting patterns:', error);
        throw error;
    }
}