"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignaturePad } from "./signature-pad";
import { PdfPreview } from "./pdf-preview";
import { 
  Form,
  FormControl,
  FormDescription,
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
  ReloadIcon,
} from "@radix-ui/react-icons";
import { AlertCircle, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schema
const formSchema = z.object({
  signerName: z.string().min(1, "Signer name is required"),
  date: z.string().optional(),
  reason: z.string().optional(),
  signatureType: z.enum(["draw", "type"]).default("draw"),
  signatureText: z.string().optional().nullable(),
  position: z.enum(["auto", "custom"]).default("auto"),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  scope: z.enum(["all", "custom"]).default("all"),
  pages: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PdfSigner() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signedFileUrl, setSignedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signerName: "",
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      reason: "",
      signatureType: "draw",
      signatureText: null,
      position: "auto",
      scope: "all",
      pages: "",
    },
  });

  // Watch fields for conditional rendering
  const signatureType = form.watch("signatureType");
  const position = form.watch("position");
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
        setSignedFileUrl(null);
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
    setSignedFileUrl(null);
    setError(null);
    setTotalPages(null);
  };

  // Handle signature change
  const handleSignatureChange = (dataUrl: string | null) => {
    setSignatureImage(dataUrl);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError("Please select a PDF file to sign");
      return;
    }

    // Check if we have a signature (either drawn or typed)
    if (signatureType === "draw" && !signatureImage) {
      setError("Please draw your signature");
      return;
    }

    if (signatureType === "type" && !values.signatureText) {
      setError("Please enter your typed signature");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSignedFileUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signatureType", signatureType === "draw" ? "image" : "text");
    formData.append("signatureData", signatureType === "draw" ? signatureImage as string : values.signatureText as string);
    formData.append("signerName", values.signerName);
    formData.append("date", values.date || new Date().toLocaleDateString());
    
    if (values.reason) {
      formData.append("reason", values.reason);
    }
    
    // Position data
    if (values.position === "auto") {
      formData.append("position", "auto");
    } else if (values.positionX !== undefined && values.positionY !== undefined) {
      const positionData = {
        x: values.positionX,
        y: values.positionY,
        width: 150, // Default signature width
        height: 50  // Default signature height
      };
      formData.append("position", JSON.stringify(positionData));
    }
    
    // Page selection
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
      const response = await fetch('/api/pdf/sign', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sign PDF file");
      }

      const data = await response.json();
      setProgress(100);
      setSignedFileUrl(data.filename);
      
      toast.success("PDF Signed Successfully", {
        description: `Document signed by ${data.signerName} on ${data.signatureDate}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Signing Failed", {
        description: err instanceof Error ? err.message : "Failed to sign your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Sign PDF Document</CardTitle>
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
            
            {/* Signature Options */}
            {file && !signedFileUrl && (
              <div className="space-y-6 mt-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Signer Name */}
                  <FormField
                    control={form.control}
                    name="signerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signer Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Signature Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signature Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Signing Reason */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Signing (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., Agreement, Approval, etc."
                          {...field}
                          disabled={isProcessing}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify why you are signing this document
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Signature Type Selection */}
                <FormField
                  control={form.control}
                  name="signatureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature Type</FormLabel>
                      <FormControl>
                        <Tabs
                          value={field.value}
                          onValueChange={field.onChange}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="draw" disabled={isProcessing}>Draw Signature</TabsTrigger>
                            <TabsTrigger value="type" disabled={isProcessing}>Type Signature</TabsTrigger>
                          </TabsList>
                          <TabsContent value="draw" className="p-4 border rounded-md mt-2">
                            <h3 className="text-sm font-medium mb-2">Draw Your Signature</h3>
                            <SignaturePad 
                              onChange={handleSignatureChange}
                              disabled={isProcessing}
                              className="bg-white"
                            />
                          </TabsContent>
                          <TabsContent value="type" className="p-4 border rounded-md mt-2">
                            <h3 className="text-sm font-medium mb-2">Type Your Signature</h3>
                            <FormField
                              control={form.control}
                              name="signatureText"
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    placeholder="Type your signature here..."
                                    {...field}
                                    value={field.value || ""}
                                    disabled={isProcessing}
                                  />
                                </FormControl>
                              )}
                            />
                          </TabsContent>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* PDF Preview with Draggable Signature */}
                {file && (signatureImage || (signatureType === "type" && form.watch("signatureText"))) && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Position Your Signature</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Drag your signature to position it exactly where you want it on the document.
                    </p>
                    <div className="relative">
                      <PdfPreview
                        file={file}
                        signatureImage={signatureImage}
                        signatureText={form.watch("signatureText") || null}
                        signatureType={signatureType}
                        onPositionChange={(x, y, pageNumber) => {
                          form.setValue("positionX", Math.round(x));
                          form.setValue("positionY", Math.round(y));
                          
                          // If on a specific page, update the pages field if in custom mode
                          if (form.watch("scope") === "custom") {
                            form.setValue("pages", String(pageNumber));
                          }
                          
                          // Auto switch to custom position mode
                          form.setValue("position", "custom");
                        }}
                      />
                      
                      {/* Fallback note in case the preview fails */}
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>If the PDF preview doesn't load correctly, you can still sign your document by selecting "Custom Position" below and entering coordinates manually.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Signature Position */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature Position</FormLabel>
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
                          <SelectItem value="auto">Automatic (Bottom Right)</SelectItem>
                          <SelectItem value="custom">Custom Position</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose "Custom" to use the position from dragging or enter coordinates manually
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Custom Position Fields (Hidden but still functional) */}
                <div className={position === "custom" ? "grid grid-cols-2 gap-4" : "hidden"}>
                  <FormField
                    control={form.control}
                    name="positionX"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X Position (points from left)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="X coordinate"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="positionY"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Y Position (points from bottom)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Y coordinate"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Page Selection */}
                <FormField
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pages to Sign</FormLabel>
                      <Select
                        disabled={isProcessing}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pages" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Pages</SelectItem>
                          <SelectItem value="custom">Specific Pages</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <FormDescription>
                          Enter page numbers separated by commas (e.g. 1,3,5,8)
                        </FormDescription>
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
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  <span>Signing your document... {progress}%</span>
                </div>
              </div>
            )}
            
            {/* Results */}
            {signedFileUrl && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      PDF successfully signed!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Your PDF document has been signed and is ready for download.
                    </p>
                    <Button 
                      className="w-full sm:w-auto" 
                      asChild
                      variant="default"
                    >
                      <a href={`/api/file?folder=signatures&filename=${encodeURIComponent(signedFileUrl)}`} download>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download Signed PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {file && !signedFileUrl && (
              <Button 
                type="submit" 
                disabled={isProcessing}
              >
                {isProcessing ? "Signing..." : "Sign PDF"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}