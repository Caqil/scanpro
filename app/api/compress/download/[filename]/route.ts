// app/api/compress/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    // Get filename from query parameter
    const url = new URL(request.url);
    const filename = url.searchParams.get('file');

    console.log('Download request received for file:', filename);

    if (!filename) {
      console.log('No filename provided in query parameter');
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    // Sanitize the filename
    const sanitizedFilename = filename.replace(/[^\w.-]/g, '');

    if (!sanitizedFilename) {
      console.log('Invalid filename after sanitization');
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Get file path
    const filePath = join(process.cwd(), 'public', 'compressions', sanitizedFilename);
    console.log('Full file path:', filePath);
    console.log('File exists:', existsSync(filePath));

    // Check if file exists
    if (!existsSync(filePath)) {
      console.log('File not found at path:', filePath);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get file stats
    const stats = await stat(filePath);
    console.log('File size:', stats.size, 'bytes');

    // Read file
    const fileBuffer = await readFile(filePath);
    console.log('File read successfully, buffer length:', fileBuffer.length);

    // Create response with file
    console.log('Returning file as download');
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
        'Content-Type': 'application/pdf',
        'Content-Length': stats.size.toString()
      }
    });
  } catch (error) {
    console.error('Download error:', error);

    return NextResponse.json(
      { error: 'Failed to download compressed file' },
      { status: 500 }
    );
  }
}