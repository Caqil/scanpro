import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat } from 'fs/promises';
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

// Split PDF using Ghostscript
async function splitPdfWithGhostscript(inputPath: string, outputDir: string, options: {
    mode: 'all' | 'pages' | 'ranges';
    pages?: number[];
    ranges?: { start: number; end: number }[];
}) {
    try {
        const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';
        const results: any[] = [];

        // Verify Ghostscript is accessible
        try {
            const { stdout } = await execPromise(`${gsCommand} --version`);
            console.log(`Ghostscript version: ${stdout.trim()}`);
        } catch (e) {
            console.error('Ghostscript not found in PATH:', e);
            throw new Error('Ghostscript is not installed or not in PATH');
        }

        if (options.mode === 'all') {
            const outputFile = join(outputDir, `page-%d.pdf`);
            const gsCmd = `${gsCommand} -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -q -sOutputFile="${outputFile}" "${inputPath}"`;
            console.log(`Executing split command: ${gsCmd}`);

            const { stdout, stderr } = await execPromise(gsCmd);
            console.log(`Ghostscript stdout: ${stdout}`);
            if (stderr) {
                console.error(`Ghostscript stderr: ${stderr}`);
                throw new Error(`Split failed: ${stderr}`);
            }

            const files = await readdir(outputDir);
            files
                .filter(file => file.match(/^page-\d+\.pdf$/))
                .sort((a, b) => parseInt(a.match(/\d+/)![0]) - parseInt(b.match(/\d+/)![0]))
                .forEach(file => {
                    const pageNumber = parseInt(file.match(/\d+/)![0], 10);
                    results.push({
                        pageNumber,
                        path: join(outputDir, file),
                        filename: file
                    });
                });

            if (results.length === 0) {
                throw new Error('No pages were split from the PDF');
            }
            console.log(`Successfully split ${results.length} pages`);
        } else if (options.mode === 'pages' && options.pages && options.pages.length > 0) {
            for (const page of options.pages) {
                const outputFile = join(outputDir, `page-${page}.pdf`);
                const gsCmd = `${gsCommand} -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -q -dFirstPage=${page} -dLastPage=${page} -sOutputFile="${outputFile}" "${inputPath}"`;
                console.log(`Extracting page ${page}: ${gsCmd}`);
                const { stderr } = await execPromise(gsCmd);
                if (stderr) {
                    console.error(`Ghostscript stderr: ${stderr}`);
                    throw new Error(`Failed to extract page ${page}: ${stderr}`);
                }

                results.push({
                    pageNumber: page,
                    path: outputFile,
                    filename: `page-${page}.pdf`
                });
            }
        } else if (options.mode === 'ranges' && options.ranges && options.ranges.length > 0) {
            for (const range of options.ranges) {
                const outputFile = join(outputDir, `pages-${range.start}-to-${range.end}.pdf`);
                const gsCmd = `${gsCommand} -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -q -dFirstPage=${range.start} -dLastPage=${range.end} -sOutputFile="${outputFile}" "${inputPath}"`;
                console.log(`Extracting pages ${range.start}-${range.end}: ${gsCmd}`);
                const { stderr } = await execPromise(gsCmd);
                if (stderr) {
                    console.error(`Ghostscript stderr: ${stderr}`);
                    throw new Error(`Failed to extract range ${range.start}-${range.end}: ${stderr}`);
                }

                results.push({
                    range: { start: range.start, end: range.end },
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

// Create ZIP file using archiver
async function createZipFromFiles(files: { path: string; filename: string }[], outputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            console.log(`Creating ZIP archive with ${files.length} files at ${outputPath}`);
            const output = createWriteStream(outputPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                console.log(`ZIP archive created successfully. Size: ${archive.pointer()} bytes`);
                const filename = outputPath.split(process.platform === 'win32' ? '\\' : '/').pop() || 'split-pdfs.zip';
                resolve({
                    path: outputPath,
                    filename: filename,
                    size: archive.pointer()
                });
            });

            output.on('error', reject);
            archive.on('error', reject);
            archive.on('warning', (err) => console.warn('Archiver warning:', err));
            archive.pipe(output);

            for (const file of files) {
                console.log(`Adding file to archive: ${file.path} as ${file.filename}`);
                archive.file(file.path, { name: file.filename });
            }

            console.log('Finalizing archive...');
            archive.finalize();
        } catch (error) {
            console.error('Exception in createZipFromFiles:', error);
            reject(error);
        }
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
        console.log(`File written to: ${inputPath}`);

        // Verify file exists and is readable
        if (!existsSync(inputPath)) {
            throw new Error(`File not found after writing: ${inputPath}`);
        }
        const fileStats = await stat(inputPath);
        console.log(`File size: ${fileStats.size}, permissions: ${fileStats.mode.toString(8)}`);
        if (!(fileStats.mode & 0o400)) {
            throw new Error(`File not readable: ${inputPath}`);
        }

        let results;
        let zipResult;

        console.log(`Starting PDF split using method: ${splitMethod}`);
        if (splitMethod === 'all') {
            results = await splitPdfWithGhostscript(inputPath, outputDir, { mode: 'all' });
            const zipPath = join(SPLIT_DIR, `${uniqueId}-all-pages.zip`);
            zipResult = await createZipFromFiles(results, zipPath);
        } else if (splitMethod === 'pages') {
            const pagesParam = formData.get('pages') as string;
            const pages = pagesParam?.split(',')
                .map(p => p.trim())
                .filter(p => /^\d+$/.test(p))
                .map(p => parseInt(p)) || [];
            if (pages.length === 0) {
                return NextResponse.json({ error: 'No valid page numbers provided' }, { status: 400 });
            }
            results = await splitPdfWithGhostscript(inputPath, outputDir, { mode: 'pages', pages });
            const zipPath = join(SPLIT_DIR, `${uniqueId}-selected-pages.zip`);
            zipResult = await createZipFromFiles(results, zipPath);
        } else if (splitMethod === 'ranges') {
            const rangesParam = formData.get('ranges') as string;
            const ranges = rangesParam?.split(',')
                .map(r => r.trim())
                .filter(r => /^\d+-\d+$/.test(r))
                .map(r => {
                    const [start, end] = r.split('-').map(p => parseInt(p));
                    return { start, end };
                })
                .filter(range => range.start <= range.end) || [];
            if (ranges.length === 0) {
                return NextResponse.json({ error: 'No valid page ranges provided' }, { status: 400 });
            }
            results = await splitPdfWithGhostscript(inputPath, outputDir, { mode: 'ranges', ranges });
            const zipPath = join(SPLIT_DIR, `${uniqueId}-page-ranges.zip`);
            zipResult = await createZipFromFiles(results, zipPath);
        } else {
            return NextResponse.json({ error: 'Invalid split method' }, { status: 400 });
        }

        const zipUrl = `/splits/${zipResult.filename}`;
        console.log(`PDF split completed successfully, created ${results.length} files at ${zipUrl}`);

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
            { error: error instanceof Error ? error.message : 'Unknown error during splitting', success: false },
            { status: 500 }
        );
    }
}