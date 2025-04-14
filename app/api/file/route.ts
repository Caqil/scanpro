// app/api/file/route.ts
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { getFileMetadata, checkFileExists } from '@/lib/file-helpers';
import { getContentType } from '@/lib/content-types';

export async function GET(req: NextRequest) {
  // Get URL parameters
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  const filename = searchParams.get("filename");

  // Validate parameters
  if (!folder || !filename) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Ensure folder is one of the allowed values
  const allowedFolders = [
    "conversions", "compressions", "merges", "splits", "rotations", 
    "watermarks", "protected", "unlocked", "signatures", "ocr", 
    "edited", "processed", "unwatermarked", "redacted", "repaired", "pagenumbers"
  ];

  if (!allowedFolders.includes(folder)) {
    return new Response(
      JSON.stringify({ error: "Invalid folder specified" }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Sanitize filename to prevent directory traversal
  const sanitizedFilename = filename.replace(/[^\w.-]/g, "");
  if (!sanitizedFilename || sanitizedFilename !== filename) {
    return new Response(
      JSON.stringify({ error: "Invalid filename" }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Check if file exists using cached check
    const exists = await checkFileExists(folder, sanitizedFilename);
    
    if (!exists) {
      return new Response(
        JSON.stringify({ error: "File not found" }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get file metadata from cache
    const metadata = await getFileMetadata(folder, sanitizedFilename);
    
    // Full path to the file
    const filePath = metadata.path;

    // Create a readable stream from the file
    const fileStream = fs.createReadStream(filePath);
    const readableStream = Readable.toWeb(fileStream) as ReadableStream;

    // Get file extension for content type
    const extension = path.extname(sanitizedFilename).slice(1).toLowerCase();

    // Return the file as a streaming response
    return new Response(readableStream, {
      headers: {
        "Content-Type": getContentType(extension),
        "Content-Disposition": `attachment; filename="${sanitizedFilename}"`,
        "Content-Length": metadata.size.toString(),
        "Cache-Control": "private, max-age=3600",
        "Last-Modified": metadata.modified.toUTCString()
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new Response(
      JSON.stringify({ error: "Failed to serve file" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}