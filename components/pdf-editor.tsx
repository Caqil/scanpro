"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
} from "@radix-ui/react-icons";
import { 
  AlertCircle, 
  PenLine, 
  Type, 
  Image, 
  Eraser,
  Undo,
  Redo,
  Plus,
  Minus,
  FileText,
  Highlighter,
  Square,
  Circle,
  Text
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignaturePad } from "@/components/signature-pad";

// Define form schema for editor settings
const editorFormSchema = z.object({
  color: z.string().default("#000000"),
  fontSize: z.number().min(8).max(72).default(16),
  fontFamily: z.string().default("Arial"),
  lineWidth: z.number().min(1).max(20).default(2),
  opacity: z.number().min(0.1).max(1).default(1),
});

type EditorFormValues = z.infer<typeof editorFormSchema>;

// Helper interface for extracted text with position
interface ExtractedTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  pageIndex: number;
  id: string;
}

// Drawing interface
interface DrawingItem {
  type: 'freehand' | 'line' | 'rectangle' | 'circle' | 'text' | 'image' | 'signature' | 'highlight';
  points?: {x: number, y: number}[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color: string;
  lineWidth: number;
  opacity: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  imageData?: string;
  pageIndex: number;
  id: string;
}

// Page interface
interface PageData {
  imageUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  extractedText: ExtractedTextItem[];
  drawings: DrawingItem[];
}

export function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfName, setPdfName] = useState("");
  const [pages, setPages] = useState<PageData[]>([]);
  const [scale, setScale] = useState(1.0);
  const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<'select' | 'text' | 'draw' | 'line' | 'rectangle' | 'circle' | 'highlight' | 'eraser' | 'signature'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextContent, setEditingTextContent] = useState("");
  const [undoStack, setUndoStack] = useState<DrawingItem[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingItem[][]>([]);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const drawingLayerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Initialize form
  const form = useForm<EditorFormValues>({
    resolver: zodResolver(editorFormSchema),
    defaultValues: {
      color: "#000000",
      fontSize: 16,
      fontFamily: "Arial",
      lineWidth: 2,
      opacity: 1,
    },
  });

  // Watch form values
  const currentColor = form.watch("color");
  const currentFontSize = form.watch("fontSize");
  const currentFontFamily = form.watch("fontFamily");
  const currentLineWidth = form.watch("lineWidth");
  const currentOpacity = form.watch("opacity");

  // Set up dropzone for PDF files only
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.file.size > 100 * 1024 * 1024) {
          setError("File is too large. Maximum size is 100MB.");
        } else {
          setError("Please upload a valid PDF file.");
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setPdfName(acceptedFiles[0].name);
        setEditedPdfUrl(null);
        setError(null);
        setPages([]);
        setCurrentPage(0);
        setTotalPages(0);
        processFile(acceptedFiles[0]);
      }
    },
  });

  // Process the uploaded PDF file
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Create form data for uploading
      const formData = new FormData();
      formData.append("file", file);

      // Setup progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Upload and process PDF
      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process PDF file");
      }

      const data = await response.json();
      setProgress(100);
      
      if (data.pages) {
        // Format the received pages data
        const formattedPages: PageData[] = data.pages.map((page: any) => ({
          imageUrl: page.imageUrl,
          width: page.width,
          height: page.height,
          originalWidth: page.originalWidth,
          originalHeight: page.originalHeight,
          extractedText: page.extractedText || [],
          drawings: []
        }));
        
        setPages(formattedPages);
        setTotalPages(formattedPages.length);
        
        // Start OCR text extraction if needed
        if (data.needsOcr) {
          extractTextWithOCR(data.sessionId);
        }

        toast.success("PDF processed successfully", {
          description: `${formattedPages.length} pages loaded for editing`,
        });
      } else {
        throw new Error("No page data returned from processing");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Processing Failed", {
        description: err instanceof Error ? err.message : "Failed to process your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Extract text using OCR
  const extractTextWithOCR = async (sessionId: string) => {
    setIsExtracting(true);
    setProgress(0);

    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 1000);

      // Call OCR API
      const response = await fetch(`/api/pdf/ocr?sessionId=${sessionId}`, {
        method: 'GET',
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract text");
      }

      const data = await response.json();
      setProgress(100);
      
      if (data.pages) {
        // Update pages with extracted text
        setPages(prevPages => {
          return prevPages.map((page, index) => {
            if (data.pages[index] && data.pages[index].extractedText) {
              return {
                ...page,
                extractedText: data.pages[index].extractedText.map((text: any) => ({
                  ...text,
                  id: `text-${index}-${Math.random().toString(36).substring(2, 11)}`
                }))
              };
            }
            return page;
          });
        });

        toast.success("Text extraction completed", {
          description: "The text in your PDF has been extracted and can now be edited",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during OCR");
      toast.error("OCR Failed", {
        description: err instanceof Error ? err.message : "Failed to extract text from your file",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle navigation between pages
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  // Format file size for display
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  // Handle drawing operations
  const startDrawing = (e: React.MouseEvent) => {
    if (currentTool === 'select' || !drawingLayerRef.current || isDrawing) return;
    
    const drawingLayer = drawingLayerRef.current;
    const rect = drawingLayer.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setIsDrawing(true);
    
    if (currentTool === 'draw' || currentTool === 'highlight') {
      // Start freehand drawing with first point
      const newDrawing: DrawingItem = {
        type: currentTool === 'highlight' ? 'highlight' : 'freehand',
        points: [{ x, y }],
        color: currentColor,
        lineWidth: currentTool === 'highlight' ? 10 : currentLineWidth,
        opacity: currentTool === 'highlight' ? 0.3 : currentOpacity,
        pageIndex: currentPage,
        id: `drawing-${Date.now()}`
      };
      
      // Save for undo
      setUndoStack([...undoStack, [...pages[currentPage].drawings]]);
      setRedoStack([]);
      
      // Add to current page drawings
      setPages(prev => {
        const updated = [...prev];
        updated[currentPage] = {
          ...updated[currentPage],
          drawings: [...updated[currentPage].drawings, newDrawing]
        };
        return updated;
      });
    } else if (currentTool === 'text') {
      // Add a new text element
      const newText: DrawingItem = {
        type: 'text',
        x,
        y,
        color: currentColor,
        lineWidth: currentLineWidth,
        opacity: currentOpacity,
        fontSize: currentFontSize,
        fontFamily: currentFontFamily,
        text: 'Click to edit text',
        pageIndex: currentPage,
        id: `text-${Date.now()}`
      };
      
      // Save for undo
      setUndoStack([...undoStack, [...pages[currentPage].drawings]]);
      setRedoStack([]);
      
      // Add to current page drawings
      setPages(prev => {
        const updated = [...prev];
        updated[currentPage] = {
          ...updated[currentPage],
          drawings: [...updated[currentPage].drawings, newText]
        };
        return updated;
      });
      
      // Set this text as currently editing
      setEditingTextId(newText.id);
      setEditingTextContent(newText.text || '');
      setIsDrawing(false);
    } else if (currentTool === 'signature' && currentSignature) {
      // Add signature
      const newSignature: DrawingItem = {
        type: 'image',
        x,
        y,
        width: 200, // Default width
        height: 100, // Default height
        color: currentColor,
        lineWidth: currentLineWidth,
        opacity: currentOpacity,
        imageData: currentSignature,
        pageIndex: currentPage,
        id: `signature-${Date.now()}`
      };
      
      // Save for undo
      setUndoStack([...undoStack, [...pages[currentPage].drawings]]);
      setRedoStack([]);
      
      // Add to current page drawings
      setPages(prev => {
        const updated = [...prev];
        updated[currentPage] = {
          ...updated[currentPage],
          drawings: [...updated[currentPage].drawings, newSignature]
        };
        return updated;
      });
      
      setIsDrawing(false);
    } else if (['line', 'rectangle', 'circle'].includes(currentTool)) {
      // Start shape drawing
      const newShape: DrawingItem = {
        type: currentTool as 'line' | 'rectangle' | 'circle',
        x,
        y,
        width: 0,
        height: 0,
        color: currentColor,
        lineWidth: currentLineWidth,
        opacity: currentOpacity,
        pageIndex: currentPage,
        id: `shape-${Date.now()}`
      };
      
      // Save for undo
      setUndoStack([...undoStack, [...pages[currentPage].drawings]]);
      setRedoStack([]);
      
      // Add to current page drawings
      setPages(prev => {
        const updated = [...prev];
        updated[currentPage] = {
          ...updated[currentPage],
          drawings: [...updated[currentPage].drawings, newShape]
        };
        return updated;
      });
    }
  };

  const continueDrawing = (e: React.MouseEvent) => {
    if (!isDrawing || !drawingLayerRef.current) return;
    
    const drawingLayer = drawingLayerRef.current;
    const rect = drawingLayer.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    if (currentTool === 'draw' || currentTool === 'highlight') {
      // Add point to freehand drawing
      setPages(prev => {
        const updated = [...prev];
        const drawings = updated[currentPage].drawings;
        const currentDrawing = drawings[drawings.length - 1];
        
        if (currentDrawing && currentDrawing.points) {
          currentDrawing.points.push({ x, y });
        }
        
        return updated;
      });
    } else if (['line', 'rectangle', 'circle'].includes(currentTool)) {
      // Update shape dimensions
      setPages(prev => {
        const updated = [...prev];
        const drawings = updated[currentPage].drawings;
        const currentShape = drawings[drawings.length - 1];
        
        if (currentShape && currentShape.x !== undefined && currentShape.y !== undefined) {
          const width = x - currentShape.x;
          const height = y - currentShape.y;
          
          currentShape.width = width;
          currentShape.height = height;
        }
        
        return updated;
      });
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  // Handle eraser tool
  const handleErase = (e: React.MouseEvent) => {
    if (currentTool !== 'eraser' || !drawingLayerRef.current) return;
    
    const drawingLayer = drawingLayerRef.current;
    const rect = drawingLayer.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    // Find and remove drawings at this position
    setPages(prev => {
      const updated = [...prev];
      const currentPageData = updated[currentPage];
      
      // Save current drawings for undo
      setUndoStack([...undoStack, [...currentPageData.drawings]]);
      setRedoStack([]);
      
      // Filter out drawings that intersect with eraser
      currentPageData.drawings = currentPageData.drawings.filter(drawing => {
        if (drawing.type === 'freehand' && drawing.points) {
          // For freehand, check distance to any point
          return !drawing.points.some(point => {
            const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
            return distance < 10; // Eraser radius
          });
        } else if (drawing.x !== undefined && drawing.y !== undefined) {
          // For shapes, check if click is within bounds
          const width = drawing.width || 0;
          const height = drawing.height || 0;
          
          // Check if point is inside shape bounds with some margin
          return !(x >= drawing.x - 5 && 
                 x <= drawing.x + Math.abs(width) + 5 && 
                 y >= drawing.y - 5 && 
                 y <= drawing.y + Math.abs(height) + 5);
        }
        return true;
      });
      
      return updated;
    });
  };

  // Handle text editing
  const handleTextClick = (id: string, text: string) => {
    if (currentTool !== 'select') return;
    
    setEditingTextId(id);
    setEditingTextContent(text);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingTextContent(e.target.value);
  };

  const handleTextSave = () => {
    if (!editingTextId) return;
    
    setPages(prev => {
      const updated = [...prev];
      const currentPageData = updated[currentPage];
      
      // Find and update the text
      const textItem = currentPageData.drawings.find(item => item.id === editingTextId) || 
                       currentPageData.extractedText.find(item => item.id === editingTextId);
      
      if (textItem) {
        // Save current state for undo
        setUndoStack([...undoStack, [...currentPageData.drawings]]);
        setRedoStack([]);
        
        textItem.text = editingTextContent;
      }
      
      return updated;
    });
    
    setEditingTextId(null);
    setEditingTextContent("");
  };

  // Undo/Redo functionality
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    
    // Save current state to redo stack
    setRedoStack([...redoStack, [...pages[currentPage].drawings]]);
    
    // Restore previous state
    setPages(prev => {
      const updated = [...prev];
      updated[currentPage] = {
        ...updated[currentPage],
        drawings: [...previousState]
      };
      return updated;
    });
    
    // Remove last state from undo stack
    setUndoStack(undoStack.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    
    // Save current state to undo stack
    setUndoStack([...undoStack, [...pages[currentPage].drawings]]);
    
    // Restore next state
    setPages(prev => {
      const updated = [...prev];
      updated[currentPage] = {
        ...updated[currentPage],
        drawings: [...nextState]
      };
      return updated;
    });
    
    // Remove last state from redo stack
    setRedoStack(redoStack.slice(0, -1));
  };

  // Handle signature creation
  const handleSignatureChange = (dataUrl: string | null) => {
    setCurrentSignature(dataUrl);
  };

  // Save edited PDF
  const savePdf = async () => {
    setIsSaving(true);
    setProgress(0);

    try {
      // Setup progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Prepare data to be sent to the server
      const requestData = {
        pdfName,
        pages: pages.map(page => ({
          imageUrl: page.imageUrl,
          extractedText: page.extractedText,
          drawings: page.drawings,
          width: page.width,
          height: page.height,
          originalWidth: page.originalWidth,
          originalHeight: page.originalHeight
        }))
      };

      // Make API request to save PDF
      const response = await fetch('/api/pdf/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save PDF file");
      }

      const data = await response.json();
      setProgress(100);
      
      // Set the URL for the edited PDF
      if (data.fileUrl) {
        setEditedPdfUrl(data.fileUrl);
        
        toast.success("PDF saved successfully", {
          description: "Your edited PDF is ready for download",
        });
      } else {
        throw new Error("No file URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Saving Failed", {
        description: err instanceof Error ? err.message : "Failed to save your edited PDF",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Render the editor interface
  return (
    <div className="space-y-4">
      {/* File Upload Area (shown only when no file is loaded) */}
      {!file && (
        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragActive ? "border-primary bg-primary/10" : 
            file ? "border-green-500 bg-green-50 dark:bg-green-950/20" : 
            "border-muted-foreground/25 hover:border-muted-foreground/50",
            isProcessing && "pointer-events-none opacity-80"
          )}
        >
          <input {...getInputProps()} disabled={isProcessing} />
          
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-lg font-medium">
              {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Drop your PDF file here or click to browse. Maximum size is 100MB.
            </p>
            <Button type="button" variant="secondary" size="sm" className="mt-2">
              Browse Files
            </Button>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 animate-pulse" />
            <span>Processing PDF... {progress}%</span>
          </div>
        </div>
      )}

      {/* OCR Processing Indicator */}
      {isExtracting && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 animate-pulse" />
            <span>Extracting text with OCR... {progress}%</span>
          </div>
        </div>
      )}

      {/* PDF Editor (shown when a file is loaded) */}
      {file && pages.length > 0 && !isProcessing && (
        <div className="space-y-4">
          {/* Editor Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border rounded-lg p-2 bg-muted/30">
            {/* Tool Selection */}
            <div className="flex items-center space-x-1">
              <Button 
                variant={currentTool === 'select' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('select')}
                title="Select Tool"
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Button 
                variant={currentTool === 'text' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('text')}
                title="Add Text"
              >
                <Text className="h-4 w-4" />
              </Button>
              <Button 
                variant={currentTool === 'draw' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('draw')}
                title="Draw"
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Button 
                variant={currentTool === 'line' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('line')}
                title="Line"
              >
                <div className="w-4 h-4 flex items-center justify-center">—</div>
              </Button>
              <Button 
                variant={currentTool === 'rectangle' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('rectangle')}
                title="Rectangle"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button 
                variant={currentTool === 'circle' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('circle')}
                title="Circle"
              >
                <Circle className="h-4 w-4" />
              </Button>
              <Button 
                variant={currentTool === 'highlight' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('highlight')}
                title="Highlight"
              >
                <Highlighter className="h-4 w-4" />
              </Button>
              <Button 
                variant={currentTool === 'eraser' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('eraser')}
                title="Eraser"
              >
                <Eraser className="h-4 w-4" />
              </Button>
                             <Button 
                variant={currentTool === 'signature' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentTool('signature')}
                title="Add Signature"
              >
                <Type className="h-4 w-4" />
              </Button>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomOut}
                disabled={scale <= 0.5}
                title="Zoom Out"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm mx-2">{Math.round(scale * 100)}%</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomIn}
                disabled={scale >= 2.0}
                title="Zoom In"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 0}
              >
                Previous Page
              </Button>
              <span className="text-sm mx-2">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next Page
              </Button>
            </div>
          </div>

          {/* Tool Properties */}
          <div className="border rounded-lg p-2 bg-muted/30">
            <Form {...form}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {/* Color Picker */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={field.value}
                            onChange={field.onChange}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Font Size */}
                <FormField
                  control={form.control}
                  name="fontSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 16)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Font Family */}
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Font Family" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Line Width */}
                <FormField
                  control={form.control}
                  name="lineWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Line Width</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Opacity */}
                <FormField
                  control={form.control}
                  name="opacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.1"
                          max="1"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </div>

          {/* Editor Canvas */}
          <div 
            ref={editorContainerRef} 
            className="border rounded-lg overflow-auto bg-muted/10 relative"
            style={{ height: '600px' }}
          >
            {pages.length > 0 && currentPage < pages.length && (
              <div 
                className="relative"
                style={{ 
                  width: pages[currentPage].width * scale, 
                  height: pages[currentPage].height * scale,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left'
                }}
              >
                {/* PDF Page Image */}
                <img 
                  src={pages[currentPage].imageUrl} 
                  alt={`Page ${currentPage + 1}`}
                  className="absolute top-0 left-0"
                  style={{ 
                    width: pages[currentPage].width,
                    height: pages[currentPage].height
                  }}
                />

                {/* Text Layer */}
                <div 
                  ref={textLayerRef}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ 
                    width: pages[currentPage].width,
                    height: pages[currentPage].height
                  }}
                >
                  {/* Render Extracted Text */}
                  {pages[currentPage].extractedText.map((textItem) => (
                    <div
                      key={textItem.id}
                      className={`absolute ${currentTool === 'select' ? 'pointer-events-auto cursor-text' : 'pointer-events-none'}`}
                      style={{
                        left: textItem.x,
                        top: textItem.y,
                        width: textItem.width,
                        fontSize: textItem.fontSize,
                        fontFamily: textItem.fontFamily,
                        border: editingTextId === textItem.id ? '1px solid blue' : 'none',
                      }}
                      onClick={() => handleTextClick(textItem.id, textItem.text)}
                    >
                      {editingTextId === textItem.id ? (
                        <Textarea
                          value={editingTextContent}
                          onChange={handleTextChange}
                          onBlur={handleTextSave}
                          autoFocus
                          className="min-h-0 p-0 w-full h-full"
                        />
                      ) : (
                        textItem.text
                      )}
                    </div>
                  ))}
                </div>

                {/* Drawing Layer */}
                <div 
                  ref={drawingLayerRef}
                  className="absolute top-0 left-0"
                  style={{ 
                    width: pages[currentPage].width,
                    height: pages[currentPage].height
                  }}
                  onMouseDown={currentTool === 'eraser' ? handleErase : startDrawing}
                  onMouseMove={isDrawing ? continueDrawing : (currentTool === 'eraser' ? handleErase : undefined)}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                >
                  {/* Render Drawings */}
                  {pages[currentPage].drawings.map((drawing) => {
                    if (drawing.type === 'freehand' && drawing.points) {
                      // Render Freehand Drawing
                      const pathData = drawing.points.reduce((path, point, index) => {
                        return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
                      }, '');
                      
                      return (
                        <svg 
                          key={drawing.id} 
                          className="absolute top-0 left-0 pointer-events-none" 
                          width={pages[currentPage].width}
                          height={pages[currentPage].height}
                        >
                          <path 
                            d={pathData}
                            stroke={drawing.color}
                            strokeWidth={drawing.lineWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={drawing.opacity}
                          />
                        </svg>
                      );
                    } else if (drawing.type === 'highlight' && drawing.points) {
                      // Render Highlight
                      const pathData = drawing.points.reduce((path, point, index) => {
                        return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
                      }, '');
                      
                      return (
                        <svg 
                          key={drawing.id} 
                          className="absolute top-0 left-0 pointer-events-none" 
                          width={pages[currentPage].width}
                          height={pages[currentPage].height}
                        >
                          <path 
                            d={pathData}
                            stroke={drawing.color}
                            strokeWidth={drawing.lineWidth}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={drawing.opacity}
                          />
                        </svg>
                      );
                    } else if (drawing.type === 'line' && drawing.x !== undefined && drawing.y !== undefined) {
                      // Render Line
                      return (
                        <svg 
                          key={drawing.id} 
                          className="absolute top-0 left-0 pointer-events-none" 
                          width={pages[currentPage].width}
                          height={pages[currentPage].height}
                        >
                          <line 
                            x1={drawing.x}
                            y1={drawing.y}
                            x2={drawing.x + (drawing.width || 0)}
                            y2={drawing.y + (drawing.height || 0)}
                            stroke={drawing.color}
                            strokeWidth={drawing.lineWidth}
                            opacity={drawing.opacity}
                          />
                        </svg>
                      );
                    } else if (drawing.type === 'rectangle' && drawing.x !== undefined && drawing.y !== undefined) {
                      // Render Rectangle
                      return (
                        <svg 
                          key={drawing.id} 
                          className="absolute top-0 left-0 pointer-events-none" 
                          width={pages[currentPage].width}
                          height={pages[currentPage].height}
                        >
                          <rect 
                            x={drawing.width && drawing.width < 0 ? drawing.x + drawing.width : drawing.x}
                            y={drawing.height && drawing.height < 0 ? drawing.y + drawing.height : drawing.y}
                            width={Math.abs(drawing.width || 0)}
                            height={Math.abs(drawing.height || 0)}
                            stroke={drawing.color}
                            strokeWidth={drawing.lineWidth}
                            fill="none"
                            opacity={drawing.opacity}
                          />
                        </svg>
                      );
                    } else if (drawing.type === 'circle' && drawing.x !== undefined && drawing.y !== undefined) {
                      // Render Circle
                      const radius = Math.sqrt(
                        Math.pow(drawing.width || 0, 2) + 
                        Math.pow(drawing.height || 0, 2)
                      ) / 2;
                      
                      return (
                        <svg 
                          key={drawing.id} 
                          className="absolute top-0 left-0 pointer-events-none" 
                          width={pages[currentPage].width}
                          height={pages[currentPage].height}
                        >
                          <circle 
                            cx={drawing.x + (drawing.width || 0) / 2}
                            cy={drawing.y + (drawing.height || 0) / 2}
                            r={radius}
                            stroke={drawing.color}
                            strokeWidth={drawing.lineWidth}
                            fill="none"
                            opacity={drawing.opacity}
                          />
                        </svg>
                      );
                    } else if (drawing.type === 'text' && drawing.x !== undefined && drawing.y !== undefined) {
                      // Render Text
                      return (
                        <div
                          key={drawing.id}
                          className={`absolute ${currentTool === 'select' ? 'pointer-events-auto cursor-text' : 'pointer-events-none'}`}
                          style={{
                            left: drawing.x,
                            top: drawing.y,
                            color: drawing.color,
                            fontSize: drawing.fontSize,
                            fontFamily: drawing.fontFamily,
                            opacity: drawing.opacity,
                            border: editingTextId === drawing.id ? '1px solid blue' : 'none',
                          }}
                          onClick={() => handleTextClick(drawing.id, drawing.text || '')}
                        >
                          {editingTextId === drawing.id ? (
                            <Textarea
                              value={editingTextContent}
                              onChange={handleTextChange}
                              onBlur={handleTextSave}
                              autoFocus
                              className="min-h-0 p-0 bg-transparent border-none resize-none"
                              style={{
                                fontSize: drawing.fontSize,
                                fontFamily: drawing.fontFamily,
                                color: drawing.color,
                              }}
                            />
                          ) : (
                            drawing.text
                          )}
                        </div>
                      );
                    } else if (drawing.type === 'image' && drawing.x !== undefined && drawing.y !== undefined && drawing.imageData) {
                      // Render Image (e.g., signature)
                      return (
                        <img
                          key={drawing.id}
                          src={drawing.imageData}
                          alt="Signature"
                          className={`absolute ${currentTool === 'select' ? 'pointer-events-auto cursor-move' : 'pointer-events-none'}`}
                          style={{
                            left: drawing.x,
                            top: drawing.y,
                            width: drawing.width,
                            height: drawing.height,
                            opacity: drawing.opacity,
                            border: currentTool === 'select' ? '1px dashed #ccc' : 'none',
                          }}
                        />
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Signature Pad */}
          {currentTool === 'signature' && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Create Signature</CardTitle>
                <CardDescription>Draw your signature below</CardDescription>
              </CardHeader>
              <CardContent>
                <SignaturePad
                  onChange={handleSignatureChange}
                  height={150}
                  width={400}
                  backgroundColor="#f8f8f8"
                />
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setFile(null);
                setPages([]);
                setEditedPdfUrl(null);
              }}
              disabled={isProcessing || isExtracting || isSaving}
            >
              <Cross2Icon className="h-4 w-4 mr-2" />
              Cancel Editing
            </Button>
            <Button 
              onClick={savePdf}
              disabled={isProcessing || isExtracting || isSaving}
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <FileIcon className="h-4 w-4 mr-2" />
                  Save Edited PDF
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Saving Indicator */}
      {isSaving && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 animate-pulse" />
            <span>Saving PDF... {progress}%</span>
          </div>
        </div>
      )}

      {/* Download Edited PDF */}
      {editedPdfUrl && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-600 dark:text-green-400">
                PDF edited successfully!
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Your edited PDF is now ready for download
              </p>
              <Button 
                className="w-full sm:w-auto" 
                asChild
                variant="default"
              >
                <a href={editedPdfUrl} download={pdfName.replace('.pdf', '-edited.pdf')}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Edited PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}