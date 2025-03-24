"use client";

import { useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PdfPreview } from "@/components/pdf-preview";
import { SignaturePad } from "@/components/signature-pad";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
} from "@radix-ui/react-icons";
import { AlertCircle, PenTool, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguageStore } from "@/src/store/store";

// Define form schema
const formSchema = z.object({
  signatureType: z.enum(["draw", "type"]).default("draw"),
  signatureText: z.string().optional(),
  signatureFont: z.string().default("cursive"),
});

type FormValues = z.infer<typeof formSchema>;

export function PdfSignatureTool() {
  const { t } = useLanguageStore();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState({ 
    x: 100, 
    y: 100, 
    page: 1,
    width: 150,
    height: 50 
  });
  
  const handlePositionChange = (x: number, y: number, pageNumber: number) => {
    setSignaturePosition(prev => ({ ...prev, x, y, page: pageNumber }));
  };
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signatureType: "draw",
      signatureText: "",
      signatureFont: "cursive",
    },
  });

  // Watch signature type to conditionally render content
  const signatureType = form.watch("signatureType");

  // Configure dropzone for PDF files
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
          setError(t('fileUploader.maxSize'));
        } else {
          setError(t('fileUploader.inputFormat'));
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setSignedPdfUrl(null);
        setError(null);
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

  // Handle signature capture from SignaturePad component
  const handleSignatureCapture = (signatureData: string) => {
    setSignatureImage(signatureData);
  };


  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setSignedPdfUrl(null);
    setError(null);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError(t('signPdf.error.noFile'));
      return;
    }

    if (values.signatureType === "draw" && !signatureImage) {
      setError(t('signPdf.error.noSignature'));
      return;
    }

    if (values.signatureType === "type" && !values.signatureText) {
      setError(t('signPdf.error.noText'));
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSignedPdfUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signatureType", values.signatureType);
    
    if (values.signatureType === "draw" && signatureImage) {
      formData.append("signatureImage", signatureImage);
    } else if (values.signatureType === "type") {
      formData.append("signatureText", values.signatureText || "");
      formData.append("signatureFont", values.signatureFont);
    }
    
    // Add signature position
    formData.append("signatureX", signaturePosition.x.toString());
    formData.append("signatureY", signaturePosition.y.toString());
    formData.append("signaturePage", signaturePosition.page.toString());

    try {
      // Simulate progress
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
        throw new Error(errorData.error || t('signPdf.error.failed'));
      }

      const data = await response.json();
      setProgress(100);
      setSignedPdfUrl(data.fileUrl);
      
      toast.success(t('signPdf.success') || "PDF signed successfully!", {
        description: t('signPdf.successDesc') || "Your PDF has been signed and is ready for download.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('signPdf.error.unknown') || "An unknown error occurred");
      toast.error(t('signPdf.error.failed') || "Failed to sign PDF", {
        description: err instanceof Error ? err.message : t('signPdf.error.unknown') || "An unknown error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>{t('signPdf.title') || "Sign PDF"}</CardTitle>
        <CardDescription>{t('signPdf.description') || "Add your signature to PDF documents"}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* File Uploader */}
            {!file && (
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  isDragActive ? "border-primary bg-primary/10" : 
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
                    {isDragActive ? t('fileUploader.dropHere') : t('fileUploader.dragAndDrop')}
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {t('fileUploader.dropHereDesc')} {t('fileUploader.maxSize')}
                  </p>
                  <Button type="button" variant="secondary" size="sm" className="mt-2">
                    {t('fileUploader.browse')}
                  </Button>
                </div>
              </div>
            )}

            {/* PDF Preview and Signature Editor */}
            {file && !signedPdfUrl && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: PDF Preview */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('signPdf.preview') || "Document Preview"}</h3>
                  <PdfPreview 
  file={file} 
  signatureImage={signatureType === "draw" ? signatureImage : null}
  signatureText={signatureType === "type" ? form.getValues("signatureText") : null}
  signatureType={signatureType}
  onPositionChange={handlePositionChange}
/>
                </div>

                {/* Right column: Signature Creation */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('signPdf.createSignature') || "Create Your Signature"}</h3>
                  
                  <Tabs 
                    defaultValue="draw" 
                    value={signatureType}
                    onValueChange={(value) => form.setValue("signatureType", value as "draw" | "type")}
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="draw">
                        <PenTool className="h-4 w-4 mr-2" />
                        {t('signPdf.draw') || "Draw"}
                      </TabsTrigger>
                      <TabsTrigger value="type">
                        <Type className="h-4 w-4 mr-2" />
                        {t('signPdf.type') || "Type"}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="draw">
                      <div className="border rounded-lg p-4 bg-muted/10">
                        <p className="text-sm text-muted-foreground mb-4">
                          {t('signPdf.drawInstructions') || "Draw your signature below using your mouse or touch screen"}
                        </p>
                        <SignaturePad onSignatureCapture={handleSignatureCapture} />
                        {signatureImage && (
                          <div className="flex justify-center mt-4 p-4 bg-white border rounded">
                            <img 
                              src={signatureImage} 
                              alt="Your signature" 
                              className="max-h-20" 
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="type">
                      <div className="border rounded-lg p-4 bg-muted/10 space-y-4">
                        <FormField
                          control={form.control}
                          name="signatureText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('signPdf.form.text') || "Signature Text"}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('signPdf.form.textPlaceholder') || "Type your name"}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="signatureFont"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('signPdf.form.font') || "Font Style"}</FormLabel>
                              <FormControl>
                                <select
                                  className="w-full p-2 border rounded-md"
                                  {...field}
                                >
                                  <option value="cursive">Signature (Cursive)</option>
                                  <option value="'Brush Script MT', cursive">Brush Script</option>
                                  <option value="'Dancing Script', cursive">Dancing Script</option>
                                  <option value="'Times New Roman', serif">Times New Roman</option>
                                  <option value="Arial, sans-serif">Arial</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.getValues("signatureText") && (
                          <div className="flex justify-center mt-4 p-4 bg-white border rounded">
                            <p style={{ 
                              fontFamily: form.getValues("signatureFont"), 
                              fontSize: "24px" 
                            }}>
                              {form.getValues("signatureText")}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('signPdf.positionInstructions') || "Drag the signature on the document preview to position it where you want"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('signPdf.currentPosition') || "Current position:"} X: {Math.round(signaturePosition.x)}, Y: {Math.round(signaturePosition.y)}, Page: {signaturePosition.page}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* File Information (when file is selected) */}
            {file && !signedPdfUrl && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                >
                  <Cross2Icon className="h-4 w-4 mr-1" /> {t('ui.remove')}
                </Button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Progress Indicator */}
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <PenTool className="h-4 w-4 animate-pulse" />
                  <span>{t('signPdf.signing') || "Signing your PDF..."} {progress}%</span>
                </div>
              </div>
            )}

            {/* Signed PDF Result */}
            {signedPdfUrl && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      {t('signPdf.success') || "PDF signed successfully!"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {t('signPdf.successDesc') || "Your signature has been added to the PDF document."}
                    </p>
                    <Button 
                      className="w-full sm:w-auto" 
                      asChild
                      variant="default"
                    >
                      <a href={signedPdfUrl} download target="_blank">
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        {t('signPdf.download') || "Download Signed PDF"}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {file && !signedPdfUrl && (
              <Button 
                type="submit" 
                disabled={isProcessing || 
                  (signatureType === "draw" && !signatureImage) || 
                  (signatureType === "type" && !form.getValues("signatureText"))
                }
              >
                {isProcessing ? t('ui.processing') : t('signPdf.sign') || "Sign PDF"}
              </Button>
            )}
            
            {signedPdfUrl && (
              <Button
                variant="outline"
                onClick={handleRemoveFile}
              >
                {t('ui.reupload') || "Sign Another PDF"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}