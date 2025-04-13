"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileIcon, 
  Cross2Icon, 
  UploadIcon, 
  TrashIcon,
} from "@radix-ui/react-icons";
import { FileImage, FileText, FileSpreadsheet, PresentationIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/src/store/store";

// This interface represents a file with additional metadata and processing status
export interface UploadedFile {
  file: File;
  id: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress?: number;
  result?: any; // This can store processed results like URLs, etc.
  error?: string;
  preview?: string; // For image previews
}

// Supported file types configuration
export const FILE_TYPES = {
  PDF: {
    accept: { 'application/pdf': ['.pdf'] },
    icon: <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />,
    bgColor: "bg-red-100 dark:bg-red-900/30"
  },
  IMAGE: {
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    icon: <FileImage className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  OFFICE: {
    accept: { 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf'],
      'text/html': ['.html'],
    },
    icon: <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  SPREADSHEET: {
    accept: { 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    icon: <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />,
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  PRESENTATION: {
    accept: { 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
    },
    icon: <PresentationIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
    bgColor: "bg-orange-100 dark:bg-orange-900/30"
  },
  // You can add more file type configurations as needed
};

interface UniversalFileUploaderProps {
  // Core functionality props
  fileTypes: (keyof typeof FILE_TYPES)[] | string[]; // Which file types to allow
  maxFiles?: number; // Maximum number of files allowed (default: 1)
  maxFileSize?: number; // Maximum file size in bytes (default: 100MB)
  multiple?: boolean; // Allow multiple file selection (default: false)
  initialFiles?: UploadedFile[]; // Initial files to display
  
  // Callbacks
  onFilesChange?: (files: UploadedFile[]) => void; // Called when files are added/removed
  onFileUpload?: (file: File) => Promise<any>; // Called when a file is selected for immediate upload
  
  // UI customization
  className?: string; // Additional CSS classes
  dropzoneText?: string; // Custom text for dropzone
  allowReordering?: boolean; // Enable drag & drop reordering (default: false)
  showFileList?: boolean; // Show the list of files (default: true)
  hideAddButton?: boolean; // Hide the add button when files are present (default: false)
  compact?: boolean; // Use compact mode (default: false)
  
  // Validation & restrictions
  acceptMultipleFileTypes?: boolean; // Allow multiple file types (default: false)
  validateFileContent?: boolean; // Validate file content beyond extension (default: false)
  preserveFileOrder?: boolean; // Keep files in the order they were added (default: true)
  disabled?: boolean; // Disable the uploader (default: false)
}

export function UniversalFileUploader({
  fileTypes = ['PDF'],
  maxFiles = 1,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  multiple = false,
  initialFiles = [],
  onFilesChange,
  onFileUpload,
  className = "",
  dropzoneText,
  allowReordering = false,
  showFileList = true,
  hideAddButton = false,
  compact = false,
  acceptMultipleFileTypes = false,
  validateFileContent = false,
  preserveFileOrder = true,
  disabled = false,
}: UniversalFileUploaderProps) {
  const { t } = useLanguageStore();
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  
  // Generate a unique ID for each file
  const generateId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Prepare file type acceptances
  const getAcceptedFileTypes = () => {
    if (!acceptMultipleFileTypes && fileTypes.length === 1) {
      // Single file type mode
      const fileType = fileTypes[0] as keyof typeof FILE_TYPES;
      return FILE_TYPES[fileType]?.accept || {};
    } else {
      // Multiple file types mode
      const acceptObj: Record<string, string[]> = {};
      fileTypes.forEach(type => {
        const fileType = type as keyof typeof FILE_TYPES;
        if (FILE_TYPES[fileType]) {
          Object.entries(FILE_TYPES[fileType].accept).forEach(([mimeType, extensions]) => {
            if (!acceptObj[mimeType]) {
              acceptObj[mimeType] = [];
            }
            acceptObj[mimeType].push(...extensions);
          });
        }
      });
      return acceptObj;
    }
  };
  
  // Get file type info based on file extension
  const getFileTypeInfo = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Check each file type to find a match
    for (const [typeName, typeInfo] of Object.entries(FILE_TYPES)) {
      for (const [_, extensions] of Object.entries(typeInfo.accept)) {
        if (extensions.some(ext => ext.toLowerCase().includes(extension))) {
          return {
            type: typeName,
            icon: typeInfo.icon,
            bgColor: typeInfo.bgColor
          };
        }
      }
    }
    
    // Default to generic file
    return {
      type: 'unknown',
      icon: <FileIcon className="h-5 w-5" />,
      bgColor: "bg-gray-100 dark:bg-gray-800"
    };
  };
  
  // Set up dropzone for file uploads
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: getAcceptedFileTypes(),
    maxSize: maxFileSize, 
    multiple: multiple && maxFiles > 1,
    disabled,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        
        if (rejection.file.size > maxFileSize) {
          setError(t('fileUploader.maxSize') || `File is too large. Maximum size is ${formatFileSize(maxFileSize)}.`);
        } else {
          setError(t('fileUploader.inputFormat') || "Please upload files in the correct format.");
        }
        return;
      }
      
      // Handle accepted files
      if (acceptedFiles.length > 0) {
        setError(null);
        
        // Check max files limit
        if (!multiple && files.length + acceptedFiles.length > maxFiles) {
          if (maxFiles === 1) {
            // Replace the existing file
            const newFiles = acceptedFiles.slice(0, 1).map(file => ({
              file,
              id: generateId(),
              status: 'idle' as const,
              preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
            }));
            
            // Clean up previous previews
            files.forEach(file => {
              if (file.preview) URL.revokeObjectURL(file.preview);
            });
            
            setFiles(newFiles);
          } else {
            setError(t('fileUploader.tooManyFiles') || `You can only upload a maximum of ${maxFiles} files.`);
            return;
          }
        } else {
          // Add new files to the list, check for duplicates if needed
          setFiles(prev => {
            const existingFileNames = new Set(prev.map(f => f.file.name));
            const newFiles = acceptedFiles
              .filter(file => !existingFileNames.has(file.name) || !multiple)
              .slice(0, maxFiles - prev.length)
              .map(file => ({
                file,
                id: generateId(),
                status: 'idle' as const,
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
              }));
              
            return multiple ? [...prev, ...newFiles] : newFiles;
          });
        }
        
        // Automatically upload files if handler provided
        if (onFileUpload) {
          acceptedFiles.forEach(file => {
            handleFileUpload(file);
          });
        }
      }
    }
  });

  // Handle manual file upload
  const handleFileUpload = async (file: File) => {
    if (!onFileUpload) return;
    
    // Update file status to processing
    setFiles(prev => prev.map(f => 
      f.file.name === file.name 
        ? { ...f, status: 'processing' as const, progress: 0 } 
        : f
    ));
    
    try {
      // Start progress simulation
      const fileId = files.find(f => f.file.name === file.name)?.id;
      if (fileId) {
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileId && f.status === 'processing'
              ? { ...f, progress: Math.min((f.progress || 0) + 5, 95) }
              : f
          ));
        }, 300);
        
        // Process the file
        const result = await onFileUpload(file);
        
        // Clear progress interval
        clearInterval(progressInterval);
        
        // Update file status to completed
        setFiles(prev => prev.map(f => 
          f.id === fileId
            ? { ...f, status: 'completed' as const, progress: 100, result }
            : f
        ));
        
        return result;
      }
    } catch (err) {
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.file.name === file.name 
          ? { 
              ...f, 
              status: 'error' as const, 
              error: err instanceof Error ? err.message : "Unknown error" 
            }
          : f
      ));
      
      toast.error(
        t('fileUploader.uploadFailed') || "Upload failed", 
        { description: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };
  
  // Handle drag-and-drop reordering (when allowReordering is true)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (disabled || !allowReordering) return;
    setDragId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!allowReordering || !dragId || dragId === targetId || disabled) return;

    const newFiles = [...files];
    const draggedIndex = newFiles.findIndex(f => f.id === dragId);
    const targetIndex = newFiles.findIndex(f => f.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const [draggedItem] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, draggedItem);
    
    setFiles(newFiles);
    setDragId(null);
  };
  
  // Handle file removal
  const handleRemoveFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter(f => f.id !== id);
    });
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
  
  // Clear all files
  const clearFiles = () => {
    // Clean up previews
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setError(null);
  };
  
  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, []);
  
  // Notify parent component of file changes
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files);
    }
  }, [files, onFilesChange]);

  // Get dropzone text based on file types
  const getDropzoneText = () => {
    if (dropzoneText) return dropzoneText;
    
    if (fileTypes.length === 1) {
      const fileType = fileTypes[0];
      switch (fileType) {
        case 'PDF':
          return t('fileUploader.dropPdf') || "Drop your PDF file here";
        case 'IMAGE':
          return t('fileUploader.dropImage') || "Drop your image file here";
        default:
          return t('fileUploader.dropHere') || "Drop your file here";
      }
    } else {
      return t('fileUploader.dropFiles') || "Drop your files here";
    }
  };
  
  // Determine if the dropzone should be shown
  const showDropzone = !hideAddButton || files.length === 0;
  
  return (
    <div className={className}>
      {/* File Drop Zone */}
      {showDropzone && (
        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-lg transition-colors cursor-pointer",
            compact ? "p-4" : "p-8",
            isDragActive ? "border-primary bg-primary/10" : 
              files.length > 0 ? "border-green-500 bg-green-50 dark:bg-green-950/20" : 
              "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <input {...getInputProps()} disabled={disabled} />
          
          <div className="flex flex-col items-center gap-2">
            <div className={cn("rounded-full flex items-center justify-center", 
              compact ? "h-10 w-10 bg-muted/50" : "h-12 w-12 bg-muted")}>
              <UploadIcon className={cn("text-muted-foreground", 
                compact ? "h-5 w-5" : "h-6 w-6")} />
            </div>
            {!compact && (
              <div className="text-lg font-medium">
                {isDragActive ? t('fileUploader.dropHere') : getDropzoneText()}
              </div>
            )}
            <p className={cn("text-muted-foreground max-w-sm text-center",
              compact ? "text-xs" : "text-sm")}>
              {compact 
                ? (t('fileUploader.dropHereCompact') || "Drop files or click to browse")
                : (t('fileUploader.dropHereDesc') || "Drop your files here or click to browse.")}
              {" "}
              {t('fileUploader.maxSize') || `Maximum size is ${formatFileSize(maxFileSize)}.`}
            </p>
            
            {!compact && (
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                className="mt-2"
                disabled={disabled}
              >
                {t('fileUploader.browse') || "Browse Files"}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Add more files button (only shown when multiple=true, files exist, and not at max) */}
      {multiple && files.length > 0 && files.length < maxFiles && !hideAddButton && (
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={open}
          className="mt-4"
          disabled={disabled}
        >
          <UploadIcon className="h-4 w-4 mr-2" />
          {t('fileUploader.addMore') || "Add More Files"}
        </Button>
      )}
    </div>
  );
}