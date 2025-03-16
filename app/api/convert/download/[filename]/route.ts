import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import type { NextRequest } from "next/server";

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
export async function GET(
  request: NextRequest,
  context: { params: { filename: string } }
) {
  try {
    const filename = context.params.filename.replace(/[^\w.-]/g, "");
    if (!filename) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "conversions", filename);
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stats = await stat(filePath);
    const fileBuffer = await readFile(filePath);
    const extension = filename.split(".").pop()?.toLowerCase() || "";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": getContentType(extension),
        "Content-Length": stats.size.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}