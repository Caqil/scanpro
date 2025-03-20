"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
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
import { AlertCircle, Edit2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define position options
const WATERMARK_POSITIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center-left', label: 'Center Left' },
  { value: 'center', label: 'Center' },
  { value: 'center-right', label: 'Center Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

// Define form schema
const formSchema = z.object({
  text: z.string().min(1, "Watermark text is required"),
  position: z.string().default("center"),
  opacity: z.number().min(0.1).max(1).default(0.3),
  size: z.number().min(1).max(100).default(20),
  color: z.string().default("#000000"),
  rotation: z.number().min(0).max(360).default(45),
  scope: z.enum(["all", "custom"]).default("all"),
  pages: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PdfWatermarker() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkResult, setWatermarkResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "CONFIDENTIAL",
      position: "center",
      opacity: 0.3,
      size: 20,
      color: "#000000",
      rotation: 45,
      scope: "all",
      pages: "",
    },
  });

  // Watch fields for the preview
  const watchedValues = form.watch();
  const scope = form.watch("scope");

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
        setWatermarkResult(null);
        setError(null);
        
        // When a new file is uploaded, estimate the number of pages
        const fileSizeInMB = acceptedFiles[0].size / (1024 * 1024);
        // Rough estimate: 1MB ≈ 10 pages
        const estimatedPages = Math.max(1, Math.round(fileSizeInMB * 10));
        setTotalPages(estimatedPages);
        
        // Generate a simple preview image
        updatePreviewImage();
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
    setWatermarkResult(null);
    setError(null);
    setTotalPages(null);
    setPreviewImage(null);
  };

  // Generate a preview image based on current settings
  const updatePreviewImage = () => {
    const position = watchedValues.position;
    const size = watchedValues.size;
    const opacity = watchedValues.opacity;
    const color = watchedValues.color;
    const rotation = watchedValues.rotation;
    const text = watchedValues.text || "WATERMARK";
    const width = 300; // SVG width
const height = 400; // SVG height
const fontSize = size * (Math.min(width, height) / 100); // Match server-side scaling

const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
    <rect width="300" height="400" fill="#f0f0f0" />
    <rect x="20" y="20" width="260" height="360" fill="white" stroke="#d0d0d0" />
    
    <!-- Watermark text -->
    <g transform="${getTransformForPosition(position, 300, 400, rotation)}">
      <text 
        font-family="Arial, sans-serif" 
        font-weight="bold" 
        font-size="${fontSize}px" 
        fill="${color}" 
        opacity="${opacity}" 
        text-anchor="middle"
      >${text}</text>
    </g>
    
    <!-- Page content simulation -->
    <g>
      <rect x="40" y="60" width="220" height="10" fill="#d0d0d0" rx="2" />
      <rect x="40" y="90" width="180" height="10" fill="#d0d0d0" rx="2" />
      <rect x="40" y="120" width="200" height="10" fill="#d0d0d0" rx="2" />
      <rect x="40" y="150" width="160" height="10" fill="#d0d0d0" rx="2" />
      <rect x="40" y="210" width="220" height="10" fill="#d0d0d0" rx="2" />
      <rect x="40" y="240" width="190" height="10" fill="#d0d0d0" rx="2" />
      <rect x="40" y="270" width="220" height="10" fill="#d0d0d0" rx="2" />
      <rect x="40" y="300" width="170" height="10" fill="#d0d0d0" rx="2" />
    </g>
  </svg>
`;
    
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    setPreviewImage(dataUrl);
  };
  const getTransformForPosition = (position: string, width: number, height: number, rotation: number): string => {
    let x = width / 2;
    let y = height / 2;
    
    // Approximate text height (about 1.2 times the font size for most fonts)
    const fontSize = watchedValues.size * (Math.min(width, height) / 100);
    const textHeight = fontSize * 1.2;

    // Adjust position
    switch (position) {
        case 'top-left':
            x = width * 0.2;
            y = height * 0.2 - textHeight / 2;
            break;
        case 'top-center':
            x = width / 2;
            y = height * 0.2 - textHeight / 2;
            break;
        case 'top-right':
            x = width * 0.8;
            y = height * 0.2 - textHeight / 2;
            break;
        case 'center-left':
            x = width * 0.2;
            y = height / 2;
            break;
        case 'center':
            x = width / 2;
            y = height / 2;
            break;
        case 'center-right':
            x = width * 0.8;
            y = height / 2;
            break;
        case 'bottom-left':
            x = width * 0.2;
            y = height * 0.8 + textHeight;
            break;
        case 'bottom-center':
            x = width / 2;
            y = height * 0.8 + textHeight;
            break;
        case 'bottom-right':
            x = width * 0.8;
            y = height * 0.8 + textHeight;
            break;
    }
    
    return `translate(${x} ${y}) rotate(${rotation})`;
};

  // Update preview whenever form values change
  useEffect(() => {
    if (file) {
      updatePreviewImage();
    }
  }, [watchedValues]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError("Please select a PDF file to watermark");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setWatermarkResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", values.text);
    formData.append("position", values.position);
    formData.append("opacity", values.opacity.toString());
    formData.append("size", values.size.toString());
    formData.append("color", values.color);
    formData.append("rotation", values.rotation.toString());
    
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
      const response = await fetch('/api/watermark', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add watermark to PDF file");
      }

      const data = await response.json();
      setProgress(100);
      setWatermarkResult(data);
      
      toast.success("Watermark Added Successfully", {
        description: `Successfully added watermark to ${data.watermarkedPages} pages.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Watermark Failed", {
        description: err instanceof Error ? err.message : "Failed to add watermark to your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Add Watermark to PDF</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: File Drop and Preview */}
              <div className="space-y-4">
                {/* File Drop Zone */}
                <div 
                  {...getRootProps()} 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
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
                
                {/* Watermark Preview */}
                {file && previewImage && (
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Watermark Preview</h3>
                    <div className="flex justify-center">
                      <img 
                        src={previewImage} 
                        alt="Watermark preview" 
                        className="max-w-full h-auto border rounded" 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      This is a simplified preview. The actual result may vary.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Right Column: Watermark Options */}
              <div className="space-y-4">
                {/* Watermark Text */}
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Watermark Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. CONFIDENTIAL, DRAFT, etc."
                          {...field}
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Color Picker */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <input
                            type="color"
                            className="w-10 h-10 rounded cursor-pointer"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isProcessing}
                          className="flex-grow"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Opacity Slider */}
                <FormField
                  control={form.control}
                  name="opacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opacity: {Math.round(field.value * 100)}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={0.1}
                          max={1}
                          step={0.05}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Size Slider */}
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={5}
                          max={50}
                          step={1}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Rotation Slider */}
                <FormField
                  control={form.control}
                  name="rotation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rotation: {field.value}°</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={360}
                          step={5}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Position Selector */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select
                        disabled={isProcessing}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {WATERMARK_POSITIONS.map((pos) => (
                            <SelectItem key={pos.value} value={pos.value}>
                              {pos.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <FormLabel>Pages to Watermark</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all-pages" />
                            <label htmlFor="all-pages" className="cursor-pointer">All pages</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom-pages" />
                            <label htmlFor="custom-pages" className="cursor-pointer">Specific pages</label>
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
            </div>
            
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
                  <Edit2Icon className="h-4 w-4 animate-pulse" />
                  <span>Adding watermark to your PDF... {progress}%</span>
                </div>
              </div>
            )}
            
            {/* Results */}
            {watermarkResult && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      Watermark successfully added!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {watermarkResult.watermarkedPages === watermarkResult.totalPages
                        ? `Watermark "${watermarkResult.text}" added to all ${watermarkResult.totalPages} pages.`
                        : `Watermark "${watermarkResult.text}" added to ${watermarkResult.watermarkedPages} out of ${watermarkResult.totalPages} pages.`
                      }
                    </p>
                    <Button 
                      className="w-full sm:w-auto" 
                      asChild
                      variant="default"
                    >
                      <a href={`/api/file?folder=watermarks&filename=${encodeURIComponent(watermarkResult.filename)}`} download>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download Watermarked PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {!watermarkResult && (
              <Button 
                type="submit" 
                disabled={!file || isProcessing}
              >
                {isProcessing ? "Adding Watermark..." : "Add Watermark"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}