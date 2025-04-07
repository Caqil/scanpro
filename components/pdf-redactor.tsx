"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/src/store/store";
import {
  EyeOff,
  Upload,
  FileUp,
  Loader2,
  Download,
  Search,
  Eraser,
  Text,
  Image,
  Info,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SelectIcon } from "@radix-ui/react-select";

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Define redaction rectangle type
interface RedactionRect {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label?: string;
}
interface Pattern {
  type: string;
  pattern: string;
  enabled: boolean;
  description?: string;
}

// Ensure the RedactionRect interface is properly defined
interface RedactionRect {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label?: string;
}
// Define pattern types for automatic redaction
type PatternType = 'ssn' | 'email' | 'phone' | 'creditCard' | 'custom';

export function PdfRedactor() {
  const { t } = useLanguageStore();
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageDetails, setPageDetails] = useState<Array<{width: number, height: number}>>([]);
  const [scale, setScale] = useState<number>(1.0);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [redactedPdfUrl, setRedactedPdfUrl] = useState<string>('');
  
  // Tool state
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [activeTool, setActiveTool] = useState<'rect' | 'text' | 'image'>('rect');
  const [redactionColor, setRedactionColor] = useState<string>('#000000');
  const [redactionLabel, setRedactionLabel] = useState<string>('');
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);
  
  // Auto redaction state
 // Add more predefined patterns and make them more robust
// In your PDF Redactor component
// Default patterns with clear descriptions
const DEFAULT_PATTERNS: Pattern[] = [
  { 
    type: 'ssn', 
    pattern: '\\b\\d{3}-\\d{2}-\\d{4}\\b', 
    enabled: true, // Default to enabled
    description: 'Social Security Numbers (123-45-6789)'
  },
  { 
    type: 'email', 
    pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', 
    enabled: true, // Default to enabled
    description: 'Email Addresses (user@example.com)'
  },
  { 
    type: 'phone', 
    pattern: '\\b(?:\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}\\b', 
    enabled: true, // Default to enabled
    description: 'Phone Numbers ((555) 123-4567)'
  },
  { 
    type: 'creditCard', 
    pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b', 
    enabled: true, // Default to enabled
    description: 'Credit Card Numbers (4111-1111-1111-1111)'
  },
  { 
    type: 'custom', 
    pattern: '', 
    enabled: false, // Leave custom disabled by default
    description: 'Custom Pattern (Advanced)'
  }
];

// Initialize patterns state with defaults
const [patterns, setPatterns] = useState(DEFAULT_PATTERNS.map(p => ({
  type: p.type,
  pattern: p.pattern,
  enabled: p.enabled
})));

  const [customPattern, setCustomPattern] = useState<string>('');
  
  // Drawing state
  const [redactionRects, setRedactionRects] = useState<RedactionRect[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLDivElement>(null);

  // Effect to handle cleanup of redacted PDF URL
  useEffect(() => {
    return () => {
      if (redactedPdfUrl) {
        URL.revokeObjectURL(redactedPdfUrl);
      }
    };
  }, [redactedPdfUrl]);

  // Handle file upload through click or drag and drop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      resetState();
    } else {
      toast.error(t('redactPdf.errors.invalidFile') || "Please select a valid PDF file");
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    
    if (e.dataTransfer.files?.length) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        resetState();
      } else {
        toast.error(t('redactPdf.errors.invalidFile') || "Please select a valid PDF file");
      }
    }
  };
  
  // Reset state when a new file is loaded
  const resetState = () => {
    setNumPages(0);
    setCurrentPage(1);
    setPageDetails([]);
    setRedactionRects([]);
    setRedactedPdfUrl('');
    setProgress(0);
  };
  
  // Handle PDF document loading
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // Initialize page details array
    const details = Array(numPages).fill({ width: 0, height: 0 });
    setPageDetails(details);
  };
  
  // Handle page rendering success to get page dimensions
  const onPageLoadSuccess = (page: any) => {
    const viewport = page.getViewport({ scale: 1 });
    const index = page._pageIndex;
    
    setPageDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        width: viewport.width,
        height: viewport.height
      };
      return updated;
    });
  };
  

