"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  CrossCircledIcon, 
  UploadIcon, 
  DownloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Define compression qualities with descriptions
const COMPRESSION_QUALITIES = [
  { 
    value: "high", 
    label: "High Quality", 
    description: "Minimal compression, best visual quality" 
  },
  { 
    value: "medium", 
    label: "Balanced", 
    description: "Good compression with minimal visual loss" 
  },
  { 
    value: "low", 
    label: "Maximum Compression", 
    description: "Highest compression ratio, may reduce visual quality" 
  }
];

// Form schema
const formSchema = z.object({
  quality: z.enum(["high", "medium", "low"]).default("medium"),
  processAllTogether: z.boolean().default(true),
});

// File with processing status
interface FileWithStatus {
  file: File;
  status: 'idle' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Compressed file result
interface CompressedFile {
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
  fileUrl: string;
  filename: string;
}

type FormValues = z.infer<typeof formSchema>;

export function MultiPdfCompressor() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [compressedFiles, setCompressedFiles] = useState<Record<string, CompressedFile>>({});
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quality: "medium",
      processAllTogether: true,
    },
  });

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
        // Add new files to the list, avoid duplicates
        setFiles(prev => {
          const existingFileNames = new Set(prev.map(f => f.file.name));
          const newFiles = acceptedFiles
            .filter(file => !existingFileNames.has(file.name))
            .map(file => ({ 
              file, 
              status: 'idle' as const 
            }));
          
          return [...prev, ...newFiles];
        });
        
        setError(null);
      }
    },
    multiple: true,
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (files.length === 0) {
      setError("Please select at least one PDF file");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Choose processing method based on form value
    if (values.processAllTogether) {
      await processAllFiles(values.quality);
    } else {
      await processFilesSequentially(values.quality);
    }

    setIsProcessing(false);
  };

  // Process all files in parallel
  const processAllFiles = async (quality: string) => {
    const compressionPromises = files
      .filter(fileItem => fileItem.status !== 'completed')
      .map(fileItem => compressFile(fileItem.file, quality));
    
      await Promise.all(compressionPromises);
      toast.success(`Compressed ${compressionPromises.length} files successfully`);
  };

  // Process files one by one
  const processFilesSequentially = async (quality: string) => {
    const filesToProcess = files.filter(fileItem => fileItem.status !== 'completed');
    
    for (const fileItem of filesToProcess) {
      try {
        await compressFile(fileItem.file, quality);
      } catch (err) {
        // Continue to the next file even if one fails
        console.error(`Failed to compress ${fileItem.file.name}:`, err);
      }
    }
    
    toast.success("Sequential compression completed");
  };

  // Compress a single file
  const compressFile = async (file: File, quality: string): Promise<void> => {
    // Update file status to processing
    setFiles(prev => 
      prev.map(f => 
        f.file.name === file.name 
          ? { ...f, status: 'processing' as const, error: undefined } 
          : f
      )
    );
    
    // Initialize progress for this file
    setProgress(prev => ({ ...prev, [file.name]: 0 }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [file.name]: currentProgress + 5 };
        });
      }, 300 + Math.random() * 300); // Randomize slightly for natural feel

      // Make API request
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compress PDF");
      }

      const data = await response.json();
      
      // Set progress to 100% for completed file
      setProgress(prev => ({ ...prev, [file.name]: 100 }));
      
      // Store compressed file information
      setCompressedFiles(prev => ({ 
        ...prev, 
        [file.name]: {
          originalSize: data.originalSize,
          compressedSize: data.compressedSize,
          compressionRatio: data.compressionRatio,
          fileUrl: data.fileUrl,
          filename: data.filename
        } 
      }));
      
      // Update file status to completed
      setFiles(prev => 
        prev.map(f => 
          f.file.name === file.name 
            ? { ...f, status: 'completed' as const } 
            : f
        )
      );
      
      toast.success(`Compressed ${file.name}`, {
        description: `Reduced by ${data.compressionRatio}`,
      });
    } catch (err) {
      // Update file status to error
      setFiles(prev => 
        prev.map(f => 
          f.file.name === file.name 
            ? { 
                ...f, 
                status: 'error' as const, 
                error: err instanceof Error ? err.message : "Failed to compress file"
              } 
            : f
        )
      );
      
      // Set progress to indicate error
      setProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      toast.error(`Failed to compress ${file.name}`, {
        description: err instanceof Error ? err.message : "An unknown error occurred",
      });
      
      throw err; // Re-throw to handle in the caller
    }
  };

  // Handle file removal
  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.file.name !== fileName));
    
    // Also remove from progress and compressed files if present
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    
    setCompressedFiles(prev => {
      const newCompressedFiles = { ...prev };
      delete newCompressedFiles[fileName];
      return newCompressedFiles;
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

  // Get total compression statistics
  const getTotalStats = useCallback(() => {
    if (Object.keys(compressedFiles).length === 0) return null;
    
    const totalOriginalSize = Object.values(compressedFiles)
      .reduce((sum, file) => sum + file.originalSize, 0);
    
    const totalCompressedSize = Object.values(compressedFiles)
      .reduce((sum, file) => sum + file.compressedSize, 0);
    
    const totalSaved = totalOriginalSize - totalCompressedSize;
    const compressionRatio = ((totalSaved / totalOriginalSize) * 100).toFixed(2);
    
    return {
      totalOriginalSize,
      totalCompressedSize,
      totalSaved,
      compressionRatio
    };
  }, [compressedFiles]);

  const totalStats = getTotalStats();
  const allFilesProcessed = files.every(f => f.status === 'completed');
  const anyFilesFailed = files.some(f => f.status === 'error');
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Compress Multiple PDFs</CardTitle>
            <CardDescription>
              Upload multiple PDF files to compress them individually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compression Options */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compression Level</FormLabel>
                    <Select
                      disabled={isProcessing}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select compression level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMPRESSION_QUALITIES.map((quality) => (
                          <SelectItem key={quality.value} value={quality.value}>
                            <div className="flex flex-col">
                              <span>{quality.label}</span>
                              <span className="text-xs text-muted-foreground">{quality.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="processAllTogether"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isProcessing}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Process all files simultaneously
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        When enabled, all files will be processed in parallel
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* File Drop Zone */}
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
            
            {/* File List */}
            {files.length > 0 && (
              <div className="border rounded-lg">
                <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                  <h3 className="font-medium">Files to Compress ({files.length})</h3>
                  {!isProcessing && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setFiles([])}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Clear All
                    </Button>
                  )}
                </div>
                <div className="divide-y overflow-y-auto max-h-[300px]">
                  {files.map((fileItem) => (
                    <div key={fileItem.file.name} className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-9 w-9 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <FileIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(fileItem.file.size)}
                            {compressedFiles[fileItem.file.name] && (
                              <span className="ml-2 text-green-600 dark:text-green-400">
                                → {formatFileSize(compressedFiles[fileItem.file.name].compressedSize)}
                                {" "}({compressedFiles[fileItem.file.name].compressionRatio} reduction)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {fileItem.status === 'idle' && !isProcessing && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRemoveFile(fileItem.file.name)}
                          >
                            <Cross2Icon className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {fileItem.status === 'processing' && (
                          <div className="flex items-center gap-2 min-w-32">
                            <Progress value={progress[fileItem.file.name] || 0} className="h-2 w-20" />
                            <span className="text-xs text-muted-foreground">
                              {progress[fileItem.file.name] || 0}%
                            </span>
                          </div>
                        )}
                        
                        {fileItem.status === 'completed' && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircledIcon className="h-3 w-3 mr-1" /> Done
                            </Badge>
                            
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              asChild
                              className="text-sm"
                            >
                              <a 
                                href={`/api/file?folder=compressions&filename=${compressedFiles[fileItem.file.name]?.filename}`}
                                download
                                target="_blank"
                              >
                                <DownloadIcon className="h-3.5 w-3.5 mr-1" /> Download
                              </a>
                            </Button>
                          </div>
                        )}
                        
                        {fileItem.status === 'error' && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                              <CrossCircledIcon className="h-3 w-3 mr-1" /> Failed
                            </Badge>
                            
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveFile(fileItem.file.name)}
                            >
                              <Cross2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              disabled={files.length === 0 || isProcessing}
              className="min-w-32"
            >
              {isProcessing ? "Compressing..." : "Compress All"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Overall progress */}
        {isProcessing && files.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Object.values(progress).filter(p => p === 100).length} of {files.length} files
              </span>
            </div>
            <Progress 
              value={(Object.values(progress).reduce((a, b) => a + b, 0) / (files.length * 100)) * 100} 
              className="h-2" 
            />
          </div>
        )}
        
        {/* Results summary */}
        {totalStats && files.length > 1 && (allFilesProcessed || anyFilesFailed) && (
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircledIcon className="h-5 w-5" />
                Compression Results Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Original</p>
                  <p className="text-lg font-semibold">{formatFileSize(totalStats.totalOriginalSize)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Compressed</p>
                  <p className="text-lg font-semibold">{formatFileSize(totalStats.totalCompressedSize)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Space Saved</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatFileSize(totalStats.totalSaved)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average Reduction</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {totalStats.compressionRatio}%
                  </p>
                </div>
              </div>
              
              {allFilesProcessed && files.length > 1 && (
                <Button 
                  className="w-full" 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Create a zip file with all compressed files
                    toast.info("Batch download feature", {
                      description: "This would download all compressed files as a zip. Implementation pending.",
                    });
                  }}
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download All Compressed Files
                </Button>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Files are automatically deleted after 24 hours for privacy and security.
            </CardFooter>
          </Card>
        )}
      </form>
    </Form>
  );
}
