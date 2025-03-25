// app/[lang]/image-tools/add-noise/add-noise-tool.tsx
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
import { addNoisePreview } from "@/lib/image-preview";

export function AddNoiseTool() {
  const { t } = useLanguageStore();
  const [noiseAmount, setNoiseAmount] = useState(30); // 0-100, default 30%
  const [noiseType, setNoiseType] = useState("gaussian"); // gaussian or salt-pepper
  const [monochrome, setMonochrome] = useState(false); // colored or monochrome noise

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="noise-amount">{t('imageTools.noise.amount') || "Noise Amount"}: {noiseAmount}%</Label>
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
          {t('imageTools.noise.amountHint') || "Higher values create more noticeable noise. For subtle effects, use values below 30%."}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="noise-type">{t('imageTools.noise.type') || "Noise Type"}</Label>
        <Select
          value={noiseType}
          onValueChange={(value) => setNoiseType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('imageTools.noise.selectType') || "Select noise type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gaussian">{t('imageTools.noise.gaussian') || "Gaussian (Smooth)"}</SelectItem>
            <SelectItem value="salt-pepper">{t('imageTools.noise.saltPepper') || "Salt & Pepper (Speckles)"}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('imageTools.noise.typeHint') || "Gaussian noise adds subtle grain, while Salt & Pepper adds random white and black pixels."}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="monochrome" 
          checked={monochrome}
          onCheckedChange={setMonochrome}
        />
        <Label htmlFor="monochrome">{t('imageTools.noise.monochrome') || "Monochrome Noise"}</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('imageTools.noise.monochromeHint') || "When enabled, noise will be black and white only. When disabled, colored noise will be used."}
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">{t('imageTools.noise.title') || "Add Noise to PNG"}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('imageTools.noise.description') || "Add film grain or noise effects to your PNG images for artistic styling"}
        </p>
      </div>
      
      <ImageProcessor
        title={t('imageTools.noise.toolTitle') || "PNG Noise Generator"}
        description={t('imageTools.noise.toolDescription') || "Upload a PNG image to add noise or grain effects."}
        processEndpoint="image/add-noise"
        fileTypes={["image/png"]}
        processOptions={{ 
          noiseAmount,
          noiseType,
          monochrome
        }}
        renderOptions={renderOptions}
        previewRenderer={addNoisePreview}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.noise.whyTitle') || "Why Add Noise to Images?"}</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('imageTools.noise.whyDesc') || "Adding noise or grain to images can serve several artistic and practical purposes:"}
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>{t('imageTools.noise.why1') || "Create a vintage or film-like aesthetic"}</li>
              <li>{t('imageTools.noise.why2') || "Add texture to flat or digital-looking images"}</li>
              <li>{t('imageTools.noise.why3') || "Reduce banding in gradient areas"}</li>
              <li>{t('imageTools.noise.why4') || "Create distressed or weathered effects"}</li>
              <li>{t('imageTools.noise.why5') || "Add visual interest to simple or minimal designs"}</li>
              <li>{t('imageTools.noise.why6') || "Simulate low-light photography"}</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.noise.typesTitle') || "Types of Noise Effects"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.noise.gaussianTitle') || "Gaussian Noise"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.noise.gaussianDesc') || "Gaussian noise creates a smooth, film-like grain by adding random variations to pixel values. The distribution follows a normal (Gaussian) curve, creating a natural-looking effect similar to film grain."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.noise.saltPepperTitle') || "Salt & Pepper Noise"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.noise.saltPepperDesc') || "This noise type adds random white and black pixels to the image, creating a speckled effect. It resembles the appearance of small dust particles or defects, giving a more rough, textured look."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.noise.tipsTitle') || "Tips for Best Results"}</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>{t('imageTools.noise.tip1') || "For subtle film grain effects, use Gaussian noise at 10-20% intensity"}</li>
              <li>{t('imageTools.noise.tip2') || "Monochrome noise tends to look more like classic film grain"}</li>
              <li>{t('imageTools.noise.tip3') || "Salt & Pepper noise at low levels (5-15%) can add interesting texture to solid areas"}</li>
              <li>{t('imageTools.noise.tip4') || "Colored noise can add a unique aesthetic to images with limited color palettes"}</li>
              <li>{t('imageTools.noise.tip5') || "Higher noise amounts (50%+) create more dramatic, stylized effects"}</li>
              <li>{t('imageTools.noise.tip6') || "For vintage photo effects, combine noise with a sepia or faded color tone"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}