"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
  ReloadIcon,
} from "@radix-ui/react-icons";
import { 
  AlertCircle, 
  PencilIcon, 
  TextIcon, 
  ImageIcon, 
  SquareIcon, 
  CircleIcon, 
  TypeIcon, 
  MousePointerIcon, 
  PenLineIcon,
  MoveIcon,
  UndoIcon,
  RedoIcon,
  SaveIcon,
  Trash2Icon,
  MinusIcon,
  PlusIcon,
  HighlighterIcon,
  StampIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schema
const formSchema = z.object({
  tool: z.enum(["select", "text", "draw", "shape", "image", "highlight", "stamp"]).default("select"),
  fontSize: z.number().min(8).max(72).default(16),
  fontFamily: z.string().default("Arial"),
  textColor: z.string().default("#000000"),
  fillColor: z.string().default("#ffffff"),
  strokeColor: z.string().default("#000000"),
  strokeWidth: z.number().min(1).max(10).default(2),
  shapeType: z.enum(["rectangle", "circle", "line", "arrow"]).default("rectangle"),
  opacity: z.number().min(0.1).max(1).default(1),
  highlightColor: z.string().default("#ffff00"),
  stampType: z.enum(["approved", "draft", "confidential", "final", "custom"]).default("approved"),
  customStampText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// PDF Editor Mock Page
interface EditorPage {
  id: number;
  objects: EditorObject[];
  width: number;
  height: number;
}

// Editor Object Types
interface BaseEditorObject {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  selected: boolean;
}

interface TextObject extends BaseEditorObject {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  width: number;
  height: number;
}

interface ShapeObject extends BaseEditorObject {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'line' | 'arrow';
  width: number;
  height: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
}

interface ImageObject extends BaseEditorObject {
  type: 'image';
  src: string;
  width: number;
  height: number;
}

interface DrawObject extends BaseEditorObject {
  type: 'draw';
  path: Array<{x: number, y: number}>;
  strokeColor: string;
  strokeWidth: number;
}

interface HighlightObject extends BaseEditorObject {
  type: 'highlight';
  width: number;
  height: number;
  color: string;
}

interface StampObject extends BaseEditorObject {
  type: 'stamp';
  stampType: string;
  text: string;
  width: number;
  height: number;
  color: string;
}

type EditorObject = 
  | TextObject 
  | ShapeObject 
  | ImageObject 
  | DrawObject 
  | HighlightObject
  | StampObject;

export function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editedFileUrl, setEditedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [pagePreviewUrls, setPagePreviewUrls] = useState<string[]>([]);
  const [startDrawing, setStartDrawing] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [history, setHistory] = useState<EditorPage[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tool: "select",
      fontSize: 16,
      fontFamily: "Arial",
      textColor: "#000000",
      fillColor: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 2,
      shapeType: "rectangle",
      opacity: 1,
      highlightColor: "#ffff00",
      stampType: "approved",
    },
  });

  // Watch tool selection for UI state
  const selectedTool = form.watch("tool");
  const shapeType = form.watch("shapeType");
  const opacity = form.watch("opacity");
  const fontSize = form.watch("fontSize");
  const fontFamily = form.watch("fontFamily");
  const textColor = form.watch("textColor");
  const fillColor = form.watch("fillColor");
  const strokeColor = form.watch("strokeColor");
  const strokeWidth = form.watch("strokeWidth");
  const highlightColor = form.watch("highlightColor");
  const stampType = form.watch("stampType");
  const customStampText = form.watch("customStampText");

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
        const pdfFile = acceptedFiles[0];
        setFile(pdfFile);
        setEditedFileUrl(null);
        setError(null);
        
        // When a new file is uploaded, estimate the number of pages
        const fileSizeInMB = pdfFile.size / (1024 * 1024);
        // Rough estimate: 1MB ≈ 5 pages
        const estimatedPages = Math.max(1, Math.round(fileSizeInMB * 5));
        setTotalPages(estimatedPages);
        
        // Generate mock preview URLs for the PDF pages
        const urls = [];
        for (let i = 0; i < estimatedPages; i++) {
          urls.push(`/api/pdf/preview?file=${encodeURIComponent(pdfFile.name)}&page=${i+1}`);
        }
        setPagePreviewUrls(urls);
        
        // Initialize pages for the editor
        const newPages: EditorPage[] = [];
        for (let i = 0; i < estimatedPages; i++) {
          newPages.push({
            id: i + 1,
            objects: [],
            width: 612, // Standard US Letter width in points (8.5 * 72)
            height: 792 // Standard US Letter height in points (11 * 72)
          });
        }
        setPages(newPages);
        
        // Initialize history
        setHistory([newPages]);
        setHistoryIndex(0);
        
        toast.success("PDF uploaded successfully", {
          description: `File name: ${pdfFile.name} (${(fileSizeInMB).toFixed(2)} MB)`,
        });
      }
    },
  });
