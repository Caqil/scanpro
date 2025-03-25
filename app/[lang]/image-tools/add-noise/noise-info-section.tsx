"use client"
import { useLanguageStore } from "@/src/store/store";

export function NoiseInfoSection() {
  const { t } = useLanguageStore();
  
  return (
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
  );
}