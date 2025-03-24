// app/[lang]/image-tools/webp-to-png/webp-to-png-tool.tsx
"use client"
import React from "react";
import { ImageProcessor } from "@/components/image-processor";
import { useLanguageStore } from "@/src/store/store";

export function WebpToPngTool() {
  const { t } = useLanguageStore();

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Convert WebP to PNG</h1>
        <p className="mt-2 text-muted-foreground">
          Convert WebP images to PNG format for better compatibility and editing options
        </p>
      </div>
      
      <ImageProcessor
        title="WebP to PNG Converter"
        description="Upload a WebP image to convert it to PNG format."
        processEndpoint="image/webp-to-png"
        fileTypes={["image/webp"]}
        processOptions={{}}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Convert WebP to PNG?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Converting WebP images to PNG format is useful for several reasons:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Better compatibility with older software and browsers that don't support WebP</li>
              <li>Lossless quality for editing in graphics software</li>
              <li>PNG is more widely accepted for printing and publishing</li>
              <li>Preserves transparency from WebP images</li>
              <li>Easier to edit and manipulate in most image editing applications</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">WebP vs PNG: Format Differences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">WebP Features</h3>
              <p className="text-sm text-muted-foreground">
                WebP was developed by Google as a modern image format with superior compression. It offers both lossy and lossless compression with smaller file sizes than traditional formats.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">PNG Features</h3>
              <p className="text-sm text-muted-foreground">
                PNG is a widely supported image format that uses lossless compression. It's compatible with virtually all software, devices, and platforms, making it an excellent choice for universal compatibility.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">When to Use This Conversion</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Consider converting WebP to PNG in these situations:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>When you need to edit the image in software that doesn't support WebP</li>
              <li>For sharing with users who may be using older browsers or software</li>
              <li>For printing purposes, as many print services prefer PNG</li>
              <li>When image quality is more important than file size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}