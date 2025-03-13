"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon, Cross2Icon, CheckCircledIcon, CrossCircledIcon, UploadIcon } from "@radix-ui/react-icons";

const SUPPORTED_FORMATS = [
  { value: "docx", label: "Word Document (.docx)" },
  { value: "doc", label: "Word Document - Legacy (.doc)" },
  { value: "xlsx", label: "Excel Spreadsheet (.xlsx)" },
  { value: "pptx", label: "PowerPoint Presentation (.pptx)" },
  { value: "txt", label: "Text File (.txt)" },
  { value: "html", label: "HTML Document (.html)" },
  { value: "jpg", label: "JPEG Image (.jpg)" },
  { value: "png", label: "PNG Image (.png)" },
  { value: "csv", label: "CSV File (.csv)" },
  { value: "rtf", label: "Rich Text Format (.rtf)" },
  { value: "odt", label: "OpenDocument Text (.odt)" },
];

// Form schema
const formSchema = z.object({
  format: z.string().min(1, "Please select a format"),
  enableOcr: z.boolean().default(false),
  quality: z.number().min(10).max(100).default(90),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: "docx",
      enableOcr: false,
      quality: 90,
      password: "",
    },
  });

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.file.size > 50 * 1024 * 1024) {
          setError("File is too large. Maximum size is 50MB.");
        } else {
          setError("Please upload a valid PDF file.");
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setConvertedFileUrl(null);
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

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setConvertedFileUrl(null);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("format", values.format);
    formData.append("ocr", values.enableOcr ? "true" : "false");
    formData.append("quality", values.quality.toString());
    
    if (values.password) {
      formData.append("password", values.password);
    }

    try {
      // Set up progress tracking
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
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert PDF');
      }

      const data = await response.json();
      setProgress(100);
      setConvertedFileUrl(data.fileUrl);
      
      toast.success("Conversion Successful", {
        description: "Your PDF has been converted successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Conversion Failed", {
        description: err instanceof Error ? err.message : "Failed to convert your PDF file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setConvertedFileUrl(null);
    setError(null);
  };

  // Check if format is an image format
  const isImageFormat = form.watch("format") === "jpg" || form.watch("format") === "png";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* File Drop Zone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? "border-primary bg-primary/10" 
              : file 
                ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input {...getInputProps()} disabled={isUploading} />
          
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FileIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                disabled={isUploading}
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
                Drop your PDF here or click to browse. Maximum size is 50MB.
              </p>
              <Button type="button" variant="secondary" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          )}
        </div>
        
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
        
        {/* Conversion options */}
        <div className="space-y-4 bg-muted/40 p-4 rounded-lg">
          <div className="text-sm font-medium">Conversion Options</div>
          
          {/* Format Selection */}
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Output Format</FormLabel>
                <Select
                  disabled={isUploading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORTED_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* OCR Option */}
          <FormField
            control={form.control}
            name="enableOcr"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isUploading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Enable OCR
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Extract text from scanned documents using Optical Character Recognition
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          {/* Image Quality (only for image outputs) */}
          {isImageFormat && (
            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Quality: {field.value}%</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Low</span>
                      <Input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isUploading}
                        className="[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4"
                      />
                      <span className="text-xs">High</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Password for protected PDFs */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password (if protected)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Leave empty if not password-protected"
                    {...field}
                    disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Progress indicator */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Converting your PDF... {progress}%
            </p>
          </div>
        )}
        
        {/* Conversion result */}
        {convertedFileUrl && (
          <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="font-medium text-green-600 dark:text-green-400">Conversion Successful!</div>
            </div>
            <Button 
              className="w-full" 
              asChild
            >
              <a href={convertedFileUrl} download>
                Download Converted File
              </a>
            </Button>
          </div>
        )}
        
        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!file || isUploading}
        >
          {isUploading ? "Converting..." : "Convert PDF"}
        </Button>
      </form>
    </Form>
  );
}