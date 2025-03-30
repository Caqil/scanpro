'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Download, 
  Upload, 
  Save, 
  Text, 
  Image as ImageIcon, 
  Pencil, 
  Square, 
  Circle, 
  Highlighter, 
  Trash2, 
  Undo2, 
  Redo2, 
  FileText, 
  Loader2 
} from 'lucide-react';

// Types for drawings
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
  imageUrl: string;
  drawings: Drawing[];
}

// Props for the component
interface PdfEditorProps {
  pages: {
    imageUrl: string;
    width: number;
    height: number;
  }[];
  onSave?: (pages: PageData[]) => void;
}

// Client-side only imports
type CanvasEditorType = any; // This will be populated at runtime

const PdfEditor: React.FC<PdfEditorProps> = ({ pages, onSave }) => {
  // State for the Canvas Editor instance
  const [CanvasEditor, setCanvasEditor] = useState<CanvasEditorType | null>(null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for currently selected page
  const [currentPage, setCurrentPage] = useState(0);
  const [pageData, setPageData] = useState<PageData[]>(
    pages.map(page => ({
      ...page,
      drawings: []
    }))
  );
  
  // Editor mode and settings
  const [editorMode, setEditorMode] = useState<'classic' | 'canvas'>('classic');
  const [currentTool, setCurrentTool] = useState<string>('select');
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  
  // State for drawing process
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [drawingHistory, setDrawingHistory] = useState<Drawing[][]>(pages.map(() => []));
  const [redoHistory, setRedoHistory] = useState<Drawing[][]>(pages.map(() => []));
  
  // State for saving
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Import Canvas Editor only on client side
  useEffect(() => {
    // Dynamically import the Canvas Editor
    const loadEditor = async () => {
      try {
        const module = await import('@hufe921/canvas-editor');
        setCanvasEditor(() => module.default || module.CanvasEditor);
        setIsEditorLoaded(true);
      } catch (error) {
        console.error('Failed to load Canvas Editor:', error);
        toast.error('Failed to load the advanced editor. Using classic mode instead.');
      }
    };
    
    loadEditor();
  }, []);
  
  // Initialize Canvas Editor when it's loaded
  useEffect(() => {
    if (isEditorLoaded && CanvasEditor && editorMode === 'canvas' && containerRef.current) {
      try {
        // Initialize the editor
        const editor = new CanvasEditor({
          el: containerRef.current,
          mode: 'edit',
          width: pages[currentPage].width,
          height: pages[currentPage].height,
          background: {
            image: pages[currentPage].imageUrl
          },
          footer: {
            pagination: {
              current: currentPage + 1,
              total: pages.length
            }
          },
          tooltipMaxWidth: 300
        });
        
        editorRef.current = editor;
        
        // Load any existing drawings if switching from classic mode
        if (pageData[currentPage].drawings && pageData[currentPage].drawings.length > 0) {
          // Convert classic drawings to canvas format if needed
          // This would need custom conversion logic based on your needs
        }
        
        // Clean up on unmount
        return () => {
          if (editorRef.current) {
            // Save editor content before destroying
            const editorContent = editorRef.current.getContent();
            
            // Update page data with canvas content
            setPageData(prev => {
              const newData = [...prev];
              newData[currentPage] = {
                ...newData[currentPage],
                drawings: [editorContent] // Store entire canvas content as a single drawing
              };
              return newData;
            });
            
            // Destroy editor
            editorRef.current.destroy();
            editorRef.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing Canvas Editor:', error);
        toast.error('Failed to initialize the advanced editor.');
        setEditorMode('classic');
      }
    }
  }, [isEditorLoaded, CanvasEditor, editorMode, currentPage, pageData, pages]);
  
  // Handle page change
  useEffect(() => {
    if (editorMode === 'canvas' && editorRef.current) {
      // Save current canvas content before changing page
      const editorContent = editorRef.current.getContent();
      
      // Update page data
      setPageData(prev => {
        const newData = [...prev];
        newData[currentPage] = {
          ...newData[currentPage],
          drawings: [editorContent] // Store canvas content
        };
        return newData;
      });
      
      // Destroy and recreate for new page
      editorRef.current.destroy();
      
      // Recreate with new page content
      if (containerRef.current) {
        editorRef.current = new CanvasEditor({
          el: containerRef.current,
          mode: 'edit',
          width: pages[currentPage].width,
          height: pages[currentPage].height,
          background: {
            image: pages[currentPage].imageUrl
          },
          footer: {
            pagination: {
              current: currentPage + 1,
              total: pages.length
            }
          }
        });
        
        // Load any existing canvas content
        if (pageData[currentPage].drawings && pageData[currentPage].drawings.length > 0 
            && pageData[currentPage].drawings[0].type === 'canvas') {
          // Load canvas content
          editorRef.current.setContent(pageData[currentPage].drawings[0]);
        }
      }
    }
  }, [currentPage, editorMode, pages]);
  
  // Classic editor event handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editorMode !== 'classic') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    let newDrawing: Drawing | null = null;
    
    switch (currentTool) {
      case 'text':
        if (textInput.trim()) {
          newDrawing = {
            type: 'text',
            text: textInput,
            fontFamily,
            fontSize,
            color,
            x,
            y
          };
          
          // Add directly to page data, don't set as current drawing
          setPageData(prev => {
            const newData = [...prev];
            newData[currentPage].drawings.push(newDrawing as Drawing);
            return newData;
          });
          
          // Update history
          setDrawingHistory(prev => {
            const newHistory = [...prev];
            newHistory[currentPage] = [...newHistory[currentPage], newDrawing as Drawing];
            return newHistory;
          });
          
          // Clear text input
          setTextInput('');
          // Don't set as current drawing
          return;
        }
        break;
        
      case 'freehand':
        newDrawing = {
          type: 'freehand',
          color,
          lineWidth,
          x,
          y,
          points: [{ x, y }]
        };
        break;
        
      case 'highlight':
        newDrawing = {
          type: 'highlight',
          color,
          lineWidth: 20,
          opacity: 0.3,
          x,
          y,
          points: [{ x, y }]
        };
        break;
        
      case 'rectangle':
        newDrawing = {
          type: 'rectangle',
          color,
          lineWidth,
          x,
          y,
          width: 0,
          height: 0
        };
        break;
        
      case 'circle':
        newDrawing = {
          type: 'circle',
          color,
          lineWidth,
          x,
          y,
          width: 0,
          height: 0
        };
        break;
        
      case 'line':
        newDrawing = {
          type: 'line',
          color,
          lineWidth,
          x,
          y,
          width: 0,
          height: 0
        };
        break;
    }
    
    setCurrentDrawing(newDrawing);
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !currentDrawing || editorMode !== 'classic') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let updatedDrawing: Drawing;
    
    switch (currentDrawing.type) {
      case 'freehand':
      case 'highlight':
        updatedDrawing = {
          ...currentDrawing,
          points: [...(currentDrawing.points || []), { x, y }]
        };
        break;
        
      case 'rectangle':
      case 'circle':
      case 'line':
        updatedDrawing = {
          ...currentDrawing,
          width: x - currentDrawing.x,
          height: y - currentDrawing.y
        };
        break;
        
      default:
        return;
    }
    
    setCurrentDrawing(updatedDrawing);
  };
  
  const handleCanvasMouseUp = () => {
    if (!isDrawing || !currentDrawing || editorMode !== 'classic') return;
    
    // Add finished drawing to page data
    setPageData(prev => {
      const newData = [...prev];
      newData[currentPage].drawings.push(currentDrawing as Drawing);
      return newData;
    });
    
    // Update history
    setDrawingHistory(prev => {
      const newHistory = [...prev];
      newHistory[currentPage] = [...newHistory[currentPage], currentDrawing as Drawing];
      return newHistory;
    });
    
    // Clear redo history
    setRedoHistory(prev => {
      const newHistory = [...prev];
      newHistory[currentPage] = [];
      return newHistory;
    });
    
    setIsDrawing(false);
    setCurrentDrawing(null);
  };
  
  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      
      if (editorMode === 'canvas' && editorRef.current) {
        // Use Canvas Editor's API to add image
        editorRef.current.insertImage(imageData);
      } else {
        // Add image to classic editor
        const newDrawing: Drawing = {
          type: 'image',
          imageData,
          x: 100, // Default position
          y: 100,
          width: 200, // Default size
          height: 200
        };
        
        setPageData(prev => {
          const newData = [...prev];
          newData[currentPage].drawings.push(newDrawing);
          return newData;
        });
        
        setDrawingHistory(prev => {
          const newHistory = [...prev];
          newHistory[currentPage] = [...newHistory[currentPage], newDrawing];
          return newHistory;
        });
      }
      
      // Reset input
      e.target.value = '';
    };
    
    reader.readAsDataURL(file);
  };
  
  // Undo/Redo handlers
  const handleUndo = () => {
    if (editorMode === 'canvas' && editorRef.current) {
      editorRef.current.undo();
      return;
    }
    
    if (drawingHistory[currentPage].length === 0) return;
    
    const newHistory = [...drawingHistory];
    const newRedoHistory = [...redoHistory];
    
    const removed = newHistory[currentPage].pop();
    if (removed) {
      newRedoHistory[currentPage].push(removed);
    }
    
    setDrawingHistory(newHistory);
    setRedoHistory(newRedoHistory);
    
    setPageData(prev => {
      const newData = [...prev];
      newData[currentPage].drawings = [...newHistory[currentPage]];
      return newData;
    });
  };
  
  const handleRedo = () => {
    if (editorMode === 'canvas' && editorRef.current) {
      editorRef.current.redo();
      return;
    }
    
    if (redoHistory[currentPage].length === 0) return;
    
    const newHistory = [...drawingHistory];
    const newRedoHistory = [...redoHistory];
    
    const restored = newRedoHistory[currentPage].pop();
    if (restored) {
      newHistory[currentPage].push(restored);
    }
    
    setDrawingHistory(newHistory);
    setRedoHistory(newRedoHistory);
    
    setPageData(prev => {
      const newData = [...prev];
      newData[currentPage].drawings = [...newHistory[currentPage]];
      return newData;
    });
  };
  
  // Clear handler
  const handleClear = () => {
    if (editorMode === 'canvas' && editorRef.current) {
      editorRef.current.clear();
      return;
    }
    
    // Store current drawings in redo history
    setRedoHistory(prev => {
      const newHistory = [...prev];
      newHistory[currentPage] = [...pageData[currentPage].drawings];
      return newHistory;
    });
    
    // Clear drawings
    setPageData(prev => {
      const newData = [...prev];
      newData[currentPage].drawings = [];
      return newData;
    });
    
    setDrawingHistory(prev => {
      const newHistory = [...prev];
      newHistory[currentPage] = [];
      return newHistory;
    });
  };
  
  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    setProgress(0);
    
    try {
      // If using canvas editor, capture final content
      if (editorMode === 'canvas' && editorRef.current) {
        const editorContent = editorRef.current.getContent();
        
        // Update current page data
        setPageData(prev => {
          const newData = [...prev];
          newData[currentPage] = {
            ...newData[currentPage],
            drawings: [editorContent] // Store canvas content
          };
          return newData;
        });
      }
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      // Call onSave callback
      if (onSave) {
        await onSave(pageData);
      }
      
      clearInterval(interval);
      setProgress(100);
      
      toast.success('PDF saved successfully!');
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save PDF. Please try again.');
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setProgress(0);
      }, 500);
    }
  };
  
  // Render drawing tools
  const renderDrawingTools = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <RadioGroup value={currentTool} onValueChange={setCurrentTool} className="flex gap-2">
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="select" id="select" className="sr-only" />
          <Label
            htmlFor="select"
            className={`p-2 cursor-pointer rounded-md ${
              currentTool === 'select' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 14a8 8 0 0 1-8 8"></path>
              <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
              <path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1"></path>
              <path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10"></path>
              <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
            </svg>
          </Label>
        </div>
        
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="text" id="text" className="sr-only" />
          <Label
            htmlFor="text"
            className={`p-2 cursor-pointer rounded-md ${
              currentTool === 'text' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Text className="h-5 w-5" />
          </Label>
        </div>
        
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="freehand" id="freehand" className="sr-only" />
          <Label
            htmlFor="freehand"
            className={`p-2 cursor-pointer rounded-md ${
              currentTool === 'freehand' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Pencil className="h-5 w-5" />
          </Label>
        </div>
        
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="highlight" id="highlight" className="sr-only" />
          <Label
            htmlFor="highlight"
            className={`p-2 cursor-pointer rounded-md ${
              currentTool === 'highlight' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Highlighter className="h-5 w-5" />
          </Label>
        </div>
        
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="rectangle" id="rectangle" className="sr-only" />
          <Label
            htmlFor="rectangle"
            className={`p-2 cursor-pointer rounded-md ${
              currentTool === 'rectangle' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Square className="h-5 w-5" />
          </Label>
        </div>
        
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="circle" id="circle" className="sr-only" />
          <Label
            htmlFor="circle"
            className={`p-2 cursor-pointer rounded-md ${
              currentTool === 'circle' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Circle className="h-5 w-5" />
          </Label>
        </div>
        
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="line" id="line" className="sr-only" />
          <Label
            htmlFor="line"
            className={`p-2 cursor-pointer rounded-md ${
              currentTool === 'line' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
            </svg>
          </Label>
        </div>
        
        {/* Upload image tool */}
        <div className="flex items-center space-x-1">
          <Label
            htmlFor="image-upload"
            className={`p-2 cursor-pointer rounded-md bg-secondary hover:bg-secondary/80`}
          >
            <ImageIcon className="h-5 w-5" />
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
  
  // Render tool properties
  const renderToolProperties = () => {
    if (currentTool === 'text') {
      return (
        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="text-input">Text</Label>
            <Input
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="font-size"
                  min={8}
                  max={72}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
                <span className="w-10 text-center">{fontSize}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="font-family">Font</Label>
              <select
                id="font-family"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>
        </div>
      );
    }
    
    if (['freehand', 'rectangle', 'circle', 'line'].includes(currentTool)) {
      return (
        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="line-width">Line Width</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="line-width"
                min={1}
                max={20}
                step={1}
                value={[lineWidth]}
                onValueChange={(value) => setLineWidth(value[0])}
              />
              <span className="w-10 text-center">{lineWidth}px</span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  // Render color picker for all tools
  const renderColorPicker = () => {
    if (['text', 'freehand', 'highlight', 'rectangle', 'circle', 'line'].includes(currentTool)) {
      return (
        <div className="mb-4">
          <Label htmlFor="color-picker">Color</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-md border"
              style={{ backgroundColor: color }}
            />
            <Input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  // Render pagination controls
  const renderPagination = () => (
    <div className="flex items-center justify-between mt-4">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
        disabled={currentPage === 0}
      >
        Previous
      </Button>
      
      <span>
        Page {currentPage + 1} of {pages.length}
      </span>
      
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
        disabled={currentPage === pages.length - 1}
      >
        Next
      </Button>
    </div>
  );
  
  // Render editor mode selector
  const renderEditorSelector = () => (
    <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as 'classic' | 'canvas')}>
      <TabsList className="mb-4">
        <TabsTrigger value="classic">Classic Editor</TabsTrigger>
        <TabsTrigger value="canvas" disabled={!isEditorLoaded}>
          {isEditorLoaded ? 'Advanced Editor' : 'Loading Advanced Editor...'}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
  
  // Render classic editor
  const renderClassicEditor = () => (
    <div>
      {renderDrawingTools()}
      
      <div className="flex flex-wrap gap-4 mb-4">
        <Button variant="outline" size="sm" onClick={handleUndo} disabled={drawingHistory[currentPage].length === 0}>
          <Undo2 className="h-4 w-4 mr-2" />
          Undo
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoHistory[currentPage].length === 0}>
          <Redo2 className="h-4 w-4 mr-2" />
          Redo
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
      
      {renderToolProperties()}
      {renderColorPicker()}
      
      <div 
        className="border rounded-md overflow-hidden relative"
        style={{ 
          width: '100%', 
          height: '500px',
          maxWidth: '100%',
          backgroundImage: `url(${pages[currentPage].imageUrl})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Render existing drawings */}
        {pageData[currentPage].drawings.map((drawing, index) => {
          switch (drawing.type) {
            case 'text':
              return (
                <div 
                  key={index}
                  style={{
                    position: 'absolute',
                    left: drawing.x,
                    top: drawing.y,
                    color: drawing.color,
                    fontFamily: drawing.fontFamily,
                    fontSize: `${drawing.fontSize}px`,
                    pointerEvents: 'none'
                  }}
                >
                  {drawing.text}
                </div>
              );
              
            case 'image':
              return (
                <img
                  key={index}
                  src={drawing.imageData}
                  alt="User uploaded"
                  style={{
                    position: 'absolute',
                    left: drawing.x,
                    top: drawing.y,
                    width: drawing.width,
                    height: drawing.height,
                    pointerEvents: 'none'
                  }}
                />
              );
              
            case 'f