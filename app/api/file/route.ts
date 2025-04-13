// app/api/file/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Get content type from file extension
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ppt: "application/vnd.ms-powerpoint",
    txt: "text/plain",
    html: "text/html",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    rtf: "application/rtf",
    odt: "application/vnd.oasis.opendocument.text",
    csv: "text/csv",
  };

  return contentTypes[extension] || "application/octet-stream";
}

export async function GET(req: NextRequest) {
  // Get URL parameters
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  const filename = searchParams.get("filename");

  // Validate parameters
  if (!folder || !filename) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  // Ensure folder is one of the allowed values
  const allowedFolders = [
    "conversions",
    "compressions",
    "merges",
    "splits",
    "rotations",
    "watermarked",
    "watermarks",
    "protected",
    "unlocked",
    "signatures",
    "ocr",
    "edited",
    "processed",
    "unwatermarked",
    "redacted",
    "repaired",
    "pagenumbers"
  ];

  if (!allowedFolders.includes(folder)) {
    return NextResponse.json({ error: "Invalid folder specified" }, { status: 400 });
  }

  // Sanitize filename to prevent directory traversal
  const sanitizedFilename = filename.replace(/[^\w.-]/g, "");
  if (!sanitizedFilename || sanitizedFilename !== filename) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  // Full path to the file
  const filePath = path.join(process.cwd(), "public", folder, sanitizedFilename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    // Get file size
    const stats = fs.statSync(filePath);

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
        "Content-Length": stats.size.toString(),
        "Cache-Control": "no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
  }
}

