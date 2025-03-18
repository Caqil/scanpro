"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
  CopyIcon,
} from "@radix-ui/react-icons";
import { AlertCircle, FileText, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatedOcrText } from "./animated-ocr-text";

// Available languages for OCR
const OCR_LANGUAGES = [
  { value: "eng", label: "English" },
  { value: "fra", label: "French" },
  { value: "deu", label: "German" },
  { value: "spa", label: "Spanish" },
  { value: "ita", label: "Italian" },
  { value: "por", label: "Portuguese" },
  { value: "chi_sim", label: "Chinese (Simplified)" },
  { value: "chi_tra", label: "Chinese (Traditional)" },
  { value: "jpn", label: "Japanese" },
  { value: "kor", label: "Korean" },
  { value: "rus", label: "Russian" },
  { value: "ara", label: "Arabic" },
  { value: "hin", label: "Hindi" },
];

// Define form schema
const formSchema = z.object({
  language: z.string().default("eng"),
  pageRange: z.enum(["all", "specific"]).default("all"),
  pages: z.string().optional(),
  enhanceScanned: z.boolean().default(true),
  preserveLayout: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function PdfOcrExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [textFile, setTextFile] = useState<{ url: string, filename: string } | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "eng",
      pageRange: "all",
      pages: "",
      enhanceScanned: true,
      preserveLayout: true,
    },
  });

  // Watch pageRange field for conditional rendering
  const pageRange = form.watch("pageRange");

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
        setExtractedText(null);
        setTextFile(null);
        setError(null);
        
        // Estimate number of pages based on file size
        // This is just an estimate - in a real implementation,
        // you might want to actually analyze the PDF
        const fileSizeInMB = acceptedFiles[0].size / (1024 * 1024);
        const estimatedPages = Math.max(1, Math.round(fileSizeInMB * 5)); // Assuming 1MB ≈ 5 pages
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
    setExtractedText(null);
    setTextFile(null);
    setError(null);
    setTotalPages(0);
  };

  // Copy extracted text to clipboard
  const copyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText)
        .then(() => {
          toast.success("Text copied to clipboard");
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          toast.error("Failed to copy text");
        });
    }
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setExtractedText(null);
    setTextFile(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", values.language);
    formData.append("pageRange", values.pageRange);
    
    if (values.pageRange === "specific" && values.pages) {
      formData.append("pages", values.pages);
    }
    
    formData.append("enhanceScanned", values.enhanceScanned.toString());
    formData.append("preserveLayout", values.preserveLayout.toString());

    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // OCR is CPU-intensive, so we'll progress more slowly
          const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
          
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return Math.min(95, prev + increment);
        });
      }, 500);

      // Make API request
      const response = await fetch('/api/ocr/extract', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract text from PDF file");
      }

      const data = await response.json();
      setProgress(100);
      
      if (data.text) {
        setExtractedText(data.text);
      }
      
      if (data.fileUrl && data.filename) {
        setTextFile({
          url: data.fileUrl,
          filename: data.filename
        });
      }
      
      toast.success("Text Extraction Successful", {
        description: `Successfully extracted ${data.wordCount} words from your PDF.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Extraction Failed", {
        description: err instanceof Error ? err.message : "Failed to extract text from your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Extract Text from PDF Using OCR</CardTitle>
        <CardDescription>
          Use Optical Character Recognition to extract text from scanned PDFs or image-based PDFs
        </CardDescription>
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
                      {formatFileSize(file.size)} • Approximately {totalPages} pages
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
                    Drop your PDF file here or click to browse. For best results, use scanned PDFs with clear text.
                  </p>
                  <Button type="button" variant="secondary" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
            
            {/* OCR Options */}
            {file && !extractedText && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Language Selection */}
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OCR Language</FormLabel>
                        <Select
                          disabled={isProcessing}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OCR_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Select the main language of your document for better accuracy
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Page Range Selection */}
                  <FormField
                    control={form.control}
                    name="pageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Range</FormLabel>
                        <Select
                          disabled={isProcessing}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select page range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Pages</SelectItem>
                            <SelectItem value="specific">Specific Pages</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Specific Pages Input */}
                {pageRange === "specific" && (
                  <FormField
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Numbers</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="E.g. 1,3,5-9"
                            className="resize-none"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Specify page numbers separated by commas (e.g., 1,3,5) or page ranges with a dash (e.g., 1-5)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Advanced Settings</h3>
                  
                  {/* Enhanced Scanning Option */}
                  <FormField
                    control={form.control}
                    name="enhanceScanned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Enhance scanned images
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Pre-process images to improve OCR accuracy (recommended for scanned documents)
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {/* Preserve Layout Option */}
                  <FormField
                    control={form.control}
                    name="preserveLayout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Preserve layout
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Try to maintain the original layout with paragraphs and line breaks
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isProcessing && (
  <div className="space-y-4">
    <Progress value={progress} className="h-2" />
    <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
      <Languages className="h-6 w-6 animate-pulse text-blue-500" />
      <div className="text-center">
        <p className="font-medium">Processing OCR... {progress}%</p>
        <AnimatedOcrText progress={progress} />
      </div>
    </div>
    <p className="text-xs text-center text-muted-foreground">
      OCR processing can take a few minutes depending on document size and complexity
    </p>
  </div>
)}
            
            {/* Extracted Text */}
            {extractedText && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Extracted Text</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard}
                    >
                      <CopyIcon className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    {textFile && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        asChild
                      >
                        <a
                          href={`/api/file?folder=ocr&filename=${encodeURIComponent(textFile.filename)}`}
                          download
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" /> Download .txt
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="border rounded-lg p-4 max-h-80 overflow-y-auto bg-muted/20">
                  <pre className="text-sm whitespace-pre-wrap font-sans">{extractedText}</pre>
                </div>
              </div>
            )}
            
          </CardContent>
          <CardFooter className="flex justify-end">
            {file && !extractedText && (
              <Button 
                type="submit" 
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Extract Text"}
              </Button>
            )}
            
            {extractedText && (
              <Button 
                type="button" 
                onClick={handleRemoveFile}
              >
                Process Another PDF
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}