// app/[lang]/image-tools/png-to-webp/png-to-webp-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";

export function PngToWebpTool() {
  const { t } = useLanguageStore();
  const [quality, setQuality] = useState(80); // Default to 80% quality

  const renderQualityOptions = (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="quality">WebP Quality: {quality}%</Label>
        </div>
        <Slider
          id="quality"
          min={10}
          max={100}
          step={1}
          value={[quality]}
          onValueChange={(values) => setQuality(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          Higher quality results in larger file sizes. Lower quality reduces file size but may introduce artifacts.
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Convert PNG to WebP</h1>
        <p className="mt-2 text-muted-foreground">
          Convert your PNG images to WebP format for better compression and web performance
        </p>
      </div>
      
      <ImageProcessor
        title="PNG to WebP Converter"
        description="Upload a PNG image to convert it to WebP format with customizable quality."
        processEndpoint="image/png-to-webp"
        fileTypes={["image/png"]}
        processOptions={{ quality }}
        renderOptions={renderQualityOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Convert PNG to WebP?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Converting PNGs to WebP format offers several advantages:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>WebP offers better compression than PNG while maintaining visual quality</li>
              <li>Smaller file sizes lead to faster website loading times</li>
              <li>WebP supports both lossless and lossy compression</li>
              <li>WebP maintains alpha channel transparency like PNG</li>
              <li>Can reduce image file sizes by up to 30% compared to PNG</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">PNG vs WebP: Key Differences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">PNG Features</h3>
              <p className="text-sm text-muted-foreground">
                PNG uses lossless compression which preserves all image data. It's widely supported across all browsers and platforms but results in larger file sizes.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">WebP Features</h3>
              <p className="text-sm text-muted-foreground">
                WebP offers both lossy and lossless compression with significantly smaller file sizes. It supports transparency like PNG but has better compression algorithms, making it ideal for web usage.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Browser Compatibility</h2>
          <p className="text-sm text-muted-foreground mb-4">
            While WebP offers better performance, it's worth noting browser support:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Chrome, Edge, Firefox, and Opera fully support WebP</li>
            <li>Safari added WebP support from version 14 (macOS Big Sur)</li>
            <li>For older browsers, consider using fallback images or the picture element</li>
          </ul>
        </div>
      </div>
    </div>
  );
}