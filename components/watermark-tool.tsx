"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Upload, 
  Download, 
  Check, 
  RefreshCw, 
  Image as ImageIcon, 
  AlertCircle, 
  StampIcon,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WatermarkToolProps {
  type: "text" | "image";
}

export function WatermarkTool({ type }: WatermarkToolProps) {
  const { t } = useLanguageStore();
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [imageWatermark, setImageWatermark] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  
  // Text watermark options
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [textColor, setTextColor] = useState<string>("#FF0000"); // Red
  const [fontSize, setFontSize] = useState<number>(48);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [textOpacity, setTextOpacity] = useState<number>(30); // 30%
  const [rotation, setRotation] = useState<number>(45); // 45 degrees
  
  // Image watermark options
  const [imageOpacity, setImageOpacity] = useState<number>(30); // 30%
  const [imageScale, setImageScale] = useState<number>(50); // 50%
  const [imageRotation, setImageRotation] = useState<number>(0); // 0 degrees
  
  // Common options
  const [position, setPosition] = useState<string>("center"); // center, tile, custom
  const [pages, setPages] = useState<string>("all"); // all, even, odd, custom
  const [customPages, setCustomPages] = useState<string>(""); // e.g., "1,3,5-10"
  
  // Progress state
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // View mode (edit or preview)
  const [activeTab, setActiveTab] = useState<string>("edit");
  
  // PDF preview state
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Result state
  const [result, setResult] = useState<{
    success: boolean;
    fileUrl?: string;
    filename?: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Handle PDF file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error(t('watermarkPdf.invalidFileType') || "Invalid file type", {
          description: t('watermarkPdf.selectPdfFile') || "Please select a PDF file"
        });
        return;
      }
      
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(t('watermarkPdf.fileTooLarge') || "File too large", {
          description: t('watermarkPdf.maxFileSize') || "Maximum file size is 50MB"
        });
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setResult(null);
      
      // Create PDF preview URL
      const fileUrl = URL.createObjectURL(selectedFile);
      setPdfPreviewUrl(fileUrl);
      
      // Reset to first page
      setCurrentPage(1);
    }
  };
  
  // Handle image watermark selection
  const handleImageWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error(t('watermarkPdf.invalidImageType') || "Invalid image type", {
          description: t('watermarkPdf.supportedFormats') || "Supported formats: PNG, JPG, SVG"
        });
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('watermarkPdf.imageTooLarge') || "Image too large", {
          description: t('watermarkPdf.maxImageSize') || "Maximum image size is 5MB"
        });
        return;
      }
      
      // Create image preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      setImageWatermark(selectedFile);
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
  
  // Update PDF preview with watermark
  useEffect(() => {
    if (!pdfPreviewUrl || !canvasRef.current || !file) return;
    
    const renderPreview = async () => {
        try {
          setPreviewLoading(true);
          
          // Dynamically import PDF.js only when needed
          const pdfjs = await import('pdfjs-dist');
          
          // Set worker path (note: this needs adjustment, see below)
          pdfjs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.mjs';
          
          // Load PDF document
          const loadingTask = pdfjs.getDocument(pdfPreviewUrl);
          const pdf = await loadingTask.promise;
          
          // Update total pages
          setTotalPages(pdf.numPages);
          
          // Get page
          const page = await pdf.getPage(currentPage);
          
          // Prepare canvas
          const canvas = canvasRef.current;
          if (!canvas) {
            throw new Error("Canvas element not available");
          }
          
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error("Canvas context not available");
          }
          
          // Calculate scale based on viewport
          const viewport = page.getViewport({ scale: zoom });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          // Render PDF page
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          // Add watermark
          renderWatermark(context, viewport);
          
        } catch (error) {
          console.error("Error rendering PDF preview:", error);
        } finally {
          setPreviewLoading(false);
        }
      };
    
    renderPreview();
  }, [
    pdfPreviewUrl, 
    currentPage, 
    zoom, 
    watermarkText, 
    textColor, 
    fontSize, 
    fontFamily, 
    textOpacity, 
    rotation,
    imagePreviewUrl,
    imageOpacity,
    imageScale,
    imageRotation,
    position,
    pages,
    customPages,
    type
  ]);
  
  // Render watermark on canvas
  const renderWatermark = (context: CanvasRenderingContext2D, viewport: any) => {
    // First check if this page should have watermark based on pages option
    if (!shouldRenderWatermarkOnPage(currentPage)) {
      return;
    }
    
    // Get canvas dimensions
    const width = viewport.width;
    const height = viewport.height;
    
    // Calculate positions based on selection
    let x = width / 2;
    let y = height / 2;
    
    switch (position) {
      case 'top-left':
        x = width * 0.1;
        y = height * 0.1;
        break;
      case 'top-center':
        x = width / 2;
        y = height * 0.1;
        break;
      case 'top-right':
        x = width * 0.9;
        y = height * 0.1;
        break;
      case 'center-left':
        x = width * 0.1;
        y = height / 2;
        break;
      case 'center':
        // default values already set
        break;
      case 'center-right':
        x = width * 0.9;
        y = height / 2;
        break;
      case 'bottom-left':
        x = width * 0.1;
        y = height * 0.9;
        break;
      case 'bottom-center':
        x = width / 2;
        y = height * 0.9;
        break;
      case 'bottom-right':
        x = width * 0.9;
        y = height * 0.9;
        break;
      case 'tile':
        renderTiledWatermark(context, width, height);
        return;
    }
    
    // Save context state
    context.save();
    
    // Apply transparency
    const opacity = type === 'text' ? textOpacity / 100 : imageOpacity / 100;
    context.globalAlpha = opacity;
    
    // Apply watermark based on type
    if (type === 'text') {
      renderTextWatermark(context, x, y);
    } else if (type === 'image' && imagePreviewUrl) {
      renderImageWatermark(context, x, y);
    }
    
    // Restore context state
    context.restore();
  };
  
  // Render text watermark
  const renderTextWatermark = (context: CanvasRenderingContext2D, x: number, y: number) => {
    // Set text properties
    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = textColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Apply rotation
    context.translate(x, y);
    context.rotate(rotation * Math.PI / 180);
    
    // Draw text
    context.fillText(watermarkText, 0, 0);
  };
  
  // Render image watermark
  const renderImageWatermark = (context: CanvasRenderingContext2D, x: number, y: number) => {
    if (!imagePreviewUrl) return;
    
    // Create image element
    const img = new Image();
    img.src = imagePreviewUrl;
    
    // Only draw when image is loaded
    img.onload = () => {
      // Apply rotation
      context.translate(x, y);
      context.rotate(imageRotation * Math.PI / 180);
      
      // Calculate dimensions based on scale
      const width = img.width * (imageScale / 100);
      const height = img.height * (imageScale / 100);
      
      // Draw centered image
      context.drawImage(img, -width / 2, -height / 2, width, height);
    };
  };
  
  // Render tiled watermark
  const renderTiledWatermark = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    // Calculate grid size
    const gridSizeX = canvasWidth / 3;
    const gridSizeY = canvasHeight / 3;
    
    // Draw watermark in grid pattern
    for (let x = gridSizeX / 2; x < canvasWidth; x += gridSizeX) {
      for (let y = gridSizeY / 2; y < canvasHeight; y += gridSizeY) {
        context.save();
        
        if (type === 'text') {
          renderTextWatermark(context, x, y);
        } else if (type === 'image' && imagePreviewUrl) {
          renderImageWatermark(context, x, y);
        }
        
        context.restore();
      }
    }
  };
  
  // Check if watermark should be rendered on current page
  const shouldRenderWatermarkOnPage = (pageNum: number): boolean => {
    switch (pages) {
      case 'all':
        return true;
      case 'even':
        return pageNum % 2 === 0;
      case 'odd':
        return pageNum % 2 === 1;
      case 'custom':
        if (!customPages) return false;
        
        const pageRanges = customPages.split(',').map(range => range.trim());
        
        for (const range of pageRanges) {
          if (range.includes('-')) {
            // Handle page range (e.g., "1-5")
            const [start, end] = range.split('-').map(Number);
            if (pageNum >= start && pageNum <= end) {
              return true;
            }
          } else {
            // Handle single page
            if (Number(range) === pageNum) {
              return true;
            }
          }
        }
        
        return false;
      default:
        return true;
    }
  };
  
  // Page navigation handlers
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
  
  // Handle watermarking submission
  const handleSubmit = async () => {
    if (!file) {
      toast.error(t('watermarkPdf.noFileSelected') || "No file selected", {
        description: t('watermarkPdf.selectPdfFile') || "Please select a PDF file to watermark"
      });
      return;
    }
    
    if (type === "image" && !imageWatermark) {
      toast.error(t('watermarkPdf.noImageSelected') || "No watermark image selected", {
        description: t('watermarkPdf.selectWatermarkImage') || "Please select an image to use as watermark"
      });
      return;
    }
    
    if (type === "text" && !watermarkText.trim()) {
      toast.error(t('watermarkPdf.noTextEntered') || "No watermark text entered", {
        description: t('watermarkPdf.enterWatermarkText') || "Please enter text to use as watermark"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('watermarkType', type);
      
      if (type === "text") {
        formData.append('text', watermarkText);
        formData.append('textColor', textColor);
        formData.append('fontSize', fontSize.toString());
        formData.append('fontFamily', fontFamily);
        formData.append('opacity', textOpacity.toString());
        formData.append('rotation', rotation.toString());
      } else {
        if (imageWatermark) {
          formData.append('watermarkImage', imageWatermark);
        }
        formData.append('opacity', imageOpacity.toString());
        formData.append('scale', imageScale.toString());
        formData.append('rotation', imageRotation.toString());
      }
      
      formData.append('position', position);
      formData.append('pages', pages);
      if (pages === "custom") {
        formData.append('customPages', customPages);
      }
      
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
      
      // Send request to API
      const response = await fetch('/api/pdf/watermark', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add watermark');
      }
      
      const data = await response.json();
      
      // Set result
      setResult({
        success: data.success,
        fileUrl: data.fileUrl,
        filename: data.filename
      });
      
      toast.success(t('watermarkPdf.success') || "Watermark added successfully", {
        description: t('watermarkPdf.successDesc') || "Your PDF has been watermarked and is ready for download"
      });
    } catch (error) {
      console.error('Error adding watermark:', error);
      setError(error instanceof Error ? error.message : t('watermarkPdf.unknownError') || "An unknown error occurred");
      toast.error(t('watermarkPdf.failed') || "Failed to add watermark", {
        description: error instanceof Error ? error.message : t('watermarkPdf.unknownErrorDesc') || "An unknown error occurred. Please try again"
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };
  
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
        setResult(null);
        
        // Create PDF preview URL
        const fileUrl = URL.createObjectURL(droppedFile);
        setPdfPreviewUrl(fileUrl);
        
        // Reset to first page
        setCurrentPage(1);
      } else {
        toast.error(t('watermarkPdf.invalidFileType') || "Invalid file type", {
          description: t('watermarkPdf.selectPdfFile') || "Please select a PDF file"
        });
      }
    }
  };
  
  // Render upload area for PDF file
  const renderUploadArea = () => (
    <div 
      className="border-2 border-dashed rounded-lg p-8 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <StampIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {t('watermarkPdf.uploadTitle') || "Upload PDF to Watermark"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t('watermarkPdf.uploadDesc') || "Drag and drop your PDF file here, or click to browse"}
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
            {t('watermarkPdf.uploading') || "Uploading..."}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {t('watermarkPdf.selectPdf') || "Select PDF File"}
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        {t('watermarkPdf.maxSize') || "Maximum file size: 50MB"}
      </p>
    </div>
  );
  
  // Render PDF preview
  const renderPdfPreview = () => (
    <div className="space-y-4">
      {previewLoading ? (
        <div className="border rounded-lg p-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-center overflow-auto bg-muted/20 rounded-lg h-[400px]">
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        {/* Page navigation */}
        <div className="flex gap-2">
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
        
        {/* Zoom controls */}
        <div className="flex gap-2">
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
    </div>
  );
  
  // Render watermark options section
  const renderWatermarkOptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{file?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(file?.size || 0)}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setFile(null);
            setResult(null);
            setPdfPreviewUrl(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          {t('watermarkPdf.change') || "Change File"}
        </Button>
      </div>
      
      {/* Tabs for edit/preview */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="edit">
            <StampIcon className="h-4 w-4 mr-2" />
            {t('watermarkPdf.editTab') || "Edit Watermark"}
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            {t('watermarkPdf.previewTab') || "Live Preview"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-6">
          {type === "text" ? renderTextWatermarkOptions() : renderImageWatermarkOptions()}
          
          {/* Common options for both watermark types */}
          <div className="space-y-3 pt-3 border-t">
            <h3 className="font-medium text-sm">{t('watermarkPdf.commonOptions') || "Watermark Settings"}</h3>
            
            <div className="space-y-2">
              <Label className="text-sm">{t('watermarkPdf.position') || "Position"}</Label>
              <RadioGroup 
                value={position} 
                onValueChange={setPosition}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="center" />
                  <Label htmlFor="center">{t('watermarkPdf.center') || "Center"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tile" id="tile" />
                  <Label htmlFor="tile">{t('watermarkPdf.tile') || "Tile"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top-left" id="top-left" />
                  <Label htmlFor="top-left">{t('watermarkPdf.topLeft') || "Top Left"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top-center" id="top-center" />
                  <Label htmlFor="top-center">{t('watermarkPdf.topCenter') || "Top Center"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top-right" id="top-right" />
                  <Label htmlFor="top-right">{t('watermarkPdf.topRight') || "Top Right"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-left" id="bottom-left" />
                  <Label htmlFor="bottom-left">{t('watermarkPdf.bottomLeft') || "Bottom Left"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-center" id="bottom-center" />
                  <Label htmlFor="bottom-center">{t('watermarkPdf.bottomCenter') || "Bottom Center"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-right" id="bottom-right" />
                  <Label htmlFor="bottom-right">{t('watermarkPdf.bottomRight') || "Bottom Right"}</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">{t('watermarkPdf.applyToPages') || "Apply to Pages"}</Label>
              <RadioGroup 
                value={pages} 
                onValueChange={setPages}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-pages" />
                  <Label htmlFor="all-pages">{t('watermarkPdf.all') || "All Pages"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="even" id="even-pages" />
                  <Label htmlFor="even-pages">{t('watermarkPdf.even') || "Even Pages"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="odd" id="odd-pages" />
                  <Label htmlFor="odd-pages">{t('watermarkPdf.odd') || "Odd Pages"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom-pages" />
                  <Label htmlFor="custom-pages">{t('watermarkPdf.customPages') || "Custom Pages"}</Label>
                </div>
              </RadioGroup>
              
              {pages === "custom" && (
  <div className="pt-2">
    <Input 
      placeholder="e.g., 1,3,5-10" 
      value={customPages}
      onChange={(e) => setCustomPages(e.target.value)}
    />
    <p className="text-xs text-muted-foreground mt-1">
      {t('watermarkPdf.pagesFormat') || "Enter page numbers separated by commas or ranges with hyphens (e.g., 1,3,5-10)"}
    </p>
  </div>
)}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="preview" className="space-y-6">
        {pdfPreviewUrl ? renderPdfPreview() : (
          <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">{t('watermarkPdf.previewNotAvailable') || "Preview not available"}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
    
    <Button 
      onClick={handleSubmit} 
      className="w-full"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {t('watermarkPdf.processing') || "Processing..."}
        </>
      ) : (
        <>
          <StampIcon className="h-4 w-4 mr-2" />
          {t('watermarkPdf.addWatermark') || "Add Watermark"}
        </>
      )}
    </Button>
  </div>
  );
  
  // Render text watermark options
  const renderTextWatermarkOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="watermark-text">{t('watermarkPdf.text.text') || "Watermark Text"}</Label>
        <Textarea 
          id="watermark-text"
          placeholder={t('watermarkPdf.text.placeholder') || "e.g., CONFIDENTIAL, DRAFT, etc."}
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="text-color">{t('watermarkPdf.text.color') || "Text Color"}</Label>
          <div className="flex gap-2">
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: textColor }}
            />
            <Input 
              id="text-color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font-family">{t('watermarkPdf.text.font') || "Font"}</Label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger id="font-family">
              <SelectValue placeholder={t('watermarkPdf.text.selectFont') || "Select Font"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="font-size">{t('watermarkPdf.text.size') || "Font Size"}</Label>
          <span className="text-sm text-muted-foreground">{fontSize}px</span>
        </div>
        <Slider 
          id="font-size"
          min={12}
          max={120}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="text-opacity">{t('watermarkPdf.text.opacity') || "Opacity"}</Label>
            <span className="text-sm text-muted-foreground">{textOpacity}%</span>
          </div>
          <Slider 
            id="text-opacity"
            min={5}
            max={100}
            step={5}
            value={[textOpacity]}
            onValueChange={(value) => setTextOpacity(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="rotation">{t('watermarkPdf.text.rotation') || "Rotation"}</Label>
            <span className="text-sm text-muted-foreground">{rotation}°</span>
          </div>
          <Slider 
            id="rotation"
            min={0}
            max={360}
            step={15}
            value={[rotation]}
            onValueChange={(value) => setRotation(value[0])}
          />
        </div>
      </div>
      
      <div className="p-4 border rounded-md bg-muted/20">
        <p className="text-sm font-medium mb-2">{t('watermarkPdf.text.preview') || "Preview"}</p>
        <div 
          className="p-6 border rounded bg-white flex items-center justify-center overflow-hidden"
          style={{ minHeight: "120px" }}
        >
          <div 
            style={{ 
              transform: `rotate(${rotation}deg)`,
              color: textColor,
              fontFamily,
              fontSize: `${fontSize}px`,
              opacity: textOpacity / 100
            }}
            className="whitespace-pre-wrap text-center"
          >
            {watermarkText}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render image watermark options
  const renderImageWatermarkOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('watermarkPdf.image.title') || "Watermark Image"}</Label>
        
        {!imageWatermark ? (
          <div 
            className="border-2 border-dashed rounded-lg p-6 text-center"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              {t('watermarkPdf.image.upload') || "Upload an image to use as watermark"}
            </p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleImageWatermarkChange}
              ref={imageInputRef}
              className="hidden"
            />
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              {t('watermarkPdf.image.select') || "Select Image"}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              {t('watermarkPdf.image.formats') || "Supported formats: PNG, JPEG, SVG"}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-sm">{imageWatermark.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(imageWatermark.size)}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setImageWatermark(null);
                  setImagePreviewUrl("");
                  if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                  }
                }}
              >
                {t('watermarkPdf.image.change') || "Change Image"}
              </Button>
            </div>
            
            <div className="mb-3 p-3 border rounded bg-muted/20 flex items-center justify-center">
              {imagePreviewUrl && (
                <img 
                  src={imagePreviewUrl} 
                  alt="Watermark preview" 
                  className="max-h-40 object-contain"
                  style={{
                    transform: `rotate(${imageRotation}deg) scale(${imageScale / 100})`,
                    opacity: imageOpacity / 100
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
      
      {imageWatermark && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="image-scale">{t('watermarkPdf.image.scale') || "Scale"}</Label>
              <span className="text-sm text-muted-foreground">{imageScale}%</span>
            </div>
            <Slider 
              id="image-scale"
              min={10}
              max={100}
              step={5}
              value={[imageScale]}
              onValueChange={(value) => setImageScale(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="image-opacity">{t('watermarkPdf.image.opacity') || "Opacity"}</Label>
                <span className="text-sm text-muted-foreground">{imageOpacity}%</span>
              </div>
              <Slider 
                id="image-opacity"
                min={5}
                max={100}
                step={5}
                value={[imageOpacity]}
                onValueChange={(value) => setImageOpacity(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="image-rotation">{t('watermarkPdf.image.rotation') || "Rotation"}</Label>
                <span className="text-sm text-muted-foreground">{imageRotation}°</span>
              </div>
              <Slider 
                id="image-rotation"
                min={0}
                max={360}
                step={15}
                value={[imageRotation]}
                onValueChange={(value) => setImageRotation(value[0])}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  // Render processing state
  const renderProcessingState = () => (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {t('watermarkPdf.adding') || "Adding Watermark"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('watermarkPdf.pleaseWait') || "Please wait while we process your document"}
        </p>
      </div>
      
      <div className="space-y-1">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-right text-muted-foreground">{progress}%</p>
      </div>
    </div>
  );
  
  // Render result state
  const renderResult = () => {
    if (!result) return null;
    
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
              {t('watermarkPdf.success') || "Watermark added successfully"}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-4 mt-6">
          {result.fileUrl && (
            <Button className="flex-1" asChild>
              <a href={result.fileUrl} download={result.filename}>
                <Download className="h-4 w-4 mr-2" />
                {t('watermarkPdf.download') || "Download PDF"}
              </a>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              setFile(null);
              setResult(null);
              setPdfPreviewUrl(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('watermarkPdf.newWatermark') || "Add Another Watermark"}
          </Button>
        </div>
      </div>
    );
  };
  
  // Main render
  if (isProcessing) {
    return renderProcessingState();
  } else if (result) {
    return renderResult();
  } else if (file) {
    return renderWatermarkOptions();
  } else {
    return renderUploadArea();
  }
}