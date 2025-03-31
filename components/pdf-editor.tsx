// components/pdf-editor.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Upload,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Trash2,
  PenTool,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Pencil,
  Eraser,
  Check,
  RotateCcw,
  RotateCw,
  Save,
  X,
  Edit2,
  Eye,
  Highlighter,
  FileImage,
  PanelLeft,
  PanelRight
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguageStore } from "@/src/store/store";

interface PDFEditorProps {
  initialFile?: File | null;
  sessionId?: string;
}
interface TextElement {
    x: number
    y: number
    width: number
    height: number
    text: string
    // Add any other properties your text elements might have
  }
  
  // Declare the missing variables
  const extractedText: any[] = [] // Replace 'any[]' with the actual type of extractedText
  const currentPage = 1 // Or whatever the initial value should be
  const pageData: any[] = [] // Replace 'any[]' with the actual type of pageData
  const textReplacements: { [key: string]: string } = {} // Or whatever the actual type should be
export function PDFEditor({ initialFile, sessionId: initialSessionId }: PDFEditorProps) {
  const { t } = useLanguageStore();
  
  // File state
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // PDF preview state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pageData, setPageData] = useState<any[]>([]);
  const [loadedImages, setLoadedImages] = useState<Record<number, HTMLImageElement>>({});
  const [extractedText, setExtractedText] = useState<any[]>([]);
  
  // Editor state
  const [mode, setMode] = useState<'select' | 'text' | 'draw' | 'highlight' | 'image' | 'shape' | 'erase'>('select');
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [textReplacements, setTextReplacements] = useState<{[key: string]: string}>({});
  const [showTextBoxes, setShowTextBoxes] = useState(false);
  const [canvasDrawings, setCanvasDrawings] = useState<any[]>([]);
  
  // Result state
  const [result, setResult] = useState<{
    success: boolean;
    fileUrl?: string;
    filename?: string;
  } | null>(null);
  
  // Canvas/drawing refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Load initial file if provided or when file changes
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Invalid file type", {
          description: "Please select a PDF file"
        });
        return;
      }
      
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error("File too large", {
          description: "Maximum file size is 100MB"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  // Process and upload PDF
  const handleFileUpload = async (selectedFile: File) => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Upload and process file
      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to process PDF');
      }
      
      setSessionId(data.sessionId);
      setTotalPages(data.pageCount);
      setCurrentPage(1);
      setPageData(data.pages);
      
      // Start OCR process to extract text
      extractTextFromPages(data.sessionId);
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error("Failed to process PDF", {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };
  
  // Extract text from processed pages using OCR
  const extractTextFromPages = async (sid: string) => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);
      
      // Call OCR API
      const response = await fetch(`/api/pdf/ocr?sessionId=${sid}`);
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to extract text');
      }
      
      console.log('OCR Result:', data);
      setExtractedText(data.pages);
      setProgress(100);
      
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error("Text extraction encountered an issue", {
        description: "Some text may not be editable"
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };
  
  // Load page image into canvas
  useEffect(() => {
    if (!sessionId || !pageData.length || currentPage < 1 || currentPage > pageData.length) return;
    
    const loadPageImage = async () => {
      try {
        const currentPageData = pageData[currentPage - 1];
        if (!currentPageData || !currentPageData.imageUrl) return;
        
        const imageUrl = currentPageData.imageUrl;
        
        if (loadedImages[currentPage]) {
          // Use cached image
          drawImageToCanvas(loadedImages[currentPage], currentPageData);
        } else {
          // Load image
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            // Cache the loaded image
            setLoadedImages(prev => ({ ...prev, [currentPage]: img }));
            drawImageToCanvas(img, currentPageData);
          };
          img.src = imageUrl;
        }
      } catch (error) {
        console.error('Error loading page image:', error);
      }
    };
    
    loadPageImage();
  }, [sessionId, pageData, currentPage, zoom, canvasDrawings]);
  
  // Draw image to canvas with proper scaling
  const drawImageToCanvas = (img: HTMLImageElement, pageData: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate dimensions
    const containerWidth = canvasContainerRef.current?.clientWidth || 800;
    const containerHeight = canvasContainerRef.current?.clientHeight || 600;
    
    const imgRatio = img.width / img.height;
    const containerRatio = containerWidth / containerHeight;
    
    let canvasWidth, canvasHeight;
    
    if (imgRatio > containerRatio) {
      // Image is wider than container (relative to height)
      canvasWidth = containerWidth * zoom;
      canvasHeight = canvasWidth / imgRatio;
    } else {
      // Image is taller than container (relative to width)
      canvasHeight = containerHeight * zoom;
      canvasWidth = canvasHeight * imgRatio;
    }
    
    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Draw any stored drawings
    drawStoredElements(ctx, canvas.width, canvas.height);
    
    // Draw text boxes for OCR text if enabled
    if (showTextBoxes) {
      drawTextElements(ctx, canvas.width, canvas.height);
    }
  };
  
  // Draw stored elements (shapes, text, images, etc.)
  const drawStoredElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Get elements for current page
    const pageElements = canvasDrawings.filter(el => el.page === currentPage);
    
    pageElements.forEach(element => {
      // Scale positions based on current canvas size vs original page size
      const pageWidth = pageData[currentPage - 1]?.width || width;
      const pageHeight = pageData[currentPage - 1]?.height || height;
      
      const scaleX = width / pageWidth;
      const scaleY = height / pageHeight;
      
      const x = element.x * scaleX;
      const y = element.y * scaleY;
      
      switch (element.type) {
        case 'text':
          // Draw text
          ctx.font = `${element.fontSize * scaleY}px ${element.fontFamily}`;
          ctx.fillStyle = element.color;
          ctx.fillText(element.text, x, y);
          break;
          
        case 'highlight':
          // Draw highlight
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = element.color;
          ctx.fillRect(x, y, element.width * scaleX, element.height * scaleY);
          ctx.globalAlpha = 1.0;
          break;
          
        case 'rectangle':
          // Draw rectangle
          ctx.strokeStyle = element.color;
          ctx.lineWidth = element.lineWidth * Math.min(scaleX, scaleY);
          ctx.strokeRect(x, y, element.width * scaleX, element.height * scaleY);
          break;
          
        case 'circle':
          // Draw circle
          ctx.beginPath();
          const radiusX = (element.width * scaleX) / 2;
          const radiusY = (element.height * scaleY) / 2;
          ctx.ellipse(
            x + radiusX,
            y + radiusY,
            radiusX,
            radiusY,
            0,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = element.color;
          ctx.lineWidth = element.lineWidth * Math.min(scaleX, scaleY);
          ctx.stroke();
          break;
          
        case 'freehand':
          // Draw freehand line
          if (element.points && element.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x * scaleX, element.points[0].y * scaleY);
            
            for (let i = 1; i < element.points.length; i++) {
              ctx.lineTo(element.points[i].x * scaleX, element.points[i].y * scaleY);
            }
            
            ctx.strokeStyle = element.color;
            ctx.lineWidth = element.lineWidth * Math.min(scaleX, scaleY);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
          }
          break;
          
        case 'image':
          // Draw imported image
          if (element.image) {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(
                img,
                x,
                y,
                element.width * scaleX,
                element.height * scaleY
              );
            };
            img.src = element.image;
          }
          break;
      }
    });
  };
  
  // Draw text elements from OCR
  const drawTextElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Get extracted text for current page
    const pageText = extractedText.find((page) => page.pageIndex === currentPage - 1)
    if (!pageText) return
  
    const textElements = pageText.extractedText || []
  
    // Scale positions based on current canvas size vs original page size
    const pageWidth = pageData[currentPage - 1]?.width || width
    const pageHeight = pageData[currentPage - 1]?.height || height
  
    const scaleX = width / pageWidth
    const scaleY = height / pageHeight
  
    // Draw each text element - add the type annotation here
    textElements.forEach((element: TextElement) => {
      const x = element.x * scaleX
      const y = element.y * scaleY
      const w = element.width * scaleX
      const h = element.height * scaleY
  
      // Draw bounding box
      ctx.strokeStyle = "rgba(0, 100, 255, 0.5)"
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, w, h)
  
      // Check if this text has a replacement
      const replacementText = textReplacements[element.text]
      if (replacementText) {
        // Highlight replaced text differently
        ctx.fillStyle = "rgba(255, 255, 0, 0.2)"
        ctx.fillRect(x, y, w, h)
  
        // Draw the replacement indicator
        ctx.fillStyle = "green"
        ctx.font = "10px Arial"
        ctx.fillText("✓", x + w - 10, y + 10)
      }
    })
  }
  
  
  // Add a text replacement
  const addTextReplacement = (oldText: string, newText: string) => {
    if (oldText && newText) {
      setTextReplacements(prev => ({
        ...prev,
        [oldText]: newText
      }));
      
      toast.success("Text replacement added", {
        description: `"${oldText}" will be replaced with "${newText}"`
      });
    }
  };
  
  // Remove a text replacement
  const removeTextReplacement = (oldText: string) => {
    setTextReplacements(prev => {
      const updated = { ...prev };
      delete updated[oldText];
      return updated;
    });
  };
  
  // Add drawing element
  const addDrawingElement = (element: any) => {
    setCanvasDrawings(prev => [...prev, {
      ...element,
      page: currentPage
    }]);
  };
  
  // Remove drawing element
  const removeDrawingElement = (index: number) => {
    setCanvasDrawings(prev => prev.filter((_, i) => i !== index));
  };
  
  // Save PDF with edits
  const saveEditedPDF = async () => {
    if (!sessionId) {
      toast.error("No document loaded", {
        description: "Please upload a PDF first"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setProgress(0);
      
      // Prepare data for saving
      const data = {
        sessionId,
        pages: pageData.map((page, index) => ({
          width: page.width,
          height: page.height,
          imageUrl: page.imageUrl,
          // Include drawings for this page
          drawings: canvasDrawings.filter(d => d.page === index + 1)
        }))
      };
      
      // If we have text replacements, handle them separately
      if (Object.keys(textReplacements).length > 0) {
        // Send text replacements request
        const replaceResponse = await fetch('/api/pdf/replace-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            replacements: textReplacements
          })
        });
        
        if (!replaceResponse.ok) {
          const errorData = await replaceResponse.json();
          throw new Error(errorData.error || 'Failed to replace text');
        }
        
        const replaceData = await replaceResponse.json();
        
        // Use the result from text replacement
        setResult({
          success: replaceData.success,
          fileUrl: replaceData.fileUrl,
          filename: replaceData.filename
        });
        
        toast.success("PDF saved successfully with text replacements");
        setProgress(100);
        setIsProcessing(false);
        return;
      }
      
      // If we only have drawings, save using the drawing API
      const response = await fetch('/api/pdf/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save PDF');
      }
      
      const responseData = await response.json();
      
      setResult({
        success: responseData.success,
        fileUrl: responseData.fileUrl,
        filename: responseData.filename
      });
      
      toast.success("PDF saved successfully");
      
    } catch (error) {
      console.error('Error saving PDF:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error("Failed to save PDF", {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };
  
  // Handle image uploads for overlays
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid image type", {
          description: "Please select a PNG, JPG, or SVG image"
        });
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image too large", {
          description: "Maximum image size is 5MB"
        });
        return;
      }
      
      // Convert to data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        // Add image to canvas
        addDrawingElement({
          type: 'image',
          x: 50,
          y: 50,
          width: 200,
          height: 200,
          image: dataUrl
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  // Handle drag over events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Handle drop events
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
      } else {
        toast.error("Invalid file type", {
          description: "Please select a PDF file"
        });
      }
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Navigation handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Zoom handlers
  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 3.0));
  };
  
  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.5));
  };
  
  // Render upload area
  const renderUploadArea = () => (
    <div 
      className="border-2 border-dashed rounded-lg p-8 text-center h-full flex flex-col items-center justify-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Upload PDF to Edit</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop your PDF file here, or click to browse
      </p>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <Button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Select PDF File
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        Maximum file size: 100MB
      </p>
    </div>
  );
  
  // Render editor interface
  const renderEditorInterface = () => (
    <div className="flex flex-col md:flex-row h-full gap-4">
      {/* Sidebar with tools */}
      {sidebarOpen && (
        <div className="w-full md:w-64 flex-shrink-0 bg-muted/20 rounded-lg p-4 border overflow-y-auto">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="draw">
                <Pencil className="h-4 w-4 mr-2" />
                Draw
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Text Replacements</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowTextBoxes(!showTextBoxes)}
                  >
                    {showTextBoxes ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* Text replacement form */}
                <div className="space-y-2 p-2 border rounded-md">
                  <div className="space-y-1">
                    <Label htmlFor="old-text" className="text-xs">Find Text</Label>
                    <Input 
                      id="old-text" 
                      placeholder="Text to replace" 
                      size={1}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="new-text" className="text-xs">Replace With</Label>
                    <Input 
                      id="new-text" 
                      placeholder="New text" 
                      size={1}
                    />
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const oldText = (document.getElementById('old-text') as HTMLInputElement)?.value;
                      const newText = (document.getElementById('new-text') as HTMLInputElement)?.value;
                      
                      if (oldText && newText) {
                        addTextReplacement(oldText, newText);
                        (document.getElementById('old-text') as HTMLInputElement).value = '';
                        (document.getElementById('new-text') as HTMLInputElement).value = '';
                      } else {
                        toast.error("Please fill both fields");
                      }
                    }}
                  >
                    Add Replacement
                  </Button>
                </div>
                
                {/* List of active replacements */}
                <div className="max-h-48 overflow-y-auto border rounded-md">
                  {Object.entries(textReplacements).length > 0 ? (
                    <div className="divide-y">
                      {Object.entries(textReplacements).map(([oldText, newText], index) => (
                        <div key={index} className="p-2 flex justify-between items-start">
                          <div className="text-xs">
                            <span className="font-medium line-through">{oldText}</span>
                            <span className="mx-1">→</span>
                            <span className="text-green-600 dark:text-green-400">{newText}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => removeTextReplacement(oldText)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No text replacements yet
                    </div>
                  )}
                </div>
                
                {/* Add new text */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Add New Text</h3>
                  <div className="space-y-1 p-2 border rounded-md">
                    <div className="space-y-1">
                      <Label htmlFor="add-text" className="text-xs">Text</Label>
                      <Input 
                        id="add-text" 
                        placeholder="Enter text to add" 
                        size={1}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="text-color" className="text-xs">Color</Label>
                        <Input 
                          id="text-color" 
                          type="color" 
                          defaultValue="#000000"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="font-size" className="text-xs">Size</Label>
                        <Input 
                          id="font-size" 
                          type="number" 
                          defaultValue="16"
                          min="8"
                          max="72"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => {
                        const text = (document.getElementById('add-text') as HTMLInputElement)?.value;
                        const color = (document.getElementById('text-color') as HTMLInputElement)?.value;
                        const fontSize = parseInt((document.getElementById('font-size') as HTMLInputElement)?.value || '16');
                        
                        if (text) {
                          addDrawingElement({
                            type: 'text',
                            text,
                            x: 100,
                            y: 100,
                            fontSize,
                            fontFamily: 'Arial',
                            color
                          });
                          
                          toast.success("Text added", {
                            description: "You can position it on the page"
                          });
                          
                          (document.getElementById('add-text') as HTMLInputElement).value = '';
                        } else {
                          toast.error("Please enter text to add");
                        }
                      }}
                    >
                      Add Text
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="draw" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Drawing Tools</h3>
                
                {/* Drawing mode selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={mode === 'draw' ? "default" : "outline"} 
                    size="sm"
                    className="flex flex-col py-3 h-auto"
                    onClick={() => setMode('draw')}
                  >
                    <Pencil className="h-4 w-4 mb-1" />
                    <span className="text-xs">Pen</span>
                  </Button>
                  
                  <Button 
                    variant={mode === 'highlight' ? "default" : "outline"}
                    size="sm"
                    className="flex flex-col py-3 h-auto"
                    onClick={() => setMode('highlight')}
                  >
                    <Highlighter className="h-4 w-4 mb-1" />
                    <span className="text-xs">Highlight</span>
                  </Button>
                  
                  <Button 
                    variant={mode === 'shape' ? "default" : "outline"} 
                    size="sm"
                    className="flex flex-col py-3 h-auto"
                    onClick={() => setMode('shape')}
                  >
                    <Square className="h-4 w-4 mb-1" />
                    <span className="text-xs">Shape</span>
                  </Button>
                  
                  <Button 
                    variant={mode === 'image' ? "default" : "outline"} 
                    size="sm"
                    className="flex flex-col py-3 h-auto"
                    onClick={() => setMode('image')}
                  >
                    <ImageIcon className="h-4 w-4 mb-1" />
                    <span className="text-xs">Image</span>
                  </Button>
                  
                  <Button 
                    variant={mode === 'erase' ? "default" : "outline"} 
                    size="sm"
                    className="flex flex-col py-3 h-auto"
                    onClick={() => setMode('erase')}
                  >
                    <Eraser className="h-4 w-4 mb-1" />
                    <span className="text-xs">Erase</span>
                  </Button>
                  
                  <Button 
                    variant={mode === 'select' ? "default" : "outline"} 
                    size="sm"
                    className="flex flex-col py-3 h-auto"
                    onClick={() => setMode('select')}
                  >
                    <Edit2 className="h-4 w-4 mb-1" />
                    <span className="text-xs">Select</span>
                  </Button>
                </div>
                
                {/* Drawing options based on mode */}
                {mode === 'draw' && (
                  <div className="p-2 border rounded-md">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="line-width" className="text-xs">Line Width</Label>
                        <span className="text-xs">
                          {(document.getElementById('line-width') as HTMLInputElement)?.value || '2'}px
                        </span>
                      </div>
                      <Input 
                        id="line-width" 
                        type="range" 
                        min="1" 
                        max="10" 
                        defaultValue="2"
                        className="cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-1 mt-2">
                      <Label htmlFor="draw-color" className="text-xs">Color</Label>
                      <Input 
                        id="draw-color" 
                        type="color" 
                        defaultValue="#000000"
                      />
                    </div>
                  </div>
                )}
                
                {mode === 'highlight' && (
                  <div className="p-2 border rounded-md">
                    <div className="space-y-1">
                      <Label htmlFor="highlight-color" className="text-xs">Highlight Color</Label>
                      <Input 
                        id="highlight-color" 
                        type="color" 
                        defaultValue="#FFFF00"
                      />
                    </div>
                  </div>
                )}
                
                {mode === 'shape' && (
                  <div className="p-2 border rounded-md">
                    <div className="space-y-1">
                      <Label className="text-xs">Shape Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center justify-center py-2"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Rectangle
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center justify-center py-2"
                        >
                          <Circle className="h-4 w-4 mr-2" />
                          Circle
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="shape-line-width" className="text-xs">Line Width</Label>
                        <span className="text-xs">
                          {(document.getElementById('shape-line-width') as HTMLInputElement)?.value || '2'}px
                        </span>
                      </div>
                      <Input 
                        id="shape-line-width" 
                        type="range" 
                        min="1" 
                        max="10" 
                        defaultValue="2"
                        className="cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-1 mt-2">
                      <Label htmlFor="shape-color" className="text-xs">Color</Label>
                      <Input 
                        id="shape-color" 
                        type="color" 
                        defaultValue="#000000"
                      />
                    </div>
                  </div>
                )}
                
                {mode === 'image' && (
                  <div className="p-2 border rounded-md">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onChange={handleImageUpload}
                      ref={imageInputRef}
                      className="hidden"
                    />
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Select Image
                    </Button>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PNG, JPG, SVG (max 5MB)
                    </p>
                  </div>
                )}
                
                {/* Added elements list */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Elements on Page {currentPage}</h3>
                  <div className="max-h-48 overflow-y-auto border rounded-md">
                    {canvasDrawings.filter(el => el.page === currentPage).length > 0 ? (
                      <div className="divide-y">
                        {canvasDrawings
                          .filter(el => el.page === currentPage)
                          .map((element, index) => (
                            <div key={index} className="p-2 flex justify-between items-center">
                              <div className="flex items-center">
                                {element.type === 'text' && <Type className="h-4 w-4 mr-2" />}
                                {element.type === 'highlight' && <Highlighter className="h-4 w-4 mr-2" />}
                                {element.type === 'rectangle' && <Square className="h-4 w-4 mr-2" />}
                                {element.type === 'circle' && <Circle className="h-4 w-4 mr-2" />}
                                {element.type === 'freehand' && <Pencil className="h-4 w-4 mr-2" />}
                                {element.type === 'image' && <ImageIcon className="h-4 w-4 mr-2" />}
                                
                                <span className="text-xs capitalize">{element.type}</span>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => removeDrawingElement(
                                  canvasDrawings.findIndex(el => 
                                    el.page === currentPage && el === element
                                  )
                                )}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No elements on this page
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Main editor area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center border rounded-md px-3 py-1 text-sm">
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center border rounded-md px-3 py-1 text-sm">
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={zoom >= 3.0}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Canvas container */}
        <div 
          ref={canvasContainerRef}
          className="flex-1 overflow-auto bg-muted/20 rounded-lg border flex items-center justify-center"
        >
          <canvas 
            ref={canvasRef}
            className="shadow-md rounded-md"
          />
        </div>
        
        {/* Actions bar */}
        <div className="mt-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => {
              setFile(null);
              setSessionId(null);
              setExtractedText([]);
              setPageData([]);
              setCanvasDrawings([]);
              setTextReplacements({});
              setResult(null);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            New Document
          </Button>
          
          <Button 
            onClick={saveEditedPDF}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
  
  // Render processing state
  const renderProcessingState = () => (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {isUploading ? "Processing PDF" : "Saving your edits"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Please wait while we {isUploading ? "process" : "save"} your document...
      </p>
      
      <div className="w-full max-w-md space-y-1">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-right text-muted-foreground">{progress}%</p>
      </div>
    </div>
  );
  
  // Render result state
  const renderResult = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <Check className="h-12 w-12 text-green-500 mb-4" />
      <h3 className="text-xl font-medium mb-2">PDF Edited Successfully</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        Your PDF has been edited and saved. You can download it now or edit it again.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {result?.fileUrl && (
          <Button asChild>
            <a href={result.fileUrl} download={result.filename}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </a>
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => {
            // Keep the current file but reset the result state
            setResult(null);
          }}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Continue Editing
        </Button>
      </div>
    </div>
  );
  
  // Main render
  if (isUploading || isProcessing) {
    return renderProcessingState();
  } else if (result) {
    return renderResult();
  } else if (file && sessionId) {
    return renderEditorInterface();
  } else {
    return renderUploadArea();
  }
}