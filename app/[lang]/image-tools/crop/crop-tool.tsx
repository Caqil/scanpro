// app/[lang]/image-tools/crop/crop-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/src/store/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  SquareIcon,
  RectangleHorizontal,
  Crop as CropIcon,
  CircleIcon
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatioIcon } from "@radix-ui/react-icons";

export function CropImageTool() {
  const { t } = useLanguageStore();
  const [cropMode, setCropMode] = useState("custom"); // custom, fixed-ratio, fixed-size, circle
  const [aspectRatio, setAspectRatio] = useState("1:1"); // 1:1, 4:3, 16:9, etc.
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [freeRotation, setFreeRotation] = useState(0); // 0-360 degrees for free rotation
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setWidth(newWidth);
    
    if (preserveAspectRatio && aspectRatio !== "custom") {
      const [x, y] = aspectRatio.split(':').map(Number);
      if (x && y) {
        setHeight(Math.round((newWidth * y) / x));
      }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setHeight(newHeight);
    
    if (preserveAspectRatio && aspectRatio !== "custom") {
      const [x, y] = aspectRatio.split(':').map(Number);
      if (x && y) {
        setWidth(Math.round((newHeight * x) / y));
      }
    }
  };

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
    
    if (value !== "custom" && preserveAspectRatio) {
      const [x, y] = value.split(':').map(Number);
      if (x && y) {
        setHeight(Math.round((width * y) / x));
      }
    }
  };

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">Crop Mode</Label>
        <RadioGroup
          value={cropMode}
          onValueChange={setCropMode}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="crop-custom" />
            <Label htmlFor="crop-custom" className="cursor-pointer flex items-center gap-2">
              <CropIcon className="h-4 w-4" /> Free Crop
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed-ratio" id="crop-ratio" />
            <Label htmlFor="crop-ratio" className="cursor-pointer flex items-center gap-2">
              <AspectRatioIcon className="h-4 w-4" /> Fixed Aspect Ratio
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed-size" id="crop-size" />
            <Label htmlFor="crop-size" className="cursor-pointer flex items-center gap-2">
              <RectangleHorizontal className="h-4 w-4" /> Fixed Size
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="circle" id="crop-circle" />
            <Label htmlFor="crop-circle" className="cursor-pointer flex items-center gap-2">
              <CircleIcon className="h-4 w-4" /> Circle/Oval
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {cropMode === "fixed-ratio" && (
        <div className="space-y-2">
          <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={aspectRatio === "1:1" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatioChange("1:1")}
              className="flex items-center gap-2"
            >
              <SquareIcon className="h-4 w-4" />
              1:1
            </Button>
            <Button
              variant={aspectRatio === "4:3" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatioChange("4:3")}
            >
              4:3
            </Button>
            <Button
              variant={aspectRatio === "16:9" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatioChange("16:9")}
            >
              16:9
            </Button>
            <Button
              variant={aspectRatio === "3:2" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatioChange("3:2")}
            >
              3:2
            </Button>
            <Button
              variant={aspectRatio === "2:3" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatioChange("2:3")}
            >
              2:3
            </Button>
            <Button
              variant={aspectRatio === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatioChange("custom")}
            >
              Custom
            </Button>
          </div>
        </div>
      )}
      
      {(cropMode === "fixed-size" || (cropMode === "fixed-ratio" && aspectRatio === "custom")) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input
              id="width"
              type="number"
              min="1"
              max="10000"
              value={width}
              onChange={handleWidthChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              min="1"
              max="10000"
              value={height}
              onChange={handleHeightChange}
            />
          </div>
          
          {cropMode === "fixed-size" && (
            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="preserve-ratio"
                checked={preserveAspectRatio}
                onCheckedChange={setPreserveAspectRatio}
              />
              <Label htmlFor="preserve-ratio">Maintain aspect ratio when resizing</Label>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="free-rotation">Rotation: {freeRotation}°</Label>
        <Slider
          id="free-rotation"
          min={0}
          max={360}
          step={1}
          value={[freeRotation]}
          onValueChange={(values) => setFreeRotation(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          Rotate the image before cropping to get the perfect angle
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Crop Image</h1>
        <p className="mt-2 text-muted-foreground">
          Crop images to remove unwanted areas and focus on important content
        </p>
      </div>
      
      <ImageProcessor
        title="Image Cropping Tool"
        description="Upload an image to crop it with precise controls."
        processEndpoint="image/crop"
        fileTypes={["image/jpeg", "image/png", "image/webp"]}
        processOptions={{ 
          cropMode,
          aspectRatio,
          width,
          height,
          freeRotation,
          preserveAspectRatio
        }}
        renderOptions={renderOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Crop Images?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Cropping is one of the most fundamental and valuable image editing operations:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Remove unwanted elements from the edges of your photos</li>
              <li>Improve composition by reframing the subject</li>
              <li>Create specific aspect ratios for different platforms (social media, printing, etc.)</li>
              <li>Focus attention on the most important part of an image</li>
              <li>Prepare images for profile pictures, thumbnails, or headers</li>
              <li>Create product images with consistent dimensions</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Cropping Options Explained</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Free Crop</h3>
              <p className="text-sm text-muted-foreground">
                Freely select any area of your image to keep, with no restrictions on size or proportions. This gives you maximum flexibility for creative cropping.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Fixed Aspect Ratio</h3>
              <p className="text-sm text-muted-foreground">
                Maintain a specific width-to-height ratio like 1:1 (square), 4:3, 16:9 (widescreen), while still being able to choose the size of the crop area. Ideal for platforms that require specific aspect ratios.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Fixed Size</h3>
              <p className="text-sm text-muted-foreground">
                Crop to exact pixel dimensions (e.g., 800x600). Perfect when you need images with very specific sizes for websites, profiles, or print materials.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Circle/Oval</h3>
              <p className="text-sm text-muted-foreground">
                Create circular or oval crops with transparency around the edges. Ideal for profile pictures, logos, and circular UI elements.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Perfect Cropping</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Use the Rule of Thirds: place key elements at the intersection points of an imaginary 3×3 grid</li>
              <li>Leave some breathing room around your subject rather than cropping too tightly</li>
              <li>For portraits, usually crop at natural points (like joints) rather than cutting through limbs</li>
              <li>Consider the direction your subject is facing or moving and leave more space in front of them</li>
              <li>Use rotation to straighten horizons or align architectural elements</li>
              <li>Choose the right aspect ratio for your intended use (social media platforms often have specific requirements)</li>
              <li>When in doubt, crop less—you can always crop more later, but you can't recover what you've cut away</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}