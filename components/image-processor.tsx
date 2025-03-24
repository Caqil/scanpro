// components/image-processor.tsx
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
} from "@radix-ui/react-icons";
import { AlertCircle, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/src/store/store";

// Define props interface for the processor
interface ImageProcessorProps {
  title: string;
  description: string;
  processEndpoint: string;
  fileTypes?: string[];
  processOptions?: Record<string, any>;
  renderOptions?: React.ReactNode;
}

export function ImageProcessor({ 
  title, 
  description, 
  processEndpoint,
  fileTypes = ["image/png"],
  processOptions = {},
  renderOptions
}: ImageProcessorProps) {
  const { t } = useLanguageStore();
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedFilename, setProcessedFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set up dropzone for image files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 
      'image/*': fileTypes.map(type => {
        if (type.includes('/')) {
          return `.${type.split('/')[1]}`;
        }
        return `.${type}`;
      })
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.file.size > 50 * 1024 * 1024) {
          setError('File size is too large. Maximum size is 50MB.');
        } else {
          setError('Please upload a valid image file.');
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        // Generate preview URL for the uploaded file
        const previewUrl = URL.createObjectURL(acceptedFiles[0]);
        setFilePreviewUrl(previewUrl);
        setProcessedImageUrl(null);
        setProcessedFilename(null);
        setError(null);
      }
    },
  });

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

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
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFile(null);
    setFilePreviewUrl(null);
    setProcessedImageUrl(null);
    setProcessedFilename(null);
    setError(null);
  };

  // Process the image
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
    
    // Add any additional options to the form data
    Object.entries(processOptions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

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
      }, 200);

      // Make API request
      const response = await fetch(`/api/${processEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      setProgress(100);
      
      // Store both the display URL and filename for downloading
      setProcessedFilename(data.filename);
      
      // Use the API file route to both display and download images
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
        {/* File Drop Zone */}
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
          
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FileIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <Cross2Icon className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-lg font-medium">
                {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Drop your image here or click to browse. Maximum size is 50MB.
              </p>
              <Button type="button" variant="secondary" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          )}
        </div>
        
        {/* File Preview (after upload, before processing) */}
        {filePreviewUrl && !processedImageUrl && (
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="text-sm font-medium mb-3">Original Image Preview</h3>
            <div className="flex justify-center">
              <img 
                src={filePreviewUrl} 
                alt="Preview" 
                className="max-h-60 max-w-full object-contain" 
              />
            </div>
          </div>
        )}
        
        {/* Additional Options */}
        {renderOptions && (
          <div className="p-4 border rounded-lg bg-muted/10">
            <h3 className="text-sm font-medium mb-3">Processing Options</h3>
            {renderOptions}
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
              <Image className="h-4 w-4 animate-pulse" />
              <span>Processing image... {progress}%</span>
            </div>
          </div>
        )}
        
        {/* Results */}
        {processedImageUrl && processedFilename && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-600 dark:text-green-400">
                  Image processed successfully!
                </h3>
                <div className="my-3 border rounded overflow-hidden bg-white dark:bg-black p-3 flex justify-center">
                  <img 
                    src={processedImageUrl} 
                    alt="Processed" 
                    className="max-h-60 object-contain" 
                  />
                </div>
                <Button 
                  className="w-full sm:w-auto" 
                  variant="default"
                  asChild
                >
                  <a 
                    href={processedImageUrl}
                    download={processedFilename}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download Processed Image
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {file && !processedImageUrl && (
          <Button 
            onClick={processImage} 
            disabled={!file || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Image'}
          </Button>
        )}
        
        {processedImageUrl && (
          <Button
            variant="outline"
            onClick={handleRemoveFile}
          >
            Process Another Image
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}