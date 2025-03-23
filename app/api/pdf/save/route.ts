// app/api/pdf/save/route.ts - Enhanced implementation with TypeScript types
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const EDITED_DIR = join(process.cwd(), 'public', 'edited');
const TEMP_DIR = join(process.cwd(), 'temp');

// Define types for drawing objects
interface Point {
  x: number;
  y: number;
}

interface Drawing {
  type: 'text' | 'image' | 'freehand' | 'highlight' | 'rectangle' | 'circle' | 'line';
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  imageData?: string;
  points?: Point[];
  lineWidth?: number;
  opacity?: number;
}

interface PageData {
  width: number;
  height: number;
  imageUrl?: string;
  drawings?: Drawing[];
}

// Process editing operations on PDF
export async function POST(request: NextRequest) {
  try {
    // Ensure directories exist
    if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
    if (!existsSync(EDITED_DIR)) await mkdir(EDITED_DIR, { recursive: true });
    if (!existsSync(TEMP_DIR)) await mkdir(TEMP_DIR, { recursive: true });

    // Parse JSON request body
    const body = await request.json();
    const { pdfName, pages } = body as { pdfName?: string; pages: PageData[] };

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: 'No page data provided' }, { status: 400 });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const uniqueId = uuidv4();
    const outputPath = join(EDITED_DIR, `${uniqueId}-edited.pdf`);

    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const pageData = pages[i];
      
      // Create a blank page with dimensions from original
      const page = pdfDoc.addPage([pageData.width, pageData.height]);
      
      // Add background image (the original page content)
      if (pageData.imageUrl) {
        // Convert relative URL to absolute path
        const imageName = pageData.imageUrl.split('/').pop();
        const imagePath = join(process.cwd(), 'public', 'processed', imageName || '');
        
        if (existsSync(imagePath)) {
          // Embed the image
          const imageBytes = await readFile(imagePath);
          const image = await pdfDoc.embedPng(imageBytes);
          
          // Draw the image as the page background
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: pageData.width,
            height: pageData.height
          });
        }
      }
      
      // Process drawings for this page
      if (pageData.drawings && Array.isArray(pageData.drawings)) {
        // Apply each drawing element
        for (const drawing of pageData.drawings) {
          if (drawing.type === 'text' && drawing.text) {
            // Add text
            let fontName: keyof typeof StandardFonts = 'Helvetica';
            
            // Map font family
            if (drawing.fontFamily) {
              if (drawing.fontFamily.includes('Times')) {
                fontName = 'TimesRoman';
              } else if (drawing.fontFamily.includes('Courier')) {
                fontName = 'Courier';
              }
            }
            
            const font = await pdfDoc.embedFont(StandardFonts[fontName]);
            const fontSize = drawing.fontSize || 16;
            
            // Parse color from hex
            let r = 0, g = 0, b = 0;
            if (drawing.color && drawing.color.startsWith('#')) {
              const hex = drawing.color.slice(1);
              r = parseInt(hex.substring(0, 2), 16) / 255;
              g = parseInt(hex.substring(2, 4), 16) / 255;
              b = parseInt(hex.substring(4, 6), 16) / 255;
            }
            
            // Add text to PDF
            page.drawText(drawing.text, {
              x: drawing.x,
              y: pageData.height - drawing.y, // Invert Y coordinate
              size: fontSize,
              font,
              color: rgb(r, g, b)
            });
          } 
          else if (drawing.type === 'image' && drawing.imageData) {
            // Handle image objects (like signatures)
            try {
              // Save image data to temp file
              const imageId = uuidv4();
              const imagePath = join(TEMP_DIR, `${imageId}.png`);
              
              // Remove data:image/png;base64, prefix
              const imageData = drawing.imageData.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(imageData, 'base64');
              await writeFile(imagePath, buffer);
              
              // Embed the image
              const imageBytes = await readFile(imagePath);
              const image = await pdfDoc.embedPng(imageBytes);
              
              // Draw the image with default values if width/height are undefined
              const imgWidth = drawing.width ?? 200;
              const imgHeight = drawing.height ?? 100;
              
              page.drawImage(image, {
                x: drawing.x,
                y: pageData.height - drawing.y - imgHeight,
                width: imgWidth,
                height: imgHeight
              });
              
              // Clean up temp file
              await unlink(imagePath);
            } catch (imageError) {
              console.error('Error processing image:', imageError);
            }
          }
          else if (drawing.type === 'freehand' || drawing.type === 'highlight') {
            // Handle drawings with points
            if (drawing.points && drawing.points.length > 1) {
              try {
                // Create SVG from the points
                const pathData = drawing.points.reduce((path: string, point: Point, index: number) => {
                  return path + (index === 0 
                    ? `M ${point.x} ${pageData.height - point.y}` 
                    : ` L ${point.x} ${pageData.height - point.y}`);
                }, '');
                
                // Create SVG content
                const svgContent = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="${pageData.width}" height="${pageData.height}">
                    <path 
                      d="${pathData}" 
                      stroke="${drawing.color || '#000000'}" 
                      stroke-width="${drawing.lineWidth || 2}" 
                      fill="${drawing.type === 'highlight' ? drawing.color || '#ffff00' : 'none'}" 
                      fill-opacity="${drawing.type === 'highlight' ? '0.3' : '0'}"
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                      opacity="${drawing.opacity || 1}"
                    />
                  </svg>`;
                
                // Save SVG to temp file and convert to PNG
                const svgId = uuidv4();
                const svgPath = join(TEMP_DIR, `${svgId}.svg`);
                const pngPath = join(TEMP_DIR, `${svgId}.png`);
                
                await writeFile(svgPath, svgContent);
                await sharp(svgPath)
                  .png()
                  .toFile(pngPath);
                
                // Embed the PNG and draw it
                const pngBytes = await readFile(pngPath);
                const image = await pdfDoc.embedPng(pngBytes);
                
                page.drawImage(image, {
                  x: 0,
                  y: 0,
                  width: pageData.width,
                  height: pageData.height
                });
                
                // Clean up temp files
                await unlink(svgPath);
                await unlink(pngPath);
              } catch (svgError) {
                console.error('Error processing drawing:', svgError);
              }
            }
          }
          else if (drawing.type === 'rectangle' || drawing.type === 'circle' || drawing.type === 'line') {
            // Handle shape drawings - we'll convert them to SVG similar to freehand
            try {
              let svgShape = '';
              
              // Handle undefined width/height with defaults
              const shapeWidth = drawing.width ?? 0;
              const shapeHeight = drawing.height ?? 0;
              
              // Create SVG element based on shape type
              if (drawing.type === 'rectangle') {
                // Calculate dimensions, handling negative width/height
                const x = shapeWidth < 0 ? drawing.x + shapeWidth : drawing.x;
                const y = shapeHeight < 0 
                  ? pageData.height - drawing.y - Math.abs(shapeHeight) 
                  : pageData.height - drawing.y - shapeHeight;
                
                svgShape = `<rect
                  x="${x}"
                  y="${y}"
                  width="${Math.abs(shapeWidth)}"
                  height="${Math.abs(shapeHeight)}"
                  stroke="${drawing.color || '#000000'}"
                  stroke-width="${drawing.lineWidth || 2}"
                  fill="none"
                />`;
              } 
              else if (drawing.type === 'circle') {
                // Calculate radius and center
                const radius = Math.sqrt(
                  Math.pow(shapeWidth, 2) + Math.pow(shapeHeight, 2)
                ) / 2;
                
                const centerX = drawing.x + shapeWidth / 2;
                const centerY = pageData.height - (drawing.y + shapeHeight / 2);
                
                svgShape = `<circle
                  cx="${centerX}"
                  cy="${centerY}"
                  r="${radius}"
                  stroke="${drawing.color || '#000000'}"
                  stroke-width="${drawing.lineWidth || 2}"
                  fill="none"
                />`;
              } 
              else if (drawing.type === 'line') {
                svgShape = `<line
                  x1="${drawing.x}"
                  y1="${pageData.height - drawing.y}"
                  x2="${drawing.x + shapeWidth}"
                  y2="${pageData.height - (drawing.y + shapeHeight)}"
                  stroke="${drawing.color || '#000000'}"
                  stroke-width="${drawing.lineWidth || 2}"
                />`;
              }
              
              // Create full SVG
              const svgContent = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${pageData.width}" height="${pageData.height}">
                  ${svgShape}
                </svg>`;
              
              // Save SVG and convert to PNG
              const svgId = uuidv4();
              const svgPath = join(TEMP_DIR, `${svgId}.svg`);
              const pngPath = join(TEMP_DIR, `${svgId}.png`);
              
              await writeFile(svgPath, svgContent);
              await sharp(svgPath)
                .png()
                .toFile(pngPath);
              
              // Embed PNG in PDF
              const pngBytes = await readFile(pngPath);
              const image = await pdfDoc.embedPng(pngBytes);
              
              page.drawImage(image, {
                x: 0,
                y: 0,
                width: pageData.width,
                height: pageData.height
              });
              
              // Clean up temp files
              await unlink(svgPath);
              await unlink(pngPath);
            } catch (shapeError) {
              console.error('Error processing shape:', shapeError);
            }
          }
        }
      }
    }
    
    // Save the final PDF
    const pdfBytes = await pdfDoc.save();
    await writeFile(outputPath, pdfBytes);
    
    // Create relative URL for download
    const fileUrl = `/edited/${uniqueId}-edited.pdf`;
    
    return NextResponse.json({
      success: true,
      message: 'PDF edited successfully',
      fileUrl,
      filename: `${uniqueId}-edited.pdf`
    });
  } catch (error) {
    console.error('PDF editing error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        success: false
      },
      { status: 500 }
    );
  }
}