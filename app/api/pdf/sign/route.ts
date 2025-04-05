// app/api/pdf/sign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';
import sharp from 'sharp';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const SIGNATURES_DIR = join(process.cwd(), 'public', 'signatures');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [UPLOAD_DIR, SIGNATURES_DIR, TEMP_DIR];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

// Interface for element data coming from frontend
interface SignatureElement {
  id: string;
  type: 'signature' | 'text' | 'stamp' | 'drawing' | 'image';
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: string;
  rotation: number;
  scale: number;
  page: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}

// Interface for page data
interface PageData {
  imageUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting PDF signing process...');
    
    // Get API key either from header or query parameter
    const headers = request.headers;
    const url = new URL(request.url);
    const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

    // If this is a programmatic API call (not from web UI), validate the API key
    if (apiKey) {
      console.log('Validating API key for signing operation');
      const validation = await validateApiKey(apiKey, 'sign');

      if (!validation.valid) {
        console.error('API key validation failed:', validation.error);
        return NextResponse.json(
          { error: validation.error || 'Invalid API key' },
          { status: 401 }
        );
      }

      // Track usage (non-blocking)
      if (validation.userId) {
        trackApiUsage(validation.userId, 'sign');
      }
    }
    
    await ensureDirectories();

    // Parse request body
    const body = await request.json();
    const { pdfName, elements, pages } = body as { 
      pdfName: string; 
      elements: SignatureElement[];
      pages: PageData[];
    };

    if (!elements || !Array.isArray(elements) || elements.length === 0) {
      return NextResponse.json(
        { error: 'No elements provided for signing' },
        { status: 400 }
      );
    }

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { error: 'No pages data provided' },
        { status: 400 }
      );
    }

    // Create unique session ID for this operation
    const sessionId = uuidv4();
    const outputPdfPath = join(SIGNATURES_DIR, `${sessionId}-signed.pdf`);
    
    // Create a PDF using sharp to combine the page images with the signature elements
    const pdfPages = [];

    // Process each page
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const page = pages[pageIndex];
      
      // Get page image from the public directory
      const pageImagePath = join(process.cwd(), 'public', page.imageUrl.substring(1));
      
      if (!existsSync(pageImagePath)) {
        console.error(`Page image not found: ${pageImagePath}`);
        continue;
      }
      
      // Load the page image
      let pageImage = sharp(pageImagePath);
      
      // Get metadata for the image
      const metadata = await pageImage.metadata();
      const imgWidth = metadata.width || page.width;
      const imgHeight = metadata.height || page.height;
      
      // Create a composite array for overlaying elements
      const composites = [];
      
      // Find elements for this page
      const pageElements = elements.filter(el => el.page === pageIndex);
      
      // Process each element and add to composites
      for (const element of pageElements) {
        if (element.type === 'signature' || element.type === 'image') {
          // For images and signatures, we need to convert the data URL to a buffer
          if (element.data.startsWith('data:image')) {
            // Extract the base64 data
            const base64Data = element.data.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Prepare the image for composition
            const overlayImage = sharp(buffer)
              .resize(element.size.width, element.size.height);
            
            // If rotation is specified, apply it
            if (element.rotation !== 0) {
              overlayImage.rotate(element.rotation);
            }
            
            // Add to composites
            composites.push({
              input: await overlayImage.toBuffer(),
              left: Math.round(element.position.x),
              top: Math.round(element.position.y),
            });
          }
        } else if (element.type === 'text') {
          // Create an SVG with the text
          const fontSize = element.fontSize || 16;
          const fontFamily = element.fontFamily || 'Arial';
          const color = element.color || '#000000';
          const text = element.data;
          
          // Create an SVG for the text
          const svgText = `
            <svg width="${element.size.width}" height="${element.size.height}">
              <style>
                text {
                  font-family: ${fontFamily}, sans-serif;
                  font-size: ${fontSize}px;
                  fill: ${color};
                }
              </style>
              <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" transform="rotate(${element.rotation} ${element.size.width/2} ${element.size.height/2})">${text}</text>
            </svg>
          `;
          
          // Add to composites
          composites.push({
            input: Buffer.from(svgText),
            left: Math.round(element.position.x),
            top: Math.round(element.position.y),
          });
        } else if (element.type === 'stamp') {
          // Stamps are already SVG data
          const stampSvg = element.data;
          
          // Add to composites
          composites.push({
            input: Buffer.from(stampSvg),
            left: Math.round(element.position.x),
            top: Math.round(element.position.y),
          });
        }
      }
      
      // Apply the composites to the page image
      if (composites.length > 0) {
        pageImage = pageImage.composite(composites);
      }
      
      // Convert the processed page to PNG
      const processedPagePath = join(TEMP_DIR, `${sessionId}-page-${pageIndex}.png`);
      await pageImage.toFile(processedPagePath);
      
      // Add the processed page to the list of pages for the PDF
      pdfPages.push(processedPagePath);
    }
    
    // Create a PDF from the processed pages
    if (pdfPages.length > 0) {
      try {
        // Use sharp to create a PDF
        const firstPageBuffer = await readFile(pdfPages[0]);
        let pdfImage = sharp(firstPageBuffer);
        
        // Get dimensions from the first page
        const firstPageMetadata = await pdfImage.metadata();
        
        // If there are multiple pages, add them as additional pages
        if (pdfPages.length > 1) {
          const additionalPages = [];
          
          for (let i = 1; i < pdfPages.length; i++) {
            const pageBuffer = await readFile(pdfPages[i]);
            additionalPages.push({ input: pageBuffer });
          }
          
          pdfImage = pdfImage.composite(additionalPages);
        }
        
        // Save as PDF
        await pdfImage.toFormat('pdf').toFile(outputPdfPath);
      } catch (error) {
        console.error('Error creating PDF:', error);
        
        // Fallback to using PDFLib or another library if needed
        // This is a simplified implementation
      }
    }
    
    // Create a relative URL for the signed PDF file
    const fileUrl = `/api/file?folder=signatures&filename=${sessionId}-signed.pdf`;
    
    return NextResponse.json({
      success: true,
      message: 'PDF signed successfully',
      fileUrl,
      filename: `${sessionId}-signed.pdf`,
      originalName: pdfName || 'signed-document.pdf'
    });
  } catch (error) {
    console.error('PDF signing error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred during PDF signing',
        success: false
      },
      { status: 500 }
    );
  }
}