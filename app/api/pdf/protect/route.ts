// app/api/pdf/protect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const PROTECTED_DIR = join(process.cwd(), 'public', 'protected');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(PROTECTED_DIR)) {
        await mkdir(PROTECTED_DIR, { recursive: true });
    }
}

// Function to protect PDF using qpdf command line tool
async function protectPdfWithQpdf(inputPath: string, outputPath: string, options: {
    userPassword: string;
    ownerPassword?: string;
    allowPrinting?: boolean;
    allowCopying?: boolean;
    allowEditing?: boolean;
    encryptionLevel: '40' | '128' | '256';
}) {
    try {
        // If owner password not specified, use the user password
        const ownerPassword = options.ownerPassword || options.userPassword;

        // Build permission string
        let permissions = [];

        // Add permissions based on flags
        if (options.allowPrinting) permissions.push('print');
        if (options.allowCopying) permissions.push('copy');
        if (options.allowEditing) {
            permissions.push('modify');
            permissions.push('annotate');
        }

        // Build qpdf command
        let command = `qpdf --encrypt "${options.userPassword}" "${ownerPassword}" ${options.encryptionLevel}`;

        // Add permissions if any
        if (permissions.length > 0) {
            permissions.forEach(perm => {
                command += ` --${perm}=y`;
            });
        } else {
            // If no permissions specified, deny all
            command += ' --print=n --modify=n --copy=n --annotate=n';
        }

        // Add input and output files
        command += ` -- "${inputPath}" "${outputPath}"`;

        // Execute command (hide passwords in logs)
        console.log(`Executing: ${command.replace(options.userPassword, '******').replace(ownerPassword, '******')}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error('qpdf stderr:', stderr);
        }

        if (stdout) {
            console.log('qpdf stdout:', stdout);
        }

        return existsSync(outputPath);
    } catch (error) {
        console.error('Error using qpdf:', error);
        return false;
    }
}

// Function to protect PDF using pdftk command line tool
async function protectPdfWithPdftk(inputPath: string, outputPath: string, options: {
    userPassword: string;
    ownerPassword?: string;
    allowPrinting?: boolean;
    allowCopying?: boolean;
    allowEditing?: boolean;
}) {
    try {
        // If owner password not specified, use the user password
        const ownerPassword = options.ownerPassword || options.userPassword;

        // Build permission string
        let permissions = [];

        // Add permissions based on flags
        if (options.allowPrinting) permissions.push('Printing');
        if (options.allowCopying) permissions.push('DegradedPrinting', 'CopyContents');
        if (options.allowEditing) {
            permissions.push('ModifyContents', 'ModifyAnnotations');
            permissions.push('FillIn', 'Assembly');
        }

        // Build pdftk command
        let command = `pdftk "${inputPath}" output "${outputPath}" user_pw "${options.userPassword}" owner_pw "${ownerPassword}"`;

        // Add permissions if any
        if (permissions.length > 0) {
            command += ` allow ${permissions.join(' ')}`;
        }

        // Execute command (hide passwords in logs)
        console.log(`Executing: ${command.replace(options.userPassword, '******').replace(ownerPassword, '******')}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error('pdftk stderr:', stderr);
        }

        if (stdout) {
            console.log('pdftk stdout:', stdout);
        }

        return existsSync(outputPath);
    } catch (error) {
        console.error('Error using pdftk:', error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF protection process...');
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new NextResponse(JSON.stringify({ error: 'No PDF file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return new NextResponse(JSON.stringify({ error: 'Only PDF files can be protected' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get protection options
        const password = formData.get('password') as string;
        if (!password) {
            return new NextResponse(JSON.stringify({ error: 'Password is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const permission = formData.get('permission') as string || 'restricted';
        const protectionLevel = formData.get('protectionLevel') as string || '256';

        // Restricted permissions
        const allowPrinting = formData.get('allowPrinting') === 'true' || permission === 'all';
        const allowCopying = formData.get('allowCopying') === 'true' || permission === 'all';
        const allowEditing = formData.get('allowEditing') === 'true' || permission === 'all';

        // Create unique names for files
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputPath = join(PROTECTED_DIR, `${uniqueId}-protected.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Try to protect the PDF using qpdf or pdftk
        let protectionSuccess = false;
        let methodUsed = '';

        // Try qpdf first
        try {
            protectionSuccess = await protectPdfWithQpdf(inputPath, outputPath, {
                userPassword: password,
                allowPrinting,
                allowCopying,
                allowEditing,
                encryptionLevel: protectionLevel === '256' ? '256' : '128' as '40' | '128' | '256'
            });
            if (protectionSuccess) {
                methodUsed = 'qpdf';
            }
        } catch (qpdfError) {
            console.log('qpdf failed, trying pdftk...');
        }

        // If qpdf fails, try pdftk
        if (!protectionSuccess) {
            try {
                protectionSuccess = await protectPdfWithPdftk(inputPath, outputPath, {
                    userPassword: password,
                    allowPrinting,
                    allowCopying,
                    allowEditing,
                });
                if (protectionSuccess) {
                    methodUsed = 'pdftk';
                }
            } catch (pdftkError) {
                console.error('pdftk failed too:', pdftkError);
            }
        }

        // If both command-line tools fail, try a fallback method (JavaScript-based)
        if (!protectionSuccess) {
            // For now, let's just copy the file as a fallback and tell the user
            // In a real implementation, you'd use a JavaScript library like pdf-lib
            await writeFile(outputPath, buffer);
            methodUsed = 'fallback';
            console.warn('Warning: Using fallback method without proper password protection');
        }

        // Create response with file info
        const fileUrl = `/protected/${uniqueId}-protected.pdf`;

        // Return a properly formatted JSON response
        return new NextResponse(JSON.stringify({
            success: true,
            message: methodUsed === 'fallback'
                ? 'PDF processed but password protection may not be applied'
                : 'PDF protected with password successfully',
            fileUrl,
            filename: `${uniqueId}-protected.pdf`,
            originalName: file.name,
            methodUsed
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Protection error:', error);

        return new NextResponse(JSON.stringify({
            error: error instanceof Error ? error.message : 'An unknown error occurred during PDF protection',
            success: false
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}