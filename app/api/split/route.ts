import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

const execPromise = promisify(exec);

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const SPLIT_DIR = join(process.cwd(), 'public', 'splits');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(SPLIT_DIR)) {
        await mkdir(SPLIT_DIR, { recursive: true });
    }
}

// Split PDF using GhostScript (alternative to pdf-lib)
async function splitPdfWithGhostscript(inputPath: string, outputDir: string, options: {
    mode: 'all' | 'pages' | 'ranges';
    pages?: number[];
    ranges?: { start: number; end: number }[];
}) {
    try {
        // Determine the correct Ghostscript command based on the platform
        const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';

        // Results to track
        const results: any[] = [];

        if (options.mode === 'all') {
            // Get page count first
            const { stdout } = await execPromise(`${gsCommand} -q -dNODISPLAY -c "(${inputPath}) (r) file runpdfbegin pdfpagecount = quit"`);
            const pageCount = parseInt(stdout.trim());

            if (isNaN(pageCount) || pageCount <= 0) {
                throw new Error('Could not determine page count');
            }

            // Split each page
            for (let i = 1; i <= pageCount; i++) {
                const outputFile = join(outputDir, `page-${i}.pdf`);
                const gsArgs = [
                    '-sDEVICE=pdfwrite',
                    '-dNOPAUSE',
                    '-dBATCH',
                    '-dSAFER',
                    `-dFirstPage=${i}`,
                    `-dLastPage=${i}`,
                    `-sOutputFile="${outputFile}"`,
                    `"${inputPath}"`
                ];

                await execPromise(`${gsCommand} ${gsArgs.join(' ')}`);

                results.push({
                    pageNumber: i,
                    path: outputFile,
                    filename: `page-${i}.pdf`
                });
            }
        }
        else if (options.mode === 'pages' && options.pages && options.pages.length > 0) {
            // Extract specific pages
            for (const page of options.pages) {
                const outputFile = join(outputDir, `page-${page}.pdf`);
                const gsArgs = [
                    '-sDEVICE=pdfwrite',
                    '-dNOPAUSE',
                    '-dBATCH',
                    '-dSAFER',
                    `-dFirstPage=${page}`,
                    `-dLastPage=${page}`,
                    `-sOutputFile="${outputFile}"`,
                    `"${inputPath}"`
                ];

                await execPromise(`${gsCommand} ${gsArgs.join(' ')}`);

                results.push({
                    pageNumber: page,
                    path: outputFile,
                    filename: `page-${page}.pdf`
                });
            }
        }
        else if (options.mode === 'ranges' && options.ranges && options.ranges.length > 0) {
            // Extract page ranges
            for (const range of options.ranges) {
                const outputFile = join(outputDir, `pages-${range.start}-to-${range.end}.pdf`);
                const gsArgs = [
                    '-sDEVICE=pdfwrite',
                    '-dNOPAUSE',
                    '-dBATCH',
                    '-dSAFER',
                    `-dFirstPage=${range.start}`,
                    `-dLastPage=${range.end}`,
                    `-sOutputFile="${outputFile}"`,
                    `"${inputPath}"`
                ];

                await execPromise(`${gsCommand} ${gsArgs.join(' ')}`);

                results.push({
                    range: {
                        start: range.start,
                        end: range.end
                    },
                    path: outputFile,
                    filename: `pages-${range.start}-to-${range.end}.pdf`
                });
            }
        }

        return results;
    } catch (error) {
        console.error('GhostScript split error:', error);
        throw new Error('Failed to split PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Create ZIP file using archiver instead of jszip
async function createZipFromFiles(files: { path: string; filename: string }[], outputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const output = createWriteStream(outputPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Compression level
        });

        output.on('close', () => {
            resolve({
                path: outputPath,
                filename: outputPath.split('/').pop() || 'split-pdfs.zip',
                size: archive.pointer()
            });
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Add each file to the archive
        for (const file of files) {
            archive.file(file.path, { name: file.filename });
        }

        archive.finalize();
    });
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting PDF split process...');
        await ensureDirectories();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
        }

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ error: 'Only PDF files can be split' }, { status: 400 });
        }

        const splitMethod = formData.get('method') as string || 'all';
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
        const outputDir = join(SPLIT_DIR, uniqueId);
        await mkdir(outputDir, { recursive: true });

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        let results;
        let zipResult;

        // Process based on split method
        if (splitMethod === 'all') {
            results = await splitPdfWithGhostscript(inputPath, outputDir, { mode: 'all' });
            const zipPath = join(SPLIT_DIR, `${uniqueId}-all-pages.zip`);
            zipResult = await createZipFromFiles(results, zipPath);
        }
        else if (splitMethod === 'pages') {
            const pagesParam = formData.get('pages') as string;
            let pages: number[] = [];
            try {
                pages = pagesParam.split(',')
                    .map(p => p.trim())
                    .filter(p => /^\d+$/.test(p))
                    .map(p => parseInt(p));
            } catch (e) {
                console.error('Invalid pages parameter:', e);
                return NextResponse.json(
                    { error: 'Invalid pages parameter. Use format "1,3,5"' },
                    { status: 400 }
                );
            }

            if (pages.length === 0) {
                return NextResponse.json(
                    { error: 'No valid page numbers provided' },
                    { status: 400 }
                );
            }

            results = await splitPdfWithGhostscript(inputPath, outputDir, {
                mode: 'pages',
                pages
            });

            const zipPath = join(SPLIT_DIR, `${uniqueId}-selected-pages.zip`);
            zipResult = await createZipFromFiles(results, zipPath);
        }
        else if (splitMethod === 'ranges') {
            const rangesParam = formData.get('ranges') as string;
            let ranges: { start: number; end: number }[] = [];
            try {
                ranges = rangesParam.split(',')
                    .map(r => r.trim())
                    .filter(r => /^\d+-\d+$/.test(r))
                    .map(r => {
                        const [start, end] = r.split('-').map(p => parseInt(p));
                        return { start, end };
                    })
                    .filter(range => range.start <= range.end);
            } catch (e) {
                console.error('Invalid ranges parameter:', e);
                return NextResponse.json(
                    { error: 'Invalid ranges parameter. Use format "1-3,5-8"' },
                    { status: 400 }
                );
            }

            if (ranges.length === 0) {
                return NextResponse.json(
                    { error: 'No valid page ranges provided' },
                    { status: 400 }
                );
            }

            results = await splitPdfWithGhostscript(inputPath, outputDir, {
                mode: 'ranges',
                ranges
            });

            const zipPath = join(SPLIT_DIR, `${uniqueId}-page-ranges.zip`);
            zipResult = await createZipFromFiles(results, zipPath);
        }
        else {
            return NextResponse.json(
                { error: 'Invalid split method. Use "all", "pages", or "ranges"' },
                { status: 400 }
            );
        }

        const zipUrl = `/splits/${zipResult.filename}`;

        return NextResponse.json({
            success: true,
            message: 'PDF split successful',
            method: splitMethod,
            totalSplits: results.length,
            fileUrl: zipUrl,
            filename: zipResult.filename,
            splits: results.map(r => ({
                filename: r.filename,
                pageNumber: 'pageNumber' in r ? r.pageNumber : undefined,
                range: 'range' in r ? r.range : undefined
            }))
        });
    } catch (error) {
        console.error('Split error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during splitting',
                success: false
            },
            { status: 500 }
        );
    }
}