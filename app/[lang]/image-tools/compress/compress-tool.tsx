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
          <Label htmlFor="quality">{lossless ? t('imageTools.compress.compressionLevel') || "Compression Level" : t('imageTools.compress.quality') || "Quality"}: {quality}%</Label>
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
            ? t('imageTools.compress.compressionLevelHint') || "Higher values mean better compression but slower processing."
            : t('imageTools.compress.qualityHint') || "Higher quality results in larger file sizes. Lower quality reduces file size but may introduce artifacts."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="lossless" 
            checked={lossless}
            onCheckedChange={setLossless}
          />
          <Label htmlFor="lossless">{t('imageTools.compress.lossless') || "Use lossless compression"}</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('imageTools.compress.losslessHint') || "Lossless compression preserves all image details but results in larger files than lossy compression."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="transparency" 
            checked={preserveTransparency}
            onCheckedChange={setPreserveTransparency}
          />
          <Label htmlFor="transparency">{t('imageTools.compress.preserveTransparency') || "Preserve transparency"}</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('imageTools.compress.preserveTransparencyHint') || "Keep transparent areas in your PNG image. Disabling this may result in smaller files but will add a white background."}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">{t('imageTools.compress.title') || "Compress PNG Images"}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('imageTools.compress.description') || "Reduce PNG file sizes while maintaining quality for faster website loading and sharing"}
        </p>
      </div>
      
      <ImageProcessor
        title={t('imageTools.compress.toolTitle') || "PNG Compressor"}
        description={t('imageTools.compress.toolDescription') || "Upload a PNG image to compress it with customizable quality settings."}
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
          <h2 className="text-xl font-medium mb-4">{t('imageTools.compress.whyTitle') || "Why Compress PNG Images?"}</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('imageTools.compress.whyDesc') || "Compressing PNG images offers several benefits:"}
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>{t('imageTools.compress.why1') || "Faster website loading times"}</li>
              <li>{t('imageTools.compress.why2') || "Reduced storage space usage"}</li>
              <li>{t('imageTools.compress.why3') || "Lower bandwidth consumption when sharing files"}</li>
              <li>{t('imageTools.compress.why4') || "Improved user experience on mobile devices"}</li>
              <li>{t('imageTools.compress.why5') || "Better SEO performance (Google considers page speed)"}</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.compress.typesTitle') || "Lossy vs. Lossless Compression"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.compress.lossyTitle') || "Lossy Compression"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.compress.lossyDesc') || "Lossy compression reduces file size by permanently removing some image data. This results in smaller files but may reduce image quality, especially with low quality settings."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.compress.losslessTitle') || "Lossless Compression"}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.compress.losslessDesc') || "Lossless compression reduces file size without removing any image data. This preserves 100% of the original image quality but results in larger file sizes compared to lossy compression."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.compress.tipsTitle') || "Tips for Best Results"}</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>{t('imageTools.compress.tip1') || "For photos and complex images, lossy compression with quality around 80-90% usually offers the best balance"}</li>
              <li>{t('imageTools.compress.tip2') || "For graphics, logos, or images with text, use lossless compression to maintain sharpness"}</li>
              <li>{t('imageTools.compress.tip3') || "If transparency is important for your use case, make sure to keep the \"Preserve transparency\" option enabled"}</li>
              <li>{t('imageTools.compress.tip4') || "Preview the compressed image before downloading to ensure it meets your quality expectations"}</li>
              <li>{t('imageTools.compress.tip5') || "Use higher quality (90%+) for images that will be edited further"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}