import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile, stat } from 'fs/promises';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

const COMPRESSION_DIR = join(process.cwd(), 'public', 'compressions');

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json();
    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files provided to zip' }, { status: 400 });
    }

    // Validate and sanitize file entries
    const fileEntries = files.map((file: { filename: string; originalName: string }) => ({
      filename: file.filename.replace(/[^\w.-]/g, ''),
      originalName: file.originalName.replace(/[^\w.-]/g, '') || file.filename.replace(/^.+-compressed\.pdf$/, 'compressed.pdf'),
    }));

    // Check if all files exist
    const missingFiles = fileEntries.filter(entry => !existsSync(join(COMPRESSION_DIR, entry.filename)));
    if (missingFiles.length > 0) {
      return NextResponse.json({ error: `Files not found: ${missingFiles.map(f => f.filename).join(', ')}` }, { status: 404 });
    }

    // Create a temporary ZIP file
    const zipPath = join(COMPRESSION_DIR, `compressed-pdfs-${Date.now()}.zip`);
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Handle stream events
    const archivePromise = new Promise<void>((resolve, reject) => {
      output.on('close', () => resolve());
      output.on('error', (err) => reject(err));
      archive.on('error', (err) => reject(err));
    });

    archive.pipe(output);

    // Add each file to the ZIP with its original name
    for (const entry of fileEntries) {
      const filePath = join(COMPRESSION_DIR, entry.filename);
      const fileBuffer = await readFile(filePath);
      archive.append(fileBuffer, { name: entry.originalName });
    }

    await archive.finalize();
    await archivePromise;

    // Read the ZIP file
    const zipBuffer = await readFile(zipPath);
    const zipStats = await stat(zipPath);

    // Serve the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="compressed-pdfs-${new Date().toISOString().split('T')[0]}.zip"`,
        'Content-Type': 'application/zip',
        'Content-Length': zipStats.size.toString(),
      },
    });
  } catch (error) {
    console.error('ZIP download error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create ZIP file' },
      { status: 500 }
    );
  }
}