// app/[lang]/image-tools/rotate/rotate-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/src/store/store";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { rotateImagePreview } from "@/lib/image-preview";

export function RotateImageTool() {
  const { t } = useLanguageStore();
  const [rotationAngle, setRotationAngle] = useState("90"); // 90, 180, 270 degrees
  const [flipDirection, setFlipDirection] = useState("none"); // none, horizontal, vertical, both

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">Rotation</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={rotationAngle === "90" ? "default" : "outline"}
            size="sm"
            onClick={() => setRotationAngle("90")}
            className="flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            90°
          </Button>
          <Button
            variant={rotationAngle === "180" ? "default" : "outline"}
            size="sm"
            onClick={() => setRotationAngle("180")}
            className="flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            180°
          </Button>
          <Button
            variant={rotationAngle === "270" ? "default" : "outline"}
            size="sm"
            onClick={() => setRotationAngle("270")}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            270° (90° CCW)
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select the angle to rotate your image clockwise
        </p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-base font-medium">Flip</Label>
        <RadioGroup
          value={flipDirection}
          onValueChange={setFlipDirection}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="flip-none" />
            <Label htmlFor="flip-none" className="cursor-pointer">No Flip</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="horizontal" id="flip-horizontal" />
            <Label htmlFor="flip-horizontal" className="cursor-pointer flex items-center gap-2">
              <FlipHorizontal className="h-4 w-4" /> Flip Horizontally
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vertical" id="flip-vertical" />
            <Label htmlFor="flip-vertical" className="cursor-pointer flex items-center gap-2">
              <FlipVertical className="h-4 w-4" /> Flip Vertically
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="flip-both" />
            <Label htmlFor="flip-both" className="cursor-pointer flex items-center gap-2">
              <FlipHorizontal className="h-4 w-4" />
              <FlipVertical className="h-4 w-4" />
              Flip Both (Mirror)
            </Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground mt-1">
          Optionally flip your image along the horizontal or vertical axis
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Rotate & Flip Images</h1>
        <p className="mt-2 text-muted-foreground">
          Rotate images to any angle and flip them horizontally or vertically
        </p>
      </div>
      
      <ImageProcessor
        title="Rotate & Flip Tool"
        description="Upload an image to rotate or flip it with precise controls."
        processEndpoint="image/rotate"
        fileTypes={["image/jpeg", "image/png", "image/webp"]}
        processOptions={{ 
          rotationAngle,
          flipDirection
        }}
        renderOptions={renderOptions}
        previewRenderer={rotateImagePreview}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">When to Rotate or Flip Images</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Rotating and flipping images are essential operations for various purposes:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Correct the orientation of photos taken in portrait or landscape mode</li>
              <li>Fix images that were scanned or captured upside down</li>
              <li>Create mirror images for specific design requirements</li>
              <li>Align text or elements properly for presentation</li>
              <li>Prepare images for printing with the correct orientation</li>
              <li>Create symmetrical compositions by flipping images</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Understanding Rotation & Flipping</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Rotation</h3>
              <p className="text-sm text-muted-foreground">
                Rotation turns your image by a specific angle around its center. Our tool supports 90°, 180°, and 270° rotation, which are the most commonly needed angles for photos and graphics.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Flipping</h3>
              <p className="text-sm text-muted-foreground">
                Flipping creates a mirror image of your original by reversing it horizontally (left to right), vertically (top to bottom), or both. This is useful for creating reflections or adjusting the direction elements are facing.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Rotating an image by 90° or 270° will swap its width and height dimensions</li>
              <li>For minor angle adjustments (not exactly 90°, 180°, or 270°), consider using the Crop tool which also offers free rotation</li>
              <li>Flipping horizontally is useful when text appears backward in scanned images</li>
              <li>Flipping both horizontally and vertically is equivalent to rotating by 180°, but the result might differ slightly due to the order of operations</li>
              <li>Image quality is preserved during rotation and flipping, with no loss of detail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}