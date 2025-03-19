"use client";

import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlusIcon,
  MinusIcon
} from "lucide-react";

interface PdfPreviewProps {
  file: File;
  signatureImage: string | null;
  signatureText: string | null;
  signatureType: "draw" | "type";
  onPositionChange: (x: number, y: number, pageNumber: number) => void;
}

export function PdfPreview({
  file,
  signatureImage,
  signatureText,
  signatureType,
  onPositionChange,
}: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  const [signaturePosition, setSignaturePosition] = useState({ x: 100, y: 100 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Create URL for the PDF file
  useEffect(() => {
    if (file) {
      try {
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        setError(null);
        
        // Estimate number of pages based on file size
        const fileSizeInMB = file.size / (1024 * 1024);
        const estimatedPages = Math.max(1, Math.round(fileSizeInMB * 5)); // Rough estimate
        setNumPages(estimatedPages);
        setLoading(false);
        
        // Clean up URL when component unmounts
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Error creating object URL:", err);
        setError("Failed to load PDF preview");
        setLoading(false);
      }
    }
  }, [file]);

  // Navigation functions
  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle signature drag
  const handleDrag = (e: any, ui: any) => {
    const newPosition = {
      x: ui.x,
      y: ui.y
    };
    setSignaturePosition(newPosition);
    
    // Send position to parent component
    onPositionChange(newPosition.x, newPosition.y, pageNumber);
  };

  // Create a simple PDF page preview
  const renderSimplePdfPreview = () => {
    // A very basic PDF page preview with placeholder content
    return (
      <div 
        className="bg-white border p-6 relative"
        style={{ 
          width: "100%", 
          height: "500px",
          transform: `scale(${scale})`,
          transformOrigin: "top left"
        }}
      >
        <div className="absolute top-2 right-2 text-gray-400 text-xs">
          Page {pageNumber} of {numPages}
        </div>
        
        {/* Simple fake page content */}
        <div className="flex flex-col space-y-3 mt-8">
          <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
          <div className="h-6"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-4/5 rounded"></div>
        </div>
        
        {/* Draggable signature */}
        {(signatureImage || signatureText) && (
          <Draggable
            bounds="parent"
            onDrag={handleDrag}
            position={signaturePosition}
          >
            <div 
              ref={dragRef}
              className="absolute cursor-move border-2 border-dashed border-blue-500 p-2 bg-white/80 z-10"
              style={{ 
                zIndex: 1000,
                display: "inline-block"
              }}
            >
              {signatureType === "draw" && signatureImage ? (
                <img 
                  src={signatureImage} 
                  alt="Your signature" 
                  className="max-h-20"
                />
              ) : signatureType === "type" && signatureText ? (
                <p className="text-xl font-serif">{signatureText}</p>
              ) : null}
            </div>
          </Draggable>
        )}
      </div>
    );
  };

  // Loading and error components
  const LoadingComponent = () => (
    <div className="flex items-center justify-center h-80">
      <div className="animate-spin mr-2 h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      <span>Loading PDF...</span>
    </div>
  );

  const ErrorComponent = () => (
    <div className="flex flex-col items-center justify-center h-80 text-red-500">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mb-2"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{error || "Failed to load PDF preview"}</span>
      <p className="text-xs mt-2 max-w-md text-center text-muted-foreground">
        You can still sign your document even without the preview by using the other options below.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col items-center border rounded-lg p-4 bg-muted/10">
      <div className="flex justify-between w-full mb-4">
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1 || loading}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">
            Page {pageNumber} of {numPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextPage} 
            disabled={pageNumber >= numPages || loading}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomOut} 
            disabled={scale <= 0.5 || loading}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">{Math.round(scale * 100)}%</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomIn} 
            disabled={scale >= 2.0 || loading}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="relative border overflow-auto bg-white rounded-md w-full"
        style={{ minHeight: 500, maxHeight: 700 }}
      >
        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <ErrorComponent />
        ) : (
          renderSimplePdfPreview()
        )}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        {!error && (signatureImage || signatureText) ? 
          "Drag your signature to position it exactly where you want it on the document" :
          "Upload a PDF and create your signature to position it on the document"
        }
      </div>
    </div>
  );
}