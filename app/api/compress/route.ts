// app/api/compress/route.ts
import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { pdfQueue } from '@/lib/job-queue';
import { validateApiKey, trackApiUsage } from '@/lib/validate-key';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const COMPRESSION_DIR = join(process.cwd(), 'public', 'compressions');

// Ensure directories exist
async function ensureDirectories() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
  if (!existsSync(COMPRESSION_DIR)) {
    await mkdir(COMPRESSION_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting PDF compression process...');

    // Get API key either from header or query parameter
    const headers = request.headers;
    const url = new URL(request.url);
    const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

    // If this is a programmatic API call (not from web UI), validate the API key
    if (apiKey) {
      console.log('Validating API key for compression operation');
      const validation = await validateApiKey(apiKey, 'compress');

      if (!validation.valid) {
        console.error('API key validation failed:', validation.error);
        return new Response(
          JSON.stringify({ error: validation.error || 'Invalid API key' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Track usage (non-blocking)
      if (validation.userId) {
        trackApiUsage(validation.userId, 'compress');
      }
    }

    // Now proceed with the actual compression operation
    await ensureDirectories();

    // Process form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No PDF file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify it's a PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return new Response(
        JSON.stringify({ error: 'Only PDF files can be compressed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get compression quality
    const quality = (formData.get('quality') as string) || 'medium';
    if (!['low', 'medium', 'high'].includes(quality)) {
      return new Response(
        JSON.stringify({ error: 'Invalid compression quality. Use low, medium, or high.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create unique names for files
    const uniqueId = uuidv4();
    const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.pdf`);
    const outputFileName = `${uniqueId}-compressed.pdf`;
    const outputPath = join(COMPRESSION_DIR, outputFileName);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    console.log(`Compressing PDF: ${file.name}, size: ${file.size} bytes, quality: ${quality}`);

    // Add compression job to queue
    const jobId = await pdfQueue.add('compress-pdf', {
      inputPath,
      outputPath,
      quality,
      fileName: outputFileName,
      originalName: file.name,
      originalSize: file.size
    });

    console.log(`Added PDF compression job to queue: ${jobId}`);

    // Return immediate response with job ID
    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF compression job started',
        jobId,
        statusUrl: `/api/compress/status?id=${jobId}`,
        originalName: file.name,
        originalSize: file.size
      }),
      { status: 202, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Compression error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred during compression',
        success: false
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}