// Improve mouse event handling
const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!pdfCanvasRef.current || activeTool !== 'rect') return;
  
  const pdfPage = pdfCanvasRef.current.querySelector('.react-pdf__Page');
  if (!pdfPage) return;

  const pdfPageRect = pdfPage.getBoundingClientRect();
  const scaleX = pdfPage.clientWidth / pageDetails[currentPage - 1].width;
  
  const x = (e.clientX - pdfPageRect.left) / scaleX;
  const y = (e.clientY - pdfPageRect.top) / scaleX;
  
  setIsDrawing(true);
  setStartPos({ x, y });
  setScale(scaleX); // Dynamically adjust scale
};

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!isDrawing || !startPos || !pdfCanvasRef.current) return;
  
  const pdfPage = pdfCanvasRef.current.querySelector('.react-pdf__Page');
  if (!pdfPage) return;

  const pdfPageRect = pdfPage.getBoundingClientRect();
  const scaleX = pdfPage.clientWidth / pageDetails[currentPage - 1].width;
  
  const x = (e.clientX - pdfPageRect.left) / scaleX;
  const y = (e.clientY - pdfPageRect.top) / scaleX;
  
  const tempRect: RedactionRect = {
    id: 'temp',
    pageIndex: currentPage - 1,
    x: Math.min(startPos.x, x),
    y: Math.min(startPos.y, y),
    width: Math.abs(x - startPos.x),
    height: Math.abs(y - startPos.y),
    color: redactionColor,
    label: showLabels ? redactionLabel : undefined
  };
  
  setRedactionRects(prev => {
    const withoutTemp = prev.filter(r => r.id !== 'temp');
    return [...withoutTemp, tempRect];
  });
};

