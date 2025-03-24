// app/[lang]/image-tools/make-transparent/make-transparent-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/src/store/store";

export function MakeTransparentTool() {
  const { t } = useLanguageStore();
  const [color, setColor] = useState("#ffffff"); // Default to white

  const renderColorOptions = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color">Color to make transparent:</Label>
        <div className="flex gap-2 items-center">
          <div 
            className={cn("w-10 h-10 rounded border cursor-pointer")} 
            style={{ backgroundColor: color }}
            onClick={() => document.getElementById('color-picker')?.click()}
          />
          <Input 
            id="color-picker"
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="w-0 h-0 opacity-0 absolute"
          />
          <Input 
            type="text" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="flex-1"
            placeholder="#ffffff"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Click the square to use the color picker or enter a hex color code (e.g. #ff0000)
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Make a PNG Transparent</h1>
        <p className="mt-2 text-muted-foreground">
          Replace any color in your PNG image with transparency
        </p>
      </div>
      
      <ImageProcessor
        title="Make PNG Transparent"
        description="Upload a PNG image and select the color you want to make transparent."
        processEndpoint="image/make-transparent"
        fileTypes={["image/png"]}
        processOptions={{ color }}
        
        renderOptions={renderColorOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
        <h2 className="text-xl font-medium mb-4">How to Make a PNG Transparent</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This tool helps you create transparent PNGs by removing specific colors from your image. This is especially useful for:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Removing white backgrounds from logos</li>
              <li>Creating product images with transparent backgrounds</li>
              <li>Preparing graphics for web design where transparency is needed</li>
              <li>Creating overlays for presentations or marketing materials</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Choosing Colors</h3>
              <p className="text-sm text-muted-foreground">
                For best results, choose colors that are distinct from the elements you want to keep. The tool will match colors within a small tolerance range.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Complex Images</h3>
              <p className="text-sm text-muted-foreground">
                For images with gradients or shadows, you might need to process the image multiple times with different color selections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}