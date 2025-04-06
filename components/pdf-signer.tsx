// components/pdf-signer.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Download, Trash2 } from 'lucide-react';
import { useLanguageStore } from '@/src/store/store';
import { v4 as uuidv4 } from 'uuid';

// Define the types for our elements
interface SignatureElement {
  id: string;
  type: 'signature' | 'text' | 'stamp' | 'drawing' | 'image';
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: string;
  rotation?: number;
  scale?: number;
  page: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}

// Define page data structure
interface PageData {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  imageUrl?: string;
}

interface PdfSignerProps {
  initialTool?: string;
}

// SignatureElement Component
const SignatureElement: React.FC<{
  element: SignatureElement;
  onUpdate: (id: string, position: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  scale: number;
}> = ({ element, onUpdate, onSelect, isSelected, scale }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(element.position);
  
  // Track touch start position for mobile
  const touchStartRef = useRef({ x: 0, y: 0 });
  // Track element's original position at touch start
  const elementStartPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition(element.position);
  }, [element.position]);

  // Handle touch start event - specifically for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default to avoid screen scrolling during drag
    e.preventDefault();
    
    // Select the element
    onSelect(element.id);
    
    // Record the start touch position
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    
    // Record the element's current position
    elementStartPosRef.current = {
      x: position.x,
      y: position.y
    };
    
    setIsDragging(true);
  };

  // Handle touch move event - specifically for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Prevent default to avoid screen scrolling during drag
    e.preventDefault();
    
    // Calculate the delta movement from the touch start
    const deltaX = (e.touches[0].clientX - touchStartRef.current.x) / scale;
    const deltaY = (e.touches[0].clientY - touchStartRef.current.y) / scale;
    
    // Update position based on the original position plus the delta
    const newPosition = {
      x: elementStartPosRef.current.x + deltaX,
      y: elementStartPosRef.current.y + deltaY
    };
    
    setPosition(newPosition);
  };

  // Handle touch end event - specifically for mobile
  const handleTouchEnd = () => {
    if (isDragging) {
      // Update the parent component with the new position
      onUpdate(element.id, position);
      setIsDragging(false);
    }
  };

  // Handle mouse drag event - for desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate the delta movement from the touch start
    const deltaX = (e.clientX - touchStartRef.current.x) / scale;
    const deltaY = (e.clientY - touchStartRef.current.y) / scale;
    
    // Update position based on the original position plus the delta
    const newPosition = {
      x: elementStartPosRef.current.x + deltaX,
      y: elementStartPosRef.current.y + deltaY
    };
    
    setPosition(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Select the element
    onSelect(element.id);
    
    // Record the start mouse position
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    // Record the element's current position
    elementStartPosRef.current = {
      x: position.x,
      y: position.y
    };
    
    setIsDragging(true);
    
    // Add mouse event listeners to document
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      // Update the parent component with the new position
      onUpdate(element.id, position);
      setIsDragging(false);
      
      // Remove mouse event listeners
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  // Render the appropriate content based on element type
  const renderContent = () => {
    switch (element.type) {
      case 'signature':
      case 'image':
        return (
          <img
            src={element.data}
            alt="Signature"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable="false"
          />
        );
      case 'text':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              color: element.color || '#000',
              fontSize: `${element.fontSize || 16}px`,
              fontFamily: element.fontFamily || 'Arial',
              userSelect: 'none',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
          >
            {element.data}
          </div>
        );
      case 'stamp':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '2px solid red',
              color: 'red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              userSelect: 'none',
              pointerEvents: 'none',
              padding: '4px',
            }}
          >
            {element.data.toUpperCase()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: 'move',
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        opacity: element.scale || 1,
        touchAction: 'none', // Important for preventing browser gestures during touch
      }}
      className={`signature-element ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(element.id)}
    >
      {renderContent()}
      {isSelected && (
        <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-dashed border-primary rounded-sm pointer-events-none" />
      )}
    </div>
  );
};

// PageContainer Component
const PageContainer: React.FC<{
  page: PageData;
  elements: SignatureElement[];
  onElementUpdate: (id: string, position: { x: number; y: number }) => void;
  onElementSelect: (id: string) => void;
  selectedElementId: string | null;
  pageIndex: number;
  scale: number;
}> = ({ page, elements, onElementUpdate, onElementSelect, selectedElementId, pageIndex, scale }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchBlocked, setTouchBlocked] = useState(false);

  // Filter elements for the current page
  const pageElements = elements.filter(element => element.page === pageIndex);

  // Handle container touch start - prevent default only when we have elements
  const handleContainerTouchStart = (e: React.TouchEvent) => {
    if (pageElements.length > 0) {
      // Don't prevent default here, just check if we should block page scrolling
      const touch = e.touches[0];
      
      // Check if the touch is on any of our signature elements
      const touchOnElement = pageElements.some(element => {
        const elementRect = {
          left: element.position.x,
          top: element.position.y,
          right: element.position.x + element.size.width,
          bottom: element.position.y + element.size.height,
        };
        
        // Get container bounds
        const container = containerRef.current?.getBoundingClientRect();
        if (!container) return false;
        
        // Adjust touch coordinates relative to the container
        const relativeX = (touch.clientX - container.left) / scale;
        const relativeY = (touch.clientY - container.top) / scale;
        
        // Check if touch is within element bounds
        return (
          relativeX >= elementRect.left &&
          relativeX <= elementRect.right &&
          relativeY >= elementRect.top &&
          relativeY <= elementRect.bottom
        );
      });
      
      if (touchOnElement) {
        // Only prevent default if we're touching a signature element
        e.preventDefault();
        setTouchBlocked(true);
      }
    }
  };

  // Clear the touch blocked state on touch end
  const handleContainerTouchEnd = () => {
    setTouchBlocked(false);
  };

  // Handle touch move on container
  const handleContainerTouchMove = (e: React.TouchEvent) => {
    // Only prevent default if we're interacting with an element
    if (touchBlocked) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative mb-8 shadow-lg">
      <div
        ref={containerRef}
        className="relative bg-white"
        style={{
          width: page.width,
          height: page.height,
          touchAction: touchBlocked ? 'none' : 'auto', // Only disable touch actions when interacting with elements
        }}
        onTouchStart={handleContainerTouchStart}
        onTouchMove={handleContainerTouchMove}
        onTouchEnd={handleContainerTouchEnd}
      >
        {/* Page background */}
        {page.imageUrl && (
          <img
            src={page.imageUrl}
            alt={`Page ${pageIndex + 1}`}
            className="absolute top-0 left-0 w-full h-full object-contain"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
            draggable="false"
          />
        )}

        {/* Page elements */}
        {pageElements.map((element) => (
          <SignatureElement
            key={element.id}
            element={element}
            onUpdate={onElementUpdate}
            onSelect={onElementSelect}
            isSelected={selectedElementId === element.id}
            scale={scale}
          />
        ))}
      </div>
      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        Page {pageIndex + 1}
      </div>
    </div>
  );
};

// SignaturePanel Component
const SignaturePanel: React.FC<{
  onAdd: (element: Omit<SignatureElement, 'id' | 'position' | 'page'>) => void;
  type: 'signature' | 'text' | 'stamp';
}> = ({ onAdd, type }) => {
  const { t } = useLanguageStore();
  const [signatureData, setSignatureData] = useState<string>('');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [text, setText] = useState<string>('');
  const [stamp, setStamp] = useState<string>('APPROVED');
  const [color, setColor] = useState<string>('#000000');
  const [fontSize, setFontSize] = useState<number>(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number, y: number } | null>(null);

  // Create signature drawing canvas
  useEffect(() => {
    if (type === 'signature' && signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [type, signatureMode, color]);

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setLastPosition({ x, y });
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosition || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPosition({ x, y });
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
    setLastPosition(null);
    
    if (canvasRef.current) {
      // Save the signature data
      const signatureImg = canvasRef.current.toDataURL('image/png');
      setSignatureData(signatureImg);
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData('');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSignatureData(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddElement = () => {
    if (type === 'signature' && !signatureData) {
      return; // Don't add empty signature
    }

    if (type === 'text' && !text) {
      return; // Don't add empty text
    }

    let elementData;
    
    switch (type) {
      case 'signature':
        elementData = {
          type: 'signature',
          data: signatureData,
          size: { width: 200, height: 100 },
        };
        break;
      case 'text':
        elementData = {
          type: 'text',
          data: text,
          size: { width: text.length * fontSize * 0.6, height: fontSize * 1.5 },
          color,
          fontSize,
          fontFamily: 'Arial',
        };
        break;
      case 'stamp':
        elementData = {
          type: 'stamp',
          data: stamp,
          size: { width: 200, height: 80 },
        };
        break;
      default:
        return;
    }

    onAdd(elementData as any);
  };

  if (type === 'signature') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={signatureMode === 'draw' ? "default" : "outline"}
            onClick={() => setSignatureMode('draw')}
            size="sm"
          >
            {t('signPdf.draw')}
          </Button>
          <Button
            variant={signatureMode === 'upload' ? "default" : "outline"}
            onClick={() => setSignatureMode('upload')}
            size="sm"
          >
            {t('signPdf.uploadSignature')}
          </Button>
          <Button
            variant={signatureMode === 'type' ? "default" : "outline"}
            onClick={() => setSignatureMode('type')}
            size="sm"
          >
            {t('signPdf.options.type')}
          </Button>
        </div>

        {signatureMode === 'draw' && (
          <div className="border p-2 rounded-md">
            <canvas
              ref={canvasRef}
              width={300}
              height={150}
              className="border border-dashed rounded-md bg-white w-full touch-none"
              onMouseDown={handleDrawStart}
              onMouseMove={handleDrawMove}
              onMouseUp={handleDrawEnd}
              onMouseLeave={handleDrawEnd}
              onTouchStart={handleDrawStart}
              onTouchMove={handleDrawMove}
              onTouchEnd={handleDrawEnd}
            />
            <div className="flex justify-between mt-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-md"
              />
              <Button variant="outline" size="sm" onClick={handleClearCanvas}>
                {t('signPdf.options.clear')}
              </Button>
            </div>
          </div>
        )}

        {signatureMode === 'upload' && (
          <div className="border p-4 rounded-md text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="signature-upload"
            />
            <label
              htmlFor="signature-upload"
              className="cursor-pointer block border-2 border-dashed rounded-md p-6 text-muted-foreground hover:border-primary"
            >
              {signatureData ? (
                <img
                  src={signatureData}
                  alt="Uploaded signature"
                  className="max-h-20 mx-auto"
                />
              ) : (
                <div>
                  <span className="block">{t('signPdf.uploadSignature')}</span>
                  <span className="text-xs">PNG, JPG, GIF</span>
                </div>
              )}
            </label>
          </div>
        )}

        {signatureMode === 'type' && (
          <div className="space-y-2">
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                // Generate signature data from text
                if (e.target.value) {
                  const canvas = document.createElement('canvas');
                  canvas.width = 300;
                  canvas.height = 150;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.font = `italic bold 30px cursive`;
                    ctx.fillStyle = color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(e.target.value, 150, 75);
                    setSignatureData(canvas.toDataURL('image/png'));
                  }
                } else {
                  setSignatureData('');
                }
              }}
              className="w-full p-2 border rounded-md"
              placeholder="Type your signature"
            />
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-md"
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <Button
            onClick={handleAddElement}
            disabled={!signatureData}
            className="w-full"
          >
            {t('signPdf.options.apply')}
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-md h-32"
          placeholder="Enter text..."
        />
        <div className="flex justify-between">
          <div>
            <label className="text-sm">{t('signPdf.options.color')}</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="block w-8 h-8 rounded-md mt-1"
            />
          </div>
          <div>
            <label className="text-sm">{t('signPdf.options.fontSize')}</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="block w-20 p-2 border rounded-md mt-1"
              min={8}
              max={72}
            />
          </div>
        </div>
        <Button
          onClick={handleAddElement}
          disabled={!text}
          className="w-full"
        >
          {t('signPdf.addText')}
        </Button>
      </div>
    );
  }

  if (type === 'stamp') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {['APPROVED', 'REJECTED', 'DRAFT', 'CONFIDENTIAL', 'FINAL'].map((stampText) => (
            <Button
              key={stampText}
              variant={stamp === stampText ? "default" : "outline"}
              onClick={() => setStamp(stampText)}
              className="justify-start"
            >
              <div
                className="border-2 border-red-500 text-red-500 px-2 py-1 text-sm font-bold"
              >
                {stampText}
              </div>
            </Button>
          ))}
        </div>
        <Button
          onClick={handleAddElement}
          className="w-full"
        >
          {t('signPdf.options.apply')}
        </Button>
      </div>
    );
  }

  return null;
};

export const PdfSigner: React.FC<PdfSignerProps> = ({ initialTool = 'signature' }) => {
  const { t } = useLanguageStore();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [elements, setElements] = useState<SignatureElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>(initialTool);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate viewport scale factor for proper positioning on different screen sizes
  useEffect(() => {
    if (containerRef.current && pages.length > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const pageWidth = pages[0].width;
      
      if (containerWidth < pageWidth) {
        setScale(containerWidth / pageWidth);
      } else {
        setScale(1);
      }
    }
  }, [pages, containerRef.current?.clientWidth]);

  // Handle window resize to recalculate scale
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && pages.length > 0) {
        const containerWidth = containerRef.current.clientWidth;
        const pageWidth = pages[0].width;
        
        if (containerWidth < pageWidth) {
          setScale(containerWidth / pageWidth);
        } else {
          setScale(1);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pages]);

  // Handle file upload
  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    setElements([]);
    setSelectedElementId(null);
    setSignedPdfUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      
      if (data.success) {
        setPages(data.pages);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: t('signPdf.messages.error'),
        description: t('signPdf.messages.errorDesc'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new element (signature, text, etc.)
  const handleAddElement = (elementData: Omit<SignatureElement, 'id' | 'position' | 'page'>) => {
    if (pages.length === 0) {
      toast({
        title: t('signPdf.messages.noFile'),
        description: t('signPdf.messages.uploadFirst'),
        variant: 'destructive',
      });
      return;
    }

    // Create new element with unique ID and centered position on the current page
    const newElement: SignatureElement = {
      ...elementData,
      id: `element-${uuidv4()}`,
      position: {
        x: (pages[0].width - elementData.size.width) / 2,
        y: (pages[0].height - elementData.size.height) / 2,
      },
      page: 0, // Default to first page
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  // Update element position
  const handleElementUpdate = (id: string, position: { x: number; y: number }) => {
    setElements(
      elements.map((element) =>
        element.id === id ? { ...element, position } : element
      )
    );
  };

  // Remove selected element
  const handleRemoveSelected = () => {
    if (selectedElementId) {
      setElements(elements.filter((element) => element.id !== selectedElementId));
      setSelectedElementId(null);
    }
  };

  // Clear all elements
  const handleClearAll = () => {
    setElements([]);
    setSelectedElementId(null);
  };

  // Process the PDF with signatures and other elements
  const handleSavePdf = async () => {
    if (!file || elements.length === 0) {
      toast({
        title: 'No changes to save',
        description: 'Add signatures or other elements before saving',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('elements', JSON.stringify(elements));
      formData.append('pages', JSON.stringify(pages));

      const response = await fetch('/api/pdf/sign', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to sign PDF');
      }

      const data = await response.json();

      if (data.success) {
        setSignedPdfUrl(data.fileUrl);
        toast({
          title: t('signPdf.messages.signed'),
          description: t('signPdf.messages.downloadReady'),
        });
      } else {
        throw new Error