// components/pdf-password-protector.tsx
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
} from "@radix-ui/react-icons";
import { AlertCircle, LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schema
const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  permission: z.enum(["all", "restricted"]).default("restricted"),
  allowPrinting: z.boolean().default(true),
  allowCopying: z.boolean().default(false),
  allowEditing: z.boolean().default(false),
  protectionLevel: z.enum(["128", "256"]).default("256"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export function PdfPasswordProtector() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [protectedFileUrl, setProtectedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      permission: "restricted",
      allowPrinting: true,
      allowCopying: false,
      allowEditing: false,
      protectionLevel: "256",
    },
  });

  // Watch permission field to conditionally render restrictions
  const permission = form.watch("permission");

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
        setProtectedFileUrl(null);
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

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setProtectedFileUrl(null);
    setError(null);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setError("Please select a PDF file to protect");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setProtectedFileUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", values.password);
    formData.append("permission", values.permission);
    formData.append("protectionLevel", values.protectionLevel);
    
    if (values.permission === "restricted") {
      formData.append("allowPrinting", values.allowPrinting.toString());
      formData.append("allowCopying", values.allowCopying.toString());
      formData.append("allowEditing", values.allowEditing.toString());
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
      const response = await fetch('/api/pdf/protect', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to protect PDF file");
      }

      const data = await response.json();
      setProgress(100);
      setProtectedFileUrl(data.filename);
      
      toast.success("Password Protection Added", {
        description: "Your PDF has been successfully protected with a password.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Protection Failed", {
        description: err instanceof Error ? err.message : "Failed to protect your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Password Protect PDF</CardTitle>
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
            
            {/* Protection Options */}
            {file && !protectedFileUrl && (
              <div className="space-y-6 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm password"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Protection Level */}
                <FormField
                  control={form.control}
                  name="protectionLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Encryption Level</FormLabel>
                      <Select
                        disabled={isProcessing}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select encryption level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="128">128-bit AES (Compatible with Acrobat 7 and later)</SelectItem>
                          <SelectItem value="256">256-bit AES (Compatible with Acrobat X and later)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher encryption provides better security but may reduce compatibility with older PDF readers.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Permission Selection */}
                <FormField
                  control={form.control}
                  name="permission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Permissions</FormLabel>
                      <Select
                        disabled={isProcessing}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select permission level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Allow All (Password to Open Only)</SelectItem>
                          <SelectItem value="restricted">Restricted Access (Custom Permissions)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Restricted Permissions */}
                {permission === "restricted" && (
                  <div className="space-y-4 border p-4 rounded-lg">
                    <h3 className="text-sm font-medium">Allowed Actions:</h3>
                    
                    <FormField
                      control={form.control}
                      name="allowPrinting"
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
                              Allow Printing
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allowCopying"
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
                              Allow Copying Text and Images
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allowEditing"
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
                              Allow Editing and Annotations
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
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
                  <LockIcon className="h-4 w-4 animate-pulse" />
                  <span>Encrypting your PDF... {progress}%</span>
                </div>
              </div>
            )}
            
            {/* Results */}
            {protectedFileUrl && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircledIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      PDF successfully protected!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Your PDF file has been encrypted and password-protected.
                    </p>
                    <Button 
                      className="w-full sm:w-auto" 
                      asChild
                      variant="default"
                    >
                      <a href={`/api/file?folder=protected&filename=${encodeURIComponent(protectedFileUrl)}`} download>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download Protected PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
            
            {!protectedFileUrl && (
              <Button 
                type="submit" 
                disabled={!file || isProcessing}
              >
                {isProcessing ? "Protecting..." : "Protect PDF"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}