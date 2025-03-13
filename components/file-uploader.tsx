"use client";

import { useState, useEffect } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  CrossCircledIcon, 
  UploadIcon, 
  ReloadIcon, 
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  TableIcon
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

// Define supported input and output formats with categories
const FORMAT_CATEGORIES = [
  {
    name: "Documents",
    icon: <FileTextIcon className="h-4 w-4" />,
    formats: [
      { value: "pdf", label: "PDF Document (.pdf)", accept: "application/pdf" },
      { value: "docx", label: "Word Document (.docx)", accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { value: "doc", label: "Word Document - Legacy (.doc)", accept: "application/msword" },
      { value: "rtf", label: "Rich Text Format (.rtf)", accept: "application/rtf" },
      { value: "odt", label: "OpenDocument Text (.odt)", accept: "application/vnd.oasis.opendocument.text" },
      { value: "txt", label: "Text File (.txt)", accept: "text/plain" },
      { value: "html", label: "HTML Document (.html)", accept: "text/html" },
    ]
  },
  {
    name: "Spreadsheets",
    icon: <TableIcon className="h-4 w-4" />,
    formats: [
      { value: "xlsx", label: "Excel Spreadsheet (.xlsx)", accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      { value: "xls", label: "Excel Spreadsheet - Legacy (.xls)", accept: "application/vnd.ms-excel" },
      { value: "csv", label: "CSV File (.csv)", accept: "text/csv" },
      { value: "ods", label: "OpenDocument Spreadsheet (.ods)", accept: "application/vnd.oasis.opendocument.spreadsheet" },
    ]
  },
  {
    name: "Presentations",
    icon: <FileTextIcon className="h-4 w-4" />,
    formats: [
      { value: "pptx", label: "PowerPoint Presentation (.pptx)", accept: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
      { value: "ppt", label: "PowerPoint Presentation - Legacy (.ppt)", accept: "application/vnd.ms-powerpoint" },
      { value: "odp", label: "OpenDocument Presentation (.odp)", accept: "application/vnd.oasis.opendocument.presentation" },
    ]
  },
  {
    name: "Images",
    icon: <ImageIcon className="h-4 w-4" />,
    formats: [
      { value: "jpg", label: "JPEG Image (.jpg)", accept: "image/jpeg" },
      { value: "png", label: "PNG Image (.png)", accept: "image/png" },
    ]
  }
];

// Form schema
const formSchema = z.object({
  inputFormat: z.string().min(1, "Please select an input format"),
  outputFormat: z.string().min(1, "Please select an output format"),
  enableOcr: z.boolean().default(false),
  quality: z.number().min(10).max(100).default(90),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Get all input formats as flattened array
const getAllInputFormats = () => {
  return FORMAT_CATEGORIES.flatMap(category => category.formats);
};

// Get all acceptable MIME types for the selected input format
const getAcceptedFileTypes = (inputFormat: string) => {
  const allFormats = getAllInputFormats();
  const format = allFormats.find(f => f.value === inputFormat);
  return format ? { [format.accept]: [`.${format.value}`] } : {};
};

// Get file Icon based on format
const getFileIcon = (format: string) => {
  if (['jpg', 'jpeg', 'png'].includes(format)) {
    return <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
  } else if (['xlsx', 'xls', 'csv', 'ods'].includes(format)) {
    return <TableIcon className="h-6 w-6 text-green-600 dark:text-green-400" />;
  } else if (['pptx', 'ppt', 'odp'].includes(format)) {
    return <FileTextIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />;
  } else {
    return <FileIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
  }
};

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptedFileTypes, setAcceptedFileTypes] = useState<Record<string, string[]>>({});

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputFormat: "pdf",
      outputFormat: "docx",
      enableOcr: false,
      quality: 90,
      password: "",
    },
  });

  // Watch inputFormat to update accepted file types for the dropzone
  const inputFormat = form.watch("inputFormat");

  useEffect(() => {
    setAcceptedFileTypes(getAcceptedFileTypes(inputFormat));
  }, [inputFormat]);

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.file.size > 50 * 1024 * 1024) {
          setError("File is too large. Maximum size is 50MB.");
        } else {
          setError(`Please upload a valid ${inputFormat.toUpperCase()} file.`);
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
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setConvertedFileUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("inputFormat", values.inputFormat);
    formData.append("outputFormat", values.outputFormat);
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
        throw new Error(errorData.error || `Failed to convert ${values.inputFormat.toUpperCase()} to ${values.outputFormat.toUpperCase()}`);
      }

      const data = await response.json();
      setProgress(100);
      setConvertedFileUrl(data.fileUrl);
      
      toast.success("Conversion Successful", {
        description: `Your ${values.inputFormat.toUpperCase()} has been converted to ${values.outputFormat.toUpperCase()}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Conversion Failed", {
        description: err instanceof Error ? err.message : "Failed to convert your file",
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

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || "";
  };

  // Check if format is an image format
  const isImageFormat = form.watch("outputFormat") === "jpg" || form.watch("outputFormat") === "png";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: File selection */}
          <div className="space-y-4">
            <div className="text-lg font-medium">1. Select Input File</div>
            
            {/* Input Format Dropdown */}
            <FormField
              control={form.control}
              name="inputFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input Format</FormLabel>
                  <Select
                    disabled={isUploading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset file when format changes
                      if (file) {
                        setFile(null);
                        setConvertedFileUrl(null);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select input format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORMAT_CATEGORIES.map((category) => (
                        <div key={category.name}>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground flex items-center">
                            {category.icon}
                            <span className="ml-1">{category.name}</span>
                          </div>
                          {category.formats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </div>
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
                isUploading && "pointer-events-none opacity-60"
              )}
            >
              <input {...getInputProps()} disabled={isUploading} />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    {getFileIcon(getFileExtension(file.name).toLowerCase())}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileExtension(file.name)}
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
                    {isDragActive ? `Drop your ${inputFormat.toUpperCase()} here` : `Drag & drop your ${inputFormat.toUpperCase()}`}
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Drop your file here or click to browse. Maximum size is 50MB.
                  </p>
                  <Button type="button" variant="secondary" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
            
            {/* Password for protected PDFs */}
            {inputFormat === 'pdf' && (
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
            )}
          </div>
          
          {/* Right column: Conversion options */}
          <div className="space-y-4">
            <div className="text-lg font-medium">2. Choose Conversion Options</div>
            
            {/* Output Format Selection */}
            <FormField
              control={form.control}
              name="outputFormat"
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
                        <SelectValue placeholder="Select output format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORMAT_CATEGORIES.map((category) => (
                        <div key={category.name}>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground flex items-center">
                            {category.icon}
                            <span className="ml-1">{category.name}</span>
                          </div>
                          {category.formats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </div>
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
            
            {/* Conversion Information */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">About This Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Converting from <span className="font-medium">{inputFormat.toUpperCase()}</span> to <span className="font-medium">{form.watch("outputFormat").toUpperCase()}</span> using LibreOffice technology.
                </p>
              </CardContent>
            </Card>
          </div>
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
        
        {/* Progress indicator */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ReloadIcon className="h-4 w-4 animate-spin" />
              Converting your file... {progress}%
            </div>
          </div>
        )}
        
        {/* Conversion result */}
        {convertedFileUrl && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircledIcon className="h-5 w-5" />
                Conversion Successful!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Your file has been successfully converted and is now ready for download.
              </p>
              <Button 
                className="w-full" 
                asChild
                variant="default"
              >
                <a href={convertedFileUrl} download>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Converted File
                </a>
              </Button>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Files are automatically deleted after 24 hours for privacy and security.
            </CardFooter>
          </Card>
        )}
        
        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!file || isUploading}
        >
          {isUploading ? "Converting..." : "Convert File"}
        </Button>
      </form>
    </Form>
  );
}