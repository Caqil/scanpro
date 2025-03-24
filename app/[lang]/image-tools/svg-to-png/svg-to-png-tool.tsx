// app/[lang]/image-tools/svg-to-png/svg-to-png-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguageStore } from "@/src/store/store";

export function SvgToPngTool() {
  const { t } = useLanguageStore();
  const [dimensions, setDimensions] = useState({ width: 1024, height: 1024 });

  const renderSizeOptions = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            min="16"
            max="4096"
            value={dimensions.width}
            onChange={(e) => setDimensions({ ...dimensions, width: parseInt(e.target.value) || 1024 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            min="16"
            max="4096"
            value={dimensions.height}
            onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) || 1024 })}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Set your desired output dimensions. SVG will be scaled to fit these dimensions while maintaining aspect ratio.
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Convert SVG to PNG</h1>
        <p className="mt-2 text-muted-foreground">
          Convert vector SVG graphics to raster PNG images with custom dimensions
        </p>
      </div>
      
      <ImageProcessor
        title="SVG to PNG Converter"
        description="Upload an SVG file to convert it to a PNG image."
        processEndpoint="image/svg-to-png"
        fileTypes={["image/svg+xml", "application/svg+xml"]}
        processOptions={dimensions}
        renderOptions={renderSizeOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Convert SVG to PNG?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Converting SVG to PNG is useful in many scenarios:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Create raster images for platforms that don't support SVG</li>
              <li>Ensure consistent display across different browsers and devices</li>
              <li>Generate thumbnails or previews of vector graphics</li>
              <li>Create fixed-size images for specific use cases like social media</li>
              <li>Prevent modifications to the original vector artwork</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">SVG vs PNG: Format Differences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">SVG Features</h3>
              <p className="text-sm text-muted-foreground">
                SVG (Scalable Vector Graphics) is a vector format that uses mathematical formulas to define shapes. This makes SVGs resolution-independent and perfect for responsive designs and high-quality printing at any size.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">PNG Features</h3>
              <p className="text-sm text-muted-foreground">
                PNG (Portable Network Graphics) is a raster format composed of pixels. It has a fixed resolution but offers excellent quality with support for transparency and is universally compatible with all applications and platforms.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Choose dimensions that are appropriate for your intended use case</li>
              <li>For crisp icons, consider using dimensions that are multiples of the original SVG's viewBox</li>
              <li>If your SVG has small details, use larger dimensions to preserve them</li>
              <li>For web use, consider the balance between quality and file size</li>
              <li>PNG supports transparency, so your SVG's transparent areas will be preserved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}