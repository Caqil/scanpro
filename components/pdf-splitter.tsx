"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  UploadIcon, 
  DownloadIcon,
} from "@radix-ui/react-icons";
import { AlertCircle, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schema
const formSchema = z.object({
  method: z.enum(["all", "pages", "ranges"]).default("all"),
  pages: z.string().optional(),
  ranges: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitResult, setSplitResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: "all",
      pages: "",
      ranges: "",
    },
  });

  // Watch the method field to conditionally render form fields
  const method = form.watch("method");

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
        setFile(acceptedFiles[0]);
        setSplitResult(null);
        setError(null);
        
        // When a new file is uploaded, estimate the number of pages
        // This would typically come from server-side, but we'll use a dummy calculation for now
        const fileSizeInMB = acceptedFiles[0].size / (1024 * 1024);
        // Rough estimate: 1MB ≈ 10 pages
        const estimatedPages = Math.max(1, Math.round(fileSizeInMB * 10));
        setTotalPages(estimatedPages);
      }
    },
  });

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
    setSplitResult(null);
    setError(null);
    setTotalPages(null);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError("Please select a PDF file to split");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSplitResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("method", values.method);
    
    if (values.method === "pages" && values.pages) {
      formData.append("pages", values.pages);
    }
    
    if (values.method === "ranges" && values.ranges) {
      formData.append("ranges", values.ranges);
    }

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

      // Make API request
      const response = await fetch('/api/split', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to split PDF file");
      }

      const data = await response.json();
      setProgress(100);
      setSplitResult(data);
      
      toast.success("Split Successful", {
        description: `Successfully created ${data.totalSplits} PDF files.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Split Failed", {
        description: err instanceof Error ? err.message : "Failed to split your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Split PDF File</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      {totalPages && ` • Approximately ${totalPages} pages`}
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
            
            {/* Split Options */}
            {file && !splitResult && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Split Method</FormLabel>
                      <Select
                        disabled={isProcessing}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select split method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">
                            <div className="flex flex-col">
                              <span>Extract All Pages</span>
                              <span className="text-xs text-muted-foreground">
                                Split into individual pages
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="pages">
                            <div className="flex flex-col">
                              <span>Extract Specific Pages</span>
                              <span className="text-xs text-muted-foreground">
                                Select individual pages to extract
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="ranges">
                            <div className="flex flex-col">
                              <span>Extract Page Ranges</span>
                              <span className="text-xs text-muted-foreground">
                                Select ranges of pages to extract
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Conditional fields based on method */}
                {method === "pages" && (
                  <FormField
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Pages</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 1,3,5,8"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Enter page numbers separated by commas (e.g. 1,3,5,8)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {method === "ranges" && (
                  <FormField
                    control={form.control}
                    name="ranges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Ranges</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 1-3,5-8"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Enter page ranges separated by commas (e.g. 1-3,5-8)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                  <Scissors className="h-4 w-4 animate-pulse" />
                  Splitting your PDF... {progress}%
                </div>
              </div>
            )}
            
            {/* Results */}
            {splitResult && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      PDF successfully split!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Your PDF has been split into {splitResult.totalSplits} files.
                    </p>
                    <Button 
                      className="w-full sm:w-auto" 
                      asChild
                      variant="default"
                    >
                      <a href={`/api/file?folder=splits&filename=${encodeURIComponent(splitResult.filename)}`} download>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download All Split Files (ZIP)
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {!splitResult && (
              <Button 
                type="submit" 
                disabled={!file || isProcessing}
              >
                {isProcessing ? "Splitting..." : "Split PDF"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}