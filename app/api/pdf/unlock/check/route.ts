// app/api/pdf/unlock/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Define directory
const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Ensure directory exists
async function ensureDirectory() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
}

// Function to check if a PDF is password protected
async function checkIfPasswordProtected(inputPath: string): Promise<boolean> {
    try {
        // First try with qpdf
        try {
            const { stdout, stderr } = await execPromise(`qpdf --check "${inputPath}"`);
            
            // Check output for password indicators
            if (stderr && stderr.toLowerCase().includes('password')) {
                return true;
            }
            
            if (stdout && stdout.toLowerCase().includes('encrypted')) {
                return true;
            }
            
            // If qpdf doesn't indicate password, it's likely not protected
            return false;
        } catch (qpdfError: any) {
            console.log('qpdf check error:', qpdfError);
            
            // If qpdf says it needs a password, then it's password protected
            if (qpdfError.message && 
                (qpdfError.message.includes('password') || 
                qpdfError.message.includes('encrypted'))) {
                return true;
            }
            
            // Try another approach with pdftk
            try {
                const { stdout, stderr } = await execPromise(`pdftk "${inputPath}" dump_data`);
                
                // Check the output for encryption indicators
                if (stdout && stdout.includes('Encrypt')) {
                    return true;
                }
                
                return false;
            } catch (pdftkError: any) {
                console.log('pdftk check error:', pdftkError);
                
                // If pdftk says it needs a password, then it's password protected
                if (pdftkError.message && 
                    (pdftkError.message.includes('password') || 
                    pdftkError.message.includes('Encrypt'))) {
                    return true;
                }
                
                // As a last resort, try pdfinfo
                try {
                    const { stdout } = await execPromise(`pdfinfo "${inputPath}"`);
                    
                    // Check if encryption is mentioned
                    return stdout.includes('Encrypted') || stdout.includes('Security');
                } catch (pdfInfoError: any) {
                    console.log('pdfinfo check error:', pdfInfoError);
                    
                    // If we got this far with errors, it's safer to assume it might be password protected
                    return true;
                }
            }
        }
    } catch (error) {
        console.error('Error checking PDF password protection:', error);
        // If all checks fail, assume it might be password protected for safety
        return true;
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Checking if PDF is password protected...');
        await ensureDirectory();

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
                { error: 'Only PDF files can be checked' },
                { status: 400 }
            );
        }

        // Create unique file path
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-check.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Check if the PDF is password protected
        const isPasswordProtected = await checkIfPasswordProtected(inputPath);

        return NextResponse.json({
            success: true,
            isPasswordProtected,
            message: isPasswordProtected
                ? 'This PDF appears to be password protected'
                : 'This PDF is not password protected'
        });

    } catch (error) {
        console.error('PDF check error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during PDF check',
                success: false
            },
            { status: 500 }
        );
    }
}