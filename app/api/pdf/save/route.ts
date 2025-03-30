// app/api/pdf/save/route.ts
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

// Interface for Canvas Editor data
interface CanvasEditorData {
  blocks?: any[]; // Blocks from canvas-editor
  canvas?: {
    width: number;
    height: number;
  };
  watermark?: any;
  // Other properties from canvas-editor
}

interface CanvasEditorDrawing {
  type: string;
  value: any;
  left: number;
  top: number;
  width?: number;
  height?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  // Other properties
}

// Process Canvas Editor drawings
async function processCanvasEditorDrawing(canvasData: CanvasEditorData, page: any, pageData: PageData) {
  try {
    // Process blocks from canvas-editor
    if (canvasData.blocks && Array.isArray(canvasData.blocks)) {
      for (const block of canvasData.blocks) {
        if (block.type === 'text' && block.value) {
          // Process text elements
          const fontName: keyof typeof StandardFonts = 
            block.fontFamily?.includes('Times') ? 'TimesRoman' : 
            block.fontFamily?.includes('Courier') ? 'Courier' : 'Helvetica';
          
          const font = await page.doc.embedFont(StandardFonts[fontName]);
          const fontSize = block.fontSize || 16;
          
          // Parse color from canvas-editor (could be in various formats)
          let r = 0, g = 0, b = 0;
          if (block.color) {
            if (block.color.startsWith('#')) {
              const hex = block.color.slice(1);
              r = parseInt(hex.substring(0, 2), 16) / 255;
              g = parseInt(hex.substring(2, 4), 16) / 255;
              b = parseInt(hex.substring(4, 6), 16) / 255;
            } else if (block.color.startsWith('rgb')) {
              const rgbMatch = block.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
              if (rgbMatch) {
                r = parseInt(rgbMatch[1]) / 255;
                g = parseInt(rgbMatch[2]) / 255;
                b = parseInt(rgbMatch[3]) / 255;
              }
            }
          }
          
          // Draw text
          page.drawText(block.value, {
            x: block.left || 0,
            y: pageData.height - (block.top || 0) - (fontSize || 16), // Adjust for canvas coordinate system
            size: fontSize,
            font,
            color: rgb(r, g, b)
          });
        } 
        else if (block.type === 'image' && block.value) {
          // Process image elements
          try {
            const imageId = uuidv4();
            const imagePath = join(TEMP_DIR, `${imageId}.png`);
            
            // Handle different image data formats
            let imageData = block.value;
            if (typeof imageData === 'string' && imageData.startsWith('data:')) {
              imageData = imageData.replace(/^data:image\/\w+;base64,/, '');
            }
            
            const buffer = Buffer.from(imageData, 'base64');
            await writeFile(imagePath, buffer);
            
            // Embed the image
            const imageBytes = await readFile(imagePath);
            const image = await page.doc.embedPng(imageBytes);
            
            // Draw the image
            const imgWidth = block.width || 200;
            const imgHeight = block.height || 100;
            
            page.drawImage(image, {
              x: block.left || 0,
              y: pageData.height - (block.top || 0) - imgHeight,
              width: imgWidth,
              height: imgHeight
            });
            
            // Clean up temp file
            await unlink(imagePath);
          } catch (imageError) {
            console.error('Error processing canvas image:', imageError);
          }
        }
        else if (block.type === 'path' || block.type === 'freedraw') {
          // Process path/drawing elements
          if (block.path && Array.isArray(block.path)) {
            try {
              // Convert canvas-editor path format to SVG path
              let pathData = '';
              block.path.forEach((point: any, index: number) => {
                if (index === 0) {
                  pathData += `M ${point.x} ${pageData.height - point.y}`;
                } else {
                  pathData += ` L ${point.x} ${pageData.height - point.y}`;
                }
              });
              
              // Create SVG for the path
              const svgContent = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${pageData.width}" height="${pageData.height}">
                  <path 
                    d="${pathData}" 
                    stroke="${block.color || '#000000'}" 
                    stroke-width="${block.lineWidth || 2}" 
                    fill="none"
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    opacity="${block.opacity || 1}"
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
              const image = await page.doc.embedPng(pngBytes);
              
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
              console.error('Error processing canvas path:', svgError);
            }
          }
        }
        else if (block.type === 'rect' || block.type === 'rectangle') {
          // Process rectangle elements
          try {
            const x = block.left || 0;
            const y = pageData.height - (block.top || 0) - (block.height || 0);
            const width = block.width || 100;
            const height = block.height || 100;
            
            // Create SVG for the rectangle
            const svgContent = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${pageData.width}" height="${pageData.height}">
                <rect
                  x="${x}"
                  y="${y}"
                  width="${width}"
                  height="${height}"
                  stroke="${block.color || '#000000'}"
                  stroke-width="${block.lineWidth || 2}"
                  fill="${block.fill || 'none'}"
                  opacity="${block.opacity || 1}"
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
            const image = await page.doc.embedPng(pngBytes);
            
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: pageData.width,
              height: pageData.height
            });
            
            // Clean up temp files
            await unlink(svgPath);
            await unlink(pngPath);
          } catch (rectError) {
            console.error('Error processing canvas rectangle:', rectError);
          }
        }
        else if (block.type === 'circle') {
          // Process circle elements
          try {
            const centerX = (block.left || 0) + (block.width || 0) / 2;
            const centerY = pageData.height - ((block.top || 0) + (block.height || 0) / 2);
            const radius = Math.min(block.width || 0, block.height || 0) / 2;
            
            // Create SVG for the circle
            const svgContent = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${pageData.width}" height="${pageData.height}">
                <circle
                  cx="${centerX}"
                  cy="${centerY}"
                  r="${radius}"
                  stroke="${block.color || '#000000'}"
                  stroke-width="${block.lineWidth || 2}"
                  fill="${block.fill || 'none'}"
                  opacity="${block.opacity || 1}"
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
            const image = await page.doc.embedPng(pngBytes);
            
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: pageData.width,
              height: pageData.height
            });
            
            // Clean up temp files
            await unlink(svgPath);
            await unlink(pngPath);
          } catch (circleError) {
            console.error('Error processing canvas circle:', circleError);
          }
        }
        else if (block.type === 'line') {
          // Process line elements
          try {
            const x1 = block.left || 0;
            const y1 = pageData.height - (block.top || 0);
            const x2 = (block.left || 0) + (block.width || 0);
            const y2 = pageData.height - ((block.top || 0) + (block.height || 0));
            
            // Create SVG for the line
            const svgContent = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${pageData.width}" height="${pageData.height}">
                <line
                  x1="${x1}"
                  y1="${y1}"
                  x2="${x2}"
                  y2="${y2}"
                  stroke="${block.color || '#000000'}"
                  stroke-width="${block.lineWidth || 2}"
                  opacity="${block.opacity || 1}"
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
            const image = await page.doc.embedPng(pngBytes);
            
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: pageData.width,
              height: pageData.height
            });
            
            // Clean up temp files
            await unlink(svgPath);
            await unlink(pngPath);
          } catch (lineError) {
            console.error('Error processing canvas line:', lineError);
          }
        }
      }
    }
    
    // Process watermark if present
    if (canvasData.watermark) {
      try {
        const watermark = canvasData.watermark;
        const text = watermark.text || 'WATERMARK';
        const fontSize = watermark.fontSize || 48;
        
        // Parse color
        let r = 0, g = 0, b = 0;
        if (watermark.color && watermark.color.startsWith('#')) {
          const hex = watermark.color.slice(1);
          r = parseInt(hex.substring(0, 2), 16) / 255;
          g = parseInt(hex.substring(2, 4), 16) / 255;
          b = parseInt(hex.substring(4, 6), 16) / 255;
        }
        
        // Draw watermark text
        const font = await page.doc.embedFont(StandardFonts.Helvetica);
        
        // For diagonal watermark across the page
        const angle = Math.atan2(pageData.height, pageData.width);
        const diagonal = Math.sqrt(Math.pow(pageData.width, 2) + Math.pow(pageData.height, 2));
        const centerX = pageData.width / 2;
        const centerY = pageData.height / 2;
        
        // Create watermark using SVG
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${pageData.width}" height="${pageData.height}">
            <text
              x="${centerX}"
              y="${centerY}"
              font-family="Helvetica"
              font-size="${fontSize}"
              text-anchor="middle"
              dominant-baseline="middle"
              transform="rotate(${-45 * (180 / Math.PI)}, ${centerX}, ${centerY})"
              fill="${watermark.color || 'rgba(0,0,0,0.2)'}"
              opacity="${watermark.opacity || 0.3}"
            >${text}</text>
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
        const image = await page.doc.embedPng(pngBytes);
        
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: pageData.width,
          height: pageData.height
        });
        
        // Clean up temp files
        await unlink(svgPath);
        await unlink(pngPath);
      } catch (watermarkError) {
        console.error('Error processing canvas watermark:', watermarkError);
      }
    }
  } catch (error) {
    console.error('Error processing Canvas Editor data:', error);
  }
}

// Process traditional drawing elements
async function processDrawing(drawing: Drawing, page: any, pageData: PageData) {
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
    
    const font = await page.doc.embedFont(StandardFonts[fontName]);
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
      const image = await page.doc.embedPng(imageBytes);
      
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
        const image = await page.doc.embedPng(pngBytes);
        
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
    // Handle shape drawings - convert them to SVG similar to freehand
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
      const image = await page.doc.embedPng(pngBytes);
      
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
          // Check if the drawing data is from Canvas Editor
          if (drawing && typeof drawing === 'object' && ('blocks' in drawing || 'canvas' in drawing)) {
            // Handle Canvas Editor data
            await processCanvasEditorDrawing(drawing as unknown as CanvasEditorData, page, pageData);
          } else {
            // Handle traditional drawings
            await processDrawing(drawing, page, pageData);
          }
        }
      }
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await writeFile(outputPath, pdfBytes);

    const fileUrl = `/edited/${uniqueId}-edited.pdf`;

    return NextResponse.json({
      success: true,
      message: "PDF saved successfully",
      fileUrl,
    });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "An unknown error occurred saving the PDF",
        success: false 
      },
      { status: 500 }
    );
  }
}