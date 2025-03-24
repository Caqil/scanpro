// app/[lang]/image-tools/png-to-jpg/png-to-jpg-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";

export function PngToJpgTool() {
  const { t } = useLanguageStore();
  const [quality, setQuality] = useState(90); // Default to 90% quality

  const renderQualityOptions = (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="quality">JPEG Quality: {quality}%</Label>
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
        <h1 className="text-3xl font-bold">Convert PNG to JPG</h1>
        <p className="mt-2 text-muted-foreground">
          Convert your PNG images to JPG format with customizable quality settings
        </p>
      </div>
      
      <ImageProcessor
        title="PNG to JPG Converter"
        description="Upload a PNG image to convert it to JPG format."
        processEndpoint="image/png-to-jpg"
        fileTypes={["image/png"]}
        processOptions={{ quality }}
        renderOptions={renderQualityOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Convert PNG to JPG?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Converting PNGs to JPGs can be useful for multiple reasons:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Smaller file sizes for faster website loading</li>
              <li>Better compatibility with some older systems</li>
              <li>Ability to adjust compression levels based on your needs</li>
              <li>Reduced storage space for image libraries</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">PNG vs JPG: Key Differences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">PNG Features</h3>
              <p className="text-sm text-muted-foreground">
                PNG supports transparency and lossless compression, making it ideal for graphics with sharp edges and transparent backgrounds.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">JPG Features</h3>
              <p className="text-sm text-muted-foreground">
                JPG uses lossy compression, making it great for photographs and complex images where slight quality loss is acceptable for smaller file sizes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}