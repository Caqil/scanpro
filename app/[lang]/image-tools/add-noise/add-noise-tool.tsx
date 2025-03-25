"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// Import NoiseInfoSection component from the same directory
import { NoiseInfoSection } from "./noise-info-section";

export function AddNoiseTool() {
  const { t } = useLanguageStore();
  const [noiseAmount, setNoiseAmount] = useState(30); // 0-100, default 30%
  const [noiseType, setNoiseType] = useState("gaussian"); // gaussian or salt-pepper
  const [monochrome, setMonochrome] = useState(false); // colored or monochrome noise

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="noise-amount">"Noise Amount": {noiseAmount}%</Label>
        </div>
        <Slider
          id="noise-amount"
          min={5}
          max={100}
          step={1}
          value={[noiseAmount]}
          onValueChange={(values) => setNoiseAmount(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          "Higher values create more noticeable noise. For subtle effects, use values below 30%."
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="noise-type">"Noise Type"</Label>
        <Select
          value={noiseType}
          onValueChange={(value) => setNoiseType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select noise type"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gaussian">"Gaussian (Smooth)"</SelectItem>
            <SelectItem value="salt-pepper">"Salt & Pepper (Speckles)"</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          "Gaussian noise adds subtle grain, while Salt & Pepper adds random white and black pixels."
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="monochrome" 
          checked={monochrome}
          onCheckedChange={setMonochrome}
        />
        <Label htmlFor="monochrome">"Monochrome Noise"</Label>
      </div>
      <p className="text-xs text-muted-foreground">
       "When enabled, noise will be black and white only. When disabled, colored noise will be used."
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">"Add Noise to PNG"</h1>
        <p className="mt-2 text-muted-foreground">
          "Add film grain or noise effects to your PNG images for artistic styling"
        </p>
      </div>
      
      <ImageProcessor
        title="PNG Noise Generator"
        description="Upload a PNG image to add noise or grain effects."
        processEndpoint="image/add-noise"
        fileTypes={["image/png"]}
        processOptions={{ 
          noiseAmount,
          noiseType,
          monochrome
        }}
        renderOptions={renderOptions}
      />
      
      <NoiseInfoSection />
    </div>
  );
}