// Add a warning for browser compatibility
useEffect(() => {
  if (typeof window === 'undefined' || !window.FileReader) {
    toast.warning('Your browser may not fully support all PDF redaction features.');
  }
}, []);
  
  
  const handleMouseUp = () => {
    if (!isDrawing || !startPos) return;
    
    // Convert temporary rectangle to permanent
    setRedactionRects(prev => {
      const withoutTemp = prev.filter(r => r.id !== 'temp');
      const tempRect = prev.find(r => r.id === 'temp');
      
      if (tempRect && tempRect.width > 5 && tempRect.height > 5) {
        const permanentRect: RedactionRect = {
          ...tempRect,
          id: `rect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        return [...withoutTemp, permanentRect];
      }
      
      return withoutTemp;
    });
    
    setIsDrawing(false);
    setStartPos(null);
  };
  
  // Text selection handler for text redaction
  const handleTextSelection = () => {
    if (activeTool !== 'text' || !window.getSelection) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Get selected text range
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    
    // Get containing element boundaries
    const rect = range.getBoundingClientRect();
    if (!pdfCanvasRef.current) return;
    
    const canvasRect = pdfCanvasRef.current.getBoundingClientRect();
    
    // Convert to PDF coordinates
    const x = (rect.left - canvasRect.left) / scale;
    const y = (rect.top - canvasRect.top) / scale;
    const width = rect.width / scale;
    const height = rect.height / scale;
    
    // Create redaction rectangle from text selection
    if (width > 0 && height > 0) {
      const textRedactionRect: RedactionRect = {
        id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pageIndex: currentPage - 1,
        x,
        y,
        width,
        height,
        color: redactionColor,
        label: showLabels ? redactionLabel : undefined
      };
      
      setRedactionRects(prev => [...prev, textRedactionRect]);
      
      // Clear selection
      selection.removeAllRanges();
    }
  };
  
  // Image selection handler for image redaction
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (activeTool !== 'image') return;
    
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    if (!pdfCanvasRef.current) return;
    
    const canvasRect = pdfCanvasRef.current.getBoundingClientRect();
    
    // Convert to PDF coordinates
    const x = (rect.left - canvasRect.left) / scale;
    const y = (rect.top - canvasRect.top) / scale;
    const width = rect.width / scale;
    const height = rect.height / scale;
    
    // Create redaction rectangle for image
    const imageRedactionRect: RedactionRect = {
      id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pageIndex: currentPage - 1,
      x,
      y,
      width,
      height,
      color: redactionColor,
      label: showLabels ? 'Image Redacted' : undefined
    };
    
    setRedactionRects(prev => [...prev, imageRedactionRect]);
  };
  
  // Function to remove a redaction rectangle
  const handleRemoveRect = (id: string) => {
    setRedactionRects(prev => prev.filter(rect => rect.id !== id));
  };
  
  // Process the redaction
  const handleProcessRedaction = async () => {
    if (!file || redactionRects.length === 0) {
      toast.error(t('redactPdf.errors.noRedactions') || "Please mark areas for redaction first");
      return;
    }
    
    setIsProcessing(true);
    setProgress(10);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('redactions', JSON.stringify(redactionRects));
      formData.append('removeMetadata', removeMetadata.toString());
      
      const response = await fetch('/api/pdf/redact', {
        method: 'POST',
        body: formData,
      });
      
      setProgress(70);
      
      if (!response.ok) {
        throw new Error(`Error redacting PDF: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to redact PDF');
      }
      
      setProgress(100);
      setRedactedPdfUrl(result.fileUrl);
      toast.success(t('redactPdf.success') || "PDF successfully redacted!");
    } catch (error) {
      console.error('Redaction error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during redaction');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Clear all redaction rectangles
  const handleClearAll = () => {
    if (redactionRects.length > 0) {
      setRedactionRects([]);
      toast.info(t('redactPdf.cleared') || "All redaction marks cleared");
    }
  };
  const renderPatternSelectionUI = () => (
    <div className="space-y-4 rounded-md border p-4 bg-card">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <span className="font-medium text-sm">Data Patterns to Detect</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs"
          onClick={() => {
            // Toggle all patterns except custom
            const allEnabled = patterns.filter(p => p.type !== 'custom').every(p => p.enabled);
            setPatterns(prev => prev.map(p => 
              p.type !== 'custom' ? { ...p, enabled: !allEnabled } : p
            ));
          }}
        >
          {patterns.filter(p => p.type !== 'custom').every(p => p.enabled) ? 'Deselect All' : 'Select All'}
        </Button>
      </div>
      
      {/* Pattern cards with examples */}
      <div className="grid gap-2">
        {/* SSN pattern */}
        <div className="rounded-md border hover:border-primary transition-colors bg-background p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="pattern-ssn"
                checked={patterns.find(p => p.type === 'ssn')?.enabled || false}
                onCheckedChange={(checked) => {
                  setPatterns(prev => prev.map(p => 
                    p.type === 'ssn' ? { ...p, enabled: checked === true } : p
                  ));
                }}
              />
              <Label htmlFor="pattern-ssn" className="font-medium cursor-pointer">
                Social Security Numbers
              </Label>
            </div>
            <div className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
              Highly Sensitive
            </div>
          </div>
          
          {/* Examples */}
          <div className="mt-2 ml-7">
            <div className="text-xs text-muted-foreground mb-1">Examples:</div>
            <div className="flex flex-wrap gap-2">
              <div className="text-xs px-2 py-1 rounded bg-muted">123-45-6789</div>
              <div className="text-xs px-2 py-1 rounded bg-muted">987-65-4321</div>
            </div>
          </div>
        </div>
        
        {/* Add similar blocks for email, phone and credit card patterns */}
        
        {/* Custom pattern */}
        <div className="rounded-md border hover:border-primary transition-colors bg-background p-3 mt-2 border-t-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="pattern-custom"
                checked={patterns.find(p => p.type === 'custom')?.enabled || false}
                onCheckedChange={(checked) => {
                  setPatterns(prev => prev.map(p => 
                    p.type === 'custom' ? { ...p, enabled: checked === true } : p
                  ));
                }}
              />
              <Label htmlFor="pattern-custom" className="font-medium cursor-pointer">
                Custom Pattern (Advanced)
              </Label>
            </div>
            <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
              Advanced
            </div>
          </div>
          
          {patterns.find(p => p.type === 'custom')?.enabled && (
            <div className="mt-2 ml-7 space-y-2">
              <div className="text-xs text-muted-foreground">
                Enter a regular expression to find specific patterns
              </div>
              <Input
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                placeholder="E.g.: Project\-\d{4}"
                className="text-sm"
              />
              <div className="text-xs text-muted-foreground">
                Examples: <code className="px-1 py-0.5 bg-muted rounded">Project\-\d{4}</code> will match "Project-1234"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  const renderDetectionResults = () => {
    // Group redaction rectangles by page and pattern type
    const redactionsByPage = redactionRects
      .filter((rect: RedactionRect) => rect.id.startsWith('auto-'))
      .reduce((acc: Record<number, RedactionRect[]>, rect: RedactionRect) => {
        if (!acc[rect.pageIndex]) {
          acc[rect.pageIndex] = [];
        }
        acc[rect.pageIndex].push(rect);
        return acc;
      }, {} as Record<number, RedactionRect[]>);
    
    // Count by pattern type
    const patternCounts = redactionRects
      .filter((rect: RedactionRect) => rect.id.startsWith('auto-'))
      .reduce((acc: Record<string, number>, rect: RedactionRect) => {
        const patternType = rect.label?.split(':')[0] || 'Unknown';
        acc[patternType] = (acc[patternType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
    // If no auto-detection results yet, show empty state
    if (Object.keys(redactionsByPage).length === 0) {
      return (
        <div className="text-center p-8 bg-muted/20 rounded-md border border-dashed">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground mb-1">No Detection Results Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select patterns above and click "Detect and Mark for Redaction" to scan your document
          </p>
          <Button
            onClick={handleAutoRedaction}
            disabled={isProcessing || patterns.every(p => !p.enabled)}
            size="sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Start Detection
          </Button>
        </div>
      );
    }
    
    // Results summary and navigation
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="font-medium">Detection Results</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Clear only auto-detected redactions
              setRedactionRects(prevRects => 
                prevRects.filter((rect: RedactionRect) => !rect.id.startsWith('auto-'))
              );
            }}
          >
            Clear Results
          </Button>
        </div>
        
        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(patternCounts).map(([type, count]) => (
            <div key={type} className="border rounded-md p-3 bg-background">
              <div className="text-xs text-muted-foreground mb-1">
                {type}
              </div>
              <div className="text-2xl font-semibold">
                {count}
              </div>
            </div>
          ))}
        </div>
        
        {/* Page navigation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Found on Pages:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(redactionsByPage).map(([pageIndex, rects]) => (
              <Button 
                key={pageIndex}
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => setCurrentPage(parseInt(pageIndex) + 1)}
              >
                Page {parseInt(pageIndex) + 1}
                <span className="ml-1 bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium text-primary">
                  {rects.length}
                </span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              // Apply the redactions - move to the redaction tool tab
              setActiveTab('manual');
              // The redaction rectangles have already been added to the state
              toast.success(`${Object.values(patternCounts).reduce((sum, count) => sum + count, 0)} items marked for redaction`, {
                description: "Review and adjust the redaction marks before applying"
              });
            }}
          >
            Review and Apply Redactions
          </Button>
        </div>
      </div>
    );
  };
  const handleAutoRedaction = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first");
      return;
    }
    
    setIsProcessing(true);
    setProgress(10);
    
    try {
      // Check if any patterns are enabled
      const activePatterns = patterns
        .filter(p => p.enabled)
        .map(p => ({
          type: p.type,
          pattern: p.type === 'custom' ? customPattern : p.pattern,
          enabled: true
        }))
        .filter(p => p.type !== 'custom' || (p.type === 'custom' && p.pattern.trim() !== ''));
  
      // If no patterns are enabled, automatically enable the default ones
      if (activePatterns.length === 0) {
        // Update the patterns state to enable the default patterns
        setPatterns(prev => prev.map(p => {
          if (['ssn', 'email', 'phone', 'creditCard'].includes(p.type)) {
            return { ...p, enabled: true };
          }
          return p;
        }));
        
        // Show a helper toast
        toast.info("Enabled standard patterns for you", {
          description: "We've selected common sensitive data patterns to scan for you"
        });
        
        // Rebuild the active patterns list with the newly enabled patterns
        const defaultPatterns = patterns
          .map(p => {
            if (['ssn', 'email', 'phone', 'creditCard'].includes(p.type)) {
              return {
                type: p.type,
                pattern: p.pattern,
                enabled: true
              };
            }
            return null;
          })
          .filter(Boolean);
        
        // Continue with the default patterns
        const formData = new FormData();
        formData.append('file', file);
        formData.append('patterns', JSON.stringify(defaultPatterns));
        formData.append('removeMetadata', removeMetadata.toString());
        
        // Rest of the API call code...
  
      } else {
        // Original flow when patterns are already selected
        const formData = new FormData();
        formData.append('file', file);
        formData.append('patterns', JSON.stringify(activePatterns));
        formData.append('removeMetadata', removeMetadata.toString());
        
        // Rest of the API call code...
      }
      
      // [... API call implementation continues here ...]
      
    } catch (error) {
      console.error('Auto redaction error:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred during automatic redaction'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Render redaction rectangles
  const renderRedactionRects = () => {
    return redactionRects
      .filter(rect => rect.pageIndex === currentPage - 1)
      .map(rect => (
        <div
          key={rect.id}
          style={{
            position: 'absolute',
            left: `${rect.x * scale}px`,
            top: `${rect.y * scale}px`,
            width: `${rect.width * scale}px`,
            height: `${rect.height * scale}px`,
            backgroundColor: rect.color,
            border: rect.id === 'temp' ? '1px dashed white' : '1px solid rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 10,
            cursor: 'pointer',
          }}
          onClick={() => handleRemoveRect(rect.id)}
          title="Click to remove"
        >
          {rect.label && (
            <span className="text-white text-xs px-1 truncate" style={{ maxWidth: '90%' }}>
              {rect.label}
            </span>
          )}
        </div>
      ));
  };
  
  // Enhanced complete Auto Redaction tab
const renderAutoRedactionTab = () => {
  // Check if there are any auto-detected results
  const hasAutoResults = redactionRects.some((rect: RedactionRect) => rect.id.startsWith('auto-'));
  
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t('redactPdf.auto.title') || "Automatic Pattern Detection"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('redactPdf.auto.description') || "Select patterns to automatically detect and redact from your document"}
        </p>
        
        {/* New info alert to guide users */}
        <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p><strong>Quick start:</strong> Common patterns are pre-selected for you. Just click "Detect and Mark" to scan your document.</p>
          </div>
        </div>
        
        {/* Enhanced pattern selection UI */}
        {renderPatternSelectionUI()}
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox
          id="remove-metadata"
          checked={removeMetadata}
          onCheckedChange={(checked) => setRemoveMetadata(checked === true)}
        />
        <Label htmlFor="remove-metadata">
          {t('redactPdf.removeMetadata') || "Remove document metadata (author, creation date, etc.)"}
        </Label>
      </div>
      
      {/* Skip the detection button if we already have results */}
      {!hasAutoResults && (
        <Button 
          className="mt-4 w-full" 
          onClick={handleAutoRedaction}
          disabled={isProcessing || patterns.every(p => !p.enabled)}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('ui.processing') || "Processing..."}
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              {t('redactPdf.auto.detect') || "Detect and Mark for Redaction"}
            </>
          )}
        </Button>
      )}
      
      {/* Progress indicator when processing */}
      {isProcessing && (
        <div className="border rounded-md p-4 mt-4 bg-background">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">Analyzing document...</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Scanning for sensitive information
          </p>
        </div>
      )}
      
      {/* Show detection results or help text */}
      <div className="mt-4">
        {renderDetectionResults()}
      </div>
      
      <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          {t('redactPdf.auto.note') || 
            "Auto-detection will mark matching text for review. You can edit the selections before applying redaction."}
        </p>
      </div>
    </div>
  );
};
  // Render the PDF uploader
  const renderUploader = () => (
    <div
      className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-muted-foreground/30"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
      />
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FileUp className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">
        {t('redactPdf.upload.title') || "Upload PDF for Redaction"}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground max-w-md mx-auto">
        {t('redactPdf.upload.description') || "Drag and drop a PDF file or click the button below to select a file for redaction"}
      </p>
      <Button onClick={() => fileInputRef.current?.click()}>
        {t('ui.selectFile') || "Select PDF"}
      </Button>
    </div>
  );
  
  // Render the success screen
  const renderSuccess = () => (
    <div className="text-center p-6">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <EyeOff className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {t('redactPdf.success.title') || "PDF Successfully Redacted!"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {t('redactPdf.success.description') || "Your PDF has been successfully redacted. The sensitive information has been permanently removed from the document."}
      </p>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => {
          setFile(null);
          setRedactedPdfUrl('');
          setRedactionRects([]);
        }}>
          {t('ui.redactAnother') || "Redact Another PDF"}
        </Button>
        <Button onClick={() => {
          if (redactedPdfUrl) {
            window.open(redactedPdfUrl, '_blank');
          }
        }}>
          <Download className="h-4 w-4 mr-2" />
          {t('ui.download') || "Download Redacted PDF"}
        </Button>
      </div>
    </div>
  );
  
  // Render the PDF editor
  const renderPdfEditor = () => (
    <div className="flex flex-col h-full" ref={containerRef}>
      {/* Toolbar */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-4">
          <Select 
            value={activeTool} 
            onValueChange={(value) => setActiveTool(value as 'rect' | 'text' | 'image')}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rect">
                <div className="flex items-center gap-2">
                  <SelectIcon className="h-4 w-4" />
                  <span>{t('redactPdf.tools.rectangle') || "Rectangle"}</span>
                </div>
              </SelectItem>
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <Text className="h-4 w-4" />
                  <span>{t('redactPdf.tools.text') || "Text Selection"}</span>
                </div>
              </SelectItem>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>{t('redactPdf.tools.image') || "Image Selection"}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <div className="w-24">
              <Label className="text-xs">{t('redactPdf.tools.color') || "Color"}</Label>
              <Input
                type="color"
                value={redactionColor}
                onChange={(e) => setRedactionColor(e.target.value)}
                className="h-8 w-full"
              />
            </div>
            
            {activeTool !== 'image' && (
              <div className="flex flex-col gap-1">
                <Label className="text-xs">{t('redactPdf.tools.label') || "Label"}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={redactionLabel}
                    onChange={(e) => setRedactionLabel(e.target.value)}
                    placeholder="Optional label text"
                    className="h-8 w-32 sm:w-40"
                  />
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={showLabels}
                      onCheckedChange={setShowLabels}
                      id="show-labels"
                    />
                    <Label htmlFor="show-labels" className="text-xs">
                      {t('redactPdf.tools.showLabels') || "Show"}
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearAll}
            disabled={redactionRects.length === 0}
          >
            <Eraser className="h-4 w-4 mr-1" />
            {t('ui.clearAll') || "Clear All"}
          </Button>
          
          <Button 
            onClick={handleProcessRedaction}
            disabled={redactionRects.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('ui.processing') || "Processing..."}
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                {t('redactPdf.redact') || "Redact PDF"}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex justify-center p-4">
          <div 
            ref={pdfCanvasRef}
            className="relative shadow-lg cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleTextSelection}
          >
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="pdf-document"
            >
              <Page
                pageNumber={currentPage}
                width={pageDetails[currentPage - 1]?.width * scale || undefined}
                height={pageDetails[currentPage - 1]?.height * scale || undefined}
                renderTextLayer={activeTool === 'text'}
                renderAnnotationLayer={false}
                onLoadSuccess={onPageLoadSuccess}
                // customTextRenderer={
                //   activeTool === 'text'
                //     ? (textItem) => (
                //         <span style={{ cursor: 'pointer' }}>{textItem.str}</span>
                //       )
                //     : undefined
                // }
              />
              {renderRedactionRects()}
            </Document>
          </div>
        </div>
      </div>
      
      {/* Pagination controls */}
      {numPages > 1 && (
        <div className="border-t p-3 flex items-center justify-between bg-muted/10">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">{t('ui.previous') || "Previous"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
              disabled={currentPage >= numPages}
            >
              <span className="mr-1 hidden sm:inline">{t('ui.next') || "Next"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {t('ui.pageOf') || "Page"} {currentPage} {t('ui.of') || "of"} {numPages}
            </span>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="scale" className="text-sm whitespace-nowrap">
                {t('ui.zoom') || "Zoom"}:
              </Label>
              <Select
                value={scale.toString()}
                onValueChange={(value) => setScale(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="100%" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">50%</SelectItem>
                  <SelectItem value="0.75">75%</SelectItem>
                  <SelectItem value="1">100%</SelectItem>
                  <SelectItem value="1.25">125%</SelectItem>
                  <SelectItem value="1.5">150%</SelectItem>
                  <SelectItem value="2">200%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {/* Processing progress */}
      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="mb-2 font-medium">{t('redactPdf.processing') || "Processing PDF"}</p>
          <div className="w-64">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <Card className="overflow-hidden h-[calc(100vh-14rem)]">
      <CardHeader className="p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <EyeOff className="h-5 w-5 text-primary" />
              {t('redactPdf.title') || "PDF Redaction Tool"}
            </CardTitle>
            <CardDescription>
              {t('redactPdf.cardDescription') || "Permanently remove sensitive information from PDF documents"}
            </CardDescription>
          </div>
          
          {file && !redactedPdfUrl && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="manual">
                  <div className="flex items-center gap-1">
                    <SelectIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('redactPdf.tabs.manual') || "Manual"}</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="auto">
                  <div className="flex items-center gap-1">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('redactPdf.tabs.auto') || "Auto-Detect"}</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 h-full">
        {!file && renderUploader()}
        
        {file && !redactedPdfUrl && (
          <div className="h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="manual" className="h-full m-0">
              {renderPdfEditor()}
            </TabsContent>
            
            <TabsContent value="auto" className="m-0">
              {renderAutoRedactionTab()}
            </TabsContent>
            </Tabs>
          </div>
        )}
        
        {redactedPdfUrl && renderSuccess()}
      </CardContent>
      
      <CardFooter className="border-t p-3 bg-muted/5 text-xs text-muted-foreground flex items-center gap-2">
        <Info className="h-3.5 w-3.5" />
        <span>
          {t('redactPdf.footer') || "For true security, download and verify the redacted PDF to ensure all sensitive information has been removed"}
        </span>
      </CardFooter>
    </Card>
  );
}