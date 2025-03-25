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
import { changeTonePreview } from "@/lib/image-preview";

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
        <Label htmlFor="preset">{t('imageTools.changeTone.preset') || "Color Tone Preset"}</Label>
        <Select value={presetMode} onValueChange={handlePresetChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('imageTools.changeTone.selectPreset') || "Select a preset"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">{t('imageTools.changeTone.customColor') || "Custom Color"}</SelectItem>
            <SelectItem value="sepia">{t('imageTools.changeTone.sepia') || "Sepia"}</SelectItem>
            <SelectItem value="blue">{t('imageTools.changeTone.coolBlue') || "Cool Blue"}</SelectItem>
            <SelectItem value="green">{t('imageTools.changeTone.forestGreen') || "Forest Green"}</SelectItem>
            <SelectItem value="red">{t('imageTools.changeTone.warmRed') || "Warm Red"}</SelectItem>
            <SelectItem value="purple">{t('imageTools.changeTone.richPurple') || "Rich Purple"}</SelectItem>
            <SelectItem value="cyan">{t('imageTools.changeTone.cyan') || "Cyan"}</SelectItem>
            <SelectItem value="vintage">{t('imageTools.changeTone.vintage') || "Vintage"}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('imageTools.changeTone.presetHint') || "Choose a preset or select \"Custom Color\" to define your own tone"}
        </p>
      </div>

      {presetMode === "custom" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tone-color">{t('imageTools.changeTone.toneColor') || "Tone Color"}</Label>
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
            {t('imageTools.changeTone.toneColorHint') || "Select the color to tint your image with"}
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="intensity">{t('imageTools.changeTone.intensity') || "Effect Intensity"}: {intensity}%</Label>
        <Slider
          id="intensity"
          min={10}
          max={100}
          step={1}
          value={[intensity]}
          onValueChange={(values) => setIntensity(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          {t('imageTools.changeTone.intensityHint') || "Higher values create a stronger color effect, lower values are more subtle"}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="preserve-grays" 
          checked={preserveGrays}
          onCheckedChange={setPreserveGrays}
        />
        <Label htmlFor="preserve-grays">{t('imageTools.changeTone.preserveGrays') || "Preserve grayscale colors"}</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('imageTools.changeTone.preserveGraysHint') || "When enabled, preserves black, white, and gray areas in the original image"}
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">{t('imageTools.changeTone.title') || "Change PNG Color Tone"}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('imageTools.changeTone.description') || "Apply a color tone or tint to your PNG images for artistic effects"}
        </p>
      </div>
      
      <ImageProcessor
        title={t('imageTools.changeTone.toolTitle') || "PNG Color Tone Changer"}
        description={t('imageTools.changeTone.toolDescription') || "Upload a PNG image to apply a color tone effect."}
        processEndpoint="image/change-tone"
        fileTypes={["image/png"]}
        processOptions={{ 
          toneColor,
          intensity,
          preserveGrays,
          preset: presetMode
        }}
        renderOptions={renderOptions}
        previewRenderer={changeTonePreview}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.changeTone.whatIsTitle') || "What is Color Toning?"}</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('imageTools.changeTone.whatIsDesc1') || "Color toning (or tinting) is a technique that applies a color overlay to an image, shifting its overall color scheme toward a specific hue. This creates a cohesive look and can dramatically change the mood and feel of your images."}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('imageTools.changeTone.whatIsDesc2') || "Common examples include sepia tone (brownish) for vintage effects, blue tone for cool/night atmospheres, and warm tones (red/orange) for sunset or nostalgic feelings."}
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.changeTone.popularTitle') || "Popular Color Tone Effects"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.changeTone.sepiaTitle') || "Sepia Tone"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.changeTone.sepiaDesc') || "Creates a warm, brownish tone reminiscent of vintage photographs. Perfect for creating an aged, nostalgic feel."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.changeTone.blueCyanTitle') || "Blue/Cyan Tone"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.changeTone.blueCyanDesc') || "Creates a cool, calming atmosphere. Often used for night scenes, winter themes, or to evoke feelings of tranquility and serenity."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.changeTone.greenTitle') || "Green Tone"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.changeTone.greenDesc') || "Adds a natural, earthy feel. Great for environmental themes, forest scenes, or creating a matrix-like digital effect at higher intensities."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.changeTone.redOrangeTitle') || "Red/Orange Tone"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.changeTone.redOrangeDesc') || "Adds warmth and energy to images. Useful for sunset effects, creating a sense of warmth, or adding dramatic tension to dark scenes."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.changeTone.tipsTitle') || "Tips for Best Results"}</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>{t('imageTools.changeTone.tip1') || "For subtle effects, use lower intensity values (10-30%)"}</li>
              <li>{t('imageTools.changeTone.tip2') || "The \"Preserve grayscale\" option helps maintain contrast in your image by keeping black and white areas intact"}</li>
              <li>{t('imageTools.changeTone.tip3') || "Try different presets to find the perfect mood for your image"}</li>
              <li>{t('imageTools.changeTone.tip4') || "For dramatic effects, use higher intensity values (70-100%)"}</li>
              <li>{t('imageTools.changeTone.tip5') || "Complementary colors (opposite on the color wheel) can create interesting contrasts"}</li>
              <li>{t('imageTools.changeTone.tip6') || "PNG transparency is preserved during color tone adjustment"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}