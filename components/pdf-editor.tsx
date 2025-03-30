"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Upload, 
  Download, 
  Check, 
  AlertCircle, 
  FileText,
  Pencil,
  Save,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Trash,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus
} from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { toast } from "sonner";
import Editor from '@hufe921/canvas-editor';

interface PageData {
  imageUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export function PdfEditor() {
  const { t } = useLanguageStore();
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  
  // Editor state
  const [currentPage, setCurrentPage] = useState(0);
  const [drawings, setDrawings] = useState<any[][]>([]); // Array of drawings per page
  const [editorMode, setEditorMode] = useState<'text' | 'draw' | 'shape'>('text');
  const [editorTool, setEditorTool] = useState<string>('text');
  const [textColor, setTextColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Editor refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  
  // Result state
  const [editResult, setEditResult] = useState<{
    success: boolean;
    fileUrl?: string;
    message?: string;
  } | null>(null);

  // Initialize editor when page changes
  useEffect(() => {
    if (pages.length > 0 && editorContainerRef.current) {
      // Clean up previous editor instance
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
      }
      
      // Get current page data
      const pageData = pages[currentPage];
      
      // Calculate editor dimensions
      const containerWidth = editorContainerRef.current.clientWidth;
      const scale = Math.min(1, containerWidth / pageData.width);
      const scaledWidth = Math.floor(pageData.width * scale);
      const scaledHeight = Math.floor(pageData.height * scale);
      
      // Initialize editor
      editorContainerRef.current.style.width = `${scaledWidth}px`;
      editorContainerRef.current.style.height = `${scaledHeight}px`;
      
      // Initialize canvas editor
      const editorOptions = {
        el: editorContainerRef.current,
        mode: 'edit',
        defaultType: 'canvas',
        width: scaledWidth,
        height: scaledHeight,
        toolbars: [
          'undo',
          'redo',
          'font',
          'fontSize',
          'bold',
          'italic',
          'underline',
          'color',
          'highlight',
          'image'
        ],
        background: {
          color: '#FFFFFF',
          image: pageData.imageUrl
        }
      };
      
      editorInstanceRef.current = new Editor(editorOptions);
      
      // Load existing drawings for this page if any
      if (drawings[currentPage] && drawings[currentPage].length > 0) {
        // Apply drawings to editor (implementation would depend on your drawing structure)
      }
    }
    
    // Cleanup function
    return () => {
      if (editorInstanceRef.current) {
        // Save current page drawings before destroying
        saveCurrentPageDrawings();
        
        // Destroy editor instance
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [currentPage, pages]);

  // Save current page drawings
  const saveCurrentPageDrawings = () => {
    if (editorInstanceRef.current && currentPage < pageCount) {
      // Get editor content
      const editorContent = editorInstanceRef.current.getValue();
      
      // Update drawings state
      const newDrawings = [...drawings];
      newDrawings[currentPage] = editorContent;
      setDrawings(newDrawings);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error(t('pdfEditor.invalidFileType') || "Invalid file type", {
          description: t('pdfEditor.selectPdfFile') || "Please select a PDF file"
        });
        return;
      }
      
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error(t('pdfEditor.fileTooLarge') || "File too large", {
          description: t('pdfEditor.maxFileSize') || "Maximum file size is 100MB"
        });
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setEditResult(null);
      
      // Upload and process the file
      uploadAndProcessFile(selectedFile);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
        setError(null);
        setEditResult(null);
        
        // Upload and process the file
        uploadAndProcessFile(droppedFile);
      } else {
        toast.error(t('pdfEditor.invalidFileType') || "Invalid file type", {
          description: t('pdfEditor.selectPdfFile') || "Please select a PDF file"
        });
      }
    }
  };

  // Upload and process PDF file
  const uploadAndProcessFile = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress (in reality this would come from upload progress events)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
      
      // Send request to API
      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }
      
      const data = await response.json();
      
      // Set session ID and pages data
      setSessionId(data.sessionId);
      setPages(data.pages);
      setPageCount(data.pageCount);
      
      // Initialize drawings array for all pages
      setDrawings(new Array(data.pageCount).fill([]));
      
      // Set to first page
      setCurrentPage(0);
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error(t('pdfEditor.processingError') || "Error processing PDF", {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setIsUploading(false);
    }
  };

  // Save edited PDF
  const saveEditedPdf = async () => {
    try {
      // Save the current page before proceeding
      saveCurrentPageDrawings();
      
      setIsProcessing(true);
      setProgress(0);
      
      // Prepare data to send
      const pdfData = {
        pdfName: file?.name || 'edited.pdf',
        pages: pages.map((page, index) => ({
          ...page,
          drawings: drawings[index] || []
        }))
      };
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Send request to API
      const response = await fetch('/api/pdf/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pdfData)
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save edited PDF');
      }
      
      const data = await response.json();
      
      // Set result
      setEditResult({
        success: data.success,
        fileUrl: data.fileUrl,
        message: data.message
      });
      
      toast.success(t('pdfEditor.saveSuccess') || "PDF saved successfully", {
        description: t('pdfEditor.downloadReady') || "Your edited PDF is ready for download"
      });
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Error saving edited PDF:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error(t('pdfEditor.saveError') || "Error saving PDF", {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      setIsProcessing(false);
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

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      saveCurrentPageDrawings();
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < pageCount - 1) {
      saveCurrentPageDrawings();
      setCurrentPage(currentPage + 1);
    }
  };

  // Change editor mode
  const changeEditorMode = (mode: 'text' | 'draw' | 'shape') => {
    setEditorMode(mode);
    
    // Update editor configuration based on mode
    if (editorInstanceRef.current) {
      // Implementation would depend on Canvas Editor's API
    }
  };

  // Change drawing tool
  const changeDrawingTool = (tool: string) => {
    setEditorTool(tool);
    
    // Update editor configuration based on tool
    if (editorInstanceRef.current) {
      // Implementation would depend on Canvas Editor's API
    }
  };

  // Render upload area
  const renderUploadArea = () => (
    <div 
      className="border-2 border-dashed rounded-lg p-8 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Pencil className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {t('pdfEditor.uploadTitle') || "Upload PDF for Editing"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t('pdfEditor.uploadDesc') || "Drag and drop your PDF file here, or click to browse"}
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
            {t('pdfEditor.uploading') || "Uploading..."}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {t('pdfEditor.selectPdf') || "Select PDF File"}
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        {t('pdfEditor.maxSize') || "Maximum file size: 100MB"}
      </p>
    </div>
  );

  // Render PDF editor
  const renderPdfEditor = () => (
    <div className="space-y-4">
      {/* File info and navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{file?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(file?.size || 0)} • {t('pdfEditor.pageCount') || "Page"}: {currentPage + 1}/{pageCount}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === pageCount - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Editor toolbar */}
      <div className="border rounded-lg p-2 bg-muted/20">
        <Tabs defaultValue="text" onValueChange={(value) => changeEditorMode(value as any)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="text">
              <Type className="h-4 w-4 mr-2" />
              {t('pdfEditor.text') || "Text"}
            </TabsTrigger>
            <TabsTrigger value="draw">
              <Pencil className="h-4 w-4 mr-2" />
              {t('pdfEditor.draw') || "Draw"}
            </TabsTrigger>
            <TabsTrigger value="shape">
              <Square className="h-4 w-4 mr-2" />
              {t('pdfEditor.shape') || "Shape"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-2">
            <div className="flex flex-wrap gap-2">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10"
                title={t('pdfEditor.textColor') || "Text Color"}
              />
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-20 h-10"
                min={8}
                max={72}
                title={t('pdfEditor.fontSize') || "Font Size"}
              />
              <Button variant="outline" size="sm" onClick={() => changeDrawingTool('text')}>
                <Type className="h-4 w-4 mr-2" />
                {t('pdfEditor.addText') || "Add Text"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="draw" className="mt-2">
            <div className="flex flex-wrap gap-2">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10"
                title={t('pdfEditor.drawColor') || "Draw Color"}
              />
              <Input
                type="range"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-32 h-10"
                min={1}
                max={10}
                title={t('pdfEditor.lineWidth') || "Line Width"}
              />
              <Button variant="outline" size="sm" onClick={() => changeDrawingTool('freehand')}>
                <Pencil className="h-4 w-4 mr-2" />
                {t('pdfEditor.freehand') || "Freehand"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => changeDrawingTool('highlight')}>
                <Pencil className="h-4 w-4 mr-2" />
                {t('pdfEditor.highlight') || "Highlight"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="shape" className="mt-2">
            <div className="flex flex-wrap gap-2">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10"
                title={t('pdfEditor.shapeColor') || "Shape Color"}
              />
              <Input
                type="range"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-32 h-10"
                min={1}
                max={10}
                title={t('pdfEditor.lineWidth') || "Line Width"}
              />
              <Button variant="outline" size="sm" onClick={() => changeDrawingTool('rectangle')}>
                <Square className="h-4 w-4 mr-2" />
                {t('pdfEditor.rectangle') || "Rectangle"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => changeDrawingTool('circle')}>
                <Circle className="h-4 w-4 mr-2" />
                {t('pdfEditor.circle') || "Circle"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => changeDrawingTool('line')}>
                <Minus className="h-4 w-4 mr-2" />
                {t('pdfEditor.line') || "Line"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Editor container */}
      <div className="flex justify-center">
        <div 
          ref={editorContainerRef}
          className="border shadow-sm bg-white"
        ></div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setFile(null);
            setPages([]);
            setSessionId(null);
            setEditResult(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          <Trash className="h-4 w-4 mr-2" />
          {t('pdfEditor.cancel') || "Cancel"}
        </Button>
        <Button
          onClick={saveEditedPdf}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('pdfEditor.saving') || "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t('pdfEditor.savePdf') || "Save PDF"}
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Render processing state
  const renderProcessingState = () => (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isUploading ? 
            (t('pdfEditor.processingPdf') || "Processing PDF...") : 
            (t('pdfEditor.savingChanges') || "Saving changes...")
          }
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('pdfEditor.pleaseWait') || "Please wait while we process your document"}
        </p>
      </div>
      
      <div className="space-y-1">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-right text-muted-foreground">{progress}%</p>
      </div>
    </div>
  );

  // Render result state
  const renderEditResult = () => {
    if (!editResult) return null;
    
    return (
      <div className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              {t('pdfEditor.editSuccess') || "PDF edited successfully"}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-4 mt-6">
          {editResult.fileUrl && (
            <Button className="flex-1" asChild>
              <a href={editResult.fileUrl} download>
                <Download className="h-4 w-4 mr-2" />
                {t('pdfEditor.download') || "Download PDF"}
              </a>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              setFile(null);
              setPages([]);
              setSessionId(null);
              setEditResult(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            {t('pdfEditor.editAnother') || "Edit Another PDF"}
          </Button>
        </div>
      </div>
    );
  };

  // Main render
  if (isUploading || isProcessing) {
    return renderProcessingState();
  } else if (editResult) {
    return renderEditResult();
  } else if (pages.length > 0 && sessionId) {
    return renderPdfEditor();
  } else {
    return renderUploadArea();
  }
}