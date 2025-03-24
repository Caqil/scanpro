// app/[lang]/image-tools/crop/page.tsx
import { Metadata } from "next";
import { CropImageTool } from "./crop-tool";
import { SUPPORTED_LANGUAGES, getTranslation } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  // Create a translation function similar to t()
  const t = (key: string) => getTranslation(lang, key);
  
  const title = t('imageTools.crop.metaTitle') || "Crop Images | Image Tools";
  const description = t('imageTools.crop.metaDescription') || "Crop images to remove unwanted areas and focus on important content";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${lang}/image-tools/crop`,
      siteName: t('metadata.title') || "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/crop`,
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map(code => {
          const langCode = {
            'en': 'en-US',
            'id': 'id-ID',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'zh': 'zh-CN',
            'ar': 'ar-SA',
            'hi': 'hi-IN',
            'ru': 'ru-RU',
            'pt': 'pt-BR',
            'de': 'de-DE',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'it': 'it-IT',
            'tr': 'tr-TR'
          }[code] || `${code}`;
          
          return [langCode, `/${code}/image-tools/crop`];
        })
      ),
    }
  };
}

export default function CropImagePage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <CropImageTool />
    </div>
  );
}