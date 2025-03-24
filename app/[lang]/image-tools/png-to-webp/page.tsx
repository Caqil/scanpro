// app/[lang]/image-tools/png-to-webp/page.tsx
import { Metadata } from "next";
import { PngToWebpTool } from "./png-to-webp-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Convert PNG to WebP | Image Tools",
    description: "Quickly convert PNG images to WebP for better web performance and smaller file sizes",
    openGraph: {
      title: "Convert PNG to WebP | Image Tools",
      description: "Quickly convert PNG images to WebP for better web performance and smaller file sizes",
      url: `/${lang}/image-tools/png-to-webp`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/png-to-webp`,
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
          
          return [langCode, `/${code}/image-tools/png-to-webp`];
        })
      ),
    }
  };
}

export default function PngToWebpPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <PngToWebpTool />
    </div>
  );
}