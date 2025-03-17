"use client";

import { useState } from "react";
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
} from "@/components/ui/card";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  CrossCircledIcon, 
  UploadIcon, 
  ReloadIcon, 
  DownloadIcon,
} from "@radix-ui/react-icons";
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
});

type FormValues = z.infer<typeof formSchema>;

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedFileUrl, setCompressedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: string;
  } | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quality: "medium",
    },
  });

  // Set up dropzone for PDF files only
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
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
        setFile(acceptedFiles[0]);
        setCompressedFileUrl(null);
        setCompressionStats(null);
        setError(null);
      }
    }
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setCompressedFileUrl(null);
    setCompressionStats(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", values.quality);

    try {
      // Set up progress tracking (simulated for compression)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

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
      setProgress(100);
      setCompressedFileUrl(data.fileUrl);
      setCompressionStats({
        originalSize: data.originalSize,
        compressedSize: data.compressedSize,
        compressionRatio: data.compressionRatio,
      });
      
      toast.success("Compression Successful", {
        description: `Your PDF has been compressed. Reduced by ${data.compressionRatio}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Compression Failed", {
        description: err instanceof Error ? err.message : "Failed to compress your PDF",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setCompressedFileUrl(null);
    setCompressionStats(null);
    setError(null);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Compress Your PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quality Selection */}
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
            
            {/* File Drop Zone */}
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragActive ? "border-primary bg-primary/10" : 
                file ? "border-green-500 bg-green-50 dark:bg-green-950/20" : 
                "border-muted-foreground/25 hover:border-muted-foreground/50",
                isProcessing && "pointer-events-none opacity-60"
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
                      {formatFileSize(file.size)} • PDF
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
                    {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Drop your PDF file here or click to browse. Maximum size is 100MB.
                  </p>
                  <Button type="button" variant="secondary" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!file || isProcessing}
              className="min-w-32"
            >
              {isProcessing ? "Compressing..." : "Compress PDF"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="flex items-center gap-2">
                <CrossCircledIcon className="h-4 w-4" />
                {error}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Progress indicator */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ReloadIcon className="h-4 w-4 animate-spin" />
              Compressing your PDF... {progress}%
            </div>
          </div>
        )}
        
        {compressedFileUrl && compressionStats && (
  <Card className="border-green-200 dark:border-green-900">
    <CardHeader className="pb-2">
      <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
        <CheckCircledIcon className="h-5 w-5" />
        Compression Successful!
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Original Size</p>
          <p className="text-lg font-semibold">{formatFileSize(compressionStats.originalSize)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Compressed Size</p>
          <p className="text-lg font-semibold">{formatFileSize(compressionStats.compressedSize)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Reduction</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {compressionStats.compressionRatio}
          </p>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        asChild
        variant="default"
      >
        <a href={compressedFileUrl} download>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download Compressed PDF
        </a>
      </Button>
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