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

  // Type-safe array getter methods
  const getWhyReasons = () => {
    const reasons = t('imageTools.compress.why');
    return Array.isArray(reasons) ? reasons : [];
  };

  const getTips = () => {
    const tips = t('imageTools.compress.tip');
    return Array.isArray(tips) ? tips : [];
  };

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="quality">
            {lossless 
              ? t('imageTools.compress.compressionLevel') 
              : t('imageTools.compress.quality')}: {quality}%
          </Label>
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
            ? t('imageTools.compress.compressionLevelHint')
            : t('imageTools.compress.qualityHint')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="lossless" 
            checked={lossless}
            onCheckedChange={setLossless}
          />
          <Label htmlFor="lossless">{t('imageTools.compress.lossless')}</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('imageTools.compress.losslessHint')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="transparency" 
            checked={preserveTransparency}
            onCheckedChange={setPreserveTransparency}
          />
          <Label htmlFor="transparency">{t('imageTools.compress.preserveTransparency')}</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('imageTools.compress.preserveTransparencyHint')}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">{t('imageTools.compress.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('imageTools.compress.description')}
        </p>
      </div>
      
      <ImageProcessor
        title={t('imageTools.compress.toolTitle')}
        description={t('imageTools.compress.toolDescription')}
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
          <h2 className="text-xl font-medium mb-4">{t('imageTools.compress.whyTitle')}</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('imageTools.compress.whyDesc')}
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {getWhyReasons().map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.compress.typesTitle')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.compress.lossyTitle')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.compress.lossyDesc')}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('imageTools.compress.losslessTitle')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.compress.losslessDesc')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">{t('imageTools.compress.tipsTitle')}</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {getTips().map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}