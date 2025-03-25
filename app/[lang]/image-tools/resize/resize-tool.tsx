// app/[lang]/image-tools/resize/resize-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguageStore } from "@/src/store/store";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resizeImagePreview } from "@/lib/image-preview";

export function ResizeImageTool() {
  const { t } = useLanguageStore();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMethod, setResizeMethod] = useState<string>("fit");
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number, height: number } | null>(null);

  // Handle dimension changes with aspect ratio preservation
  const handleWidthChange = (newWidth: number) => {
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newHeight = Math.round(newWidth / aspectRatio);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions({ ...dimensions, width: newWidth });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(newHeight * aspectRatio);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions({ ...dimensions, height: newHeight });
    }
  };

  // Function to set the original dimensions when an image is loaded
  const handleImageLoaded = (file: File) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setDimensions({ width: img.width, height: img.height });
      URL.revokeObjectURL(objectUrl);
    };
    
    img.src = objectUrl;
  };

  const renderOptions = (
    <div className="space-y-6">
      {originalDimensions && (
        <div className="text-sm text-muted-foreground mb-4">
          Original dimensions: {originalDimensions.width} × {originalDimensions.height} pixels
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            min="1"
            max="10000"
            value={dimensions.width}
            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            min="1"
            max="10000"
            value={dimensions.height}
            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="aspect-ratio" 
          checked={maintainAspectRatio}
          onCheckedChange={setMaintainAspectRatio}
        />
        <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="resize-method">Resize Method</Label>
        <Select
          value={resizeMethod}
          onValueChange={setResizeMethod}
        >
          <SelectTrigger id="resize-method">
            <SelectValue placeholder="Select resize method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fit">Fit (Preserve aspect ratio)</SelectItem>
            <SelectItem value="fill">Fill (Stretch to dimensions)</SelectItem>
            <SelectItem value="cover">Cover (Crop to fill)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {resizeMethod === "fit" 
            ? "Fit: Resizes the image to fit within the specified dimensions while maintaining the aspect ratio." 
            : resizeMethod === "fill" 
              ? "Fill: Stretches the image to exactly match the specified dimensions, which may distort the image."
              : "Cover: Resizes and crops the image to cover the specified dimensions while maintaining the aspect ratio."}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Common Sizes</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            type="button"
            className="px-3 py-2 border rounded-md text-xs hover:bg-muted transition-colors"
            onClick={() => setDimensions({ width: 1920, height: 1080 })}
          >
            1920×1080 (Full HD)
          </button>
          <button
            type="button"
            className="px-3 py-2 border rounded-md text-xs hover:bg-muted transition-colors"
            onClick={() => setDimensions({ width: 1280, height: 720 })}
          >
            1280×720 (HD)
          </button>
          <button
            type="button"
            className="px-3 py-2 border rounded-md text-xs hover:bg-muted transition-colors"
            onClick={() => setDimensions({ width: 800, height: 600 })}
          >
            800×600
          </button>
          <button
            type="button"
            className="px-3 py-2 border rounded-md text-xs hover:bg-muted transition-colors"
            onClick={() => setDimensions({ width: 640, height: 480 })}
          >
            640×480
          </button>
          <button
            type="button"
            className="px-3 py-2 border rounded-md text-xs hover:bg-muted transition-colors"
            onClick={() => setDimensions({ width: 1080, height: 1080 })}
          >
            1080×1080 (Instagram)
          </button>
          <button
            type="button"
            className="px-3 py-2 border rounded-md text-xs hover:bg-muted transition-colors"
            onClick={() => {
              if (originalDimensions) {
                setDimensions({ 
                  width: Math.round(originalDimensions.width / 2), 
                  height: Math.round(originalDimensions.height / 2) 
                });
              }
            }}
          >
            50% of Original
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Resize Image</h1>
        <p className="mt-2 text-muted-foreground">
          Change the dimensions of your images while maintaining quality
        </p>
      </div>
      
      <ImageProcessor
        title="Image Resizer"
        description="Upload an image to resize it to your desired dimensions."
        processEndpoint="image/resize"
        fileTypes={["image/jpeg", "image/png", "image/gif", "image/webp"]}
        processOptions={{ 
          width: dimensions.width,
          height: dimensions.height,
          method: resizeMethod
        }}
        renderOptions={renderOptions}
        onImageLoaded={handleImageLoaded}
        previewRenderer={resizeImagePreview}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Resize Images?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Resizing images is useful for many purposes:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Reduce file size for web uploads and sharing</li>
              <li>Fit images to specific dimensions for websites or social media</li>
              <li>Create thumbnails for galleries or previews</li>
              <li>Prepare images for printing at specific dimensions</li>
              <li>Make images suitable for email attachments</li>
              <li>Standardize dimensions in a collection of photos</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Understanding Resize Methods</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Fit</h3>
              <p className="text-sm text-muted-foreground">
                Resizes the image to fit entirely within the specified dimensions while maintaining the original aspect ratio. This ensures the image isn't distorted, but may result in "letterboxing" (empty space on sides or top/bottom).
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Fill</h3>
              <p className="text-sm text-muted-foreground">
                Stretches or compresses the image to exactly match the specified dimensions. This method may distort the image if the target dimensions have a different aspect ratio than the original.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Cover</h3>
              <p className="text-sm text-muted-foreground">
                Resizes the image to cover the entire specified dimensions while maintaining the aspect ratio, and crops any excess parts. This ensures no empty space but may crop parts of the image.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Maintain aspect ratio to prevent image distortion</li>
              <li>It's better to reduce an image's size rather than enlarge it, as enlarging can cause quality loss</li>
              <li>For web images, consider keeping file sizes under 200KB for optimal loading speeds</li>
              <li>For printing, aim for at least 300 pixels per inch (PPI) for high-quality results</li>
              <li>When in doubt about dimensions, use common sizes like 1920×1080 (Full HD) or 1280×720 (HD)</li>
              <li>For social media platforms, check their recommended dimensions for optimal display</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}