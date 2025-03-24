// app/[lang]/image-tools/jpg-to-png/jpg-to-png-tool.tsx
"use client"
import React from "react";
import { ImageProcessor } from "@/components/image-processor";
import { useLanguageStore } from "@/src/store/store";

export function JpgToPngTool() {
  const { t } = useLanguageStore();

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Convert JPG to PNG</h1>
        <p className="mt-2 text-muted-foreground">
          Convert your JPG images to PNG format with transparency support
        </p>
      </div>
      
      <ImageProcessor
        title="JPG to PNG Converter"
        description="Upload a JPG image to convert it to PNG format."
        processEndpoint="image/jpg-to-png"
        fileTypes={["image/jpeg"]}
        processOptions={{}}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Convert JPG to PNG?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Converting JPGs to PNGs can be beneficial for many reasons:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Better quality without compression artifacts</li>
              <li>Support for transparency in your images</li>
              <li>Lossless format preserves image details</li>
              <li>Better for images with text or sharp edges</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">JPG vs PNG: Key Differences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">JPG Features</h3>
              <p className="text-sm text-muted-foreground">
                JPG uses lossy compression, making it ideal for photographs and complex images where file size is more important than perfect quality.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">PNG Features</h3>
              <p className="text-sm text-muted-foreground">
                PNG uses lossless compression and supports transparency. It's best for images that require high quality, sharp edges, or transparent backgrounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}