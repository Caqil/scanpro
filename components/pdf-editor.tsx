"use client";

import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";
import { SignaturePad } from "@/components/signature-pad";
import { 
  FileIcon, 
  Cross2Icon, 
  UploadIcon, 
  DownloadIcon,
  CheckCircledIcon
} from "@radix-ui/react-icons";
import { 
  AlertCircle, 
  Edit2, 
  Type, 
  Pencil, 
  Square, 
  Circle, 
  Highlighter,
  Eraser, 
  PenTool, 
  PenLineIcon, 
  Signature
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define props interface (fixes missing props error)
interface PdfEditorProps {}

// Define drawing element types
interface DrawingElement {
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
  color?: string;
  lineWidth?: number;
  opacity?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  imageData?: string;
}

interface PageImage {
  imageUrl: string;
  width: number;
  height: number;
}

export function PdfEditor(props: PdfEditorProps) {
  const { t } = useLanguageStore();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [activeTab, setActiveTab] = useState("text");
  const [activeDrawingTool, setActiveDrawingTool] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<DrawingElement[][]>([]);
  const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const currentDrawingRef = useRef<DrawingElement[]>([]);

  // Drawing tool settings
  const [strokeColor, setStrokeColor] = useState("#ff0000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Handle file upload
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.file.size > 100 * 1024 * 1024) {
          setError('File size is too large. Maximum size is 100MB.');
        } else {
          setError('Only PDF files are accepted.');
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setEditedPdfUrl(null);
        setSessionId(null);
        setDrawings([]);
        setPageImages([]);
        setError(null);
        processFile(acceptedFiles[0]);
      }
    },
  });

  // Process uploaded PDF file
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      // Call API to process PDF
      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }

      const data = await response.json();
      setProgress(100);
      
      // Initialize editor with processed PDF data
      setSessionId(data.sessionId);
      setPageImages(data.pages);
      setTotalPages(data.pageCount);
      
      // Initialize drawings array for each page
      const initialDrawings = Array(data.pageCount).fill([]);
      setDrawings(initialDrawings);
      
      toast.success('PDF loaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to process PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drawing functionality
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeDrawingTool || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    isDrawingRef.current = true;
    lastPositionRef.current = { x, y };

    // For text and image tools, add them immediately
    if (activeDrawingTool === 'text' && textInput) {
      const newTextElement = {
        type: 'text',
        x,
        y,
        text: textInput,
        fontSize,
        fontFamily,
        color: strokeColor
      };

      // Add to current page's drawings
      setDrawings(prev => {
        const newDrawings = [...prev];
        newDrawings[currentPage - 1] = [...(newDrawings[currentPage - 1] || []), newTextElement];
        return newDrawings;
      });
    } else if (activeDrawingTool === 'signature' && signatureImage) {
      const newSignature = {
        type: 'image',
        x,
        y,
        imageData: signatureImage,
        width: 200,
        height: 100
      };

      setDrawings(prev => {
        const newDrawings = [...prev];
        newDrawings[currentPage - 1] = [...(newDrawings[currentPage - 1] || []), newSignature];
        return newDrawings;
      });
    } else if (activeDrawingTool === 'freehand' || activeDrawingTool === 'highlight') {
      // Start collecting points for drawing
      currentDrawingRef.current = [{
        type: activeDrawingTool,
        points: [{ x, y }],
        color: strokeColor,
        lineWidth: strokeWidth,
        opacity: activeDrawingTool === 'highlight' ? 0.3 : 1
      }];
    } else if (activeDrawingTool === 'rectangle' || activeDrawingTool === 'circle' || activeDrawingTool === 'line') {
      // Start shape with initial position
      currentDrawingRef.current = [{
        type: activeDrawingTool,
        x,
        y,
        width: 0,
        height: 0,
        color: strokeColor,
        lineWidth: strokeWidth
      }];
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
  
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
  
    if (activeDrawingTool === 'freehand' || activeDrawingTool === 'highlight') {
      // Add point to current drawing
      if (currentDrawingRef.current && currentDrawingRef.current.length > 0) {
        // Type guard to ensure points exists
        if (currentDrawingRef.current[0].points) {
          currentDrawingRef.current[0].points.push({ x, y });
          
          // Redraw canvas with temporary drawing
          redrawCanvas([...(drawings[currentPage - 1] || []), ...currentDrawingRef.current]);
        }
      }
    } else if (activeDrawingTool === 'rectangle' || activeDrawingTool === 'circle' || activeDrawingTool === 'line') {
      // Update shape dimensions
      if (currentDrawingRef.current && currentDrawingRef.current.length > 0) {
        // These properties are optional, so we need to ensure they can be set
        const currentDrawing = currentDrawingRef.current[0];
        currentDrawing.width = x - (currentDrawing.x ?? 0);
        currentDrawing.height = y - (currentDrawing.y ?? 0);
        
        // Redraw canvas with temporary shape
        redrawCanvas([...(drawings[currentPage - 1] || []), ...currentDrawingRef.current]);
      }
    }
  
    lastPositionRef.current = { x, y };
  };

  const endDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    // Add the completed drawing to the page's drawings
    if (currentDrawingRef.current.length > 0) {
      setDrawings(prev => {
        const newDrawings = [...prev];
        newDrawings[currentPage - 1] = [...(newDrawings[currentPage - 1] || []), ...currentDrawingRef.current];
        return newDrawings;
      });
      currentDrawingRef.current = [];
    }
  };

  // Redraw canvas with all drawings
  const redrawCanvas = (drawingsList: any[]) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image if available
    if (pageImages[currentPage - 1]) {
      const img = new Image();
      img.src = pageImages[currentPage - 1].imageUrl;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Draw all elements on this page
    drawingsList.forEach(drawing => {
      if (drawing.type === 'text') {
        ctx.font = `${drawing.fontSize}px ${drawing.fontFamily}`;
        ctx.fillStyle = drawing.color;
        ctx.fillText(drawing.text, drawing.x, drawing.y);
      } else if (drawing.type === 'image') {
        const img = new Image();
        img.src = drawing.imageData;
        img.onload = () => {
          ctx.drawImage(img, drawing.x, drawing.y, drawing.width, drawing.height);
        };
      } else if (drawing.type === 'freehand' || drawing.type === 'highlight') {
        ctx.beginPath();
        if (drawing.points && drawing.points.length > 0) {
          ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
          
          for (let i = 1; i < drawing.points.length; i++) {
            ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
          }
        }
        
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.lineWidth;
        ctx.globalAlpha = drawing.opacity || 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (drawing.type === 'highlight') {
          ctx.stroke();
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = drawing.color;
          ctx.fill();
        } else {
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
      } else if (drawing.type === 'rectangle') {
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.lineWidth;
        ctx.strokeRect(drawing.x, drawing.y, drawing.width, drawing.height);
      } else if (drawing.type === 'circle') {
        ctx.beginPath();
        const radius = Math.sqrt(drawing.width*drawing.width + drawing.height*drawing.height) / 2;
        ctx.arc(
          drawing.x + drawing.width/2, 
          drawing.y + drawing.height/2, 
          radius, 
          0, 
          2 * Math.PI
        );
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.lineWidth;
        ctx.stroke();
      } else if (drawing.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(drawing.x, drawing.y);
        ctx.lineTo(drawing.x + drawing.width, drawing.y + drawing.height);
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.lineWidth;
        ctx.stroke();
      }
    });
  };

  // Save the edited PDF
  const saveEditedPdf = async () => {
    if (!sessionId) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Prepare data for API request
      const pagesData = pageImages.map((page, index) => ({
        ...page,
        drawings: drawings[index] || []
      }));
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      // Call API to save the edited PDF
      const response = await fetch('/api/pdf/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfName: file?.name || 'edited-document.pdf',
          pages: pagesData
        }),
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save PDF');
      }
      
      const data = await response.json();
      setProgress(100);
      setEditedPdfUrl(data.fileUrl);
      
      toast.success('PDF edited successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to save PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update canvas when page changes or drawings are updated
  useEffect(() => {
    if (canvasRef.current && pageImages[currentPage - 1]) {
      const canvas = canvasRef.current;
      
      // Set canvas dimensions from page image
      const pageData = pageImages[currentPage - 1];
      canvas.width = pageData.width;
      canvas.height = pageData.height;
      
      // Load background image and draw all elements
      const img = new Image();
      img.src = pageData.imageUrl;
      img.onload = () => {
        redrawCanvas(drawings[currentPage - 1] || []);
      };
    }
  }, [currentPage, pageImages, drawings]);

  // Handle signature capture
  const handleSignatureCapture = (signatureData: string) => {
    setSignatureImage(signatureData);
    setActiveDrawingTool('signature');
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

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>PDF Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file && (
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragActive ? "border-primary bg-primary/10" : 
              "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-lg font-medium">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your file'}
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

        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Edit2 className="h-4 w-4 animate-pulse" />
              <span>Processing... {progress}%</span>
            </div>
          </div>
        )}

        {/* PDF Editor UI */}
        {file && sessionId && pageImages.length > 0 && !editedPdfUrl && (
          <div className="space-y-6">
            {/* File info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <FileIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {totalPages} pages
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Editor toolbar */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <Tabs defaultValue="text" onValueChange={value => setActiveTab(value)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="draw">Draw</TabsTrigger>
                  <TabsTrigger value="shapes">Shapes</TabsTrigger>
                  <TabsTrigger value="sign">Signature</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-1/3">
                      <input
                        type="text"
                        placeholder="Enter text..."
                        className="border rounded p-2 w-full"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm whitespace-nowrap">Font Size:</label>
                      <Slider
                        className="w-24"
                        min={8}
                        max={48}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                      />
                      <span className="text-sm">{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm whitespace-nowrap">Font:</label>
                      <select
                        className="border rounded p-1"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm whitespace-nowrap">Color:</label>
                      <input
                        type="color"
                        className="w-8 h-8 p-0 border-0"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveDrawingTool('text')}
                      className={activeDrawingTool === 'text' ? 'bg-primary/20' : ''}
                    >
                      <Type className="h-4 w-4 mr-1" />
                      Add Text
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="draw" className="mt-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm whitespace-nowrap">Color:</label>
                      <input
                        type="color"
                        className="w-8 h-8 p-0 border-0"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm whitespace-nowrap">Size:</label>
                      <Slider
                        className="w-24"
                        min={1}
                        max={10}
                        step={1}
                        value={[strokeWidth]}
                        onValueChange={(value) => setStrokeWidth(value[0])}
                      />
                      <span className="text-sm">{strokeWidth}px</span>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveDrawingTool('freehand')}
                              className={activeDrawingTool === 'freehand' ? 'bg-primary/20' : ''}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Freehand Drawing</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveDrawingTool('highlight')}
                              className={activeDrawingTool === 'highlight' ? 'bg-primary/20' : ''}
                            >
                              <Highlighter className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Highlighter</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveDrawingTool(null)}
                              className={!activeDrawingTool ? 'bg-primary/20' : ''}
                            >
                              <Eraser className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Clear Selection</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="shapes" className="mt-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm whitespace-nowrap">Color:</label>
                      <input
                        type="color"
                        className="w-8 h-8 p-0 border-0"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm whitespace-nowrap">Size:</label>
                      <Slider
                        className="w-24"
                        min={1}
                        max={10}
                        step={1}
                        value={[strokeWidth]}
                        onValueChange={(value) => setStrokeWidth(value[0])}
                      />
                      <span className="text-sm">{strokeWidth}px</span>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveDrawingTool('rectangle')}
                              className={activeDrawingTool === 'rectangle' ? 'bg-primary/20' : ''}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rectangle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveDrawingTool('circle')}
                              className={activeDrawingTool === 'circle' ? 'bg-primary/20' : ''}
                            >
                              <Circle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Circle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveDrawingTool('line')}
                              className={activeDrawingTool === 'line' ? 'bg-primary/20' : ''}
                            >
                              <PenLineIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Line</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sign" className="mt-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <SignaturePad onSignatureCapture={handleSignatureCapture} />
                    
                    {signatureImage && (
                      <div className="border rounded p-2 bg-background">
                        <p className="text-xs text-muted-foreground mb-1">Your signature:</p>
                        <img 
                          src={signatureImage} 
                          alt="Your signature" 
                          className="max-h-16"
                        />
                      </div>
                    )}
                    
                    {signatureImage && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSignatureImage(null);
                          setActiveDrawingTool(null);
                        }}
                      >
                        <Cross2Icon className="h-4 w-4 mr-1" />
                        Clear Signature
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Canvas for PDF editing */}
            <div className="border rounded-lg overflow-hidden bg-background">
              <div 
                className="relative"
                style={{ 
                  maxHeight: '70vh', 
                  overflowY: 'auto',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center'
                }}
              >
                <canvas 
                  ref={canvasRef}
                  className="mx-auto"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                />
              </div>
              
              {/* Zoom controls */}
              <div className="p-2 border-t flex justify-center gap-2 bg-muted/20">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                  disabled={scale <= 0.5}
                >
                  Zoom Out
                </Button>
                <span className="py-2 px-3 text-sm">
                  {Math.round(scale * 100)}%
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
                  disabled={scale >= 2}
                >
                  Zoom In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edited PDF Result */}
        {editedPdfUrl && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-600 dark:text-green-400">
                  PDF edited successfully
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Your PDF has been successfully edited and is ready for download.
                </p>
                <Button 
                  className="w-full sm:w-auto" 
                  asChild
                  variant="default"
                >
                  <a href={editedPdfUrl} download target="_blank">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download Edited PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {file && sessionId && pageImages.length > 0 && !editedPdfUrl && (
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setFile(null);
                setSessionId(null);
                setPageImages([]);
                setDrawings([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEditedPdf}
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save Edited PDF'}
            </Button>
          </div>
        )}
        
        {editedPdfUrl && (
          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setSessionId(null);
              setPageImages([]);
              setDrawings([]);
              setEditedPdfUrl(null);
            }}
          >
            Edit Another PDF
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}