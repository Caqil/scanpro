// app/[lang]/image-tools/compress/compress-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";
import { Switch } from "@/components/ui/switch";

export function CompressPngTool() {
  const { t } = useLanguageStore();
  const [quality, setQuality] = useState(80);
  const [preserveTransparency, setPreserveTransparency] = useState(true);
  const [lossless, setLossless] = useState(false);

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="quality">{lossless ? "Compression Level" : "Quality"}: {quality}%</Label>
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
          {lossless 
            ? "Higher values mean better compression but slower processing."
            : "Higher quality results in larger file sizes. Lower quality reduces file size but may introduce artifacts."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="lossless" 
            checked={lossless}
            onCheckedChange={setLossless}
          />
          <Label htmlFor="lossless">Use lossless compression</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Lossless compression preserves all image details but results in larger files than lossy compression.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="transparency" 
            checked={preserveTransparency}
            onCheckedChange={setPreserveTransparency}
          />
          <Label htmlFor="transparency">Preserve transparency</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Keep transparent areas in your PNG image. Disabling this may result in smaller files but will add a white background.
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Compress PNG Images</h1>
        <p className="mt-2 text-muted-foreground">
          Reduce PNG file sizes while maintaining quality for faster website loading and sharing
        </p>
      </div>
      
      <ImageProcessor
        title="PNG Compressor"
        description="Upload a PNG image to compress it with customizable quality settings."
        processEndpoint="image/compress-png"
        fileTypes={["image/png"]}
        processOptions={{ 
          quality,
          lossless,
          preserveTransparency
        }}
        renderOptions={renderOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Compress PNG Images?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Compressing PNG images offers several benefits:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Faster website loading times</li>
              <li>Reduced storage space usage</li>
              <li>Lower bandwidth consumption when sharing files</li>
              <li>Improved user experience on mobile devices</li>
              <li>Better SEO performance (Google considers page speed)</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Lossy vs. Lossless Compression</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Lossy Compression</h3>
              <p className="text-sm text-muted-foreground">
                Lossy compression reduces file size by permanently removing some image data. This results in smaller files but may reduce image quality, especially with low quality settings.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Lossless Compression</h3>
              <p className="text-sm text-muted-foreground">
                Lossless compression reduces file size without removing any image data. This preserves 100% of the original image quality but results in larger file sizes compared to lossy compression.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>For photos and complex images, lossy compression with quality around 80-90% usually offers the best balance</li>
              <li>For graphics, logos, or images with text, use lossless compression to maintain sharpness</li>
              <li>If transparency is important for your use case, make sure to keep the "Preserve transparency" option enabled</li>
              <li>Preview the compressed image before downloading to ensure it meets your quality expectations</li>
              <li>Use higher quality (90%+) for images that will be edited further</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}