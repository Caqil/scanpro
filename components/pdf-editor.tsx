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
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  PenLine, 
  Signature,
  Move,
  Undo2,
  Redo2,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/src/store/store";

// Define drawing element types
interface Point {
  x: number;
  y: number;
}

interface DrawingElement {
  id: string;
  type: 'text' | 'image' | 'freehand' | 'highlight' | 'rectangle' | 'circle' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Point[];
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
  originalWidth?: number;
  originalHeight?: number;
}

export function PdfEditor() {
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
  const [activeTab, setActiveTab] = useState("draw");
  const [activeDrawingTool, setActiveDrawingTool] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<DrawingElement[][]>([]);
  const [history, setHistory] = useState<DrawingElement[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<DrawingElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const currentDrawingRef = useRef<DrawingElement | null>(null);

  // Drawing tool settings
  const [strokeColor, setStrokeColor] = useState("#ff0000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  // Generate unique ID for drawing elements
  const generateId = () => {
    return `drawing-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Add to history when drawings change
  useEffect(() => {
    if (drawings.length > 0 && !isDrawingRef.current) {
      // Only add to history if we're not in the middle of drawing
      // and if the drawings have actually changed
      if (historyIndex === -1 || JSON.stringify(drawings) !== JSON.stringify(history[historyIndex])) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(drawings)));
        
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
  }, [drawings]);

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setDrawings(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setDrawings(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

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
        setHistory([]);
        setHistoryIndex(-1);
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
      const initialDrawings = Array(data.pageCount).fill([]).map(() => []);
      setDrawings(initialDrawings);
      
      // Initialize history
      setHistory([initialDrawings]);
      setHistoryIndex(0);
      
      toast.success('PDF loaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to process PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert screen coordinates to canvas coordinates
  const convertCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Account for scale
    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;
    
    return { x, y };
  };

  // Check if a point is inside a drawing element
  const isPointInElement = (point: Point, element: DrawingElement): boolean => {
    // For text, image, rectangle, check if point is within bounds
    if (['text', 'image', 'rectangle'].includes(element.type)) {
      const width = element.width || 0;
      const height = element.height || 0;
      
      return (
        point.x >= element.x &&
        point.x <= element.x + width &&
        point.y >= element.y &&
        point.y <= element.y + height
      );
    }
    
    // For circle, check if point is within radius
    if (element.type === 'circle') {
      const width = element.width || 0;
      const height = element.height || 0;
      const radius = Math.sqrt(width * width + height * height) / 2;
      const centerX = element.x + width / 2;
      const centerY = element.y + height / 2;
      
      const distance = Math.sqrt(
        Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
      );
      
      return distance <= radius;
    }
    
    // For line, check if point is near the line
    if (element.type === 'line') {
      const x1 = element.x;
      const y1 = element.y;
      const x2 = element.x + (element.width || 0);
      const y2 = element.y + (element.height || 0);
      
      // Calculate distance from point to line
      const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      if (lineLength === 0) return false;
      
      const distance = Math.abs(
        (x2 - x1) * (y1 - point.y) - (x1 - point.x) * (y2 - y1)
      ) / lineLength;
      
      return distance <= 5; // Threshold for line selection
    }
    
    // For freehand and highlight, check if point is near any segment
    if (['freehand', 'highlight'].includes(element.type) && element.points) {
      for (let i = 0; i < element.points.length - 1; i++) {
        const x1 = element.points[i].x;
        const y1 = element.points[i].y;
        const x2 = element.points[i + 1].x;
        const y2 = element.points[i + 1].y;
        
        // Calculate distance from point to line segment
        const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (lineLength === 0) continue;
        
        const distance = Math.abs(
          (x2 - x1) * (y1 - point.y) - (x1 - point.x) * (y2 - y1)
        ) / lineLength;
        
        if (distance <= 5) return true; // Threshold for line selection
      }
    }
    
    return false;
  };

  // Mouse down event handler
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const { x, y } = convertCoordinates(e.clientX, e.clientY);
    
    // If we're in move mode, check if we're clicking on an element
    if (isMoving) {
      const currentPageDrawings = drawings[currentPage - 1] || [];
      
      // Check from last to first (top to bottom in z-index)
      for (let i = currentPageDrawings.length - 1; i >= 0; i--) {
        if (isPointInElement({ x, y }, currentPageDrawings[i])) {
          setSelectedElement(currentPageDrawings[i]);
          lastPositionRef.current = { x, y };
          isDrawingRef.current = true;
          return;
        }
      }
      
      // If we didn't hit any element, deselect
      setSelectedElement(null);
      return;
    }
    
    // If no active drawing tool, do nothing
    if (!activeDrawingTool) return;
    
    isDrawingRef.current = true;
    lastPositionRef.current = { x, y };
    
    // Handle different drawing tools
    if (activeDrawingTool === 'text' && textInput) {
      // For text, create element immediately
      const newTextElement: DrawingElement = {
        id: generateId(),
        type: 'text',
        x,
        y,
        text: textInput,
        fontSize,
        fontFamily,
        color: strokeColor,
        width: measureTextWidth(textInput, fontFamily, fontSize),
        height: fontSize * 1.2
      };
      
      // Add to current page's drawings
      setDrawings(prev => {
        const newDrawings = [...prev];
        if (!newDrawings[currentPage - 1]) {
          newDrawings[currentPage - 1] = [];
        }
        newDrawings[currentPage - 1] = [...newDrawings[currentPage - 1], newTextElement];
        return newDrawings;
      });
      
      isDrawingRef.current = false;
    } 
    else if (activeDrawingTool === 'signature' && signatureImage) {
      // For signature, create element immediately
      const img = new Image();
      img.src = signatureImage;
      
      // Use a placeholder size first, will be updated when image loads
      const newSignature: DrawingElement = {
        id: generateId(),
        type: 'image',
        x,
        y,
        imageData: signatureImage,
        width: 200,
        height: 100
      };
      
      // Add to current page's drawings
      setDrawings(prev => {
        const newDrawings = [...prev];
        if (!newDrawings[currentPage - 1]) {
          newDrawings[currentPage - 1] = [];
        }
        newDrawings[currentPage - 1] = [...newDrawings[currentPage - 1], newSignature];
        return newDrawings;
      });
      
      isDrawingRef.current = false;
    }
    else if (activeDrawingTool === 'freehand' || activeDrawingTool === 'highlight') {
      // For drawing tools, create element and store in currentDrawingRef
      currentDrawingRef.current = {
        id: generateId(),
        type: activeDrawingTool as 'freehand' | 'highlight',
        x,
        y,
        points: [{ x, y }],
        color: strokeColor,
        lineWidth: strokeWidth,
        opacity: activeDrawingTool === 'highlight' ? 0.3 : 1
      };
    }
    else if (['rectangle', 'circle', 'line'].includes(activeDrawingTool)) {
      // For shape tools, create element and store in currentDrawingRef
      currentDrawingRef.current = {
        id: generateId(),
        type: activeDrawingTool as 'rectangle' | 'circle' | 'line',
        x,
        y,
        width: 0,
        height: 0,
        color: strokeColor,
        lineWidth: strokeWidth
      };
    }
  };

  // Mouse move event handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    
    const { x, y } = convertCoordinates(e.clientX, e.clientY);
    
    // If moving an element
    if (isMoving && selectedElement) {
      const dx = x - lastPositionRef.current.x;
      const dy = y - lastPositionRef.current.y;
      
      setDrawings(prev => {
        const newDrawings = [...prev];
        const pageDrawings = [...newDrawings[currentPage - 1]];
        
        // Find the selected element in the current page
        const elementIndex = pageDrawings.findIndex(el => el.id === selectedElement.id);
        if (elementIndex === -1) return prev;
        
        // Create a new updated element
        const updatedElement = { ...pageDrawings[elementIndex] };
        
        // Update position based on element type
        if (updatedElement.type === 'freehand' || updatedElement.type === 'highlight') {
          if (updatedElement.points) {
            updatedElement.points = updatedElement.points.map(point => ({
              x: point.x + dx,
              y: point.y + dy
            }));
          }
        } else {
          updatedElement.x += dx;
          updatedElement.y += dy;
        }
        
        // Replace the element in the drawings array
        pageDrawings[elementIndex] = updatedElement;
        newDrawings[currentPage - 1] = pageDrawings;
        
        // Update the selected element reference
        setSelectedElement(updatedElement);
        
        return newDrawings;
      });
      
      lastPositionRef.current = { x, y };
      return;
    }
    
    if (!activeDrawingTool || !currentDrawingRef.current) return;

  if (activeDrawingTool === 'freehand' || activeDrawingTool === 'highlight') {
    if (currentDrawingRef.current.points) {
      currentDrawingRef.current.points.push({ x, y });
      const currentPageDrawings = [...(drawings[currentPage - 1] || [])];
      redrawCanvas([...currentPageDrawings, currentDrawingRef.current]);
    }
  } else if (['rectangle', 'circle', 'line'].includes(activeDrawingTool)) {
    // Update width and height for shape
    currentDrawingRef.current.width = x - currentDrawingRef.current.x;
    currentDrawingRef.current.height = y - currentDrawingRef.current.y;
    
    // Redraw with the temporary drawing
    const currentPageDrawings = [...(drawings[currentPage - 1] || [])];
    redrawCanvas([...currentPageDrawings, currentDrawingRef.current]);
  }
  };

  // Mouse up event handler
  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    
    // If we're in move mode, just end the move
    if (isMoving) {
      isDrawingRef.current = false;
      return;
    }
    
    // For drawing tools, add the current drawing to the page drawings
    if (currentDrawingRef.current) {
      setDrawings(prev => {
        const newDrawings = [...prev];
        if (!newDrawings[currentPage - 1]) {
          newDrawings[currentPage - 1] = [];
        }
        newDrawings[currentPage - 1] = [...newDrawings[currentPage - 1], currentDrawingRef.current!];
        return newDrawings;
      });
      
      currentDrawingRef.current = null;
    }
    
    isDrawingRef.current = false;
  };

  // Measure text width for element sizing
  const measureTextWidth = (text: string, fontFamily: string, fontSize: number): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return text.length * fontSize * 0.6; // Fallback estimation
    
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
  };

  // Redraw canvas with all drawings
  const redrawCanvas = (drawingsList: DrawingElement[]) => {
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

    // Draw all elements
    drawingsList.forEach(drawing => {
      // Set common styles
      ctx.lineWidth = drawing.lineWidth || 2;
      ctx.strokeStyle = drawing.color || '#000000';
      ctx.fillStyle = drawing.color || '#000000';
      ctx.globalAlpha = drawing.opacity || 1;
      
      // Highlight selected element
      const isSelected = selectedElement && drawing.id === selectedElement.id;
      if (isSelected) {
        ctx.save();
        ctx.strokeStyle = '#0000ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
      }
      
      if (drawing.type === 'text' && drawing.text) {
        // Draw text
        ctx.font = `${drawing.fontSize}px ${drawing.fontFamily}`;
        ctx.fillText(drawing.text, drawing.x, drawing.y + (drawing.fontSize || 16));
        
        // Draw selection box if selected
        if (isSelected) {
          const width = drawing.width || measureTextWidth(drawing.text, drawing.fontFamily || 'Arial', drawing.fontSize || 16);
          const height = drawing.fontSize ? drawing.fontSize * 1.2 : 20;
          
          ctx.strokeRect(
            drawing.x - 2,
            drawing.y - 2,
            width + 4,
            height + 4
          );
        }
      } 
      else if (drawing.type === 'image' && drawing.imageData) {
        // Draw image
        const img = new Image();
        img.src = drawing.imageData;
        
        // Only draw if the image is loaded
        if (img.complete) {
          ctx.drawImage(
            img, 
            drawing.x, 
            drawing.y, 
            drawing.width || 200, 
            drawing.height || 100
          );
        } else {
          img.onload = () => {
            ctx.drawImage(
              img, 
              drawing.x, 
              drawing.y, 
              drawing.width || 200, 
              drawing.height || 100
            );
          };
        }
        
        // Draw selection box if selected
        if (isSelected) {
          ctx.strokeRect(
            drawing.x - 2,
            drawing.y - 2,
            (drawing.width || 200) + 4,
            (drawing.height || 100) + 4
          );
        }
      }
      else if ((drawing.type === 'freehand' || drawing.type === 'highlight') && drawing.points && drawing.points.length > 1) {
        // Draw freehand or highlight path
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        
        for (let i = 1; i < drawing.points.length; i++) {
          ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (drawing.type === 'highlight') {
          ctx.stroke();
          
          // For highlight, also fill with semi-transparent color
          ctx.globalAlpha = 0.2;
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.stroke();
        }
        
        // Draw selection box if selected
        if (isSelected && drawing.points.length > 0) {
          // Calculate bounding box of the path
          let minX = drawing.points[0].x;
          let minY = drawing.points[0].y;
          let maxX = drawing.points[0].x;
          let maxY = drawing.points[0].y;
          
          drawing.points.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
          });
          
          ctx.strokeRect(
            minX - 4,
            minY - 4,
            maxX - minX + 8,
            maxY - minY + 8
          );
        }
      }
      else if (drawing.type === 'rectangle') {
        // Draw rectangle
        const width = drawing.width || 0;
        const height = drawing.height || 0;
        
        ctx.strokeRect(drawing.x, drawing.y, width, height);
        
        // Draw selection box if selected
        if (isSelected) {
          ctx.strokeRect(
            drawing.x - 2,
            drawing.y - 2,
            width + 4,
            height + 4
          );
        }
      }
      else if (drawing.type === 'circle') {
        // Draw circle
        const width = drawing.width || 0;
        const height = drawing.height || 0;
        const centerX = drawing.x + width / 2;
        const centerY = drawing.y + height / 2;
        const radius = Math.sqrt(width * width + height * height) / 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw selection box if selected
        if (isSelected) {
          ctx.strokeRect(
            drawing.x - 2,
            drawing.y - 2,
            width + 4,
            height + 4
          );
        }
      }
      else if (drawing.type === 'line') {
        // Draw line
        ctx.beginPath();
        ctx.moveTo(drawing.x, drawing.y);
        ctx.lineTo(drawing.x + (drawing.width || 0), drawing.y + (drawing.height || 0));
        ctx.stroke();
        
        // Draw selection box if selected
        if (isSelected) {
          // Calculate line bounding box
          const x = Math.min(drawing.x, drawing.x + (drawing.width || 0));
          const y = Math.min(drawing.y, drawing.y + (drawing.height || 0));
          const width = Math.abs(drawing.width || 0);
          const height = Math.abs(drawing.height || 0);
          
          ctx.strokeRect(
            x - 4,
            y - 4,
            width + 8,
            height + 8
          );
        }
      }
      
      // Restore context if selected
      if (isSelected) {
        ctx.restore();
      }
    });
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
  }, [currentPage, pageImages, drawings, selectedElement]);

  // Handle signature capture
  const handleSignatureCapture = (signatureData: string) => {
    setSignatureImage(signatureData);
    setActiveDrawingTool('signature');
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
          sessionId,
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

  // Remove the current selected element
  const removeSelectedElement = () => {
    if (!selectedElement) return;
    
    setDrawings(prev => {
      const newDrawings = [...prev];
      const pageDrawings = newDrawings[currentPage - 1] || [];
      
      // Filter out the selected element
      newDrawings[currentPage - 1] = pageDrawings.filter(
        element => element.id !== selectedElement.id
      );
      
      return newDrawings;
    });
    
    setSelectedElement(null);
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
                {isDragActive ? 'Drop your file here' : 'Drag & drop your PDF'}
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Upload a PDF file to edit. Add text, signatures, drawings, and more.
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
              {editedPdfUrl ? (
                <>
                  <Save className="h-4 w-4 animate-pulse" />
                  <span>Saving PDF... {progress}%</span>
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 animate-pulse" />
                  <span>Processing PDF... {progress}%</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* PDF Editor UI */}
        {file && sessionId && pageImages.length > 0 && !editedPdfUrl && (
          <div className="space-y-6">
            {/* File info */}
            <div className="flex items-center justify-between flex-wrap gap-2">
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
                    setSelectedElement(null);
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
                    setSelectedElement(null);
                  }}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Editor toolbar */}
            <div className="border rounded-lg p-4 bg-muted/20">
              <Tabs defaultValue="draw" onValueChange={value => {
                setActiveTab(value);
                setActiveDrawingTool(null);
                setIsMoving(false);
                setSelectedElement(null);
              }}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="draw">Draw</TabsTrigger>
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="shapes">Shapes</TabsTrigger>
                  <TabsTrigger value="sign">Signature</TabsTrigger>
                </TabsList>
                
                <TabsContent value="draw" className="mt-4">
                  <div className="flex flex-wrap items-center gap-4">
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
                              onClick={() => {
                                setActiveDrawingTool('freehand');
                                setIsMoving(false);
                                setSelectedElement(null);
                              }}
                              className={activeDrawingTool === 'freehand' ? 'bg-primary/20' : ''}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pencil</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setActiveDrawingTool('highlight');
                                setIsMoving(false);
                                setSelectedElement(null);
                              }}
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
                              onClick={() => {
                                setIsMoving(true);
                                setActiveDrawingTool(null);
                              }}
                              className={isMoving ? 'bg-primary/20' : ''}
                            >
                              <Move className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select/Move</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setActiveDrawingTool(null);
                                setIsMoving(false);
                                setSelectedElement(null);
                              }}
                              className={!activeDrawingTool && !isMoving ? 'bg-primary/20' : ''}
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
                
                <TabsContent value="text" className="mt-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-1/3">
                      <Input
                        type="text"
                        placeholder="Enter text..."
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
                      <Select
                        value={fontFamily}
                        onValueChange={setFontFamily}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                        </SelectContent>
                      </Select>
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
                      onClick={() => {
                        setActiveDrawingTool('text');
                        setIsMoving(false);
                        setSelectedElement(null);
                      }}
                      className={activeDrawingTool === 'text' ? 'bg-primary/20' : ''}
                      disabled={!textInput.trim()}
                    >
                      <Type className="h-4 w-4 mr-1" />
                      Add Text
                    </Button>
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
                              onClick={() => {
                                setActiveDrawingTool('rectangle');
                                setIsMoving(false);
                                setSelectedElement(null);
                              }}
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
                              onClick={() => {
                                setActiveDrawingTool('circle');
                                setIsMoving(false);
                                setSelectedElement(null);
                              }}
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
                              onClick={() => {
                                setActiveDrawingTool('line');
                                setIsMoving(false);
                                setSelectedElement(null);
                              }}
                              className={activeDrawingTool === 'line' ? 'bg-primary/20' : ''}
                            >
                              <PenLine className="h-4 w-4" />
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
                      <div className="flex gap-2">
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
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setActiveDrawingTool('signature');
                            setIsMoving(false);
                            setSelectedElement(null);
                          }}
                          className={activeDrawingTool === 'signature' ? 'bg-primary/20' : ''}
                        >
                          <Signature className="h-4 w-4 mr-1" />
                          Add Signature
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* History controls and element actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo2 className="h-4 w-4 mr-1" />
                    Undo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo2 className="h-4 w-4 mr-1" />
                    Redo
                  </Button>
                </div>
                
                {selectedElement && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={removeSelectedElement}
                  >
                    <Eraser className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                )}
              </div>
            </div>

            {/* Canvas for PDF editing */}
            <div className="border rounded-lg overflow-hidden bg-background">
              <div 
                ref={containerRef}
                className="relative"
                style={{ 
                  maxHeight: '70vh', 
                  overflowY: 'auto',
                }}
              >
                <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
                  <canvas 
                    ref={canvasRef}
                    className="mx-auto"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                </div>
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
                setHistory([]);
                setHistoryIndex(-1);
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
              setHistory([]);
              setHistoryIndex(-1);
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