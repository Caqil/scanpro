import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);

  // Handle /convert with query parameters
  if (pathname === "/convert") {
    const input = searchParams.get("input");
    const output = searchParams.get("output");

    if (input) {
      // Convert from other format to PDF (e.g., /convert?input=xlsx → /convert/xlsx-to-pdf)
      return NextResponse.redirect(new URL(`/convert/${input}-to-pdf`, request.url));
    } else if (output) {
      // Convert from PDF to other format (e.g., /convert?output=docx → /convert/pdf-to-docx)
      return NextResponse.redirect(new URL(`/convert/pdf-to-${output}`, request.url));
    }
    
    // If no parameters are provided, redirect to a default conversion
    return NextResponse.redirect(new URL("/convert/pdf-to-docx", request.url));
  }

  return NextResponse.next();
}

// Define which paths this middleware will run on
export const config = {
  matcher: ["/convert"],
};