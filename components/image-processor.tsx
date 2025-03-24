"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
  ReloadIcon
} from "@radix-ui/react-icons";
import { AlertCircle, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/src/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageProcessorProps {
  title: string;
  description: string;
  processEndpoint: string;
  fileTypes?: string[];
  processOptions?: Record<string, any>;
  renderOptions?: React.ReactNode;
  onImageLoaded?: (file: File) => void;
  previewRenderer?: (file: File, options: Record<string, any>) => Promise<string>;
}

export function ImageProcessor({ 
  title, 
  description, 
  processEndpoint,
  fileTypes = ["image/png"],
  processOptions = {},
  renderOptions,
  onImageLoaded,
  previewRenderer
}: ImageProcessorProps) {
  const { t } = useLanguageStore();
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedFilename, setProcessedFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"original" | "preview">("original");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const optionsRef = useRef<string>(JSON.stringify(processOptions));
  const filePreviewUrlRef = useRef<string | null>(null); // Track URL for cleanup

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 
      'image/*': fileTypes.map(type => `.${type.split('/')[1] || type}`)
    },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        setError(rejection.file.size > 50 * 1024 * 1024 
          ? 'File size is too large. Maximum size is 50MB.'
          : 'Please upload a valid image file.');
        return;
      }
      
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0];
        // Revoke previous URL if it exists
        if (filePreviewUrlRef.current?.startsWith('blob:')) {
          console.log("Revoking previous filePreviewUrl:", filePreviewUrlRef.current);
          URL.revokeObjectURL(filePreviewUrlRef.current);
        }
        const previewUrl = URL.createObjectURL(newFile);
        filePreviewUrlRef.current = previewUrl;
        setFile(newFile);
        setFilePreviewUrl(previewUrl);
        console.log("Set new filePreviewUrl:", previewUrl); // Debug log
        setProcessedPreviewUrl(null);
        setProcessedImageUrl(null);
        setProcessedFilename(null);
        setError(null);
        setActiveTab("original");
        optionsRef.current = JSON.stringify(processOptions);
        onImageLoaded?.(newFile);
        generatePreview();
      }
    },
  });

  // Cleanup URLs only on component unmount or explicit reset
  useEffect(() => {
    // Cleanup function runs only when component unmounts
    return () => {
      if (filePreviewUrlRef.current?.startsWith('blob:')) {
        console.log("Revoking filePreviewUrl on unmount:", filePreviewUrlRef.current);
        URL.revokeObjectURL(filePreviewUrlRef.current);
        filePreviewUrlRef.current = null;
      }
      if (processedPreviewUrl?.startsWith('blob:')) {
        console.log("Revoking processedPreviewUrl on unmount:", processedPreviewUrl);
        URL.revokeObjectURL(processedPreviewUrl);
      }
    };
  }, []); // Empty dependency array to run cleanup only on unmount

  // Watch for option changes
  useEffect(() => {
    if (!file) return;

    const currentOptions = JSON.stringify(processOptions);
    if (optionsRef.current !== currentOptions) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        optionsRef.current = currentOptions;
        generatePreview();
      }, 500);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [processOptions, file]);

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleRemoveFile = () => {
    if (filePreviewUrlRef.current?.startsWith('blob:')) {
      console.log("Revoking filePreviewUrl on remove:", filePreviewUrlRef.current);
      URL.revokeObjectURL(filePreviewUrlRef.current);
      filePreviewUrlRef.current = null;
    }
    if (processedPreviewUrl?.startsWith('blob:')) {
      console.log("Revoking processedPreviewUrl on remove:", processedPreviewUrl);
      URL.revokeObjectURL(processedPreviewUrl);
    }
    setFile(null);
    setFilePreviewUrl(null);
    setProcessedPreviewUrl(null);
    setProcessedImageUrl(null);
    setProcessedFilename(null);
    setError(null);
    setActiveTab("original");
  };

  const defaultPreviewRenderer = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

  const generatePreview = async () => {
    if (!file) return;

    setIsGeneratingPreview(true);
    setError(null);

    try {
      const renderer = previewRenderer || defaultPreviewRenderer;
      const oldUrl = processedPreviewUrl;
      const newPreviewUrl = await renderer(file, processOptions);
      if (oldUrl?.startsWith('blob:')) {
        console.log("Revoking old processedPreviewUrl:", oldUrl);
        URL.revokeObjectURL(oldUrl);
      }
      setProcessedPreviewUrl(newPreviewUrl);
      setActiveTab("preview");
    } catch (err) {
      console.error("Preview generation error:", err);
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
      toast.error('Preview failed', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const processImage = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    Object.entries(processOptions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? (clearInterval(progressInterval), 95) : prev + 5));
      }, 200);

      const response = await fetch(`/api/${processEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to process image');

      const data = await response.json();
      setProgress(100);
      setProcessedFilename(data.filename);
      const fileUrl = `/api/file?folder=processed-images&filename=${encodeURIComponent(data.filename)}`;
      setProcessedImageUrl(fileUrl);
      toast.success('Image processed successfully', {
        description: 'Your image has been processed and is ready for download.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to process image', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file && (
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-lg font-medium">
                {isDragActive ? t('fileUploader.dropHere') || 'Drop your image here' : t('fileUploader.dragAndDrop') || 'Drag & drop your image'}
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t('fileUploader.dropHereDesc') || "Drop your image here or click to browse."} {t('fileUploader.maxSize') || "Maximum size is 50MB."}
              </p>
              <Button type="button" variant="secondary" size="sm" className="mt-2">
                {t('fileUploader.browse') || "Browse Files"}
              </Button>
            </div>
          </div>
        )}
        
        {file && !processedImageUrl && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{t('ui.preview') || "Preview"}</h3>
                <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                  <Cross2Icon className="h-4 w-4 mr-1" />
                  {t('ui.remove') || "Remove"}
                </Button>
              </div>
              
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "original" | "preview")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="preview" disabled={!processedPreviewUrl && !isGeneratingPreview}>Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="original" className="p-2 mt-2 border rounded-md min-h-80 flex items-center justify-center overflow-hidden">
                  {filePreviewUrl ? (
                    <img 
                      src={filePreviewUrl} 
                      alt="Original" 
                      className="max-w-full max-h-80 object-contain"
                      onError={(e) => console.error("Failed to load original image:", filePreviewUrl, e)}
                      onLoad={() => console.log("Original image loaded successfully:", filePreviewUrl)}
                    />
                  ) : (
                    <p className="text-muted-foreground">No original image available</p>
                  )}
                </TabsContent>
                
                <TabsContent value="preview" className="p-2 mt-2 border rounded-md min-h-80 flex items-center justify-center overflow-hidden">
                  {isGeneratingPreview ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                      <ReloadIcon className="h-8 w-8 animate-spin mb-4" />
                      <p>Generating preview...</p>
                    </div>
                  ) : processedPreviewUrl ? (
                    <img 
                      src={processedPreviewUrl} 
                      alt="Preview" 
                      className="max-w-full max-h-80 object-contain" 
                      key={processedPreviewUrl}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                      <p>No preview available yet</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={generatePreview}
                        disabled={isGeneratingPreview}
                      >
                        <ReloadIcon className="h-4 w-4 mr-2" />
                        Generate Preview
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-center">
                <Button onClick={processImage} disabled={isProcessing || isGeneratingPreview} className="w-full">
                  {isProcessing ? (
                    <>
                      <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                      {t('ui.processing') || 'Processing...'}
                    </>
                  ) : (
                    t('ui.process') || 'Process Image'
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/10">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file?.name || "Unknown file"}</p>
                  <p className="text-xs text-muted-foreground">{file ? formatFileSize(file.size) : "N/A"}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('convert.options.title') || "Editing Options"}</h3>
              <div className="p-4 border rounded-lg bg-muted/10">
                {renderOptions}
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={generatePreview}
                    disabled={isGeneratingPreview}
                  >
                    <ReloadIcon className={cn("h-4 w-4 mr-2", isGeneratingPreview && "animate-spin")} />
                    {isGeneratingPreview ? "Generating..." : "Update Preview"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Image className="h-4 w-4 animate-pulse" />
              <span>{t('ui.processing') || "Processing image..."} {progress}%</span>
            </div>
          </div>
        )}
        
        {processedImageUrl && processedFilename && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-600 dark:text-green-400 mb-3">
                  {t('ui.success') || "Image processed successfully!"}
                </h3>
                <div className="my-3 border rounded overflow-hidden bg-white dark:bg-black p-3 flex justify-center">
                  <img src={processedImageUrl} alt="Processed" className="max-h-80 object-contain" />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" variant="default" asChild>
                    <a href={processedImageUrl} download={processedFilename}>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      {t('ui.download') || "Download Processed Image"}
                    </a>
                  </Button>
                  <Button variant="outline" onClick={handleRemoveFile} className="flex-1">
                    {t('ui.reupload') || "Process Another Image"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}