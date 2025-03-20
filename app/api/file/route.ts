import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export async function GET(req: Request) {
  // Ambil URL parameter
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  const filename = searchParams.get("filename");

  // Pastikan folder hanya boleh `conversions` atau `compressions`
  if (!folder || !filename || !["conversions", "compressions", "merges", "splits","rotations", "watermarks", , "protected", "unlocked", "signatures", "ocr"].includes(folder)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  // Path lengkap file
  const filePath = path.join(process.cwd(), "public", folder, filename);

  // Jika file tidak ditemukan, balas 404
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Baca file dan kirim sebagai response
  const fileStream = fs.createReadStream(filePath);
  const readableStream = Readable.toWeb(fileStream) as ReadableStream;

  return new Response(readableStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

