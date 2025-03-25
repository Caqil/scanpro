"use client"
import { useLanguageStore } from "@/src/store/store";

export function BorderInfoSection() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mt-12 space-y-6">
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-medium mb-4">{t('imageTools.addBorder.whyTitle') || "Why Add Borders to Images?"}</h2>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t('imageTools.addBorder.whyDesc') || "Adding borders to images serves both aesthetic and practical purposes:"}
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t('imageTools.addBorder.why1') || "Create a clean, finished look for photos and artwork"}</li>
            <li>{t('imageTools.addBorder.why2') || "Draw attention to the image content by framing it"}</li>
            <li>{t('imageTools.addBorder.why3') || "Match image presentation to your website or brand aesthetics"}</li>
            <li>{t('imageTools.addBorder.why4') || "Add visual interest with decorative borders"}</li>
            <li>{t('imageTools.addBorder.why5') || "Create a uniform look across multiple images in a collection"}</li>
            <li>{t('imageTools.addBorder.why6') || "Simulate photo prints with styles like Polaroid frames"}</li>
            <li>{t('imageTools.addBorder.why7') || "Add spacing between image content and surrounding elements"}</li>
          </ul>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-medium mb-4">{t('imageTools.addBorder.stylesTitle') || "Border Styles and Effects"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-base font-medium">{t('imageTools.addBorder.basicTitle') || "Basic Borders"}</h3>
            <p className="text-sm text-muted-foreground">
              {t('imageTools.addBorder.basicDesc') || "Simple borders add definition to your images. Adjust the width, color, corner radius, and style to achieve the perfect look. Larger widths create more dramatic frames, while rounded corners can soften the overall appearance."}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium">{t('imageTools.addBorder.gradientTitle') || "Gradient Borders"}</h3>
            <p className="text-sm text-muted-foreground">
              {t('imageTools.addBorder.gradientDesc') || "Gradient borders add visual interest with smooth color transitions. Linear gradients can create dynamic directional effects, while radial gradients provide a focal point. Experiment with complementary or contrasting colors for different moods."}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium">{t('imageTools.addBorder.frameTitle') || "Inner Frames"}</h3>
            <p className="text-sm text-muted-foreground">
              {t('imageTools.addBorder.frameDesc') || "Adding an inner frame creates a multi-layered effect that mimics traditional photo frames. This effect works particularly well with thicker outer borders and can provide an elegant, gallery-style presentation for your images."}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium">{t('imageTools.addBorder.shadowTitle') || "Drop Shadows"}</h3>
            <p className="text-sm text-muted-foreground">
              {t('imageTools.addBorder.shadowDesc') || "Drop shadows create depth and dimension by making the image appear to float above the background. Adjust blur, offset, and color to achieve different effects, from subtle elevation to dramatic pop-off-the-page visuals."}
            </p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-medium mb-4">{t('imageTools.addBorder.tipsTitle') || "Tips for Best Results"}</h2>
        <div className="space-y-3">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t('imageTools.addBorder.tip1') || "Consider the content of your image when choosing border colors—complementary colors often work best"}</li>
            <li>{t('imageTools.addBorder.tip2') || "For a clean, professional look, use moderate border widths (10-30px) and simple solid styles"}</li>
            <li>{t('imageTools.addBorder.tip3') || "When creating photo frames, use white or off-white inner frames with darker outer borders"}</li>
            <li>{t('imageTools.addBorder.tip4') || "Match border radius to the style of your image—square for formal or architectural photos, rounded for casual or personal images"}</li>
            <li>{t('imageTools.addBorder.tip5') || "Use padding to give your image some breathing room within its border"}</li>
            <li>{t('imageTools.addBorder.tip6') || "For social media posts, try vibrant gradient borders to catch attention"}</li>
            <li>{t('imageTools.addBorder.tip7') || "When in doubt, start with one of our presets and customize from there"}</li>
            <li>{t('imageTools.addBorder.tip8') || "Drop shadows work best with lighter backgrounds—adjust the blur and offset for different lighting effects"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}