"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from "react-draggable";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlusIcon,
  MinusIcon
} from "lucide-react";

// Set the PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Create URL for the PDF file
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      // Clean up URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  // Handle document load success
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // Navigation functions
  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    if (numPages) {
      setPageNumber(prev => Math.min(prev + 1, numPages));
    }
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle page render success to get dimensions
  const onPageRenderSuccess = (page: any) => {
    const viewport = page.getViewport({ scale: 1 });
    setPageSize({
      width: viewport.width,
      height: viewport.height,
    });
  };

  // Handle signature drag
  const handleDrag = (e: any, ui: any) => {
    const newPosition = {
      x: signaturePosition.x + ui.deltaX,
      y: signaturePosition.y + ui.deltaY,
    };
    setSignaturePosition(newPosition);
    
    // Get the page element to calculate relative position
    if (containerRef.current) {
      const pageElement = containerRef.current.querySelector(".react-pdf__Page");
      if (pageElement) {
        const pageRect = pageElement.getBoundingClientRect();
        const dragElement = dragRef.current;
        
        if (dragElement) {
          const dragRect = dragElement.getBoundingClientRect();
          const relativeX = (dragRect.left - pageRect.left) / scale;
          const relativeY = (dragRect.top - pageRect.top) / scale;
          
          onPositionChange(relativeX, relativeY, pageNumber);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center border rounded-lg p-4 bg-muted/10">
      <div className="flex justify-between w-full mb-4">
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">
            Page {pageNumber} of {numPages || '...'}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextPage} 
            disabled={!numPages || pageNumber >= numPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomOut} 
            disabled={scale <= 0.5}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">{Math.round(scale * 100)}%</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomIn} 
            disabled={scale >= 2.0}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="relative border overflow-auto bg-white rounded-md" 
        style={{ minHeight: 500 }}
      >
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="flex items-center justify-center h-80">Loading PDF...</div>}
            error={<div className="flex items-center justify-center h-80">Failed to load PDF</div>}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              onRenderSuccess={onPageRenderSuccess}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
            
            {/* Draggable Signature */}
            {!loading && (signatureImage || signatureText) && (
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
                    <p className="text-xl font-signature">{signatureText}</p>
                  ) : null}
                </div>
              </Draggable>
            )}
          </Document>
        )}
        
        {!pdfUrl && (
          <div className="flex items-center justify-center h-80">
            No PDF loaded
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        Drag your signature to position it exactly where you want it on the document
      </div>
    </div>
  );
}