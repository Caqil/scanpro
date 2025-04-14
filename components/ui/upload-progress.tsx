"use client";

import { Progress } from "@/components/ui/progress";
import {
  UploadCloudIcon,
  CheckCircleIcon,
  XCircleIcon,
  LoaderIcon,
} from "lucide-react";

interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
  error: Error | null;
  isProcessing?: boolean;
  processingProgress?: number;
  variant?: "default" | "compact";
  label?: string;
}

export function UploadProgress({
  progress,
  isUploading,
  error,
  isProcessing = false,
  processingProgress = 0,
  variant = "default",
  label,
}: UploadProgressProps) {
  // Determine the effective progress (upload or processing)
  const effectiveProgress = isUploading
    ? progress
    : isProcessing
    ? processingProgress
    : progress === 100 && !error
    ? 100
    : 0;

  // Determine the status text
  let statusText = "";
  if (isUploading) {
    statusText = label || "Uploading...";
  } else if (isProcessing) {
    statusText = "Processing...";
  } else if (progress === 100 && !error) {
    statusText = "Complete";
  } else if (error) {
    statusText = error.message || "Upload failed";
  }

  // Render a compact version for inline use
  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-2 text-sm ${
          error ? "text-red-500" : "text-muted-foreground"
        }`}
      >
        {isUploading || isProcessing ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : error ? (
          <XCircleIcon className="h-4 w-4 text-red-500" />
        ) : progress === 100 ? (
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        ) : (
          <UploadCloudIcon className="h-4 w-4" />
        )}
        <span>
          {statusText}{" "}
          {(isUploading || isProcessing) && `${effectiveProgress}%`}
        </span>
      </div>
    );
  }

  // Default full-size version
  return (
    <div className="space-y-2">
      <Progress value={effectiveProgress} className="h-2" />
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        {isUploading || isProcessing ? (
          <>
            {isUploading ? (
              <UploadCloudIcon className="h-4 w-4 animate-pulse" />
            ) : (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            )}
            <span>
              {statusText} {effectiveProgress}%
            </span>
          </>
        ) : error ? (
          <>
            <XCircleIcon className="h-4 w-4 text-red-500" />
            <span className="text-red-500">{statusText}</span>
          </>
        ) : progress === 100 ? (
          <>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span>{statusText}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
