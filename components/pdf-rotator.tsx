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
import { AlertCircle, RotateCcw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define form schema
const formSchema = z.object({
  angle: z.enum(["90", "180", "270", "-90", "-180", "-270"]).default("90"),
  scope: z.enum(["all", "custom"]).default("all"),
  pages: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PdfRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotationResult, setRotationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      angle: "90",
      scope: "all",
      pages: "",
    },
  });

  // Watch fields to conditionally render
  const scope = form.watch("scope");
  const angle = form.watch("angle");

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
        setRotationResult(null);
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
    setRotationResult(null);
    setError(null);
    setTotalPages(null);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError("Please select a PDF file to rotate");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setRotationResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("angle", values.angle);
    
    if (values.scope === "custom" && values.pages) {
      formData.append("pages", values.pages);
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
      const response = await fetch('/api/rotate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rotate PDF file");
      }

      const data = await response.json();
      setProgress(100);
      setRotationResult(data);
      
      toast.success("Rotation Successful", {
        description: `Successfully rotated ${data.rotatedPages} pages by ${data.angle} degrees.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Rotation Failed", {
        description: err instanceof Error ? err.message : "Failed to rotate your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get rotation angle icon and description
  const getRotationInfo = (angle: string) => {
    const angleNum = parseInt(angle);
    const isClockwise = angleNum > 0;
    
    return {
      icon: isClockwise ? <RotateCw className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />,
      description: `${isClockwise ? 'Clockwise' : 'Counter-clockwise'} by ${Math.abs(angleNum)}°`,
      direction: isClockwise ? 'clockwise' : 'counter-clockwise'
    };
  };

  const rotationInfo = getRotationInfo(angle);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Rotate PDF File</CardTitle>
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
            
            {/* Rotation Options */}
            {file && !rotationResult && (
              <div className="space-y-6">
                {/* Rotation Angle */}
                <FormField
                  control={form.control}
                  name="angle"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Rotation Angle</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="90" id="r90" />
                            <label htmlFor="r90" className="flex items-center gap-2 cursor-pointer">
                              <RotateCw className="h-5 w-5" />
                              <span>90° Clockwise</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="180" id="r180" />
                            <label htmlFor="r180" className="flex items-center gap-2 cursor-pointer">
                              <RotateCw className="h-5 w-5" />
                              <span>180° Clockwise</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="270" id="r270" />
                            <label htmlFor="r270" className="flex items-center gap-2 cursor-pointer">
                              <RotateCw className="h-5 w-5" />
                              <span>270° Clockwise</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="-90" id="r-90" />
                            <label htmlFor="r-90" className="flex items-center gap-2 cursor-pointer">
                              <RotateCcw className="h-5 w-5" />
                              <span>90° Counter</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="-180" id="r-180" />
                            <label htmlFor="r-180" className="flex items-center gap-2 cursor-pointer">
                              <RotateCcw className="h-5 w-5" />
                              <span>180° Counter</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="-270" id="r-270" />
                            <label htmlFor="r-270" className="flex items-center gap-2 cursor-pointer">
                              <RotateCcw className="h-5 w-5" />
                              <span>270° Counter</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Page Selection */}
                <FormField
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Pages to Rotate</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <label htmlFor="all" className="cursor-pointer">All pages</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <label htmlFor="custom" className="cursor-pointer">Specific pages</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {scope === "custom" && (
                  <FormField
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Numbers</FormLabel>
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
                  {rotationInfo.icon}
                  <span>Rotating your PDF {rotationInfo.description}... {progress}%</span>
                </div>
              </div>
            )}
            
            {/* Results */}
            {rotationResult && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      PDF successfully rotated!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {rotationResult.rotatedPages === rotationResult.totalPages
                        ? `All ${rotationResult.totalPages} pages have been rotated by ${rotationResult.angle}°.`
                        : `${rotationResult.rotatedPages} out of ${rotationResult.totalPages} pages have been rotated by ${rotationResult.angle}°.`
                      }
                    </p>
                    <Button 
                      className="w-full sm:w-auto" 
                      asChild
                      variant="default"
                    >
                      <a href={`/api/file?folder=rotations&filename=${encodeURIComponent(rotationResult.filename)}`} download>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download Rotated PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {!rotationResult && (
              <Button 
                type="submit" 
                disabled={!file || isProcessing}
              >
                {isProcessing ? "Rotating..." : "Rotate PDF"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}