// Update the addObject function signature
const addObject = <T extends EditorObject>(object: Omit<T, 'id' | 'selected'>): string => {
  const newObject: T = {
    ...object,
    id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    selected: false,
  } as T;

  const newPages = [...pages];
  newPages[currentPage - 1].objects.push(newObject);

  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push([...newPages]);

  setPages(newPages);
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);

  return newObject.id;
};

  // Update an existing object
  const updateObject = <T extends EditorObject>(objectId: string, updates: Partial<T>) => {
    const newPages = [...pages];
    const pageIndex = currentPage - 1;
    const objectIndex = newPages[pageIndex].objects.findIndex(obj => obj.id === objectId);
  
    if (objectIndex !== -1) {
      const currentObject = newPages[pageIndex].objects[objectIndex] as T;
      newPages[pageIndex].objects[objectIndex] = {
        ...currentObject,
        ...updates,
      } as T;
  
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newPages]);
  
      setPages(newPages);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  // Delete an object
  const deleteObject = (objectId: string) => {
    const newPages = [...pages];
    const pageIndex = currentPage - 1;
    
    newPages[pageIndex].objects = newPages[pageIndex].objects.filter(obj => obj.id !== objectId);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newPages]);
    
    setPages(newPages);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    if (selectedObjectId === objectId) {
      setSelectedObjectId(null);
    }
  };

  // Handle tool selection
  const handleToolSelect = (tool: FormValues['tool']) => {
    form.setValue("tool", tool);
    setSelectedObjectId(null); // Deselect any selected object when changing tools
  };

  // Handle selection of objects
  const handleObjectClick = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();
    
    if (selectedTool !== 'select') return;
    
    // Deselect all objects
    const newPages = [...pages];
    const pageIndex = currentPage - 1;
    
    newPages[pageIndex].objects.forEach(obj => {
      obj.selected = obj.id === objectId;
    });
    
    setPages(newPages);
    setSelectedObjectId(objectId);
  };

  // Get the selected object
  const getSelectedObject = (): EditorObject | null => {
    if (!selectedObjectId) return null;
    
    const pageIndex = currentPage - 1;
    return pages[pageIndex].objects.find(obj => obj.id === selectedObjectId) || null;
  };

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(history[historyIndex - 1]);
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(history[historyIndex + 1]);
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();
    
    if (selectedTool !== 'select') return;
    
    setDraggedObjectId(objectId);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle drag
  const handleDrag = (e: React.MouseEvent) => {
    if (!draggedObjectId || !dragStart) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newPages = [...pages];
    const pageIndex = currentPage - 1;
    const objectIndex = newPages[pageIndex].objects.findIndex(obj => obj.id === draggedObjectId);
    
    if (objectIndex !== -1) {
      const object = newPages[pageIndex].objects[objectIndex];
      newPages[pageIndex].objects[objectIndex] = {
        ...object,
        x: object.x + deltaX / zoom,
        y: object.y + deltaY / zoom
      };
      
      setPages(newPages);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (draggedObjectId) {
      // Add current state to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...pages]);
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    setDraggedObjectId(null);
    setDragStart(null);
  };

  // Handle canvas mouse down
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    if (selectedTool === 'select') {
      // Deselect all objects when clicking canvas
      const newPages = [...pages];
      const pageIndex = currentPage - 1;
      
      newPages[pageIndex].objects.forEach(obj => {
        obj.selected = false;
      });
      
      setPages(newPages);
      setSelectedObjectId(null);
      return;
    }
    
    if (selectedTool === 'text') {
      const text = prompt('Enter text:', 'Your text here');
      if (text) {
        const textObject: Omit<TextObject, 'id' | 'selected'> = {
          type: 'text',
          x,
          y,
          rotation: 0,
          opacity,
          text,
          fontSize,
          fontFamily,
          color: textColor,
          width: 200,
          height: 30,
        };
        const objectId = addObject(textObject);
        setSelectedObjectId(objectId);
      }
    }
    
    if (selectedTool === 'shape') {
      const shapeObject: Omit<ShapeObject, 'id' | 'selected'> = {
        type: 'shape',
        x,
        y,
        rotation: 0,
        opacity,
        shapeType,
        width: 100,
        height: 100,
        strokeColor,
        strokeWidth,
        fillColor,
      };
      const objectId = addObject(shapeObject);
      setSelectedObjectId(objectId);
    }
    
    if (selectedTool === 'highlight') {
      const highlightObject: Omit<HighlightObject, 'id' | 'selected'> = {
        type: 'highlight',
        x,
        y,
        rotation: 0,
        opacity: 0.5, // Highlights are semi-transparent
        width: 100,
        height: 30,
        color: highlightColor,
      };
      const objectId = addObject(highlightObject);
      setSelectedObjectId(objectId);
    }
    if (selectedTool === 'stamp') {
      let stampText = '';
    
      switch (stampType) {
        case 'approved':
          stampText = 'APPROVED';
          break;
        case 'draft':
          stampText = 'DRAFT';
          break;
        case 'confidential':
          stampText = 'CONFIDENTIAL';
          break;
        case 'final':
          stampText = 'FINAL';
          break;
        case 'custom':
          stampText = customStampText || 'CUSTOM';
          break;
      }
    
      const stampObject: Omit<StampObject, 'id' | 'selected'> = {
        type: 'stamp',
        x,
        y,
        rotation: -30, // Stamps are often rotated
        opacity,
        stampType,
        text: stampText,
        width: 200,
        height: 80,
        color:
          stampType === 'approved'
            ? '#28a745'
            : stampType === 'draft'
            ? '#6c757d'
            : stampType === 'confidential'
            ? '#dc3545'
            : stampType === 'final'
            ? '#007bff'
            : '#6c757d',
      };
    
      const objectId = addObject(stampObject);
      setSelectedObjectId(objectId);
    }
  };

  // Handle canvas mouse move
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedObjectId && dragStart) {
      handleDrag(e);
      return;
    }
    
    if (!isDrawing || !editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setCurrentPath([...currentPath, {x, y}]);
  };

  // Handle canvas mouse up
  const handleCanvasMouseUp = () => {
    handleDragEnd();
    
    if (isDrawing && currentPath.length > 0) {
      const drawObject: Omit<DrawObject, 'id' | 'selected'> = {
        type: 'draw',
        x: 0,
        y: 0,
        rotation: 0,
        opacity,
        path: currentPath,
        strokeColor,
        strokeWidth,
      };
      addObject(drawObject);
      setIsDrawing(false);
      setStartDrawing(false);
      setCurrentPath([]);
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

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setEditedFileUrl(null);
    setError(null);
    setTotalPages(1);
    setCurrentPage(1);
    setPages([]);
    setHistory([]);
    setHistoryIndex(-1);
    setSelectedObjectId(null);
  };

  // Handle page navigation
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedObjectId(null);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedObjectId(null);
    }
  };

  // Handle zoom
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Delete selected object
  const deleteSelected = () => {
    if (selectedObjectId) {
      deleteObject(selectedObjectId);
    }
  };

  // Render a PDF object
  const renderObject = (object: EditorObject) => {
    const { id, x, y, rotation, opacity, selected } = object;
    
    const commonStyles: React.CSSProperties = {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transform: `rotate(${rotation}deg)`,
      opacity,
      cursor: selectedTool === 'select' ? 'move' : 'default',
      border: selected ? '1px dashed #4f46e5' : 'none',
    };
    
    switch (object.type) {
      case 'text':
        return (
          <div
            key={id}
            className="editor-object"
            style={{
              ...commonStyles,
              fontSize: `${object.fontSize}px`,
              fontFamily: object.fontFamily,
              color: object.color,
              width: `${object.width}px`,
              minHeight: `${object.height}px`,
              padding: '2px',
            }}
            onClick={(e) => handleObjectClick(e, id)}
            onMouseDown={(e) => handleDragStart(e, id)}
          >
            {object.text}
          </div>
        );
        
      case 'shape':
        if (object.shapeType === 'rectangle') {
          return (
            <div
              key={id}
              className="editor-object"
              style={{
                ...commonStyles,
                width: `${object.width}px`,
                height: `${object.height}px`,
                backgroundColor: object.fillColor,
                border: `${object.strokeWidth}px solid ${object.strokeColor}`,
              }}
              onClick={(e) => handleObjectClick(e, id)}
              onMouseDown={(e) => handleDragStart(e, id)}
            />
          );
        } else if (object.shapeType === 'circle') {
          return (
            <div
              key={id}
              className="editor-object"
              style={{
                ...commonStyles,
                width: `${object.width}px`,
                height: `${object.height}px`,
                backgroundColor: object.fillColor,
                border: `${object.strokeWidth}px solid ${object.strokeColor}`,
                borderRadius: '50%',
              }}
              onClick={(e) => handleObjectClick(e, id)}
              onMouseDown={(e) => handleDragStart(e, id)}
            />
          );
        } else {
          // Line or Arrow (simplified for this example)
          return (
            <div
              key={id}
              className="editor-object"
              style={{
                ...commonStyles,
                width: `${object.width}px`,
                height: `${object.strokeWidth}px`,
                backgroundColor: object.strokeColor,
              }}
              onClick={(e) => handleObjectClick(e, id)}
              onMouseDown={(e) => handleDragStart(e, id)}
            />
          );
        }
        
      case 'highlight':
        return (
          <div
            key={id}
            className="editor-object"
            style={{
              ...commonStyles,
              width: `${object.width}px`,
              height: `${object.height}px`,
              backgroundColor: object.color,
              mixBlendMode: 'multiply',
            }}
            onClick={(e) => handleObjectClick(e, id)}
            onMouseDown={(e) => handleDragStart(e, id)}
          />
        );
        
      case 'stamp':
        return (
          <div
            key={id}
            className="editor-object"
            style={{
              ...commonStyles,
              width: `${object.width}px`,
              height: `${object.height}px`,
              border: `2px solid ${object.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: object.color,
              fontFamily: 'Arial',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
            onClick={(e) => handleObjectClick(e, id)}
            onMouseDown={(e) => handleDragStart(e, id)}
          >
            {object.text}
          </div>
        );
        
      case 'draw':
        if (object.path.length < 2) return null;
        
        // Create an SVG path from the drawing
        const pathData = object.path.reduce((acc, point, index) => {
          if (index === 0) {
            return `M ${point.x} ${point.y}`;
          }
          return `${acc} L ${point.x} ${point.y}`;
        }, '');
        
        return (
          <svg
            key={id}
            className="editor-object"
            style={{
              ...commonStyles,
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <path
              d={pathData}
              stroke={object.strokeColor}
              strokeWidth={object.strokeWidth}
              fill="none"
              style={{
                pointerEvents: 'auto',
              }}
              onClick={(e) => handleObjectClick(e, id)}
            />
          </svg>
        );
        
      default:
        return null;
    }
  };

  // Handle form submission (save the edited PDF)
  const handleSave = async () => {
    if (!file) {
      setError("No PDF file loaded");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      // In a real implementation, we would send the PDF and all edit operations to the server
      // Here we'll simulate a successful response after a delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        
        // Set a mock edited file URL
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const mockEditedFileName = `${fileNameWithoutExt}_edited_${Date.now()}.pdf`;
        setEditedFileUrl(mockEditedFileName);
        
        toast.success("PDF edited successfully");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Editing Failed", {
        description: err instanceof Error ? err.message : "Failed to save edited PDF",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Properties panel based on the selected tool and object
  const renderPropertiesPanel = () => {
    const selectedObject = getSelectedObject();
    
    return (
      <div className="border rounded-lg p-4 bg-muted/10">
        <h3 className="text-sm font-medium mb-4">Properties</h3>
        
        {selectedTool === 'text' || (selectedObject?.type === 'text' && selectedTool === 'select') ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Size</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => form.setValue("fontSize", Math.max(8, field.value - 1))}
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min={8}
                          max={72}
                          className="rounded-none text-center h-8"
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 16)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => form.setValue("fontSize", Math.min(72, field.value + 1))}
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fontFamily"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Font" />
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
            </div>
            
            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Color</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <input
                        type="color"
                        className="w-8 h-8 rounded cursor-pointer"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      className="flex-grow h-8"
                    />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="opacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opacity: {Math.round(field.value * 100)}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ) : selectedTool === 'shape' || (selectedObject?.type === 'shape' && selectedTool === 'select') ? (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="shapeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shape Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Shape Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="arrow">Arrow</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fillColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fill Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <input
                          type="color"
                          className="w-8 h-8 rounded cursor-pointer"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        className="flex-grow h-8"
                      />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="strokeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stroke Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <input
                          type="color"
                          className="w-8 h-8 rounded cursor-pointer"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        className="flex-grow h-8"
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="strokeWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stroke Width: {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="opacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opacity: {Math.round(field.value * 100)}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ) : selectedTool === 'draw' || (selectedObject?.type === 'draw' && selectedTool === 'select') ? (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="strokeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stroke Color</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <input
                        type="color"
                        className="w-8 h-8 rounded cursor-pointer"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      className="flex-grow h-8"
                    />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="strokeWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stroke Width: {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="opacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opacity: {Math.round(field.value * 100)}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ) : selectedTool === 'highlight' || (selectedObject?.type === 'highlight' && selectedTool === 'select') ? (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="highlightColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlight Color</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <input
                        type="color"
                        className="w-8 h-8 rounded cursor-pointer"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      className="flex-grow h-8"
                    />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="opacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opacity: {Math.round(field.value * 100)}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ) : selectedTool === 'stamp' || (selectedObject?.type === 'stamp' && selectedTool === 'select') ? (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="stampType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stamp Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Stamp Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="approved">APPROVED</SelectItem>
                      <SelectItem value="draft">DRAFT</SelectItem>
                      <SelectItem value="confidential">CONFIDENTIAL</SelectItem>
                      <SelectItem value="final">FINAL</SelectItem>
                      <SelectItem value="custom">Custom...</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            {stampType === 'custom' && (
              <FormField
                control={form.control}
                name="customStampText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter stamp text"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="opacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opacity: {Math.round(field.value * 100)}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-2">
            {selectedTool === 'select' ? (
              <p>Click on an object to select it and view properties</p>
            ) : (
              <p>Select a tool to view available properties</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Edit PDF</CardTitle>
        <CardDescription>
          Add text, shapes, and annotations to your PDF document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Drop Zone - Show only if no file is loaded */}
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
        
        {/* PDF Editor UI - Show when a file is loaded */}
        {file && !editedFileUrl && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <FileIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {totalPages} pages
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                >
                  <Cross2Icon className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title="Undo"
                >
                  <UndoIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo"
                >
                  <RedoIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={deleteSelected}
                  disabled={!selectedObjectId}
                  title="Delete Selected"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                  title="Zoom Out"
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="text-xs w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={zoomIn}
                  disabled={zoom >= 2}
                  title="Zoom In"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center ml-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToPrevPage}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-xs mx-2 w-16 text-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Tools Panel */}
              <div className="md:col-span-1 border rounded-lg p-4 bg-muted/10">
                <h3 className="text-sm font-medium mb-4">Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  <Button
                    variant={selectedTool === 'select' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleToolSelect('select')}
                  >
                    <MousePointerIcon className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                  <Button
                    variant={selectedTool === 'text' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleToolSelect('text')}
                  >
                    <TextIcon className="h-4 w-4 mr-2" />
                    Text
                  </Button>
                  <Button
                    variant={selectedTool === 'draw' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleToolSelect('draw')}
                  >
                    <PenLineIcon className="h-4 w-4 mr-2" />
                    Draw
                  </Button>
                  <Button
                    variant={selectedTool === 'shape' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleToolSelect('shape')}
                  >
                    <SquareIcon className="h-4 w-4 mr-2" />
                    Shape
                  </Button>
                  <Button
                    variant={selectedTool === 'highlight' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleToolSelect('highlight')}
                  >
                    <HighlighterIcon className="h-4 w-4 mr-2" />
                    Highlight
                  </Button>
                  <Button
                    variant={selectedTool === 'stamp' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleToolSelect('stamp')}
                  >
                    <StampIcon className="h-4 w-4 mr-2" />
                    Stamp
                  </Button>
                </div>
                
                {/* Properties Panel */}
                <div className="mt-6">
                  {renderPropertiesPanel()}
                </div>
              </div>
              
              {/* Editor Canvas */}
              <div className="md:col-span-4 flex flex-col">
                <div 
                  ref={editorRef}
                  className="border rounded-lg bg-white overflow-auto h-[600px] relative"
                  style={{
                    padding: '20px',
                  }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                >
                  {/* PDF Page */}
                  <div 
                    className="pdf-page bg-white shadow-md mx-auto"
                    style={{
                      width: `${612 * zoom}px`,
                      height: `${792 * zoom}px`,
                      transform: `scale(${zoom})`,
                      transformOrigin: 'top left',
                      position: 'relative',
                    }}
                  >
                    {/* Mock PDF page content */}
                    <div className="absolute inset-0 bg-white border">
                      {/* If we had a real PDF preview, it would go here */}
                      <div className="flex justify-center items-center h-full text-muted-foreground">
                        <p>Page {currentPage} Preview</p>
                      </div>
                    </div>
                    
                    {/* Render all objects for the current page */}
                    {currentPage <= pages.length && pages[currentPage - 1].objects.map(obj => renderObject(obj))}
                    
                    {/* Render current drawing path */}
                    {isDrawing && currentPath.length > 1 && (
                      <svg
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <path
                          d={currentPath.reduce((acc, point, index) => {
                            if (index === 0) {
                              return `M ${point.x} ${point.y}`;
                            }
                            return `${acc} L ${point.x} ${point.y}`;
                          }, '')}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Save Button */}
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={handleSave}
                    disabled={isProcessing}
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Edited PDF
                  </Button>
                </div>
              </div>
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
        
        {/* Progress indicator */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ReloadIcon className="h-4 w-4 animate-spin" />
              <span>Processing your PDF... {progress}%</span>
            </div>
          </div>
        )}
        
        {/* Results */}
        {editedFileUrl && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-600 dark:text-green-400">
                  PDF successfully edited!
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Your PDF document has been edited and is ready for download.
                </p>
                <Button 
                  className="w-full sm:w-auto" 
                  asChild
                  variant="default"
                >
                  <a href={`/api/file?folder=edited&filename=${encodeURIComponent(editedFileUrl)}`} download>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download Edited PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}