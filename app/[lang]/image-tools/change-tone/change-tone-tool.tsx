// app/[lang]/image-tools/change-tone/change-tone-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ChangeToneTool() {
  const { t } = useLanguageStore();
  const [toneColor, setToneColor] = useState("#0066ff"); // Default blue tone
  const [intensity, setIntensity] = useState(50); // 0-100, default 50%
  const [preserveGrays, setPreserveGrays] = useState(true); // Default preserve grayscale colors
  const [presetMode, setPresetMode] = useState("custom"); // Default custom color

  // Handle preset selection
  const handlePresetChange = (value: string) => {
    setPresetMode(value);
    
    // Set color based on preset
    switch (value) {
      case "sepia":
        setToneColor("#704214");
        setIntensity(40);
        break;
      case "blue":
        setToneColor("#0066ff");
        setIntensity(50);
        break;
      case "green":
        setToneColor("#00cc66");
        setIntensity(45);
        break;
      case "red":
        setToneColor("#ff3333");
        setIntensity(45);
        break;
      case "purple":
        setToneColor("#990099");
        setIntensity(40);
        break;
      case "cyan":
        setToneColor("#00cccc");
        setIntensity(50);
        break;
      case "vintage":
        setToneColor("#997a5a");
        setIntensity(35);
        break;
      case "custom":
        // Keep the current custom color
        break;
    }
  };

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="preset">Color Tone Preset</Label>
        <Select value={presetMode} onValueChange={handlePresetChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Color</SelectItem>
            <SelectItem value="sepia">Sepia</SelectItem>
            <SelectItem value="blue">Cool Blue</SelectItem>
            <SelectItem value="green">Forest Green</SelectItem>
            <SelectItem value="red">Warm Red</SelectItem>
            <SelectItem value="purple">Rich Purple</SelectItem>
            <SelectItem value="cyan">Cyan</SelectItem>
            <SelectItem value="vintage">Vintage</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose a preset or select "Custom Color" to define your own tone
        </p>
      </div>

      {presetMode === "custom" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tone-color">Tone Color</Label>
            <div 
              className="w-6 h-6 rounded-md border" 
              style={{ backgroundColor: toneColor }}
            />
          </div>
          <div className="flex gap-2">
            <Input
              id="tone-color"
              type="color"
              value={toneColor}
              onChange={(e) => setToneColor(e.target.value)}
              className="w-10"
            />
            <Input
              type="text"
              value={toneColor}
              onChange={(e) => setToneColor(e.target.value)}
              placeholder="#0066ff"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Select the color to tint your image with
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="intensity">Effect Intensity: {intensity}%</Label>
        <Slider
          id="intensity"
          min={10}
          max={100}
          step={1}
          value={[intensity]}
          onValueChange={(values) => setIntensity(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          Higher values create a stronger color effect, lower values are more subtle
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="preserve-grays" 
          checked={preserveGrays}
          onCheckedChange={setPreserveGrays}
        />
        <Label htmlFor="preserve-grays">Preserve grayscale colors</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        When enabled, preserves black, white, and gray areas in the original image
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Change PNG Color Tone</h1>
        <p className="mt-2 text-muted-foreground">
          Apply a color tone or tint to your PNG images for artistic effects
        </p>
      </div>
      
      <ImageProcessor
        title="PNG Color Tone Changer"
        description="Upload a PNG image to apply a color tone effect."
        processEndpoint="image/change-tone"
        fileTypes={["image/png"]}
        processOptions={{ 
          toneColor,
          intensity,
          preserveGrays,
          preset: presetMode
        }}
        renderOptions={renderOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">What is Color Toning?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Color toning (or tinting) is a technique that applies a color overlay to an image, 
              shifting its overall color scheme toward a specific hue. This creates a cohesive look 
              and can dramatically change the mood and feel of your images.
            </p>
            <p className="text-sm text-muted-foreground">
              Common examples include sepia tone (brownish) for vintage effects, 
              blue tone for cool/night atmospheres, and warm tones (red/orange) for sunset or nostalgic feelings.
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Popular Color Tone Effects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Sepia Tone</h3>
              <p className="text-sm text-muted-foreground">
                Creates a warm, brownish tone reminiscent of vintage photographs. 
                Perfect for creating an aged, nostalgic feel.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Blue/Cyan Tone</h3>
              <p className="text-sm text-muted-foreground">
                Creates a cool, calming atmosphere. Often used for night scenes, winter themes, 
                or to evoke feelings of tranquility and serenity.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Green Tone</h3>
              <p className="text-sm text-muted-foreground">
                Adds a natural, earthy feel. Great for environmental themes, forest scenes, 
                or creating a matrix-like digital effect at higher intensities.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Red/Orange Tone</h3>
              <p className="text-sm text-muted-foreground">
                Adds warmth and energy to images. Useful for sunset effects, creating a sense of 
                warmth, or adding dramatic tension to dark scenes.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>For subtle effects, use lower intensity values (10-30%)</li>
              <li>The "Preserve grayscale" option helps maintain contrast in your image by keeping black and white areas intact</li>
              <li>Try different presets to find the perfect mood for your image</li>
              <li>For dramatic effects, use higher intensity values (70-100%)</li>
              <li>Complementary colors (opposite on the color wheel) can create interesting contrasts</li>
              <li>PNG transparency is preserved during color tone adjustment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}