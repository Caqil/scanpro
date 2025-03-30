"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Upload, 
  Download, 
  Check, 
  RefreshCw, 
  Image as ImageIcon, 
  AlertCircle, 
  FileText,
  StampIcon
} from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { toast } from "sonner";

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
  
  // Result state
  const [result, setResult] = useState<{
    success: boolean;
    fileUrl?: string;
    filename?: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Handle PDF file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    }
  };
  
  // Handle image watermark selection
  const handleImageWatermarkChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          {t('watermarkPdf.change') || "Change File"}
        </Button>
      </div>
      
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
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">{t('watermarkPdf.custom') || "Custom"}</Label>
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