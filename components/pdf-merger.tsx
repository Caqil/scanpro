"use client";

import { useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
  TrashIcon,
  MoveIcon,
} from "@radix-ui/react-icons";
import { AlertCircle, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface for file with order
interface FileWithOrder {
  file: File;
  id: string;
  preview?: string;
}

export function PdfMerger() {
  const [files, setFiles] = useState<FileWithOrder[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  // Generate a unique ID
  const generateId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Set up dropzone for PDF files only
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 100 * 1024 * 1024, // 100MB per file
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.file.size > 100 * 1024 * 1024) {
          setError("One or more files are too large. Maximum size is 100MB per file.");
        } else {
          setError("Please upload valid PDF files only.");
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        setFiles(prev => {
          const existingFileNames = new Set(prev.map(f => f.file.name));
          const newFiles = acceptedFiles
            .filter(file => !existingFileNames.has(file.name))
            .map(file => ({ 
              file,
              id: generateId(),
              preview: URL.createObjectURL(file)
            }));
          
          return [...prev, ...newFiles];
        });
        
        setError(null);
      }
    },
    multiple: true,
  });

  // Clean up previews when component unmounts
  const cleanUpPreviews = useCallback(() => {
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
  }, [files]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (isProcessing) return;
    setDragId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId || isProcessing) return;

    const newFiles = [...files];
    const draggedIndex = newFiles.findIndex(f => f.id === dragId);
    const targetIndex = newFiles.findIndex(f => f.id === targetId);
    
    const [draggedItem] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, draggedItem);
    
    setFiles(newFiles);
    setDragId(null);
  };

  // Move file up in the list
  const moveFileUp = (index: number) => {
    if (index <= 0) return;
    const newFiles = [...files];
    [newFiles[index-1], newFiles[index]] = [newFiles[index], newFiles[index-1]];
    setFiles(newFiles);
  };

  // Move file down in the list
  const moveFileDown = (index: number) => {
    if (index >= files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index+1]] = [newFiles[index+1], newFiles[index]];
    setFiles(newFiles);
  };

  // Handle file removal
  const handleRemoveFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter(f => f.id !== id);
    });
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

  // Process merging PDFs
  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least two PDF files to merge");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setMergedFileUrl(null);

    const formData = new FormData();
    
    files.forEach((fileObj, index) => {
      formData.append('files', fileObj.file);
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      const response = await fetch('/api/merge', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to merge PDF files");
      }

      const data = await response.json();
      setProgress(100);
      setMergedFileUrl(data.filename);
      
      toast.success("Merge Successful", {
        description: `Successfully merged ${data.fileCount} PDF files.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Merge Failed", {
        description: err instanceof Error ? err.message : "Failed to merge your files",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Merge PDF Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragActive ? "border-primary bg-primary/10" : 
            files.length > 0 ? "border-green-500 bg-green-50 dark:bg-green-950/20" : 
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
              {isDragActive ? "Drop your PDF files here" : "Drag & drop your PDF files"}
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Drop your PDF files here or click to browse. You can select multiple files.
              Maximum size is 100MB per file.
            </p>
            <Button type="button" variant="secondary" size="sm" className="mt-2">
              Browse Files
            </Button>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="border rounded-lg">
            <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
              <h3 className="font-medium">Files to Merge ({files.length})</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <MoveIcon className="h-3 w-3 mr-1" /> Drag to reorder
                </Badge>
                {!isProcessing && (
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      cleanUpPreviews();
                      setFiles([]);
                    }}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" /> Clear All
                  </Button>
                )}
              </div>
            </div>
            
            <div className="divide-y overflow-y-auto max-h-[400px]">
              {files.map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  draggable={!isProcessing}
                  onDragStart={(e) => handleDragStart(e, fileObj.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, fileObj.id)}
                  className="p-3 flex items-center justify-between gap-4 hover:bg-muted/30"
                >
                  <div 
                    className="flex items-center justify-center p-1 rounded hover:bg-muted cursor-move"
                  >
                    <MoveIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="h-9 w-9 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <FileIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileObj.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFileUp(index)}
                      disabled={index === 0 || isProcessing}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFileDown(index)}
                      disabled={index === files.length - 1 || isProcessing}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRemoveFile(fileObj.id)}
                      disabled={isProcessing}
                    >
                      <Cross2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
              <MoveIcon className="h-4 w-4 animate-spin" />
              Merging your PDF files... {progress}%
            </div>
          </div>
        )}
        
        {mergedFileUrl && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-600 dark:text-green-400">
                  PDFs successfully merged!
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Your merged PDF file is now ready for download.
                </p>
                <Button 
                  className="w-full sm:w-auto" 
                  asChild
                  variant="default"
                >
                  <a href={`/api/file?folder=merges&filename=${encodeURIComponent(mergedFileUrl)}`} download>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download Merged PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
        {files.length > 0 && !isProcessing && !mergedFileUrl && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              cleanUpPreviews();
              setFiles([]);
            }}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
        
        <Button 
          className={cn(
            "sm:ml-auto",
            files.length === 0 && !mergedFileUrl && "w-full"
          )}
          onClick={handleMerge}
          disabled={files.length < 2 || isProcessing}
        >
          {isProcessing ? "Merging..." : "Merge PDFs"}
        </Button>
      </CardFooter>
    </Card>
  );
}